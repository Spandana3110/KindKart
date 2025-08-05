const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const { optionalAuth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/items
// @desc    Create a new item
// @access  Private (Donors only)
router.post('/', auth, authorize('donor', 'admin'), [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['clothing', 'electronics', 'books', 'furniture', 'toys', 'kitchen', 'sports', 'beauty', 'automotive', 'other']).withMessage('Invalid category'),
  body('condition').isIn(['new', 'like-new', 'excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.zipCode').notEmpty().withMessage('ZIP code is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, condition, location, pickupPreferences, dimensions, tags, expiresAt } = req.body;

    // Create item object
    const itemFields = {
      donor: req.user.id,
      title,
      description,
      category,
      condition,
      location,
      pickupPreferences,
      dimensions,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      expiresAt: expiresAt ? new Date(expiresAt) : null
    };

    const item = new Item(itemFields);
    await item.save();

    // Populate donor info
    await item.populate('donor', 'name profilePicture');

    res.status(201).json({
      message: 'Item created successfully',
      item
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error during item creation' });
  }
});

// @route   GET /api/items
// @desc    Get all available items with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      condition,
      city,
      state,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = {
      status: 'available',
      isVisible: true
    };

    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    // Search functionality
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    // Get items with pagination
    const items = await Item.find(filter)
      .populate('donor', 'name profilePicture location')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Item.countDocuments(filter);

    // Increment view count for each item
    items.forEach(item => {
      item.incrementViewCount();
    });

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

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('donor', 'name profilePicture location bio')
      .populate('currentRequest', 'status requester');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment view count
    await item.incrementViewCount();

    res.json(item);

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Owner only)
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').optional().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').optional().isIn(['clothing', 'electronics', 'books', 'furniture', 'toys', 'kitchen', 'sports', 'beauty', 'automotive', 'other']).withMessage('Invalid category'),
  body('condition').optional().isIn(['new', 'like-new', 'excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Check if item can be updated (not in active request)
    if (item.status === 'requested' || item.status === 'accepted') {
      return res.status(400).json({ message: 'Cannot update item that has active requests' });
    }

    const { title, description, category, condition, location, pickupPreferences, dimensions, tags, expiresAt } = req.body;

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (condition) updateFields.condition = condition;
    if (location) updateFields.location = location;
    if (pickupPreferences) updateFields.pickupPreferences = pickupPreferences;
    if (dimensions) updateFields.dimensions = dimensions;
    if (tags) updateFields.tags = tags.split(',').map(tag => tag.trim());
    if (expiresAt) updateFields.expiresAt = new Date(expiresAt);

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('donor', 'name profilePicture');

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error during item update' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Owner or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership or admin
    if (item.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // Check if item can be deleted
    if (item.status === 'requested' || item.status === 'accepted') {
      return res.status(400).json({ message: 'Cannot delete item that has active requests' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error during item deletion' });
  }
});

// @route   GET /api/items/user/:userId
// @desc    Get items by user
// @access  Public
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { donor: req.params.userId };
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

// @route   POST /api/items/:id/images
// @desc    Upload images for item
// @access  Private (Owner only)
router.post('/:id/images', auth, upload.array('images', 5), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Process uploaded images
    const images = req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      publicId: file.filename,
      isPrimary: index === 0 // First image is primary
    }));

    // Add images to item
    item.images.push(...images);
    await item.save();

    res.json({
      message: 'Images uploaded successfully',
      images: item.images
    });

  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error during image upload' });
  }
});

// @route   DELETE /api/items/:id/images/:imageId
// @desc    Delete image from item
// @access  Private (Owner only)
router.delete('/:id/images/:imageId', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Remove image
    item.images = item.images.filter(img => img._id.toString() !== req.params.imageId);
    await item.save();

    res.json({
      message: 'Image deleted successfully',
      images: item.images
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error during image deletion' });
  }
});

module.exports = router; 