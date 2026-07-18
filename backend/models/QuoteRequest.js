const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  productInterest: {
    type: String,
    required: [true, 'Product interest is required'],
    enum: ['leather-jackets', 'leather-bags', 'both', 'custom'],
  },
  estimatedQuantity: {
    type: String,
    required: [true, 'Estimated quantity is required'],
    enum: ['50-100', '100-500', '500-1000', '1000-5000', '5000+'],
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'quoted', 'closed'],
    default: 'new',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
