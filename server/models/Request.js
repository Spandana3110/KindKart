const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  // Pickup details
  pickupDetails: {
    preferredDate: Date,
    preferredTime: String,
    pickupAddress: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    contactPhone: String,
    specialInstructions: String
  },
  // Communication history
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  // Timestamps for status changes
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  // Completion details
  completionDetails: {
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String
    }
  },
  // Expiry for pending requests
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
requestSchema.index({ item: 1, status: 1 });
requestSchema.index({ requester: 1, status: 1 });
requestSchema.index({ donor: 1, status: 1 });
requestSchema.index({ createdAt: -1 });
requestSchema.index({ expiresAt: 1 });

// Method to add status change to history
requestSchema.methods.addStatusChange = function(newStatus, changedBy, reason = '') {
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    reason: reason
  });
  this.status = newStatus;
  return this.save();
};

// Method to add message to conversation
requestSchema.methods.addMessage = function(sender, message) {
  this.messages.push({
    sender: sender,
    message: message
  });
  return this.save();
};

// Method to mark messages as read
requestSchema.methods.markMessagesAsRead = function(userId) {
  this.messages.forEach(msg => {
    if (msg.sender.toString() !== userId.toString() && !msg.isRead) {
      msg.isRead = true;
    }
  });
  return this.save();
};

// Method to check if request is expired
requestSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to get unread message count for a user
requestSchema.methods.getUnreadCount = function(userId) {
  return this.messages.filter(msg => 
    msg.sender.toString() !== userId.toString() && !msg.isRead
  ).length;
};

// Virtual for latest message
requestSchema.virtual('latestMessage').get(function() {
  if (this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Virtual for days until expiry
requestSchema.virtual('daysUntilExpiry').get(function() {
  if (this.status !== 'pending') return null;
  const now = new Date();
  const diffTime = this.expiresAt - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Ensure virtual fields are serialized
requestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Request', requestSchema); 