import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const submit = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password });
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("Login response:", res);
      
      // Store complete user object including _id for cart persistence
      const userData = {
        email: res.data.email,
        _id: res.data._id,
        token: res.data.token,
      };
      login(userData);
      
      // After login, check for pending action
      try {
        const pendingRaw = localStorage.getItem("pendingAction");
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          if (pending.type === "add") {
            const p = pending.payload;
            addToCart(p.product, p.quantity, p.size, p.customization, p.customizationPrice);
            localStorage.removeItem("pendingAction");
            navigate("/cart");
            return;
          } else if (pending.type === "customize") {
            const pid = pending.payload.productId;
            localStorage.removeItem("pendingAction");
            navigate(`/customize/${pid}`);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to process pending action", e);
      }

      navigate("/products");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed. Please try again.";
      setError(errMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            style={{
              ...styles.loginBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              style={styles.signupLink}
            >
              Sign Up
            </button>
          </p>
          <p style={styles.footerText}>
            <button
              onClick={() => navigate("/forgot-password")}
              style={styles.forgotPasswordLink}
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },
  errorBox: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "12px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #ef5350",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    transition: "border-color 0.2s",
  },
  passwordInputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {
    padding: "12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "all 0.2s",
  },
  divider: {
    height: "1px",
    backgroundColor: "#ddd",
    margin: "30px 0",
  },
  footer: {
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },
  signupLink: {
    backgroundColor: "transparent",
    color: "#000",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
    padding: "0",
    fontSize: "14px",
  },
  forgotPasswordLink: {
    backgroundColor: "transparent",
    color: "#666",
    border: "none",
    fontWeight: "normal",
    cursor: "pointer",
    textDecoration: "underline",
    padding: "0",
    fontSize: "13px",
    marginTop: "10px",
  },};