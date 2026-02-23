import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verify SMTP configuration
console.log('📧 Email Configuration:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST);
console.log('  SMTP_PORT:', process.env.SMTP_PORT);
console.log('  SMTP_USER:', process.env.SMTP_USER);
console.log('  SMTP_FROM:', process.env.SMTP_FROM);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// Order Placed Email Template
const orderPlacedTemplate = (order) => {
  const itemsHTML = order.items.map((item, idx) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; text-align: left;">${idx + 1}. ${item.name}</td>
      <td style="padding: 12px; text-align: center;">
        ${item.size || 'N/A'}
      </td>
      <td style="padding: 12px; text-align: center;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 12px; text-align: right;">
        Rs. ${(item.price || 0).toFixed(2)}
      </td>
      <td style="padding: 12px; text-align: right;">
        Rs. ${((item.price || 0) + (item.customizationPrice || 0)).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #d4a574; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #333; margin: 0; font-size: 28px; }
        .header p { color: #666; margin: 4px 0; font-size: 12px; letter-spacing: 0.5px; }
        .order-id { background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .order-id h3 { margin: 0 0 10px 0; color: #333; font-size: 16px; }
        .order-id-text { font-size: 14px; color: #d4a574; font-weight: bold; }
        .section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 12px; border-bottom: 2px solid #d4a574; padding-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; color: #333; border-bottom: 2px solid #ddd; }
        .summary { background-color: #fafafa; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .summary-row.total { font-size: 16px; font-weight: bold; color: #d4a574; padding-top: 12px; border-top: 2px solid #d4a574; }
        .status { padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 20px; }
        .status h4 { margin: 0 0 8px 0; color: #2e7d32; }
        .status p { margin: 0; color: #1b5e20; font-size: 14px; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
        .footer p { margin: 6px 0; }
        .cta-button { display: inline-block; padding: 12px 30px; background-color: #333; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold; }
        .info-box { background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 12px; border-radius: 4px; margin-bottom: 20px; font-size: 13px; color: #e65100; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>NextGen</h1>
          <p>CUSTOM APPAREL STUDIO</p>
          <p>Premium Quality Customization</p>
        </div>

        <!-- Order ID -->
        <div class="order-id">
          <h3>Order Confirmation</h3>
          <p>Order ID: <span class="order-id-text">REC_${order._id || Date.now()}</span></p>
          <p style="margin: 0; font-size: 12px; color: #999;">Placed on: ${new Date(order.createdAt || Date.now()).toLocaleString()}</p>
        </div>

        <!-- Customer Info -->
        <div>
          <div class="section-title">Shipping Address</div>
          <p style="margin: 0; color: #555; font-size: 14px;">
            <strong>${order.address?.name || 'N/A'}</strong><br>
            ${order.address?.address || ''}, ${order.address?.city || ''} ${order.address?.postal || ''}<br>
            Phone: ${order.address?.phone || 'N/A'}
          </p>
        </div>

        <!-- Order Items -->
        <div style="margin-top: 20px;">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <!-- Order Summary -->
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <strong>Rs. ${(order.total - order.shipping - order.tax).toFixed(2)}</strong>
          </div>
          <div class="summary-row">
            <span>Shipping (${order.shipping === 0 ? 'Standard' : 'Express'}):</span>
            <strong>${order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toFixed(2)}`}</strong>
          </div>
          <div class="summary-row">
            <span>Tax (8%):</span>
            <strong>Rs. ${(order.tax || 0).toFixed(2)}</strong>
          </div>
          <div class="summary-row total">
            <span>Total Amount:</span>
            <span>Rs. ${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <!-- Order Status -->
        <div class="status">
          <h4>✓ Order Received</h4>
          <p>We've received your order! Our team will process it shortly and you'll receive updates via email.</p>
        </div>

        <!-- Info Box -->
        <div class="info-box">
          💡 Payment Method: <strong>${(order.paymentMethod || 'COD').toUpperCase()}</strong><br>
          Status: <strong>Pending Processing</strong>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>NextGen Custom Apparel Studio</strong></p>
          <p>Thank you for your order! We're excited to create your custom apparel.</p>
          <p style="margin-top: 12px; color: #999; font-size: 11px;">Quality • Customization • Excellence</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Order Status Update Email Template
const orderStatusTemplate = (order, previousStatus, newStatus) => {
  const statusMessages = {
    'pending': 'Your order is being processed.',
    'confirmed': 'Your order has been confirmed! We\'re preparing it for you.',
    'processing': 'We\'re actively working on your custom apparel.',
    'shipped': 'Great news! Your order is on its way to you.',
    'delivered': 'Your order has been delivered! We hope you love your custom apparel.',
    'cancelled': 'Your order has been cancelled. If you have any questions, please contact us.',
  };

  const statusColors = {
    'pending': '#ff9800',
    'confirmed': '#2196f3',
    'processing': '#9c27b0',
    'shipped': '#00bcd4',
    'delivered': '#4caf50',
    'cancelled': '#f44336',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #d4a574; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #333; margin: 0; font-size: 28px; }
        .header p { color: #666; margin: 4px 0; font-size: 12px; letter-spacing: 0.5px; }
        .status-update { padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 6px solid ${statusColors[newStatus] || '#d4a574'}; background-color: ${statusColors[newStatus] || '#d4a574'}10; }
        .status-update h2 { margin: 0 0 10px 0; color: ${statusColors[newStatus] || '#d4a574'}; font-size: 20px; }
        .status-update p { margin: 0; color: #333; font-size: 16px; line-height: 1.6; }
        .order-summary { background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .summary-item { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; }
        .summary-item:last-child { border-bottom: none; }
        .summary-item strong { color: #333; }
        .section-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
        .footer p { margin: 6px 0; }
        .timeline { margin: 20px 0; padding: 15px; background-color: #fafafa; border-radius: 6px; }
        .timeline-item { padding: 10px 0; font-size: 13px; color: #555; border-bottom: 1px solid #eee; }
        .timeline-item:last-child { border-bottom: none; }
        .timeline-item.active { color: ${statusColors[newStatus] || '#d4a574'}; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>NextGen</h1>
          <p>CUSTOM APPAREL STUDIO</p>
          <p>Order Status Update</p>
        </div>

        <!-- Status Update -->
        <div class="status-update">
          <h2>📦 Status: ${newStatus.toUpperCase()}</h2>
          <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="section-title">Order Details</div>
          <div class="summary-item">
            <strong>Order ID:</strong> REC_${order._id || Date.now()}
          </div>
          <div class="summary-item">
            <strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}
          </div>
          <div class="summary-item">
            <strong>Total Amount:</strong> Rs. ${(order.total || 0).toFixed(2)}
          </div>
          <div class="summary-item">
            <strong>Previous Status:</strong> ${previousStatus.charAt(0).toUpperCase() + previousStatus.slice(1)}
          </div>
          <div class="summary-item">
            <strong>Current Status:</strong> <span style="color: ${statusColors[newStatus] || '#d4a574'}; font-weight: bold;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span>
          </div>
        </div>

        <!-- Order Timeline -->
        <div class="timeline">
          <div class="section-title">Order Timeline</div>
          <div class="timeline-item ${['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(newStatus) ? 'active' : ''}">
            ✓ Order Placed - ${new Date(order.createdAt || Date.now()).toLocaleDateString()}
          </div>
          <div class="timeline-item ${['confirmed', 'processing', 'shipped', 'delivered'].includes(newStatus) ? 'active' : ''}">
            ${['confirmed', 'processing', 'shipped', 'delivered'].includes(newStatus) ? '✓' : '○'} Confirmed
          </div>
          <div class="timeline-item ${['processing', 'shipped', 'delivered'].includes(newStatus) ? 'active' : ''}">
            ${['processing', 'shipped', 'delivered'].includes(newStatus) ? '✓' : '○'} Processing
          </div>
          <div class="timeline-item ${['shipped', 'delivered'].includes(newStatus) ? 'active' : ''}">
            ${['shipped', 'delivered'].includes(newStatus) ? '✓' : '○'} Shipped
          </div>
          <div class="timeline-item ${newStatus === 'delivered' ? 'active' : ''}">
            ${newStatus === 'delivered' ? '✓' : '○'} Delivered
          </div>
        </div>

        <!-- Contact Info -->
        <div style="background-color: #e3f2fd; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; color: #1565c0;">
          <strong>Need Help?</strong> If you have any questions about your order, please don't hesitate to contact us.
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>NextGen Custom Apparel Studio</strong></p>
          <p>We appreciate your business and hope you'll love your custom apparel!</p>
          <p style="margin-top: 12px; color: #999; font-size: 11px;">Quality • Customization • Excellence</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send Order Placed Email
export const sendOrderPlacedEmail = async (order, customerEmail) => {
  try {
    console.log('📨 Sending order placed email...');
    console.log('   Order ID:', order._id);
    console.log('   Customer Email:', customerEmail);
    
    if (!customerEmail) {
      console.warn('⚠️ No customer email provided!');
      return { success: false, error: 'No customer email provided' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customerEmail,
      subject: `Order Confirmation - REC_${order._id || Date.now()}`,
      html: orderPlacedTemplate(order),
    };

    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order placed email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order placed email:');
    console.error('   Error Message:', error.message);
    console.error('   Full Error:', error);
    return { success: false, error: error.message };
  }
};

// Send Order Status Update Email
export const sendOrderStatusEmail = async (order, customerEmail, previousStatus, newStatus) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customerEmail,
      subject: `Order Update - Status Changed to ${newStatus.toUpperCase()}`,
      html: orderStatusTemplate(order, previousStatus, newStatus),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order status email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order status email:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendOrderPlacedEmail,
  sendOrderStatusEmail,
};
