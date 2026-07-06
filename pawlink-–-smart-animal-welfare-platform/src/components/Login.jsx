import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, User, Award, Mail, Lock, ArrowRight, ArrowLeft, 
  CheckCircle, Eye, EyeOff, AlertCircle 
} from "lucide-react";

export default function Login({ initialRole = "Citizen", onAuthSuccess, onNavigateToPublic, onNavigateToSignup }) {
  const [selectedRole, setSelectedRole] = useState(initialRole); // Citizen, Responder, NGO
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    // Simulate clinical auth handshake with animation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onAuthSuccess(selectedRole);
      }, 1000);
    }, 1800);
  };

  const roleInfo = {
    Citizen: {
      title: "Citizen Account",
      desc: "Report lost stray pets, support active fundraisers, and find local shelters near your coordinates.",
      color: "from-emerald-500 to-green-600",
      icon: <User className="w-5 h-5 text-white" />
    },
    Responder: {
      title: "Rescue Responder",
      desc: "Receive real-time trauma dispatches, update animal coordinates, and earn community service points.",
      color: "from-blue-500 to-indigo-600",
      icon: <Award className="w-5 h-5 text-white" />
    },
    NGO: {
      title: "NGO Administrator",
      desc: "Audit fundraiser ledger records, verify clinical responder credentials, and manage regional rosters.",
      color: "from-purple-600 to-slate-900",
      icon: <Shield className="w-5 h-5 text-white" />
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none">
      
      {/* Background Ambience Dots and Glow Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-slate-950 to-slate-950 pointer-events-none" />
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>

      {/* Main Authentication card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-slate-900/80 border border-slate-800/80 rounded-3xl w-full max-w-4xl min-h-[600px] shadow-2xl backdrop-blur-xl overflow-hidden grid md:grid-cols-12 z-10"
      >
        
        {/* Left Informational Showcase */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 flex flex-col justify-between border-r border-slate-800/50 relative overflow-hidden">
          
          <div className="space-y-6 relative z-10">
            {/* PawLink logo header */}
            <button 
              onClick={onNavigateToPublic} 
              className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
            >
              <div className="bg-green-600 p-2 rounded-xl text-white">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">Paw<span className="text-green-500">Link</span></span>
                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest block -mt-1">Smart Welfare</span>
              </div>
            </button>

            <div className="space-y-3 pt-6">
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest font-mono bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                Secure Handshake Gate
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Empowering stray animal recovery.
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect directly with regional clinics, emergency dispatches, and secure auditing ledgers in real-time.
              </p>
            </div>
          </div>

          {/* Dynamic Role showcase card inside sidebar */}
          <div className="relative mt-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`bg-gradient-to-r ${roleInfo[selectedRole].color} p-2 rounded-xl`}>
                    {roleInfo[selectedRole].icon}
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{roleInfo[selectedRole].title}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed text-left">
                  {roleInfo[selectedRole].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Back action */}
          <button 
            onClick={onNavigateToPublic}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold mt-8 z-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Public Hub
          </button>
        </div>

        {/* Right Form Interactive Module */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center relative bg-slate-900/40">
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.7, 1] }}
                  className="bg-green-500/10 p-4 rounded-full border border-green-500/20 text-green-400"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h3 className="text-xl font-extrabold text-white">Ecosystem Sync Complete</h3>
                <p className="text-xs text-slate-400">Authenticating credentials and routing payload...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                
                {/* Switcher headers */}
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Sign In to PawLink</h3>
                  <p className="text-xs text-slate-400 mt-1">Access your personalized responder or citizen tools.</p>
                </div>

                {/* Role picker buttons */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">
                    Choose Ecosystem Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Citizen", label: "Citizen" },
                      { id: "Responder", label: "Responder" },
                      { id: "NGO", label: "NGO Admin" }
                    ].map(r => {
                      const isSelected = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRole(r.id)}
                          className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all text-center cursor-pointer ${
                            isSelected 
                              ? "bg-green-700 text-white border-green-600 shadow-md shadow-green-900/10" 
                              : "bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Coordinate</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="email" 
                        placeholder="fawwaz@pawlink.org" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-800/40 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Password Vault</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-800/40 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-700/10 mt-6 relative"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Authenticate Session</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Redirect Link */}
                <div className="text-center pt-4">
                  <p className="text-xs text-slate-400">
                    Don't have an ecosystem account?{" "}
                    <button 
                      onClick={onNavigateToSignup}
                      className="text-green-500 hover:text-green-400 font-bold underline transition-colors cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </motion.div>

    </div>
  );
}
