import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SVGShirtContainer from "../components/SVGShirtContainer";

// Helper function to check if image is SVG
const isSVGImage = (imageData) => {
  if (!imageData) return false;
  if (imageData.includes("data:image/svg+xml")) return true;
  if (typeof imageData === "string" && imageData.toLowerCase().endsWith(".svg")) return true;
  return false;
};

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleDeleteItem = (id, size, customization) => {
    removeFromCart(id, size, customization);
  };

  const handleQuantityChange = (id, size, customization, newQuantity) => {
    updateQuantity(id, size, customization, newQuantity);
  };

  const calculateItemTotal = (item) => {
    const price = item.price || 0;
    const customizationPrice = item.customizationPrice || 0;
    const quantity = item.quantity || 1;
    return (price + customizationPrice) * quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Shopping Cart</h1>
      <p style={styles.itemCount}>{cartItems.length} items in your cart</p>

      <div style={styles.mainContent}>
        <div style={styles.cartItemsSection}>
          {cartItems.length === 0 ? (
            <div style={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button
                style={styles.continueShoppingBtn}
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item._id}-${item.size}-${item.customization}-${index}`}
                style={styles.cartItem}
              >
                {(() => {
                  const imageUrl = item.frontImage || item.image || "https://via.placeholder.com/100";
                  
                  // Get shirt color from customization if available
                  let shirtColorToUse = "#FFFFFF";
                  if (item.customization) {
                    try {
                      const details = typeof item.customization === "string"
                        ? JSON.parse(item.customization)
                        : item.customization;
                      const front = details.frontDesign || details;
                      shirtColorToUse = front.shirtColor || "#FFFFFF";
                    } catch (e) {
                      // Use default white
                    }
                  }

                  // If SVG, render with SVGShirtContainer, otherwise use img
                  if (isSVGImage(imageUrl)) {
                    return (
                      <div style={styles.svgContainer}>
                        <SVGShirtContainer imageUrl={imageUrl} shirtColor={shirtColorToUse} />
                      </div>
                    );
                  } else {
                    return (
                      <img
                        src={imageUrl}
                        alt={item.name || "Product"}
                        style={styles.itemImage}
                      />
                    );
                  }
                })()}

                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name || "Unnamed Product"}</h3>

                  {item.customization && (
                    <div style={styles.customizationDetails}>
                      {(() => {
                        try {
                          const details = typeof item.customization === "string"
                            ? JSON.parse(item.customization)
                            : item.customization;

                          // New structure stores frontDesign/backDesign
                          const front = details.frontDesign || details;
                          const back = details.backDesign || null;

                          return (
                            <div>
                              {front?.shirtColor && <p style={styles.customDetail}>👕 Shirt Color: <span style={{display: 'inline-block', width: '20px', height: '20px', backgroundColor: front.shirtColor, border: '1px solid #ccc', borderRadius: '3px', verticalAlign: 'middle', marginLeft: '5px'}}></span> <strong>{front.shirtColor}</strong></p>}
                              {front?.designText && <p style={styles.customDetail}>📝 Front Text: <strong>{front.designText}</strong></p>}
                              {front?.logo && <p style={styles.customDetail}>🏷️ Front Logo: Included</p>}
                              {front?.selectedStickers && front.selectedStickers.length > 0 && (
                                <p style={styles.customDetail}>✨ Front Stickers: {front.selectedStickers.map((s) => s.name || s.emoji || 'Sticker').join(', ')}</p>
                              )}
                              {back && (
                                <>
                                  {back.designText && <p style={styles.customDetail}>📝 Back Text: <strong>{back.designText}</strong></p>}
                                  {back.logo && <p style={styles.customDetail}>🏷️ Back Logo: Included</p>}
                                  {back.selectedStickers && back.selectedStickers.length > 0 && (
                                    <p style={styles.customDetail}>✨ Back Stickers: {back.selectedStickers.map((s) => s.name || s.emoji || 'Sticker').join(', ')}</p>
                                  )}
                                </>
                              )}
                              {details.instructions && <p style={styles.customDetail}>📝 Instructions: {details.instructions}</p>}
                            </div>
                          );
                        } catch (e) {
                          return <p style={styles.customDetail}>Customization: {item.customization}</p>;
                        }
                      })()}
                    </div>
                  )}

                  <div style={styles.itemMeta}>
                    <span style={styles.metaItem}>Size: {item.size || "N/A"}</span>
                    <div style={styles.quantityControl}>
                      <button
                        style={styles.quantityChangeBtn}
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            item.size,
                            item.customization,
                            (item.quantity || 1) - 1
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            item._id,
                            item.size,
                            item.customization,
                            parseInt(e.target.value) || 1
                          )
                        }
                        style={styles.quantityInput}
                        min="1"
                      />
                      <button
                        style={styles.quantityChangeBtn}
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            item.size,
                            item.customization,
                            (item.quantity || 1) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p style={styles.priceBreakdown}>
                    Rs.{(item.price || 0).toFixed(2)}
                    {(item.customizationPrice || 0) > 0 && ` + Rs.${(item.customizationPrice || 0).toFixed(2)} custom`}
                  </p>

                  <div style={styles.itemFooter}>
                    <span style={styles.itemTotal}>
                      Rs.{calculateItemTotal(item).toFixed(2)}
                    </span>
                    <div style={styles.buttonGroup2}>
                      {item.customization && (
                        <button
                          style={styles.previewBtn}
                          onClick={() =>
                            navigate("/preview", { state: { item, index } })
                          }
                        >
                          Preview
                        </button>
                      )}
                      <button
                        style={styles.deleteBtn}
                        onClick={() =>
                          handleDeleteItem(item._id, item.size, item.customization)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={styles.orderSummary}>
            <h2 style={styles.summaryHeading}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={styles.freeText}>
                {shipping === 0 ? "FREE" : `Rs.${shipping.toFixed(2)}`}
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax (8%)</span>
              <span>Rs.{tax.toFixed(2)}</span>
            </div>
            <div style={styles.summaryDivider}></div>
            <div style={styles.totalRow}>
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
            <div style={styles.buttonGroup}>
              <button
                style={styles.checkoutBtn}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
              <button
                style={styles.continueShoppingBtn}
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Keep all your previous CSS exactly as it was
const styles = {
  container: {
    padding: "30px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    color: "#000",
  },
  itemCount: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 30px 0",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "30px",
    alignItems: "start",
  },
  cartItemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  emptyCart: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
  },
  cartItem: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  itemImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
    color: "#000",
  },
  customInfo: {
    fontSize: "13px",
    color: "#666",
    margin: "0",
  },
  itemMeta: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "13px",
  },
  metaItem: {
    color: "#333",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  quantityChangeBtn: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  quantityInput: {
    width: "40px",
    padding: "4px",
    fontSize: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    textAlign: "center",
  },
  priceBreakdown: {
    fontSize: "12px",
    color: "#666",
    margin: "5px 0",
  },
  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  itemTotal: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  buttonGroup2: {
    display: "flex",
    gap: "10px",
  },
  previewBtn: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  deleteBtn: {
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  orderSummary: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    height: "fit-content",
    position: "sticky",
    top: "20px",
  },
  summaryHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    color: "#000",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#333",
  },
  freeText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  summaryDivider: {
    height: "1px",
    backgroundColor: "#ddd",
    margin: "10px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
  },
  checkoutBtn: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  continueShoppingBtn: {
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid #000",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  customizationDetails: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "8px",
    marginBottom: "8px",
    border: "1px solid #e0e0e0",
  },
  customDetail: {
    fontSize: "12px",
    color: "#555",
    margin: "4px 0",
  },
  customInfo: {
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
  },
  svgContainer: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
};
