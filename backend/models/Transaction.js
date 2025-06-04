

// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive amount'],
    min: [0.01, 'Amount must be positive']
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: {
      values: ['INCOME', 'EXPENSES'],
      message: 'Type must be either INCOME or EXPENSES'
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Number,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Index for better query performance
TransactionSchema.index({ userId: 1, created: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);