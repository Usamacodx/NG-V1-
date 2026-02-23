import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  frontImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Product', productSchema);
