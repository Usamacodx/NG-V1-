import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      
      setSuccess("Password has been reset successfully! Redirecting to login...");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errMsg);
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>Enter your new password</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {token ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.passwordInputWrapper}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  style={styles.input}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                  title={showNewPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showNewPassword ? "👁️" : "👁️‍🗨️"}
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
                  placeholder="Confirm your new password"
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
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div style={styles.errorBox}>
            Invalid or expired reset link. Please request a new password reset from the login page.
          </div>
        )}

        <div style={styles.divider}></div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
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
