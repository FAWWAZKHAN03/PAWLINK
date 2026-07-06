import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, Activity, Shield, Users, Layers, ExternalLink } from "lucide-react";
import PublicWebsite from "./components/PublicWebsite";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [view, setView] = useState("Public"); // Public, Login, Signup, Dashboard, Admin
  const [authRole, setAuthRole] = useState("Citizen"); // Citizen, Responder, NGO
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSandboxTooltip, setShowSandboxTooltip] = useState(false);

  const handleAuthSuccess = (role) => {
    setAuthRole(role);
    setIsAuthenticated(true);
    if (role === "NGO") {
      setView("Admin");
    } else {
      setView("Dashboard");
    }
  };

  const handleSandboxNavigate = (targetView, role = "Citizen") => {
    setAuthRole(role);
    if (targetView === "Dashboard" || targetView === "Admin") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setView(targetView);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative select-none">
      
      {/* Dynamic Module Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view + "-" + authRole}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {view === "Public" && (
            <PublicWebsite 
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
                if (!isAuthenticated) {
                  setView("Signup");
                } else {
                  if (role === "NGO") {
                    setView("Admin");
                  } else {
                    setView("Dashboard");
                  }
                }
              }}
            />
          )}

          {view === "Login" && (
            <Login 
              initialRole={authRole}
              onAuthSuccess={handleAuthSuccess}
              onNavigateToPublic={() => setView("Public")}
              onNavigateToSignup={() => setView("Signup")}
            />
          )}

          {view === "Signup" && (
            <Signup 
              initialRole={authRole}
              onAuthSuccess={handleAuthSuccess}
              onNavigateToPublic={() => setView("Public")}
              onNavigateToLogin={() => setView("Login")}
            />
          )}

          {view === "Dashboard" && (
            <Dashboard 
              role={authRole}
              onLogout={() => { setAuthRole("Citizen"); setIsAuthenticated(false); setView("Public"); }}
              onNavigateToAdmin={() => { setAuthRole("NGO"); setView("Admin"); }}
              onNavigateToPublic={() => setView("Public")}
            />
          )}

          {view === "Admin" && (
            <AdminPanel 
              onLogout={() => { setAuthRole("Citizen"); setIsAuthenticated(false); setView("Public"); }}
              onNavigateToDashboard={() => { setAuthRole("Citizen"); setView("Dashboard"); }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ==================================================== */}
      {/* FLOATING ECOSYSTEM SANDBOX SELECTOR                  */}
      {/* ==================================================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-card bg-slate-900/95 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-md relative group">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1 rounded-lg text-white">
              <Layers className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-green-400 font-extrabold uppercase tracking-widest block">Sandbox Console</span>
              <span className="text-[10px] font-bold text-white block -mt-0.5 whitespace-nowrap">View State Switcher</span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex gap-1.5 text-[10px] font-bold">
            <button 
              onClick={() => handleSandboxNavigate("Public")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                view === "Public" ? "bg-green-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Public App
            </button>
            <button 
              onClick={() => handleSandboxNavigate("Login")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                view === "Login" ? "bg-green-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Login Screen
            </button>
            <button 
              onClick={() => handleSandboxNavigate("Signup")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                view === "Signup" ? "bg-green-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Signup Screen
            </button>
            <button 
              onClick={() => handleSandboxNavigate("Dashboard", "Citizen")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                view === "Dashboard" && authRole === "Citizen" ? "bg-green-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Citizen SaaS
            </button>
            <button 
              onClick={() => handleSandboxNavigate("Dashboard", "Responder")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                view === "Dashboard" && authRole === "Responder" ? "bg-green-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Rescue Squad
            </button>
            <button 
              onClick={() => handleSandboxNavigate("Admin", "NGO")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                view === "Admin" ? "bg-green-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              NGO Admin (Dark)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
