// ============================================================
//  FILE: src/components/Navbar.jsx
//  PURPOSE: Top navigation bar shown on the Dashboard
//  HOW IT WORKS: Gets user info and logout function from AuthContext
// ============================================================

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth(); // Get user and logout from context

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Noteflow</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="user-name">{user?.username || "User"}</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}
