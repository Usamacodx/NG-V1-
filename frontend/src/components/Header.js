import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Admin login status
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdminLoggedIn") === "true";
    setIsAdmin(adminStatus);

    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem("isAdminLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAdmin(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  // Customer logout
  const handleCustomerLogout = () => {
    // Clear user-specific cart before logout
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      localStorage.removeItem(`cart_${user._id}`);
    }
    
    // Clear token
    localStorage.removeItem("token");
    
    // Call AuthContext logout to update user state and localStorage
    logout();
    
    setShowProfileDropdown(false);
    window.dispatchEvent(new Event("storage"));
    alert("Logout successfully!");
    navigate("/");
  };

  return (
    <header style={headerStyle}>
      <h1 style={logoStyle} onClick={() => navigate("/")}>
        NextGen Custom Apparel
      </h1>

      <nav style={navStyle}>
        <button style={btnStyle} onClick={() => navigate("/")}>
          Home
        </button>
        
        {/* Cart button - hide for admin */}
        {!isAdmin && (
          <button style={btnStyle} onClick={() => navigate("/cart")}>
            Cart
          </button>
        )}

        {/* Admin logout */}
        {isAdmin && (
          <>
            <button style={btnStyle} onClick={() => navigate('/admin/orders')}>
              Orders
            </button>
            <button style={logoutBtnStyle} onClick={handleAdminLogout}>
              Logout
            </button>
          </>
        )}

        {/* Profile dropdown */}
        <div style={profileContainerStyle}>
          <FaUserCircle
            size={30}
            style={{ cursor: "pointer" }}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div style={dropdownStyle}>
              <button
                style={dropdownLoginStyle}
                onClick={() => {
                  navigate("/login");
                  setShowProfileDropdown(false);
                }}
              >
                Login
              </button>
              <button
                style={dropdownLogoutStyle}
                onClick={handleCustomerLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

/* ===== Styles ===== */
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#000",
  color: "#fff",
};

const logoStyle = {
  cursor: "pointer",
  fontSize: "22px",
};

const navStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
};

const btnStyle = {
  padding: "8px 15px",
  backgroundColor: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const logoutBtnStyle = {
  padding: "8px 15px",
  backgroundColor: "#ff4444",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

const profileContainerStyle = {
  position: "relative",
  display: "inline-block",
};

const dropdownStyle = {
  position: "absolute",
  top: "35px",
  right: "0",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  zIndex: 100,
  minWidth: "100px",
  display: "flex",
  flexDirection: "column",
};

const dropdownBtnStyle = {
  width: "100%",
  padding: "8px 12px",
  backgroundColor: "#fff",
  color: "#000",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: "600",
  borderBottom: "1px solid #eee",
  height: "40px",
  display: "flex",
  alignItems: "center",
};

const dropdownLoginStyle = {
  ...dropdownBtnStyle,
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const dropdownLogoutStyle = {
  ...dropdownBtnStyle,
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

export default Header;
