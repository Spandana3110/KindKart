const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(auth, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic statistics
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalRequests = await Request.countDocuments();
    const completedRequests = await Request.countDocuments({ status: 'completed' });

    // Get user statistics by role
    const donors = await User.countDocuments({ role: 'donor' });
    const recipients = await User.countDocuments({ role: 'recipient' });
    const ngos = await User.countDocuments({ role: 'ngo' });

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentItems = await Item.find()
      .populate('donor', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status donor createdAt');

    const recentRequests = await Request.find()
      .populate('requester', 'name')
      .populate('donor', 'name')
      .populate('item', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status requester donor item createdAt');

    // Get top locations
    const topLocations = await Item.aggregate([
      {
        $group: {
          _id: { city: '$location.city', state: '$location.state' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const stats = {
      totalUsers,
      totalItems,
      totalRequests,
      completedRequests,
      userStats: { donors, recipients, ngos },
      recentUsers,
      recentItems,
      recentRequests,
      topLocations
    };

    res.json(stats);

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;
    if (status === 'blocked') filter.isBlocked = true;
    if (status === 'active') filter.isBlocked = false;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
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
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/block
// @desc    Block or unblock a user
// @access  Private (Admin only)
router.put('/users/:id/block', async (req, res) => {
  try {
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user
    });

  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Server error while blocking user' });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify or unverify a user
// @access  Private (Admin only)
router.put('/users/:id/verify', async (req, res) => {
  try {
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error while verifying user' });
  }
});

// @route   GET /api/admin/items
// @desc    Get all items with moderation filters
// @access  Private (Admin only)
router.get('/items', async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const items = await Item.find(filter)
      .populate('donor', 'name email')
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
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
});

// @route   PUT /api/admin/items/:id/moderate
// @desc    Moderate an item (hide/show)
// @access  Private (Admin only)
router.put('/items/:id/moderate', async (req, res) => {
  try {
    const { isVisible, reason } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isVisible },
      { new: true }
    ).populate('donor', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({
      message: `Item ${isVisible ? 'approved' : 'hidden'} successfully`,
      item
    });

  } catch (error) {
    console.error('Moderate item error:', error);
    res.status(500).json({ message: 'Server error while moderating item' });
  }
});

// @route   DELETE /api/admin/items/:id
// @desc    Delete an item (admin override)
// @access  Private (Admin only)
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete associated requests
    await Request.deleteMany({ item: req.params.id });

    // Delete item
    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all requests for moderation
// @access  Private (Admin only)
router.get('/requests', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate('requester', 'name email')
      .populate('donor', 'name email')
      .populate('item', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Request.countDocuments(filter);

    res.json({
      requests,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + requests.length < total,
        hasPrev: parseInt(page) > 1
      },
      total
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'day') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    }

    // User growth
    const newUsers = await User.countDocuments(dateFilter);
    const totalUsers = await User.countDocuments();

    // Item statistics
    const newItems = await Item.countDocuments(dateFilter);
    const totalItems = await Item.countDocuments();
    const completedItems = await Item.countDocuments({ status: 'completed' });

    // Request statistics
    const newRequests = await Request.countDocuments(dateFilter);
    const totalRequests = await Request.countDocuments();
    const completedRequests = await Request.countDocuments({ status: 'completed' });

    // Category breakdown
    const categoryStats = await Item.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Location breakdown
    const locationStats = await Item.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { city: '$location.city', state: '$location.state' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const analytics = {
      period,
      users: { new: newUsers, total: totalUsers },
      items: { new: newItems, total: totalItems, completed: completedItems },
      requests: { new: newRequests, total: totalRequests, completed: completedRequests },
      categoryStats,
      locationStats
    };

    res.json(analytics);

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
});

module.exports = router; 