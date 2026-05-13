// ============================================================
//  FILE: src/pages/LoginPage.jsx
//  PURPOSE: User login page
//  HOW IT WORKS:
//    1. User fills email + passward
//    2. submit() calls loginUser() from api.js
//    3. Backend returns { token, user }
//    4. login() from AuthContext saves token → goes to dashboard
// ============================================================

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api";
import InputField from "../components/InputField";

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();

  // Form state — matches what your backend expects
  const [form, setForm] = useState({
    email: "",
    passward: "",   // ← keeping your backend spelling
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    setError("");

    if (!form.email || !form.passward) {
      return setError("Please enter your email and password.");
    }

    setLoading(true);

    try {
      const data = await loginUser(form); // Call backend

      if (data.token) {
        login(data.token, data.user); // Save token → redirect to dashboard
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Cannot connect to server. Is your backend running?");
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel-left">
        <div className="panel-content">
          <div className="panel-logo">
            <span className="logo-star">✦</span>
            <span>Noteflow</span>
          </div>
          <h1 className="panel-heading">
            Welcome<br />
            <em>back.</em>
          </h1>
          <p className="panel-sub">
            Your notes are right where you left them. Sign in to continue.
          </p>
          <div className="panel-features">
            <div className="feature-item">
              <span className="feature-dot" />
              All your notes synced
            </div>
            <div className="feature-item">
              <span className="feature-dot" />
              Pick up where you left off
            </div>
            <div className="feature-item">
              <span className="feature-dot" />
              Safe & encrypted
            </div>
          </div>
        </div>
        <div className="panel-art">
          <div className="art-circle c1" />
          <div className="art-circle c2" />
          <div className="art-circle c3" />
          <div className="art-lines">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="art-line" style={{ "--i": i }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Sign in</h2>
            <p className="auth-form-sub">
              New here?{" "}
              <button className="switch-link" onClick={() => onSwitch("register")}>
                Create an account →
              </button>
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-fields">
            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handle}
            />
            <InputField
              label="Password"
              name="passward"
              type="password"
              placeholder="Your password"
              value={form.passward}
              onChange={(e) => {
                handle(e);
              }}
            />
          </div>

          <button
            className="auth-submit-btn"
            onClick={submit}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          >
            {loading ? (
              <span className="btn-spinner">Signing in...</span>
            ) : (
              "Sign In →"
            )}
          </button>

          <p className="auth-legal">
            Secure login powered by JWT authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
