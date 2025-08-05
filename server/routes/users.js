const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get community leaderboard
// @access  Public
router.get('/leaderboard/top-donors', async (req, res) => {
  try {
    const { limit = 10, period = 'all' } = req.query;
    
    let dateFilter = {};
    if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    }

    // Get top donors based on completed donations
    const topDonors = await User.aggregate([
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'donor',
          as: 'items'
        }
      },
      {
        $lookup: {
          from: 'requests',
          localField: 'items._id',
          foreignField: 'item',
          as: 'requests'
        }
      },
      {
        $match: {
          'requests.status': 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          profilePicture: { $first: '$profilePicture' },
          location: { $first: '$location' },
          totalDonations: { $sum: 1 },
          totalImpact: { $first: '$stats.totalImpact' }
        }
      },
      {
        $sort: { totalDonations: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json(topDonors);

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
});

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, role, city, state, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { isBlocked: false };
    
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { bio: new RegExp(q, 'i') }
      ];
    }
    
    if (role) filter.role = role;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    const users = await User.find(filter)
      .select('name profilePicture bio location role stats createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1
      },
      total
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error while searching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get public user profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name profilePicture bio location stats role ngoDetails createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's items count
    const itemsCount = await Item.countDocuments({ donor: req.params.id });
    user.itemsCount = itemsCount;

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// @route   GET /api/users/:id/items
// @desc    Get user's items
// @access  Public
router.get('/:id/items', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { donor: req.params.id };
    if (status) filter.status = status;

    const items = await Item.find(filter)
      .populate('donor', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + items.length < total,
        hasPrev: parseInt(page) > 1
      },
      total
    });

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Server error while fetching user items' });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user's detailed statistics
// @access  Private (Owner or Admin only)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    // Check if user is requesting their own stats or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these statistics' });
    }

    const userId = req.params.id;

    // Get basic stats
    const user = await User.findById(userId).select('stats');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get detailed statistics
    const itemsDonated = await Item.countDocuments({ donor: userId });
    const itemsReceived = await Request.countDocuments({ 
      requester: userId, 
      status: 'completed' 
    });
    const totalRequests = await Request.countDocuments({ requester: userId });
    const pendingRequests = await Request.countDocuments({ 
      requester: userId, 
      status: 'pending' 
    });

    // Get recent activity
    const recentItems = await Item.find({ donor: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    const recentRequests = await Request.find({ requester: userId })
      .populate('item', 'title images')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status createdAt item');

    const stats = {
      ...user.stats,
      itemsDonated,
      itemsReceived,
      totalRequests,
      pendingRequests,
      recentItems,
      recentRequests
    };

    res.json(stats);

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { notifications, privacy } = req.body;

    const updateFields = {};
    if (notifications) updateFields['preferences.notifications'] = notifications;
    if (privacy) updateFields['preferences.privacy'] = privacy;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error during preferences update' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active items or requests
    const activeItems = await Item.countDocuments({ 
      donor: req.user.id, 
      status: { $in: ['requested', 'accepted'] } 
    });

    const activeRequests = await Request.countDocuments({
      $or: [
        { requester: req.user.id, status: { $in: ['pending', 'accepted'] } },
        { donor: req.user.id, status: { $in: ['pending', 'accepted'] } }
      ]
    });

    if (activeItems > 0 || activeRequests > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete account with active items or requests. Please complete or cancel them first.' 
      });
    }

    // Delete user's items and requests
    await Item.deleteMany({ donor: req.user.id });
    await Request.deleteMany({ 
      $or: [{ requester: req.user.id }, { donor: req.user.id }] 
    });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
});

module.exports = router; 