import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, Users, Activity, DollarSign, Award, Settings, Check, X, Trash2,
  AlertTriangle, ArrowUpRight, ArrowLeft, RefreshCw, Eye, Sparkles, Filter, Search
} from "lucide-react";
import { MOCK_PETS, MOCK_VOLUNTEERS, MOCK_DONATIONS } from "../data";

export default function AdminPanel({ onLogout, onNavigateToDashboard }) {
  const [activeSubTab, setActiveSubTab] = useState("Analytics"); // Analytics, Verification, Volunteers, Settings
  
  // Verification states
  const [verificationQueue, setVerificationQueue] = useState([
    { id: "usr-901", name: "Siddharth Roy", role: "Field Responder", credentials: "EMS License #7819", status: "Pending" },
    { id: "ngo-402", name: "Paws Haven Rescue", role: "NGO Admin", credentials: "NGO Register ID #4401", status: "Pending" },
    { id: "vet-105", name: "Dr. Clara Barton", role: "Veterinary Specialist", credentials: "DVM License #1128", status: "Pending" }
  ]);

  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEERS.leaderboard);

  // Stats
  const totalVerificationPending = verificationQueue.filter(q => q.status === "Pending").length;

  const handleApprove = (id) => {
    setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: "Approved" } : item));
  };

  const handleReject = (id) => {
    setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" } : item));
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex font-sans antialiased text-left">
      
      {/* ==================================================== */}
      {/* LEFT ADMIN SIDEBAR                                   */}
      {/* ==================================================== */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Logo identity */}
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-xl text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight">Paw<span className="text-green-500">Link</span></span>
              <span className="text-[9px] text-green-500 font-bold uppercase tracking-wider block -mt-1">Admin Operations</span>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: "Analytics", label: "Analytics & Reports", icon: <Activity className="w-4 h-4" /> },
              { id: "Verification", label: "User Verification", icon: <Users className="w-4 h-4" />, badge: totalVerificationPending },
              { id: "Volunteers", label: "NGO & Volunteers", icon: <Award className="w-4 h-4" /> },
              { id: "Settings", label: "System Settings", icon: <Settings className="w-4 h-4" /> }
            ].map(tab => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive ? "bg-green-700 text-white shadow-md shadow-green-900/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{tab.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="space-y-3">
          <button 
            onClick={onNavigateToDashboard}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 rounded-xl font-bold text-xs text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Dark Mode
          </button>
          <button 
            onClick={onLogout}
            className="w-full bg-transparent hover:bg-red-500/10 text-red-400 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            End Admin Session
          </button>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* MAIN ADMIN WORKSPACE                                 */}
      {/* ==================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top telemetry bar */}
        <header className="bg-slate-900 border-b border-slate-800 py-4 px-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold text-white">System Admin Control Room</h2>
            <span className="text-[10px] bg-green-500/10 text-green-400 font-extrabold px-3 py-1 rounded-full border border-green-500/20">
              CLUSTER ACTIVE • SECURE HTTPS
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-400">Security: TLS 1.3 Encryption</span>
            <div className="bg-slate-800 text-slate-300 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Main interactive panel */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          
          {/* ==================== ANALYTICS & REPORTS VIEW ==================== */}
          {activeSubTab === "Analytics" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white">Real-Time Analytical Telemetry</h2>
                  <p className="text-xs text-slate-400">Historical parameters and campaign conversion matrices plotted live.</p>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Force Cluster Sync
                </button>
              </div>

              {/* Stats metric bento */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Audited Charity", val: "$184,910", trend: "+14.2% MoM", icon: <DollarSign className="w-5 h-5 text-green-400" /> },
                  { title: "Rescue Mission Success", val: "99.2%", trend: "98.8% Previous Target", icon: <Activity className="w-5 h-5 text-emerald-400" /> },
                  { title: "Citizen Responders", val: "2,491", trend: "+115 added this month", icon: <Users className="w-5 h-5 text-blue-400" /> },
                  { title: "Pending Verifications", val: totalVerificationPending, trend: "Requires manual check", icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="bg-slate-950 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-850">
                        {stat.icon}
                      </div>
                      <span className="block text-2xl font-extrabold text-white">{stat.val}</span>
                      <span className="block font-bold text-xs text-slate-300 mt-1">{stat.title}</span>
                    </div>
                    <span className="text-[10px] text-green-400 font-mono block mt-3">{stat.trend}</span>
                  </div>
                ))}
              </div>

              {/* High Fidelity Custom Interactive SVG Area Chart */}
              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* SVG Area Chart Panel (8 Cols) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Daily Stray Rescue Dispatches</h3>
                      <p className="text-[10px] text-slate-400">Incident frequency tracked across 30-day window.</p>
                    </div>
                    <span className="text-xs font-mono text-green-400">+14.2% index</span>
                  </div>

                  {/* SVG Chart visualization */}
                  <div className="relative h-64 bg-slate-950/60 rounded-2xl border border-slate-850 overflow-hidden flex items-end p-4">
                    <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area background */}
                      <path 
                        d="M 0 180 Q 100 120 200 150 T 400 60 T 600 40 L 600 200 L 0 200 Z" 
                        fill="url(#chartGlow)" 
                      />

                      {/* Stroke line */}
                      <path 
                        d="M 0 180 Q 100 120 200 150 T 400 60 T 600 40" 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="3.5" 
                      />

                      {/* Data coordinates circles */}
                      <circle cx="200" cy="150" r="5" fill="#22c55e" stroke="#000" strokeWidth="2" />
                      <circle cx="400" cy="60" r="5" fill="#22c55e" stroke="#000" strokeWidth="2" />
                      <circle cx="600" cy="40" r="5" fill="#22c55e" stroke="#000" strokeWidth="2" />
                    </svg>

                    <div className="absolute top-4 left-4 text-[10px] text-slate-400 space-y-1">
                      <p className="font-bold text-white">Peak Rescue Dispatch (Day 24)</p>
                      <p>44 alerts matched successfully • Peak latency 12ms</p>
                    </div>
                  </div>
                </div>

                {/* Campaign Progress Conversion lists (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6">
                  <h3 className="font-extrabold text-sm text-white">Direct Campaign Metrics</h3>
                  
                  <div className="space-y-4 text-xs">
                    {MOCK_DONATIONS.campaigns.map((c) => {
                      const percent = Math.round((c.raised / c.goal) * 100);
                      return (
                        <div key={c.id} className="space-y-2">
                          <div className="flex justify-between font-bold text-slate-300">
                            <span className="truncate max-w-[150px]">{c.title}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                            <span>Raised: ${c.raised.toLocaleString()}</span>
                            <span>Goal: ${c.goal.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== USER VERIFICATION QUEUE ==================== */}
          {activeSubTab === "Verification" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">Workspace Verification Console</h2>
                <p className="text-xs text-slate-400">Validate regional clinicians, emergency dispatch drivers, and partner NGO registration documents.</p>
              </div>

              <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-850">
                    <tr>
                      <th className="p-4">Handler Profile</th>
                      <th className="p-4">Role / Scope</th>
                      <th className="p-4">Submitted Documents</th>
                      <th className="p-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificationQueue.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-850/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white font-mono">
                              {item.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-white">{item.name}</p>
                              <span className="text-[9px] text-slate-500 font-mono">{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-green-400">{item.role}</span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">
                          {item.credentials}
                        </td>
                        <td className="p-4 text-right">
                          {item.status === "Pending" ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleApprove(item.id)}
                                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg cursor-pointer transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(item.id)}
                                className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-lg cursor-pointer transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                              item.status === "Approved" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            }`}>
                              {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== NGO & VOLUNTEERS DIRECTORY ==================== */}
          {activeSubTab === "Volunteers" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">Active Field responders directory</h2>
                <p className="text-xs text-slate-400">Manage registered citizen squads, dispatch points weight, and field hours logs.</p>
              </div>

              <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-850">
                    <tr>
                      <th className="p-4">Squad Member</th>
                      <th className="p-4">Dispatched Cases</th>
                      <th className="p-4">Roster Hours</th>
                      <th className="p-4 text-right">Points Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.map((vol) => (
                      <tr key={vol.name} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-850/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={vol.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                            <p className="font-bold text-white">{vol.name}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-400">{vol.rescues} cases</td>
                        <td className="p-4 text-slate-400">{vol.hours} hours logged</td>
                        <td className="p-4 text-right font-extrabold text-green-400">
                          +{vol.points} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== SYSTEM SETTINGS TAB ==================== */}
          {activeSubTab === "Settings" && (
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 space-y-6 max-w-2xl text-xs text-slate-400">
              <h3 className="font-extrabold text-lg text-white">System Configuration Parameters</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <p className="font-bold text-white">AI Vision Auto-Matching Threshold</p>
                    <p className="text-[10px] text-slate-500">Probabilistic trigger score for matching lost & found pets.</p>
                  </div>
                  <select className="bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-xl focus:outline-none">
                    <option>90% (Strict matching)</option>
                    <option>80% (Moderate threshold)</option>
                    <option>70% (Relaxed match)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <p className="font-bold text-white">Trauma Dispatch Notification Frequency</p>
                    <p className="text-[10px] text-slate-500">Interval parameters before routing secondary dispatcher alerts.</p>
                  </div>
                  <select className="bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-xl focus:outline-none">
                    <option>Instant (0 seconds lag)</option>
                    <option>30 seconds retry window</option>
                    <option>60 seconds backup dispatch</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Verified NGO Direct Ledger Payout Index</p>
                    <p className="text-[10px] text-slate-500">Automatically route donor payments directly to bank coordinate vectors.</p>
                  </div>
                  <span className="text-green-400 font-extrabold">ENABLED</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
