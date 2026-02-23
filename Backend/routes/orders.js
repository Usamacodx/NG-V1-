import express from 'express';
import Order from '../models/Order.js';
import { sendOrderPlacedEmail, sendOrderStatusEmail } from '../services/emailService.js';

const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    console.log('\n📦 NEW ORDER RECEIVED');
    console.log('   Order Payload:', JSON.stringify(payload, null, 2));
    
    if (!payload || !payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      return res.status(400).json({ message: 'Invalid order payload' });
    }

    const order = new Order(payload);
    const saved = await order.save();
    console.log('✅ Order saved to database:', saved._id);

    // Send order confirmation email to customer
    if (payload.address?.email) {
      console.log('📧 Order Email Details:');
      console.log('   Email:', payload.address.email);
      console.log('   Name:', payload.address.name);
      
      const emailResult = await sendOrderPlacedEmail(saved, payload.address.email);
      if (!emailResult.success) {
        console.warn('⚠️ Email notification failed but order was created:', emailResult.error);
      } else {
        console.log('✅ Email sent successfully!');
      }
    } else {
      console.warn('⚠️ No customer email provided in order address');
      console.log('   Address:', JSON.stringify(payload.address, null, 2));
    }

    res.status(201).json({ message: 'Order created', order: saved });
  } catch (err) {
    console.error('❌ Error creating order', err.message);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// Get all orders (admin)
router.get('/admin', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders', err.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching user orders', err.message);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    // Get the order before update to get previous status and customer email
    const orderBefore = await Order.findById(id);
    if (!orderBefore) return res.status(404).json({ message: 'Order not found' });

    const previousStatus = orderBefore.status;
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });

    // Send status update email to customer
    if (orderBefore.address?.email && previousStatus !== status) {
      const emailResult = await sendOrderStatusEmail(updated, orderBefore.address.email, previousStatus, status);
      if (!emailResult.success) {
        console.warn('Status update email failed but order was updated:', emailResult.error);
      }
    }

    res.json({ message: 'Status updated', order: updated });
  } catch (err) {
    console.error('Error updating order status', err.message);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

export default router;
