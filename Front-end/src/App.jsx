import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PublicWebsite from "./components/PublicWebsite";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [view, setView] = useState("Login"); // Opens directly on Login authentication screen
  const [authRole, setAuthRole] = useState("Citizen"); // Citizen, Responder, NGO
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = (role) => {
    setAuthRole(role);
    setIsAuthenticated(true);
    if (role === "NGO") {
      setView("Admin");
    } else {
      // After login, send the user to the Homepage (Public Website Hub) where they can explore or access their portal
      setView("Public");
    }
  };

  const handleLogout = () => {
    setAuthRole("Citizen");
    setIsAuthenticated(false);
    setView("Login");
  };

  // Enforce authentication gate:
  // If not authenticated, the only valid views are Login and Signup.
  // Any attempt to view Public, Dashboard, or Admin falls back to Login.
  const activeView = isAuthenticated ? view : (view === "Signup" ? "Signup" : "Login");

  return (
    <div className="min-h-screen bg-brand-bg relative select-none">
      
      {/* Dynamic Module Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView + "-" + authRole}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {activeView === "Public" && (
            <PublicWebsite 
              isAuthenticated={isAuthenticated}
              authRole={authRole}
              onLogout={handleLogout}
              onNavigateToLogin={() => {
                setAuthRole("Citizen");
                setView("Login");
              }}
              onNavigateToSignup={() => {
                setAuthRole("Citizen");
                setView("Signup");
              }}
              onNavigateToDashboard={(role = "Citizen") => { 
                setAuthRole(role); 
                if (role === "NGO") {
                  setView("Admin");
                } else {
                  setView("Dashboard");
                }
              }}
            />
          )}

          {activeView === "Login" && (
            <Login 
              initialRole={authRole}
              onAuthSuccess={handleAuthSuccess}
              onNavigateToSignup={() => setView("Signup")}
            />
          )}

          {activeView === "Signup" && (
            <Signup 
              initialRole={authRole}
              onAuthSuccess={handleAuthSuccess}
              onNavigateToLogin={() => setView("Login")}
            />
          )}

          {activeView === "Dashboard" && (
            <Dashboard 
              role={authRole}
              onLogout={handleLogout}
              onNavigateToAdmin={() => { setAuthRole("NGO"); setView("Admin"); }}
              onNavigateToPublic={() => setView("Public")}
            />
          )}

          {activeView === "Admin" && (
            <AdminPanel 
              onLogout={handleLogout}
              onNavigateToDashboard={() => { setAuthRole("Citizen"); setView("Dashboard"); }}
              onNavigateToPublic={() => setView("Public")}
            />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
