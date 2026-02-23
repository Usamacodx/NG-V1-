import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    subcategory: "",
    fabric: "",
    description: "",
    frontImage: "",
    backImage: "",
    colors: [],
  });

  const [imageFiles, setImageFiles] = useState({
    frontImage: null,
    backImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setError("");
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleColorToggle = (color) => {
    const exists = product.colors.includes(color);
    const newColors = exists ? product.colors.filter((c) => c !== color) : [...product.colors, color];
    setProduct({ ...product, colors: newColors });
    setFieldErrors({ ...fieldErrors, colors: "" });
  };

  // Handle file input and convert to base64
  const handleFileUpload = async (e, imageField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size (<= 3MB)
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setFieldErrors({ ...fieldErrors, [imageField]: "Only PNG/JPEG/WebP/SVG images allowed" });
      return;
    }
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setFieldErrors({ ...fieldErrors, [imageField]: "Image must be <= 3MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result;
      setProduct({ ...product, [imageField]: base64String });
      setImageFiles({ ...imageFiles, [imageField]: file.name });
      setFieldErrors({ ...fieldErrors, [imageField]: "" });
    };
    reader.onerror = () => {
      setFieldErrors({ ...fieldErrors, [imageField]: "Failed to read file" });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Field-level validations
    const errors = {};
    if (!product.name || product.name.trim().length < 3) errors.name = "Product name (min 3 chars) is required";
    if (product.price === "" || isNaN(Number(product.price)) || Number(product.price) < 0) errors.price = "Price must be a number ≥ 0";
    if (product.quantity !== "" && (!Number.isInteger(Number(product.quantity)) || Number(product.quantity) < 0)) errors.quantity = "Quantity must be a non-negative integer";
    if (!product.category) errors.category = "Please select gender";
    if (!product.subcategory) errors.subcategory = "Please select type/subcategory";
    if (!product.fabric) errors.fabric = "Please select fabric";
    if (!product.frontImage) errors.frontImage = "Front image is required";
    if (!product.backImage) errors.backImage = "Back image is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the highlighted fields");
      return;
    }

    setLoading(true);

    try {
      // First check if backend is running
      const healthRes = await fetch("http://localhost:5000/api/health");
      if (!healthRes.ok) {
        throw new Error("Backend is not responding");
      }
      const health = await healthRes.json();
      
      if (!health.mongoConnected) {
        throw new Error(`MongoDB not connected. Status: ${health.mongoState}`);
      }
      
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name?.trim(),
          price: Number(product.price),
          quantity: Number(product.quantity) || 0,
          category: product.category,
          subcategory: product.subcategory,
          fabric: product.fabric,
          colors: product.colors || [],
          description: product.description?.trim() || "",
          frontImage: product.frontImage,
          backImage: product.backImage,
        }),
      });

      const responseText = await res.text();

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: `;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage += errorData.message || JSON.stringify(errorData);
        } catch {
          errorMessage += responseText.substring(0, 200);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Invalid response from server: ${parseErr.message}`);
      }

      alert("✅ Product added successfully!");
      setProduct({
        name: "",
        price: "",
        quantity: "",
        category: "",
        subcategory: "",
        fabric: "",
        description: "",
        frontImage: "",
        backImage: "",
        colors: [],
      });
      setImageFiles({ frontImage: null, backImage: null });
      setFieldErrors({});
      navigate("/products");
    } catch (err) {
      setError(err.message || "Error adding product. Make sure backend is running on http://localhost:5000!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h2>Add Product (Admin)</h2>
      
      {error && (
        <div style={errorStyle}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <h3 style={{ marginBottom: "10px", color: "#333" }}>Basic Information</h3>
        
        <div>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {fieldErrors.name && <div style={errorFieldStyle}>{fieldErrors.name}</div>}
        </div>
        
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price (PKR)"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="1"
            style={inputStyle}
          />
          {fieldErrors.price && <div style={errorFieldStyle}>{fieldErrors.price}</div>}
        </div>
        
        <div>
          <input
            type="number"
            name="quantity"
            placeholder="Available Stock (Quantity)"
            value={product.quantity}
            onChange={handleChange}
            style={inputStyle}
            min="0"
            step="1"
          />
          {fieldErrors.quantity && <div style={errorFieldStyle}>{fieldErrors.quantity}</div>}
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          rows="4"
          style={inputStyle}
        />

        <h3 style={{ marginBottom: "10px", marginTop: "15px", color: "#333" }}>Category & Type</h3>

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
        {fieldErrors.category && <div style={errorFieldStyle}>{fieldErrors.category}</div>}

        <select
          name="subcategory"
          value={product.subcategory}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select Type</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="hoodies">Hoodies</option>
          <option value="sweatshirt">Sweatshirt</option>
          <option value="long-sleeves">Long Sleeves</option>
          <option value="round-neck">Round Neck</option>
          <option value="v-neck">V Neck</option>
          <option value="polo-shirt">Polo Shirt</option>
        </select>
        {fieldErrors.subcategory && <div style={errorFieldStyle}>{fieldErrors.subcategory}</div>}

        <select
          name="fabric"
          value={product.fabric}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select Fabric</option>
          <option value="Cotton">Cotton</option>
          <option value="Polyester">Polyester</option>
          <option value="Silk">Silk</option>
            <option value="Tri-Blend">Tri-Blend</option>
                <option value="Viscose">Viscose</option>

        </select>
        {fieldErrors.fabric && <div style={errorFieldStyle}>{fieldErrors.fabric}</div>}

        <h3 style={{ marginBottom: "10px", marginTop: "15px", color: "#333" }}>Available Colors</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "Black",
            "White",
            "Red",
            "Blue",
            "Green",
            "Yellow",
            "Pink",
            "Gray",
          ].map((c) => (
            <label key={c} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="checkbox"
                checked={product.colors.includes(c)}
                onChange={() => handleColorToggle(c)}
              />
              <span style={{ fontSize: "14px" }}>{c}</span>
            </label>
          ))}
        </div>
        {fieldErrors.colors && <div style={errorFieldStyle}>{fieldErrors.colors}</div>}

        <h3 style={{ marginBottom: "10px", color: "#333" }}>Images</h3>
        
        <label style={{ fontWeight: "bold" }}>📷 Front Image</label>
        <div>
          <input
            type="file"
            accept="image/*,.svg"
            onChange={(e) => handleFileUpload(e, "frontImage")}
            style={inputStyle}
          />
          {fieldErrors.frontImage && <div style={errorFieldStyle}>{fieldErrors.frontImage}</div>}
          {imageFiles.frontImage && (
            <p style={{ fontSize: "12px", color: "#666" }}>✓ {imageFiles.frontImage} selected</p>
          )}
          {product.frontImage && (
            <img src={product.frontImage} alt="Front Preview" style={previewStyle} />
          )}
        </div>

        <label style={{ fontWeight: "bold", marginTop: "10px" }}>📷 Back Image</label>
        <div>
          <input
            type="file"
            accept="image/*,.svg"
            onChange={(e) => handleFileUpload(e, "backImage")}
            style={inputStyle}
          />
          {fieldErrors.backImage && <div style={errorFieldStyle}>{fieldErrors.backImage}</div>}
          {imageFiles.backImage && (
            <p style={{ fontSize: "12px", color: "#666" }}>✓ {imageFiles.backImage} selected</p>
          )}
          {product.backImage && (
            <img src={product.backImage} alt="Back Preview" style={previewStyle} />
          )}
        </div>

        <button type="submit" style={loading ? submitBtnStyle_disabled : submitBtnStyle} disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

/* ===== Styles ===== */
const pageStyle = {
  padding: "20px",
  maxWidth: "600px",
  margin: "50px auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "15px",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
};

const submitBtnStyle = {
  padding: "12px",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
  fontWeight: "bold",
  marginTop: "10px",
};

const submitBtnStyle_disabled = {
  ...submitBtnStyle,
  backgroundColor: "#888",
  cursor: "not-allowed",
  opacity: 0.6,
};

const errorStyle = {
  backgroundColor: "#ffebee",
  color: "#c62828",
  padding: "12px",
  borderRadius: "5px",
  marginBottom: "15px",
  border: "1px solid #ef5350",
  fontSize: "14px",
};

const previewStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "5px",
  marginTop: "10px",
  border: "1px solid #ddd",
};

const errorFieldStyle = {
  color: "#b00020",
  fontSize: "12px",
  marginTop: "6px",
};

export default AddProduct;
