import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, Activity, Shield, Users, Layers, ExternalLink } from "lucide-react";
import PublicWebsite from "./components/PublicWebsite";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import ProfilePage from "./components/ProfilePage";
import { fetchCurrentUser, logout as apiLogout } from "./api/auth";
import { getToken, getStoredUser } from "./api/client";

export default function App() {
  const [view, setView] = useState("Public"); // Public, Login, Signup, Dashboard, Admin
  const [authRole, setAuthRole] = useState("Citizen"); // Citizen, Responder, NGO
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSandboxTooltip, setShowSandboxTooltip] = useState(false);

  // Restore the session on page load/refresh by validating the stored JWT
  // against the backend, so the user isn't logged out every time they refresh.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCheckingSession(false);
      return;
    }

    // Show the cached user immediately for a fast UI, then confirm with the server
    const cached = getStoredUser();
    if (cached) {
      setCurrentUser(cached);
      setAuthRole(cached.role);
      setIsAuthenticated(true);
      setView(cached.role === "NGO" ? "Admin" : "Dashboard");
    }

    fetchCurrentUser()
      .then((user) => {
        setCurrentUser(user);
        setAuthRole(user.role);
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Token expired/invalid - clear the stale session
        apiLogout();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setView("Public");
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleAuthSuccess = (role, user) => {
    setAuthRole(role);
    setIsAuthenticated(true);
    if (user) setCurrentUser(user);
    if (role === "NGO") {
      setView("Admin");
    } else {
      // After login, send the user to the Homepage (Public Website Hub) where they can explore or access their portal
      setView("Public");
    }
  };

  const handleLogout = () => {
    apiLogout();
    setAuthRole("Citizen");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView("Public");
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
      </div>
    );
  }

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
              onLogout={() => { setAuthRole("Citizen"); setIsAuthenticated(false); setView("Public"); }}
              onNavigateToAdmin={() => { setAuthRole("NGO"); setView("Admin"); }}
              onNavigateToPublic={() => setView("Public")}
              onNavigateToProfile={() => setView("Profile")}
            />
          )}

          {activeView === "Admin" && (
            <AdminPanel 
              onLogout={handleLogout}
              onNavigateToDashboard={() => { setAuthRole("Citizen"); setView("Dashboard"); }}
              onNavigateToPublic={() => setView("Public")}
            />
          )}

          {view === "Profile" && (
            <ProfilePage
              onNavigateBack={() => setView(authRole === "NGO" ? "Admin" : "Dashboard")}
              onUserUpdated={(user) => { setCurrentUser(user); setAuthRole(user.role); }}
            />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
