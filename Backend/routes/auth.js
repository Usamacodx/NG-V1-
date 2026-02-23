import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();


// Test route to verify auth routes work
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working" });
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Normalize email: trim and convert to lowercase
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ email: { $regex: `^${cleanEmail}$`, $options: "i" } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (hash password)
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email: cleanEmail, password: hashed });
    const savedUser = await user.save();

    console.log(`✅ User registered: ${cleanEmail}`);
    res.json({ 
      message: "Signup successful",
      email: savedUser.email,
      _id: savedUser._id,
      cart: []
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ message: "Signup failed: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Trim whitespace and convert email to lowercase for case-insensitive search
    const cleanEmail = email.trim().toLowerCase();
    
    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: { $regex: `^${cleanEmail}$`, $options: "i" } });
    if (!user) {
      console.log(`❌ User not found for email: ${cleanEmail}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is hashed (starts with $2a$, $2b$, or $2y$) or plain text
    const isHashedPassword = user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$");
    
    let match;
    if (isHashedPassword) {
      // Password is hashed, use bcrypt.compare
      match = await bcrypt.compare(password, user.password);
    } else {
      // Password might be plain text (legacy accounts), compare directly
      match = password === user.password;
      if (match) {
        console.log("⚠️  User has plain text password. Consider rehashing on next login or during migration.");
      }
    }

    if (!match) {
      console.log(`❌ Password mismatch for user: ${cleanEmail}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log(`✅ Login successful for: ${cleanEmail}`);
    res.json({ 
      token: "user-token",
      email: user.email,
      _id: user._id,
      cart: user.cart || []
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Login failed: " + err.message });
  }
});

// Get user's cart
router.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ cart: user.cart || [] });
  } catch (err) {
    console.error("❌ Error fetching cart:", err.message);
    res.status(500).json({ message: "Error fetching cart: " + err.message });
  }
});

// Update user's cart
router.post("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart } = req.body;
    
    if (!userId || !cart) {
      return res.status(400).json({ message: "userId and cart are required" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { cart },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "Cart updated successfully", cart: user.cart });
  } catch (err) {
    console.error("❌ Error updating cart:", err.message);
    res.status(500).json({ message: "Error updating cart: " + err.message });
  }
});

// Clear user's cart
router.delete("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { cart: [] },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "Cart cleared successfully", cart: [] });
  } catch (err) {
    console.error("❌ Error clearing cart:", err.message);
    res.status(500).json({ message: "Error clearing cart: " + err.message });
  }
});

// Forgot password - generate token and (in real app) email it
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token and expiry (1 hour)
    const token = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = token;
    user.resetTokenExpires = expires;
    await user.save();

    // Send email using SMTP credentials from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    console.log("🔗 Reset Link:", resetLink);
    console.log("📧 FRONTEND_URL:", process.env.FRONTEND_URL);

    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@nextgen.com',
      to: user.email,
      subject: 'NextGen Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p>Click the link below to reset your password (valid for 1 hour):</p><p><a href="${resetLink}">Reset Password</a></p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      // Do NOT log the token or reset link to console in production
      res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    } catch (emailErr) {
      console.error('❌ Error sending reset email:', emailErr.message);
      res.status(500).json({ message: 'Failed to send reset email' });
    }
  } catch (err) {
    console.error("❌ forgot-password error:", err.message);
    res.status(500).json({ message: "Error generating reset token: " + err.message });
  }
});

// Reset password using token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and newPassword are required" });

    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (err) {
    console.error("❌ reset-password error:", err.message);
    res.status(500).json({ message: "Error resetting password: " + err.message });
  }
});

export default router;

