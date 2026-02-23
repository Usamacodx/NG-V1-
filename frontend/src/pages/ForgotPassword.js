import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setSuccess("If an account exists with that email, a reset link has been sent. Please check your email.");
      setEmail("");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to process request. Please try again.";
      setError(errMsg);
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Forgot Password</h1>
          <p style={styles.subtitle}>Enter your email to receive a password reset link</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={styles.divider}></div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              style={styles.backLink}
            >
              Back to Login
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
    border: "1px solid #4caf50",
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
  submitBtn: {
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
  backLink: {
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
