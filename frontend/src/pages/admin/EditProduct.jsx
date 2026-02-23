import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    subcategory: "",
    fabric: "",
    description: "",
    image: "",
    frontImage: "",
    backImage: "",
  });

  const [loading, setLoading] = useState(true);

  const [imageFiles, setImageFiles] = useState({
    frontImage: null,
    backImage: null,
    image: null,
  });

  // Handle file input and convert to base64
  const handleFileUpload = async (e, imageField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result;
      setProduct({ ...product, [imageField]: base64String });
      setImageFiles({ ...imageFiles, [imageField]: file.name });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          name: data.name || "",
          price: data.price || "",
          quantity: data.quantity || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          fabric: data.fabric || "",
          description: data.description || "",
          image: data.image || "",
          frontImage: data.frontImage || "",
          backImage: data.backImage || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }).then(() => navigate("/products"));
  };

  if (loading) return <h2 style={styles.loading}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Product</h2>

      <form style={styles.form} onSubmit={handleUpdate}>
        <h3>Basic Information</h3>
        
        <label style={styles.label}>Product Name</label>
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          style={styles.input}
          placeholder="Product Name"
        />

        <label style={styles.label}>Price (Rs.)</label>
        <input
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          style={styles.input}
          placeholder="Price"
        />

        <label style={styles.label}>Available Stock (Quantity)</label>
        <input
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          style={styles.input}
          placeholder="Quantity"
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          style={{ ...styles.input, minHeight: "100px" }}
          placeholder="Product Description"
        />

        <h3>Category & Type</h3>

        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <label style={styles.label}>Subcategory</label>
        <select
          name="subcategory"
          value={product.subcategory}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="t-shirt">T-Shirt</option>
          <option value="hoodies">Hoodies</option>
          <option value="sweatshirt">Sweatshirt</option>
          <option value="long-sleeves">Long Sleeves</option>
          <option value="round-neck">Round Neck</option>
          <option value="v-neck">V Neck</option>
          <option value="polo-shirt">Polo Shirt</option>
        </select>

        <label style={styles.label}>Fabric Type</label>
        <select
          name="fabric"
          value={product.fabric}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="cotton">Cotton</option>
          <option value="polyester">Polyester</option>
          <option value="blend">Blend</option>
        </select>

        <h3>Images</h3>

        <label style={styles.label}>📷 Front Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "frontImage")}
          style={styles.input}
        />
        {product.frontImage && product.frontImage.startsWith("data:") ? (
          <p style={{ fontSize: "12px", color: "#666" }}>✓ New image selected</p>
        ) : null}
        {product.frontImage && (
          <img src={product.frontImage} alt="Front Preview" style={styles.preview} />
        )}

        <label style={styles.label}>📷 Back Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "backImage")}
          style={styles.input}
        />
        {product.backImage && product.backImage.startsWith("data:") ? (
          <p style={{ fontSize: "12px", color: "#666" }}>✓ New image selected</p>
        ) : null}
        {product.backImage && (
          <img src={product.backImage} alt="Back Preview" style={styles.preview} />
        )}

        <label style={styles.label}>📷 Main Display Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "image")}
          style={styles.input}
        />
        {product.image && product.image.startsWith("data:") ? (
          <p style={{ fontSize: "12px", color: "#666" }}>✓ New image selected</p>
        ) : null}
        {product.image && (
          <img src={product.image} alt="Display Preview" style={styles.preview} />
        )}

        <button type="submit" style={styles.button}>
          Update Product
        </button>
      </form>
    </div>
  );
}

/* ===== CSS-IN-JS STYLES ===== */
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    fontFamily: "Arial, sans-serif",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "10px",
  },
  buttonHover: {
    backgroundColor: "#333",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
    color: "#555",
  },
  preview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
    marginTop: "10px",
    border: "1px solid #ddd",
  },
};
