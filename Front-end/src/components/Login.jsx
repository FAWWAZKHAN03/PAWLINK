import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, User, Award, Mail, Lock, ArrowRight, 
  CheckCircle, Eye, EyeOff, AlertCircle 
} from "lucide-react";
import { login } from "../api/auth";
export default function Login({ initialRole = "Citizen", onAuthSuccess, onNavigateToSignup }) {
  const [selectedRole, setSelectedRole] = useState(initialRole); // Citizen, Responder, NGO
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setErrorMessage("Please fill in all required fields.");
    return;
  }

  try {
    setErrorMessage("");
    setIsLoading(true);

    const result = await login({
      email,
      password,
    });

    setIsLoading(false);
    setIsSuccess(true);

    setTimeout(() => {
      onAuthSuccess(result.user.role, result.user);
    }, 1000);
  } catch (err) {
    setIsLoading(false);

    setErrorMessage(
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Invalid email or password."
    );
  }
};
  const roleInfo = {
    Citizen: {
      title: "Citizen Account",
      desc: "Report lost stray pets, support active fundraisers, and find local shelters near your coordinates.",
      color: "bg-[#8B5E3C]/10 text-[#8B5E3C]",
      icon: <User className="w-5 h-5 text-[#8B5E3C]" />
    },
    Responder: {
      title: "Rescue Responder",
      desc: "Receive real-time trauma dispatches, update animal coordinates, and earn community service points.",
      color: "bg-[#C68B59]/10 text-[#C68B59]",
      icon: <Award className="w-5 h-5 text-[#C68B59]" />
    },
    NGO: {
      title: "NGO Administrator",
      desc: "Audit fundraiser ledger records, verify clinical responder credentials, and manage regional rosters.",
      color: "bg-[#2C2C2C]/10 text-[#2C2C2C]",
      icon: <Shield className="w-5 h-5 text-[#2C2C2C]" />
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none">
      
      {/* Soft natural ambient glow circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#D8C3A5]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#C68B59]/10 blur-[120px] pointer-events-none" />

      {/* Main Authentication card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white border border-[#EFE7DC] rounded-[32px] w-full max-w-4xl min-h-[580px] shadow-xl overflow-hidden grid md:grid-cols-12 z-10"
      >
        
        {/* Left Informational Showcase */}
        <div className="md:col-span-5 bg-[#FAF8F5]/60 p-8 md:p-10 flex flex-col justify-between border-r border-[#EFE7DC] relative">
          
          <div className="space-y-8 relative z-10">
            {/* PawLink logo header */}
            <div className="flex items-center gap-2 text-left">
              <div className="bg-[#8B5E3C] p-2.5 rounded-2xl text-white shadow-sm shadow-[#8B5E3C]/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#2C2C2C] tracking-tight">Paw<span className="text-[#8B5E3C]">Link</span></span>
                <span className="text-[10px] text-[#C68B59] font-bold uppercase tracking-widest block -mt-1">Smart Welfare</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-left">
              <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#8B5E3C]/10 px-3 py-1 rounded-full">
                Secure Portal Access
              </span>
              <h2 className="text-2xl font-extrabold text-[#2C2C2C] tracking-tight leading-tight">
                Empowering street animal recovery.
              </h2>
              <p className="text-slate-600 text-xs leading-relaxed font-light">
                Connect directly with regional clinics, emergency dispatches, and secure auditing ledgers in real-time.
              </p>
            </div>
          </div>

          {/* Dynamic Role showcase card inside sidebar */}
          <div className="relative mt-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-[#EFE7DC] p-5 rounded-2xl space-y-3.5 shadow-sm text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${roleInfo[selectedRole].color}`}>
                    {roleInfo[selectedRole].icon}
                  </div>
                  <h4 className="font-extrabold text-sm text-[#2C2C2C]">{roleInfo[selectedRole].title}</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                  {roleInfo[selectedRole].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Copyright line */}
          <div className="text-[10px] text-slate-400 font-medium z-10 text-left">
            © 2026 PawLink Initiative. All rights reserved.
          </div>
        </div>

        {/* Right Form Interactive Module */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center relative bg-white">
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center space-y-4 py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ duration: 0.4 }}
                  className="bg-emerald-50 p-4 rounded-full border border-emerald-100 text-emerald-600"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h3 className="text-xl font-extrabold text-[#2C2C2C]">Secure Connection Verified</h3>
                <p className="text-xs text-slate-500 font-light">Authenticating credentials and loading your workspace...</p>
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
                <div className="border-b border-[#EFE7DC] pb-4">
                  <h3 className="text-lg font-extrabold text-[#2C2C2C] tracking-tight">Login In to PawLink</h3>
                  <p className="text-xs text-slate-500 mt-1 font-light">Access your personalized responder or citizen tools.</p>
                </div>

                {/* Role picker buttons */}
                <div className="space-y-2.5">
                  <label className="text-[10px] text-[#8B5E3C] font-extrabold uppercase tracking-widest block">
                    Select Your Ecosystem Role
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
                          className={`py-2.5 px-3 rounded-xl font-extrabold text-xs border transition-all text-center cursor-pointer ${
                            isSelected 
                              ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-sm shadow-[#8B5E3C]/25" 
                              : "bg-[#FAF8F5] text-slate-600 border-[#EFE7DC] hover:bg-[#EFE7DC]"
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
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 text-xs text-red-600">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50/50 border border-[#EFE7DC] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#2C2C2C] placeholder-slate-400 focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-50/50 border border-[#EFE7DC] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#2C2C2C] placeholder-slate-400 focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition-all"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#8B5E3C]/20 mt-6 relative"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Login</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Redirect Link */}
                <div className="text-center pt-4">
                  <p className="text-xs text-slate-500 font-light">
                    Don't have an account?{" "}
                    <button 
                      onClick={onNavigateToSignup}
                      className="text-[#8B5E3C] hover:underline font-bold transition-colors cursor-pointer"
                    >
                      Create one here
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