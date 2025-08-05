const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'clothing',
      'electronics',
      'books',
      'furniture',
      'toys',
      'kitchen',
      'sports',
      'beauty',
      'automotive',
      'other'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Item condition is required'],
    enum: ['new', 'like-new', 'excellent', 'good', 'fair', 'poor']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Pickup address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['available', 'requested', 'accepted', 'completed', 'cancelled'],
    default: 'available'
  },
  // Request details
  currentRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  // Pickup preferences
  pickupPreferences: {
    type: String,
    enum: ['pickup-only', 'dropoff-only', 'both'],
    default: 'both'
  },
  // Size/weight info
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['inches', 'cm'],
      default: 'inches'
    }
  },
  // Tags for better search
  tags: [{
    type: String,
    trim: true
  }],
  // Visibility settings
  isVisible: {
    type: Boolean,
    default: true
  },
  // Expiry date (optional)
  expiresAt: {
    type: Date
  },
  // View count
  viewCount: {
    type: Number,
    default: 0
  },
  // Request count
  requestCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
itemSchema.index({ status: 1, category: 1 });
itemSchema.index({ 'location.city': 1, 'location.state': 1 });
itemSchema.index({ donor: 1, status: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ tags: 1 });

// Virtual for primary image
itemSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '');
});

// Virtual for full address
itemSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Method to increment view count
itemSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment request count
itemSchema.methods.incrementRequestCount = function() {
  this.requestCount += 1;
  return this.save();
};

// Method to check if item is available
itemSchema.methods.isAvailable = function() {
  return this.status === 'available' && this.isVisible;
};

// Method to check if item has expired
itemSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Ensure virtual fields are serialized
itemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema); 