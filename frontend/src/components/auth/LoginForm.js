import React, { useState } from "react";
import axios from "axios";

// Change this if your project uses a different config file.
// Common options:
// 1) const API_BASE_URL = "http://127.0.0.1:8000/api";
// 2) const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
// 3) const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_BASE_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "http://127.0.0.1:8000/api";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // FastAPI OAuth2PasswordRequestForm requires x-www-form-urlencoded
      // and fields named: username, password
      const formData = new URLSearchParams();
      formData.append("username", email.trim());
      formData.append("password", password);

      const tokenRes = await axios.post(`${API_BASE_URL}/auth/token`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const accessToken = tokenRes.data?.access_token;
      if (!accessToken) {
        setError("Login failed: missing token.");
        return;
      }

      // Get current user info (optional but recommended)
      const meRes = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = {
        ...meRes.data,
        token: accessToken,
      };

      localStorage.setItem("user", JSON.stringify(user));

      if (typeof onLogin === "function") {
        onLogin(user);
      }
    } catch (err) {
      // Most common: 401 from backend
      const status = err?.response?.status;
      if (status === 401) {
        setError("Invalid email or password.");
      } else if (status === 422) {
        setError("Login request format error (check username/password fields).");
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passRow}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              style={styles.eyeBtn}
              aria-label="Toggle password visibility"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <a href="/register" style={styles.link}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f6f8fc",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    padding: 28,
  },
  title: {
    textAlign: "center",
    margin: "6px 0 18px",
    color: "#0b2f6b",
    fontSize: 28,
    fontWeight: 800,
  },
  errorBox: {
    background: "#fdecec",
    border: "1px solid #f5b5b5",
    color: "#b42318",
    padding: "12px 14px",
    borderRadius: 10,
    marginBottom: 14,
    textAlign: "center",
  },
  form: {
    display: "grid",
    gap: 10,
  },
  label: {
    fontWeight: 700,
    color: "#1f2a37",
    marginTop: 4,
  },
  input: {
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 15,
    marginBottom: 6,
  },
  passRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 6,
  },
  eyeBtn: {
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    padding: "12px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  btn: {
    marginTop: 8,
    background: "#0b2f6b",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 800,
  },
  footerText: {
    marginTop: 14,
    textAlign: "center",
    color: "#4b5563",
  },
  link: {
    color: "#0b2f6b",
    fontWeight: 800,
    textDecoration: "none",
  },
};