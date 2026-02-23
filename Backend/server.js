import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";
import ordersRoutes from "./routes/orders.js";
import Product from "./models/Product.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Global error handler middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server error", error: err.message });
});

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

/* =========================
   Schemas
========================= */

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

// Product model is imported from ./models/Product.js at the top

/* =========================
   ADMIN AUTH
========================= */

// Admin Signup (run once)
app.post("/api/admin/signup", async (req, res) => {
  const { email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin exists" });

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });

  res.json({ message: "Admin created" });
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* =========================
   PRODUCT ROUTES
========================= */

// Test endpoint to verify auth routes are loaded
app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Auth routes are loaded successfully" });
});

// Use auth routes
app.use("/api/auth", authRoutes);

// Orders routes (create/fetch orders)
app.use('/api/orders', ordersRoutes);

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// GET product by ID (EDIT PAGE)
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

// ADD product
app.post("/api/products", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const productData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity || 0,
      category: req.body.category || "men",
      subcategory: req.body.subcategory || "t-shirt",
      fabric: req.body.fabric || "cotton",
      colors: req.body.colors || [],
      description: req.body.description || "",
      frontImage: req.body.frontImage,
      backImage: req.body.backImage,
      image: req.body.image || null,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding product", 
      error: error.message,
      details: error.errors || null
    });
  }
});

// UPDATE product
app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    mongoConnected: mongoose.connection.readyState === 1,
    mongoState: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState],
    timestamp: new Date().toISOString()
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
