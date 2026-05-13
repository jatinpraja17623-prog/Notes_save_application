// ============================================================
//  FILE: src/pages/RegisterPage.jsx
//  PURPOSE: User registration page
//  HOW IT WORKS:
//    1. User fills form → state updates via handle()
//    2. User clicks button → submit() runs
//    3. submit() calls registerUser() from api.js
//    4. If backend returns token → login() saves it → goes to dashboard
//    5. If error → show error message
// ============================================================

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../utils/api";
import InputField from "../components/InputField";

export default function RegisterPage({ onSwitch }) {
  const { login } = useAuth();

  // Form state — matches exactly what your backend expects
  const [form, setForm] = useState({
    username: "",
    email: "",
    passward: "",   // ← keeping your backend spelling
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Updates the specific field that changed
  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    setError("");

    // Basic validation before hitting the API
    if (!form.username || !form.email || !form.passward) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);

    try {
      const data = await registerUser(form); // Call backend

      if (data.token) {
        // Success! Save token and go to dashboard
        login(data.token, data.user);
      } else if (data.message === "User Already Exist") {
        setError("This username or email is already taken.");
      } else {
        setError(data.message || "Something went wrong. Try again.");
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
            Capture every<br />
            <em>great idea.</em>
          </h1>
          <p className="panel-sub">
            Your personal space to think, write, and organize — beautifully.
          </p>
          <div className="panel-features">
            <div className="feature-item">
              <span className="feature-dot" />
              Instant cloud sync
            </div>
            <div className="feature-item">
              <span className="feature-dot" />
              Secure & private
            </div>
            <div className="feature-item">
              <span className="feature-dot" />
              Always accessible
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
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-sub">
              Already have one?{" "}
              <button className="switch-link" onClick={() => onSwitch("login")}>
                Sign in →
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
              label="Username"
              name="username"
              placeholder="e.g. johndoe"
              value={form.username}
              onChange={handle}
            />
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
              placeholder="Min. 6 characters"
              value={form.passward}
              onChange={handle}
            />
          </div>

          <button
            className="auth-submit-btn"
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner">Creating account...</span>
            ) : (
              "Create Account →"
            )}
          </button>

          <p className="auth-legal">
            By signing up you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
