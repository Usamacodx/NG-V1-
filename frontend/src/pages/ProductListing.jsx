import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Edit3 } from 'lucide-react';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const subcategories = [
    "t-shirt",
    "hoodies",
    "sweatshirt",
    "long-sleeves",
    "round-neck",
    "v-neck",
    "polo-shirt",
  ];

  const categories = [
    { name: "All", key: "all" },
    { name: "Men", key: "men" },
    { name: "Women", key: "women" },
    { name: "Kids", key: "kids" },
  ];

  // ✅ Check admin login status on load
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdminLoggedIn") === "true";
    setIsAdmin(adminStatus);

    // Listen for storage changes
    const handleStorageChange = () => {
      const status = localStorage.getItem("isAdminLoggedIn") === "true";
      setIsAdmin(status);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Backend not running");
        setLoading(false);
      });
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // Filtered products
  const filteredProducts =
    filter === "all"
      ? products.filter(
          (p) =>
            subcategoryFilter === "all" ||
            p.subcategory?.toLowerCase() === subcategoryFilter.toLowerCase()
        )
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === filter.toLowerCase() &&
            (subcategoryFilter === "all" ||
              p.subcategory?.toLowerCase() === subcategoryFilter.toLowerCase())
        );

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading products...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "30px" }}>
      {/* HEADER */}
      <div style={headerStyle}>
        <h1 style={{ textAlign: "center" }}>NextGen Custom Apparel Studio</h1>

        {/* Main Category Buttons */}
        <div style={filterBtnContainer}>
          {categories.map((cat) => (
            <div key={cat.key} style={{ position: "relative" }}>
              <button
                style={
                  filter === cat.key
                    ? { ...filterBtnStyle, backgroundColor: "#333" }
                    : filterBtnStyle
                }
                onClick={() => {
                  setFilter(cat.key);
                  setSubcategoryFilter("all");
                  setExpandedCategory(
                    expandedCategory === cat.key ? null : cat.key
                  );
                }}
              >
                {cat.name}
                {cat.key !== "all" && expandedCategory === cat.key
                  ? " ▼"
                  : cat.key !== "all"
                  ? " ▶"
                  : ""}
              </button>

              {/* Subcategory Dropdown */}
              {expandedCategory === cat.key && cat.key !== "all" && (
                <div style={subcategoryDropdown}>
                  <button
                    style={{
                      ...subcategoryBtnStyle,
                      backgroundColor:
                        subcategoryFilter === "all" ? "#555" : "#222",
                    }}
                    onClick={() => setSubcategoryFilter("all")}
                  >
                    All {cat.name}
                  </button>
                  {subcategories.map((subcat) => (
                    <button
                      key={subcat}
                      style={{
                        ...subcategoryBtnStyle,
                        backgroundColor:
                          subcategoryFilter === subcat ? "#0b84ff" : "#222",
                      }}
                      onClick={() => setSubcategoryFilter(subcat)}
                    >
                      {subcat
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Show Add Product only if admin is logged in */}
          {isAdmin && (
            <button style={adminBtnStyle} onClick={() => navigate("/admin/add-product")}>
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={gridStyle}>
        {filteredProducts.map((product) => (
          <div key={product._id} style={cardStyle}>
            <img
              src={product.frontImage || "https://via.placeholder.com/300"}
              alt={product.name}
              style={imageStyle}
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer"
            />

            <h3 style={{cursor: "pointer"}} onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
            <p><strong>Price:</strong> Rs. {product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>

            {/* Add to Cart & Customize (customer-only) - compact icon buttons with tooltips */}
            {!isAdmin && (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: 10 }}>
                <button
                  title="Add to cart"
                  aria-label="Add to cart"
                  style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    border: "none",
                    padding: "8px",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      alert("Please login first to add products to cart!");
                      navigate("/login");
                      return;
                    }
                    addToCart(product, 1, null, null, 0);
                    alert(`${product.name} added to cart`);
                  }}
                >
                  <ShoppingCart size={18} />
                </button>

                <button
                  title="Customize"
                  aria-label="Customize product"
                  style={{
                    backgroundColor: "#0b84ff",
                    color: "#fff",
                    border: "none",
                    padding: "8px",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      alert("Please login first to customize products!");
                      navigate("/login");
                      return;
                    }
                    navigate(`/customize/${product._id}`);
                  }}
                >
                  <Edit3 size={18} />
                </button>
              </div>
            )}

            {/* Edit & Delete buttons only for admin */}
            {isAdmin && (
              <div style={adminBtnContainerStyle}>
                <button
                  style={editBtnStyle}
                  onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                >
                  Edit
                </button>

                <button
                  style={deleteBtnStyle}
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const headerStyle = { display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" };
const filterBtnContainer = { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px", position: "relative" };
const filterBtnStyle = { backgroundColor: "#000", color: "#fff", fontWeight: "bold", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" };
const subcategoryDropdown = {
  position: "absolute",
  top: "100%",
  left: "0",
  backgroundColor: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  zIndex: 100,
  minWidth: "150px",
  marginTop: "5px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
};
const subcategoryBtnStyle = {
  backgroundColor: "#222",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
  borderBottom: "1px solid #333",
};
const adminBtnStyle = { backgroundColor: "#444", color: "#fff", fontWeight: "bold", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" };
const cardStyle = { border: "1px solid #ddd", borderRadius: "10px", padding: "15px", textAlign: "center", backgroundColor: "#fff" };
const imageStyle = { width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" };
const editBtnStyle = { backgroundColor: "#000", color: "#fff", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" };
const deleteBtnStyle = { backgroundColor: "crimson", color: "#fff", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" };
const adminBtnContainerStyle = { display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" };

export default ProductListing;
