import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Hardcoded admin check (OK for now)
    if (email === "admin@nextgen.com" && password === "admin123") {
      
      // ✅ ADD THIS
      localStorage.setItem("isAdminLoggedIn", "true");

      // ✅ UPDATE STATE
      setIsAdmin(true);

      // ✅ Dispatch storage event to notify other tabs/windows
      window.dispatchEvent(new Event("storage"));

      // ✅ REDIRECT TO PRODUCT LISTING
      navigate("/products");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" style={{ padding: "10px 15px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
