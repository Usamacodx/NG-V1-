import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  name: String,
  price: Number,
  quantity: Number,
  size: String,
  customization: mongoose.Schema.Types.Mixed,
  customizationPrice: Number,
  frontImage: String,
  backImage: String,
});

const orderSchema = new mongoose.Schema({
  id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [orderItemSchema],
  shippingMethod: String,
  shippingCost: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  address: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postal: String,
  },
  paymentMethod: String,
  paymentDetails: mongoose.Schema.Types.Mixed,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
