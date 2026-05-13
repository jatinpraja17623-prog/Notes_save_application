// ============================================================
//  FILE: src/App.jsx
//  PURPOSE: Root component — decides which page to show
//  HOW IT WORKS:
//    - If user is logged in (has token) → show DashboardPage
//    - If not logged in → show LoginPage or RegisterPage
//    - AuthProvider wraps everything so all components can access auth
// ============================================================

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// This inner component reads auth state and decides which page to show
function AppRouter() {
  const { isLoggedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState("login"); // "login" or "register"

  // If logged in → always show dashboard
  if (isLoggedIn) {
    return <DashboardPage />;
  }

  // Not logged in → show login or register
  if (currentPage === "login") {
    return <LoginPage onSwitch={setCurrentPage} />;
  }

  return <RegisterPage onSwitch={setCurrentPage} />;
}

// App wraps everything in AuthProvider so context is available everywhere
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
