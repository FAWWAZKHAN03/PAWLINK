import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

import PublicWebsite from "./components/PublicWebsite";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import ProfilePage from "./components/ProfilePage";

import { getMe, logout as apiLogout } from "./api/auth";

export default function App() {
  const [view, setView] = useState("Public");
  const [authRole, setAuthRole] = useState("Citizen");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCheckingSession(false);
      return;
    }

    const cachedUser = JSON.parse(localStorage.getItem("user"));

    if (cachedUser) {
      setCurrentUser(cachedUser);
      setAuthRole(cachedUser.role);
      setIsAuthenticated(true);
      setView(cachedUser.role === "NGO" ? "Admin" : "Dashboard");
    }

    getMe()
      .then((user) => {
        setCurrentUser(user);
        setAuthRole(user.role);
        setIsAuthenticated(true);
      })
      .catch(() => {
        apiLogout();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthRole("Citizen");
        setView("Login");
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  const handleAuthSuccess = (role, user) => {
    setCurrentUser(user);
    setAuthRole(role);
    setIsAuthenticated(true);

    if (role === "NGO") {
      setView("Admin");
    } else {
      setView("Dashboard");
    }
  };

  const handleLogout = () => {
    apiLogout();
    setCurrentUser(null);
    setAuthRole("Citizen");
    setIsAuthenticated(false);
    setView("Login");
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const activeView = isAuthenticated
    ? view
    : view === "Signup"
      ? "Signup"
      : "Login";

  return (
    <div className="min-h-screen bg-brand-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="min-h-screen"
        >
          {activeView === "Public" && (
            <PublicWebsite
              isAuthenticated={isAuthenticated}
              authRole={authRole}
              currentUser={currentUser}
              onLogout={handleLogout}
              onNavigateToLogin={() => {
                setAuthRole("Citizen");
                setView("Login");
              }}
              onNavigateToSignup={() => {
                setAuthRole("Citizen");
                setView("Signup");
              }}
              onNavigateToDashboard={(role = authRole) => {
                setAuthRole(role);
                setView(role === "NGO" ? "Admin" : "Dashboard");
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
              currentUser={currentUser}
              onLogout={handleLogout}
              onNavigateToAdmin={() => {
                setAuthRole("NGO");
                setView("Admin");
              }}
              onNavigateToPublic={() => setView("Public")}
              onNavigateToProfile={() => setView("Profile")}
            />
          )}

          {activeView === "Admin" && (
            <AdminPanel
              currentUser={currentUser}
              onLogout={handleLogout}
              onNavigateToDashboard={() => {
                setAuthRole("Citizen");
                setView("Dashboard");
              }}
              onNavigateToPublic={() => setView("Public")}
            />
          )}

          {activeView === "Profile" && (
            <ProfilePage
              currentUser={currentUser}
              onNavigateBack={() =>
                setView(authRole === "NGO" ? "Admin" : "Dashboard")
              }
              onUserUpdated={(user) => {
                setCurrentUser(user);
                setAuthRole(user.role);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
