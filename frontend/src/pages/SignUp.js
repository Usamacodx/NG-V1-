import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Attempting signup with:", { email, password });
      const response = await axios.post("http://localhost:5000/api/auth/signup", { email, password });
      console.log("Signup response:", response);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      const errMsg = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(errMsg);
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
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join our community today</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

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
              disabled={loading}
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
                placeholder="At least 6 characters"
                style={styles.input}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                title={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Confirm your password"
                style={styles.input}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            style={{
              ...styles.signupBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={styles.loginLink}
              disabled={loading}
            >
              Sign In
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
  successBox: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "12px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #66bb6a",
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
  signupBtn: {
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
  loginLink: {
    backgroundColor: "transparent",
    color: "#000",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
    padding: "0",
    fontSize: "14px",
  },
};
