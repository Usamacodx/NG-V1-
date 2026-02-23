import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import html2pdf from "html2pdf.js";
import SVGShirtContainer from "../components/SVGShirtContainer";

// Helper function to check if image is SVG
const isSVGImage = (imageData) => {
  if (!imageData) return false;
  if (imageData.includes("data:image/svg+xml")) return true;
  if (typeof imageData === "string" && imageData.toLowerCase().endsWith(".svg")) return true;
  return false;
};

function tryParse(json) {
  if (!json) return null;
  if (typeof json === 'object') return json;
  try {
    
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function DesignView({ design }) {
  if (!design) return <div style={{fontSize:'12px', color:'#999'}}>No design</div>;
  const resolveImgSrc = (val) => {
    if (!val) return null;
    if (typeof val === 'string') {
      if (val.startsWith('blob:')) return null;
      return val;
    }
    if (typeof val === 'object') {
      return val.dataURL || val.url || val.src || null;
    }
    return null;
  };

  const logoSrc = resolveImgSrc(design.logo);
  
  // Handle both old format (single sticker) and new format (array of stickers)
  const stickers = design.selectedStickers || (design.selectedSticker ? [design.selectedSticker] : []);

  return (
    <div style={{background:'#f9f9f9', padding:'8px', borderRadius:'4px'}}>
      {design.shirtColor && (
        <div style={{fontSize:'12px', marginBottom:'4px'}}>
          <strong>👕 Shirt Color:</strong>
          <span style={{display:'inline-block', width:'16px', height:'16px', marginLeft:'4px', marginRight:'4px', verticalAlign:'middle', background: design.shirtColor, border:'1px solid #ccc'}}></span>
          {design.shirtColor}
        </div>
      )}
      <div style={{fontSize:'12px', marginBottom:'4px'}}><strong>Text:</strong> {design.designText || '—'}</div>
      <div style={{fontSize:'12px', marginBottom:'4px'}}>
        <strong>Color:</strong> 
        <span style={{display:'inline-block', width:'16px', height:'16px', marginLeft:'4px', marginRight:'4px', verticalAlign:'middle', background: design.selectedColor || '#000', border:'1px solid #ccc'}}></span>
        {design.selectedColor || '—'}
      </div>
      <div style={{fontSize:'12px', marginBottom:'4px'}}><strong>Font:</strong> {design.selectedFont || '—'} ({design.fontSize || '—'} px)</div>
      <div style={{fontSize:'12px', marginBottom:'4px'}}>
        <strong>Logo:</strong> {logoSrc ? <img src={logoSrc} alt="logo" style={{display:'inline-block', width:'32px', height:'32px', marginLeft:'4px', border:'1px solid #ccc'}} /> : (design.logo ? <span style={{fontSize:'10px', color:'#666'}}> Uploaded (preview not available)</span> : ' None')}
      </div>
      <div style={{fontSize:'12px', marginBottom:'4px'}}>
        <strong>Sticker{stickers.length > 1 ? 's' : ''}:</strong> {stickers.length > 0 ? (
          <div style={{display:'flex', gap:'4px', flexWrap:'wrap', marginTop:'4px'}}>
            {stickers.map((sticker, idx) => {
              const stickerSrc = resolveImgSrc(sticker?.url || sticker);
              return stickerSrc ? (
                <img key={idx} src={stickerSrc} alt={`sticker-${idx}`} style={{display:'inline-block', width:'32px', height:'32px', border:'1px solid #ccc'}} />
              ) : sticker?.emoji ? (
                <span key={idx} style={{fontSize:'24px'}}>{sticker.emoji}</span>
              ) : (
                <span key={idx} style={{fontSize:'10px', color:'#666'}}> {sticker?.name || 'Sticker'} (preview not available)</span>
              );
            })}
          </div>
        ) : ' None'}
      </div>
      <div style={{fontSize:'12px', fontWeight:'600', color:'#d4a574', marginTop:'6px'}}><strong>Charge:</strong> PKR {Number(design.charge || 0).toFixed(2)}</div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    const customization = item.customizationPrice || 0;
    const qty = item.quantity || 1;
    return sum + (price + customization) * qty;
  }, 0);

  const [shippingMethod, setShippingMethod] = useState('standard');
  const shippingCost = shippingMethod === 'express' ? 250 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shippingCost + tax).toFixed(2);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [fieldErrors, setFieldErrors] = useState({});
  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  // Bank proof
  const [bankProof, setBankProof] = useState(null);

  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Validate inputs
    const errors = {};
    if (!name || name.trim().length < 3) errors.name = "Please enter your full name (min 3 chars)";
    // Email
    const emailValue = (email || user?.email || '').trim();
    const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!emailValue || !emailRe.test(emailValue)) errors.email = 'Enter a valid email address';

    const phoneDigits = (phone || '').replace(/[^0-9+]/g, "");
    if (!phoneDigits || phoneDigits.length < 7 || phoneDigits.length > 15) errors.phone = "Enter a valid phone number (7-15 digits)";
    if (!address || address.trim().length < 5) errors.address = "Please enter a valid address";
    if (!city || city.trim().length < 2) errors.city = "Enter your city";
    if (postal && !/^[0-9A-Za-z\- ]{3,10}$/.test(postal)) errors.postal = "Invalid postal code";

    // Payment-specific validations
    const luhnCheck = (num) => {
      const s = (num || '').replace(/\s+/g, '');
      if (!/^[0-9]{12,19}$/.test(s)) return false;
      let sum = 0, alt = false;
      for (let i = s.length - 1; i >= 0; i--) {
        let n = parseInt(s.charAt(i), 10);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        alt = !alt;
      }
      return (sum % 10) === 0;
    };

    const validateExpiry = (val) => {
      if (!val) return false;
      const m = val.trim().replace(/\s/g, '').split('/');
      if (m.length !== 2) return false;
      let mm = parseInt(m[0],10), yy = parseInt(m[1],10);
      if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) return false;
      if (yy < 100) {
        const full = 2000 + yy;
        yy = full;
      }
      const exp = new Date(yy, mm - 1, 1);
      const now = new Date();
      // set to last day of month
      exp.setMonth(exp.getMonth() + 1);
      exp.setDate(0);
      return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
    };

    if (paymentMethod === 'card') {
      if (!cardNumber || !luhnCheck(cardNumber)) errors.cardNumber = 'Enter a valid card number';
      if (!cardExpiry || !validateExpiry(cardExpiry)) errors.cardExpiry = 'Invalid expiry (MM/YY)';
      if (!cardCvc || !/^\d{3,4}$/.test(cardCvc)) errors.cardCvc = 'Invalid CVC';
      if (!cardName || cardName.trim().length < 2) errors.cardName = 'Name on card required';
    }

    if (paymentMethod === 'bank') {
      if (!bankProof) errors.bankProof = 'Please upload bank payment screenshot for verification';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const order = {
      id: `ORD_${Date.now()}`,
      userId: user?._id || null,
      items: cartItems,
      shippingMethod,
      shippingCost,
      tax,
      total,
      address: { name, email: user?.email, phone, address, city, postal },
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    // POST order to backend
    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Order creation failed');
        }
        return res.json();
      })
      .then((data) => {
        clearCart();
        alert('Order placed successfully! Order ID: ' + (data.order?.id || order.id));
        navigate('/products');
      })
      .catch((err) => {
        console.error('Order POST failed', err);
        alert('Failed to place order on server. Saved locally.');
        try {
          const existing = JSON.parse(localStorage.getItem('orders') || '[]');
          existing.push(order);
          localStorage.setItem('orders', JSON.stringify(existing));
        } catch (e) {
          console.warn('Failed to save order locally', e.message);
        }
      });
  };

  const downloadReceipt = () => {
    const orderId = `REC_${Date.now()}`;
    const receiptElement = document.getElementById('receipt-content');
    
    if (!receiptElement) {
      alert('Receipt not found');
      return;
    }

    const options = {
      margin: 10,
      filename: `NextGen_Receipt_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(receiptElement).save();
  };

  const [newsletter, setNewsletter] = useState(true);
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Checkout</h1>

      <div style={styles.topRow}>
        <div>
          <div style={styles.accountLine}>A</div>
          <div style={styles.emailLine}>{user?.email || 'guest@example.com'}</div>
          <label style={styles.newsletter}><input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} /> Email me with news and offers</label>
        </div>
        <div style={styles.shippingMethodBox}>
          <strong>Delivery</strong>
          <div style={{marginTop:8}}>Shipping method</div>
          <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} style={{...styles.input, width:260}}>
            <option value="shipping">Choose a shipping method</option>
            <option value="standard">Standard Shipping (Free) - 3 days</option>
            <option value="express">Express Shipping (Paid) - 1-2 days (Rs. 250)</option>
          </select>
          <div style={styles.shippingNote}><strong>(Fastest Delivery in 3 days 🚚🚀)</strong> For urgent delivery choose Express and consider full advance payment.</div>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.left}>
          <h2 style={styles.sub}>Contact & Shipping</h2>
          <input placeholder="Full name" value={name} onChange={(e) => { setName(e.target.value); setFieldErrors({ ...fieldErrors, name: '' }); }} style={styles.input} />
          {fieldErrors.name && <div style={styles.errorField}>{fieldErrors.name}</div>}

          <input placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors({ ...fieldErrors, email: '' }); }} style={styles.input} />
          {fieldErrors.email && <div style={styles.errorField}>{fieldErrors.email}</div>}

          <input placeholder="Phone / WhatsApp" value={phone} onChange={(e) => { setPhone(e.target.value); setFieldErrors({ ...fieldErrors, phone: '' }); }} style={styles.input} />
          {fieldErrors.phone && <div style={styles.errorField}>{fieldErrors.phone}</div>}
          <div style={{fontSize:13, color:'#555', marginBottom:8}}>Provide your full address (house/street number, city, landmark) and keep your SIM/WhatsApp number active for smooth delivery.</div>
          <input placeholder="Address (house / street / landmark)" value={address} onChange={(e) => { setAddress(e.target.value); setFieldErrors({ ...fieldErrors, address: '' }); }} style={styles.input} />
          {fieldErrors.address && <div style={styles.errorField}>{fieldErrors.address}</div>}
          <div style={{display:'flex', gap:10}}>
            <input placeholder="City" value={city} onChange={(e) => { setCity(e.target.value); setFieldErrors({ ...fieldErrors, city: '' }); }} style={{...styles.input, flex:1}} />
            <input placeholder="Postal Code" value={postal} onChange={(e) => { setPostal(e.target.value); setFieldErrors({ ...fieldErrors, postal: '' }); }} style={{...styles.input, width:120}} />
          </div>
          {fieldErrors.city && <div style={styles.errorField}>{fieldErrors.city}</div>}
          {fieldErrors.postal && <div style={styles.errorField}>{fieldErrors.postal}</div>}

          <h2 style={styles.sub}>Payment</h2>
          <div style={styles.paymentMethods}>
            <label style={styles.paymentOption}><input type="radio" name="pay" checked={paymentMethod==='card'} onChange={() => setPaymentMethod('card')} /> Debit/Credit Card</label>
            <div style={styles.cardLogos}>VISA · MASTERCARD · AMEX</div>
            <label style={styles.paymentOption}><input type="radio" name="pay" checked={paymentMethod==='cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery (COD)</label>
            <label style={styles.paymentOption}><input type="radio" name="pay" checked={paymentMethod==='bank'} onChange={() => setPaymentMethod('bank')} /> Bank Deposit</label>
          </div>

          {paymentMethod === 'card' && (
            <div style={{marginTop:10}}>
              <input placeholder="Card number" value={cardNumber} onChange={(e)=>{ setCardNumber(e.target.value); setFieldErrors({ ...fieldErrors, cardNumber: '' }); }} style={styles.input} />
              {fieldErrors.cardNumber && <div style={styles.errorField}>{fieldErrors.cardNumber}</div>}

              <div style={{display:'flex', gap:10}}>
                <input placeholder="MM / YY" value={cardExpiry} onChange={(e)=>{ setCardExpiry(e.target.value); setFieldErrors({ ...fieldErrors, cardExpiry: '' }); }} style={{...styles.input, flex:1}} />
                <input placeholder="CVC" value={cardCvc} onChange={(e)=>{ setCardCvc(e.target.value); setFieldErrors({ ...fieldErrors, cardCvc: '' }); }} style={{...styles.input, width:120}} />
              </div>
              {fieldErrors.cardExpiry && <div style={styles.errorField}>{fieldErrors.cardExpiry}</div>}
              {fieldErrors.cardCvc && <div style={styles.errorField}>{fieldErrors.cardCvc}</div>}

              <input placeholder="Name on card" value={cardName} onChange={(e)=>{ setCardName(e.target.value); setFieldErrors({ ...fieldErrors, cardName: '' }); }} style={styles.input} />
              {fieldErrors.cardName && <div style={styles.errorField}>{fieldErrors.cardName}</div>}

              <label style={{fontSize:13, color:'#555'}}><input type="checkbox" /> Use shipping address as billing address</label>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div style={styles.bankDetails}>
              <p><strong>Bank Deposit</strong></p>
              <p style={{marginTop:6}}>Transfer the amount to your preferred bank and upload the payment screenshot below for verification. Our team will confirm and process your order.</p>
              <input type="file" accept="image/*,application/pdf" style={{marginTop:8}} onChange={(e)=>{ setBankProof(e.target.files && e.target.files[0] ? e.target.files[0] : null); setFieldErrors({...fieldErrors, bankProof: ''}); }} />
              {fieldErrors.bankProof && <div style={styles.errorField}>{fieldErrors.bankProof}</div>}
              <div style={{marginTop:8, fontSize:13}}>After payment, please upload the payment screenshot and keep your WhatsApp number active for delivery coordination.</div>
            </div>
          )}

          <label style={{display:'block', marginTop:12}}><input type="checkbox" checked={useDifferentBilling} onChange={(e)=>setUseDifferentBilling(e.target.checked)} /> Use a different billing address</label>
          {useDifferentBilling && (
            <div style={{marginTop:10}}>
              <input placeholder="Billing full name" value={billingName} onChange={(e)=>setBillingName(e.target.value)} style={styles.input} />
              <input placeholder="Billing address" value={billingAddress} onChange={(e)=>setBillingAddress(e.target.value)} style={styles.input} />
            </div>
          )}

          <div style={{marginTop:16}}>
            <button style={styles.placeBtn} onClick={placeOrder}>Place Order</button>
            <button style={styles.backBtn} onClick={() => navigate('/cart')}>Back to Cart</button>
          </div>
        </div>

        <div style={styles.right}>
          <h2 style={styles.sub}>Order summary</h2>
          <div style={styles.orderSummaryBox}>
            <div style={styles.summaryRow}><span>Subtotal · {cartItems.length} items</span><span>Rs. {subtotal.toFixed(2)}</span></div>
            <div style={styles.summaryRow}><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `Rs. ${shippingCost.toFixed(2)}`}</span></div>
            <div style={styles.summaryRow}><span>Tax</span><span>Rs. {tax.toFixed(2)}</span></div>
            <div style={{height:1, background:'#ddd', margin:'10px 0'}}></div>
            <div style={{...styles.summaryRow, fontWeight:'bold'}}><span>Total</span><span>Rs. {total.toFixed(2)}</span></div>
          </div>

          <h3 style={{marginTop:16}}>Shopping cart</h3>
          <div style={{display:'grid', gap:12}}>
            {cartItems.map((it, idx) => {
              const base = (it.price||0);
              const cust = (it.customizationPrice||0);
              const qty = (it.quantity||1);
              const itemTotal = (base + cust) * qty;
              return (
                <div key={idx} style={{border:'1px solid #ddd', borderRadius:'8px', padding:'12px', background:'#fafafa'}}>
                  <div style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
                    {(() => {
                      const imageUrl = it.frontImage || it.image || 'https://via.placeholder.com/80';
                      
                      // Get shirt color from customization if available
                      let shirtColorToUse = "#FFFFFF";
                      if (it.customization) {
                        try {
                          const details = typeof it.customization === "string"
                            ? JSON.parse(it.customization)
                            : it.customization;
                          const front = details.frontDesign || details;
                          shirtColorToUse = front.shirtColor || "#FFFFFF";
                        } catch (e) {
                          // Use default white
                        }
                      }

                      // If SVG, render with SVGShirtContainer, otherwise use img
                      if (isSVGImage(imageUrl)) {
                        return (
                          <div style={{width:'100px', height:'100px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', borderRadius:'6px'}}>
                            <SVGShirtContainer imageUrl={imageUrl} shirtColor={shirtColorToUse} />
                          </div>
                        );
                      } else {
                        return (
                          <img src={imageUrl} alt={it.name} style={{width:100, height:100, objectFit:'cover', borderRadius:'6px'}} />
                        );
                      }
                    })()}
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, fontSize:15}}>{it.name}</div>
                      <div style={{fontSize:13, color:'#666', marginTop:3}}>{it.description || ''}</div>
                      <div style={{fontSize:13, color:'#555', marginTop:6}}>Size: <strong>{it.size || 'N/A'}</strong> | Qty: <strong>{qty}</strong></div>
                      <div style={{marginTop:8, fontSize:13}}>
                        <div>Price: <strong>Rs. {base.toFixed(2)}</strong></div>
                        {cust ? <div style={{color:'#d4a574'}}>Customization: <strong>Rs. {cust.toFixed(2)}</strong></div> : null}
                        <div style={{fontWeight:600, marginTop:4, fontSize:14}}>Total: Rs. {itemTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Customization Details */}
                  {it.customization && (
                    <div style={{paddingTop:12, borderTop:'2px solid #ddd'}}>
                      <div style={{fontWeight:700, marginBottom:10, fontSize:14}}>Customization Details</div>
                      {(() => {
                        const customization = tryParse(typeof it.customization === 'string' ? it.customization : JSON.stringify(it.customization));
                        const front = customization?.frontDesign || customization?.front || null;
                        const back = customization?.backDesign || customization?.back || null;
                        return (
                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                            {front && (
                              <div style={{background:'#fff', padding:'10px', borderRadius:'6px', border:'1px solid #e0e0e0'}}>
                                <div style={{fontWeight:700, marginBottom:'8px', fontSize:'13px', color:'#333'}}>Front Design</div>
                                <DesignView design={front} />
                              </div>
                            )}
                            {back && (
                              <div style={{background:'#fff', padding:'10px', borderRadius:'6px', border:'1px solid #e0e0e0'}}>
                                <div style={{fontWeight:700, marginBottom:'8px', fontSize:'13px', color:'#333'}}>Back Design</div>
                                <DesignView design={back} />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{marginTop:14, display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button style={styles.continueShoppingBtn} onClick={() => setShowReceipt(!showReceipt)}>{showReceipt ? 'Hide Receipt' : 'Generate Receipt'}</button>
            {showReceipt && <button style={styles.continueShoppingBtn} onClick={downloadReceipt}>📥 Download Receipt</button>}
            <button style={styles.continueShoppingBtn} onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>

          {showReceipt && (
            <div id="receipt-content" style={{marginTop:16, padding:20, border:'1px solid #ddd', borderRadius:6, background:'#fff', fontFamily:'Arial, sans-serif'}}>
              {/* NextGen Header */}
              <div style={{textAlign:'center', marginBottom:20, paddingBottom:15, borderBottom:'3px solid #d4a574'}}>
                <div style={{fontSize:24, fontWeight:'bold', color:'#333', marginBottom:4}}>NextGen</div>
                <div style={{fontSize:12, color:'#666', letterSpacing:'0.5px'}}>CUSTOM APPAREL STUDIO</div>
                <div style={{fontSize:11, color:'#999', marginTop:4}}>Premium Quality Customization</div>
              </div>

              {/* Order Info Header */}
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:16, fontSize:12}}>
                <div>
                  <div style={{color:'#666', marginBottom:2}}>Order ID</div>
                  <div style={{fontWeight:'bold', fontSize:13, color:'#333'}}>REC_{Date.now()}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{color:'#666', marginBottom:2}}>Date</div>
                  <div style={{fontWeight:'bold', fontSize:13, color:'#333'}}>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>

              <div style={{height:1, background:'#e0e0e0', marginBottom:16}}></div>

              {/* Customer Info */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13, fontWeight:'bold', color:'#333', marginBottom:8}}>CUSTOMER INFORMATION</div>
                <table style={{width:'100%', fontSize:12, color:'#555'}}>
                  <tbody>
                    <tr>
                      <td style={{paddingBottom:4}}>Name:</td>
                      <td style={{paddingBottom:4, fontWeight:'bold', color:'#333'}}>{name || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style={{paddingBottom:4}}>Email:</td>
                      <td style={{paddingBottom:4}}>{user?.email || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style={{paddingBottom:4}}>Phone:</td>
                      <td style={{paddingBottom:4}}>{phone || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style={{paddingBottom:4}}>Address:</td>
                      <td style={{paddingBottom:4}}>{address || 'Not provided'}, {city || ''} {postal || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{height:1, background:'#e0e0e0', marginBottom:16}}></div>

              {/* Items Section */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13, fontWeight:'bold', color:'#333', marginBottom:12}}>ORDER ITEMS</div>
                {cartItems.map((it, idx) => {
                  const base = (it.price||0);
                  const cust = (it.customizationPrice||0);
                  const qty = (it.quantity||1);
                  const itemTotal = (base + cust) * qty;
                  const customization = tryParse(typeof it.customization === 'string' ? it.customization : JSON.stringify(it.customization));
                  const front = customization?.frontDesign || customization?.front || null;
                  const back = customization?.backDesign || customization?.back || null;

                  return (
                    <div key={idx} style={{marginBottom:14, paddingBottom:12, borderBottom:'1px solid #f0f0f0'}}>
                      <div style={{display:'flex', gap:12, marginBottom:10}}>
                        {(() => {
                          const imageUrl = it.frontImage || it.image || 'https://via.placeholder.com/80';
                          const shirtColorToUse = front?.shirtColor || "#FFFFFF";

                          // If SVG, render with SVGShirtContainer, otherwise use img
                          if (isSVGImage(imageUrl)) {
                            return (
                              <div style={{width:'80px', height:'80px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', borderRadius:'4px', border:'1px solid #ddd'}}>
                                <SVGShirtContainer imageUrl={imageUrl} shirtColor={shirtColorToUse} />
                              </div>
                            );
                          } else {
                            return (
                              <img src={imageUrl} alt={it.name} style={{width:80, height:80, objectFit:'cover', borderRadius:'4px', border:'1px solid #ddd'}} />
                            );
                          }
                        })()}
                        <div style={{flex:1, fontSize:12}}>
                          <div style={{fontWeight:'bold', fontSize:13, color:'#333', marginBottom:4}}>{idx+1}. {it.name}</div>
                          <div style={{color:'#666', marginBottom:3}}>Quantity: <strong>{qty}</strong></div>
                          <div style={{color:'#666', marginBottom:3}}>Size: <strong>{it.size || 'N/A'}</strong></div>
                          <div style={{color:'#666', marginBottom:2}}>Price: <strong>Rs. {base.toFixed(2)}</strong></div>
                          {cust ? <div style={{color:'#d4a574', marginBottom:2}}>Customization: <strong>Rs. {cust.toFixed(2)}</strong></div> : null}
                          <div style={{fontWeight:'bold', fontSize:12, marginTop:6, color:'#333', paddingTop:6, borderTop:'1px solid #f0f0f0'}}>Total: Rs. {itemTotal.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Design Details */}
                      {(front || back) && (
                        <div style={{background:'#fafafa', padding:10, borderRadius:'4px', marginTop:8, fontSize:11}}>
                          <div style={{fontWidth:'bold', marginBottom:8, color:'#333'}}>✓ Design Customizations</div>
                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                            {front && (
                              <div>
                                <div style={{fontWeight:'bold', marginBottom:4, color:'#555', fontSize:'11px'}}>🔹 Front Side</div>
                                <div style={{fontSize:'10px', color:'#666', lineHeight:'1.4'}}>
                                  {front.shirtColor && <div style={{display:'flex', alignItems:'center', gap:'4px'}}>👕 Shirt: <span style={{display:'inline-block', width:'12px', height:'12px', background:front.shirtColor, border:'1px solid #999', borderRadius:'2px'}}></span> {front.shirtColor}</div>}
                                  {front.designText && <div>Text: {front.designText}</div>}
                                  {front.selectedColor && <div style={{display:'flex', alignItems:'center', gap:'4px'}}>Color: <span style={{display:'inline-block', width:'12px', height:'12px', background:front.selectedColor, border:'1px solid #999', borderRadius:'2px'}}></span></div>}
                                  {front.selectedFont && <div>Font: {front.selectedFont}</div>}
                                  {front.logo && <div>📌 Logo: Included</div>}
                                  {front.selectedStickers && front.selectedStickers.length > 0 && (
                                    <div>
                                      <div>✨ Stickers ({front.selectedStickers.length}):</div>
                                      <div style={{marginLeft:'8px'}}>
                                        {front.selectedStickers.map((s, idx) => (
                                          <div key={idx} style={{fontSize:'9px', color:'#555', marginTop:'2px'}}>
                                            {s.emoji && <span>{s.emoji} </span>}
                                            {s.name && <span>{s.name}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {back && (
                              <div>
                                <div style={{fontWeight:'bold', marginBottom:4, color:'#555', fontSize:'11px'}}>🔹 Back Side</div>
                                <div style={{fontSize:'10px', color:'#666', lineHeight:'1.4'}}>
                                  {back.designText && <div>Text: {back.designText}</div>}
                                  {back.selectedColor && <div style={{display:'flex', alignItems:'center', gap:'4px'}}>Color: <span style={{display:'inline-block', width:'12px', height:'12px', background:back.selectedColor, border:'1px solid #999', borderRadius:'2px'}}></span></div>}
                                  {back.selectedFont && <div>Font: {back.selectedFont}</div>}
                                  {back.logo && <div>📌 Logo: Included</div>}
                                  {back.selectedStickers && back.selectedStickers.length > 0 && (
                                    <div>
                                      <div>✨ Stickers ({back.selectedStickers.length}):</div>
                                      <div style={{marginLeft:'8px'}}>
                                        {back.selectedStickers.map((s, idx) => (
                                          <div key={idx} style={{fontSize:'9px', color:'#555', marginTop:'2px'}}>
                                            {s.emoji && <span>{s.emoji} </span>}
                                            {s.name && <span>{s.name}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{height:2, background:'#d4a574', marginBottom:14}}></div>

              {/* Order Summary */}
              <div style={{marginBottom:14, fontSize:12}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span style={{fontWeight:'bold'}}>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Shipping ({shippingMethod === 'express' ? 'Express (1-2 days)' : 'Standard (3 days)'})</span>
                  <span style={{fontWeight:'bold'}}>{shippingCost===0 ? 'Free' : `Rs. ${shippingCost.toFixed(2)}`}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                  <span>Tax (8%)</span>
                  <span style={{fontWeight:'bold'}}>Rs. {tax.toFixed(2)}</span>
                </div>
                <div style={{height:2, background:'#d4a574', marginBottom:10}}></div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:'bold', color:'#333'}}>
                  <span>TOTAL AMOUNT</span>
                  <span style={{color:'#d4a574', fontSize:16}}>Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{height:1, background:'#e0e0e0', marginBottom:14}}></div>

              {/* Payment Info */}
              <div style={{marginBottom:14, fontSize:12}}>
                <div style={{marginBottom:6}}>
                  <span style={{color:'#666'}}>Payment Method:</span>
                  <span style={{fontWeight:'bold', marginLeft:8}}>{paymentMethod.toUpperCase()}</span>
                </div>
                <div>
                  <span style={{color:'#666'}}>Status:</span>
                  <span style={{fontWeight:'bold', marginLeft:8, color:'#ff9800'}}>Pending</span>
                </div>
              </div>

              <div style={{height:1, background:'#e0e0e0', marginBottom:14}}></div>

              {/* Footer */}
              <div style={{textAlign:'center', fontSize:11, color:'#666', paddingTop:10}}>
                <div style={{marginBottom:6}}>Thank you for choosing NextGen Custom Apparel Studio!</div>
                <div style={{fontSize:10, color:'#999'}}>For inquiries, visit our website or contact support</div>
                <div style={{marginTop:8, fontSize:10, fontWeight:'bold', color:'#333'}}>Quality • Customization • Excellence</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 30, maxWidth: 1100, margin: '0 auto', fontFamily: 'Arial, sans-serif' },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' },
  left: { background:'#fff', padding:20, borderRadius:8, border:'1px solid #e0e0e0' },
  right: { background:'#fff', padding:20, borderRadius:8, border:'1px solid #e0e0e0' },
  sub: { fontSize:16, margin:'0 0 10px 0' },
  input: { width:'100%', padding:10, marginBottom:10, borderRadius:6, border:'1px solid #ddd' },
  placeBtn: { padding:12, background:'#000', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', marginRight:10 },
  backBtn: { padding:12, background:'#fff', color:'#000', border:'1px solid #000', borderRadius:6, cursor:'pointer' },
  summaryRow: { display:'flex', justifyContent:'space-between', marginBottom:8 }
  ,
  errorField: { color: '#b00020', fontSize: 13, marginBottom: 8 }
  ,
  topRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  accountLine: { width:28, height:28, borderRadius:14, background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 },
  emailLine: { marginTop:6, fontSize:14 },
  newsletter: { display:'block', marginTop:6, fontSize:13, color:'#444' },
  shippingMethodBox: { textAlign:'right' },
  shippingNote: { marginTop:8, fontSize:13, color:'#444' },
  paymentMethods: { display:'flex', flexDirection:'column', gap:8 },
  paymentOption: { fontSize:14, display:'flex', alignItems:'center', gap:8 },
  cardLogos: { fontSize:12, color:'#666', marginLeft:22 },
  bankDetails: { background:'#fafafa', padding:12, borderRadius:6, border:'1px solid #eee', marginTop:10, fontSize:14 },
  orderSummaryBox: { background:'#fff', padding:12, borderRadius:6, border:'1px solid #eee' },
  cartItemRow: { display:'flex', gap:12, alignItems:'center', padding:8, borderRadius:6, border:'1px solid #f0f0f0' },
  cartThumb: { width:80, height:80, objectFit:'cover', borderRadius:6 },
  continueShoppingBtn: { padding:10, background:'#fff', border:'1px solid #000', borderRadius:6, cursor:'pointer' }
};

function formatKey(k){
  return k.replace(/([A-Z])/g, ' $1').replace(/[_\-]/g,' ').replace(/^./, s=>s.toUpperCase());
}
