const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/requests
// @desc    Create a new request for an item
// @access  Private (Recipients only)
router.post('/', auth, authorize('recipient', 'ngo', 'admin'), [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('pickupDetails.preferredDate').optional().isISO8601().withMessage('Invalid date format'),
  body('pickupDetails.contactPhone').optional().trim(),
  body('pickupDetails.specialInstructions').optional().isLength({ max: 200 }).withMessage('Special instructions cannot exceed 200 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, message, pickupDetails } = req.body;

    // Check if item exists and is available
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available for requests' });
    }

    // Check if user is requesting their own item
    if (item.donor.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot request your own item' });
    }

    // Check if user already has a pending request for this item
    const existingRequest = await Request.findOne({
      item: itemId,
      requester: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a request for this item' });
    }

    // Create request
    const request = new Request({
      item: itemId,
      requester: req.user.id,
      donor: item.donor,
      message,
      pickupDetails
    });

    await request.save();

    // Update item status
    item.status = 'requested';
    item.currentRequest = request._id;
    await item.save();

    // Increment request count
    await item.incrementRequestCount();

    // Populate request with user details
    await request.populate([
      { path: 'requester', select: 'name profilePicture' },
      { path: 'donor', select: 'name profilePicture' },
      { path: 'item', select: 'title images' }
    ]);

    res.status(201).json({
      message: 'Request created successfully',
      request
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error during request creation' });
  }
});

// @route   GET /api/requests/my-requests
// @desc    Get user's requests (as requester)
// @access  Private
router.get('/my-requests', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { requester: req.user.id };
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate('item', 'title images status')
      .populate('donor', 'name profilePicture')
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
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

// @route   GET /api/requests/received
// @desc    Get requests received by user (as donor)
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { donor: req.user.id };
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate('item', 'title images status')
      .populate('requester', 'name profilePicture')
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
    console.error('Get received requests error:', error);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

// @route   GET /api/requests/:id
// @desc    Get request by ID
// @access  Private (Participants only)
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('item', 'title images status donor')
      .populate('requester', 'name profilePicture')
      .populate('donor', 'name profilePicture');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is part of this request
    if (request.requester.toString() !== req.user.id && 
        request.donor.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    // Mark messages as read for the current user
    await request.markMessagesAsRead(req.user.id);

    res.json(request);

  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error while fetching request' });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status (accept/reject/complete)
// @access  Private (Donor or Admin only)
router.put('/:id/status', auth, [
  body('status').isIn(['accepted', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('reason').optional().isLength({ max: 200 }).withMessage('Reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, reason } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check authorization
    if (request.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Check if status change is valid
    if (status === 'accepted' && request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only accept pending requests' });
    }

    if (status === 'rejected' && request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only reject pending requests' });
    }

    if (status === 'completed' && request.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only complete accepted requests' });
    }

    // Update request status
    await request.addStatusChange(status, req.user.id, reason);

    // Update item status
    const item = await Item.findById(request.item);
    if (item) {
      if (status === 'accepted') {
        item.status = 'accepted';
      } else if (status === 'rejected' || status === 'cancelled') {
        item.status = 'available';
        item.currentRequest = null;
      } else if (status === 'completed') {
        item.status = 'completed';
        
        // Update user statistics
        await User.findByIdAndUpdate(request.donor, {
          $inc: { 'stats.itemsDonated': 1, 'stats.totalImpact': 1 }
        });
        await User.findByIdAndUpdate(request.requester, {
          $inc: { 'stats.itemsReceived': 1 }
        });
      }
      await item.save();
    }

    // Populate request with user details
    await request.populate([
      { path: 'requester', select: 'name profilePicture' },
      { path: 'donor', select: 'name profilePicture' },
      { path: 'item', select: 'title images status' }
    ]);

    res.json({
      message: 'Request status updated successfully',
      request
    });

  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error during status update' });
  }
});

// @route   POST /api/requests/:id/messages
// @desc    Add message to request conversation
// @access  Private (Participants only)
router.post('/:id/messages', auth, [
  body('message').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is part of this request
    if (request.requester.toString() !== req.user.id && 
        request.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to send messages in this request' });
    }

    // Check if request is still active
    if (request.status === 'completed' || request.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot send messages to completed or cancelled requests' });
    }

    // Add message
    await request.addMessage(req.user.id, message);

    // Populate request with user details
    await request.populate([
      { path: 'requester', select: 'name profilePicture' },
      { path: 'donor', select: 'name profilePicture' },
      { path: 'item', select: 'title images status' }
    ]);

    res.json({
      message: 'Message sent successfully',
      request
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// @route   PUT /api/requests/:id/complete
// @desc    Mark request as completed
// @access  Private (Participants only)
router.put('/:id/complete', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is part of this request
    if (request.requester.toString() !== req.user.id && 
        request.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to complete this request' });
    }

    // Check if request can be completed
    if (request.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only complete accepted requests' });
    }

    // Update completion details
    request.completionDetails = {
      completedAt: new Date(),
      completedBy: req.user.id,
      feedback: { rating, comment }
    };

    await request.addStatusChange('completed', req.user.id);

    // Update item status
    const item = await Item.findById(request.item);
    if (item) {
      item.status = 'completed';
      await item.save();
    }

    // Update user statistics
    await User.findByIdAndUpdate(request.donor, {
      $inc: { 'stats.itemsDonated': 1, 'stats.totalImpact': 1 }
    });
    await User.findByIdAndUpdate(request.requester, {
      $inc: { 'stats.itemsReceived': 1 }
    });

    // Populate request with user details
    await request.populate([
      { path: 'requester', select: 'name profilePicture' },
      { path: 'donor', select: 'name profilePicture' },
      { path: 'item', select: 'title images status' }
    ]);

    res.json({
      message: 'Request completed successfully',
      request
    });

  } catch (error) {
    console.error('Complete request error:', error);
    res.status(500).json({ message: 'Server error during request completion' });
  }
});

module.exports = router; 