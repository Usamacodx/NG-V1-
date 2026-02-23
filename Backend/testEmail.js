import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Test SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log('🔍 Testing Email Configuration...\n');
console.log('Configuration Details:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST);
console.log('  SMTP_PORT:', process.env.SMTP_PORT);
console.log('  SMTP_USER:', process.env.SMTP_USER);
console.log('  SMTP_FROM:', process.env.SMTP_FROM);
console.log('');

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:');
    console.error('  Error:', error.message);
    console.error('  Code:', error.code);
    console.error('  Command:', error.command);
  } else {
    console.log('✅ SMTP Connection Successful!');
    console.log('  The server is ready to send emails.\n');
    
    // Send test email
    const testEmail = {
      from: process.env.SMTP_FROM,
      to: 'aqsasaleem059@gmail.com',
      subject: '🧪 NextGen Email Service Test',
      html: `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; }
            .header { text-align: center; color: #333; padding-bottom: 20px; border-bottom: 3px solid #d4a574; }
            .content { padding: 20px 0; color: #555; line-height: 1.6; }
            .success { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; color: #2e7d32; margin-bottom: 20px; }
            .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NextGen 🎯</h1>
              <p>Email Service Test</p>
            </div>
            
            <div class="success">
              <strong>✅ Success!</strong>
              <p>Your email service is working correctly!</p>
            </div>
            
            <div class="content">
              <p>This is a test email from your NextGen Custom Apparel Studio email service.</p>
              <p><strong>Email Configuration:</strong></p>
              <ul>
                <li>SMTP Host: ${process.env.SMTP_HOST}</li>
                <li>SMTP Port: ${process.env.SMTP_PORT}</li>
                <li>From Email: ${process.env.SMTP_FROM}</li>
                <li>Test Sent: ${new Date().toLocaleString()}</li>
              </ul>
              <p>Your customers will now receive order confirmation and status update emails!</p>
            </div>
            
            <div class="footer">
              <p>NextGen Custom Apparel Studio</p>
              <p>Quality • Customization • Excellence</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    console.log('📧 Sending test email to:', testEmail.to);
    
    transporter.sendMail(testEmail, (err, info) => {
      if (err) {
        console.error('❌ Test Email Failed:');
        console.error('  Error:', err.message);
      } else {
        console.log('✅ Test Email Sent Successfully!');
        console.log('  Message ID:', info.messageId);
        console.log('  Response:', info.response);
        console.log('\n🎉 Email service is fully operational!');
        console.log('✅ Order confirmation emails will be sent automatically');
        console.log('✅ Status update emails will be sent to customers');
      }
    });
  }
});
