const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['jacket', 'bag'],
  },
  description: {
    type: String,
    required: true,
  },
  specifications: {
    material: {
      type: String,
      default: 'Full-grain leather',
    },
    availableColors: [{
      type: String,
    }],
    sizes: [{
      type: String,
    }],
    customizationOptions: [{
      type: String,
    }],
  },
  minimumOrderQuantity: {
    type: Number,
    default: 50,
  },
  leadTimeDays: {
    type: Number,
    default: 30,
  },
  images: [{
    url: String,
    alt: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
