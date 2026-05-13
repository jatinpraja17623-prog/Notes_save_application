// ============================================================
//  FILE: src/context/AuthContext.jsx
//  PURPOSE: Shares login state (token, user) across ALL components
//  HOW IT WORKS: React Context - wrap your app with this provider
//                and any component can read the auth state
// ============================================================

import { createContext, useContext, useState } from "react";

// Step 1: Create the context (like a global variable)
const AuthContext = createContext(null);

// Step 2: Create the Provider component
// This wraps your whole app and provides the auth state
export function AuthProvider({ children }) {
  // Read token from localStorage on first load (so user stays logged in)
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Called after successful login/register
  // Saves token to localStorage AND to state
  function login(newToken, newUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  // Called when user clicks Logout
  // Clears everything
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  // isLoggedIn is just a shortcut boolean
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook — any component calls useAuth() to get the state
// Example: const { user, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
