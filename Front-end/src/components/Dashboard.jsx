import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, Bell, Search, User, MapPin, Compass, Activity, Heart,
  DollarSign, Award, Calendar, Clock, Send, MessageSquare, Plus,
  FileText, ArrowRight, Check, AlertTriangle, Paperclip, CheckCircle,
  Volume2, Play, Pause, LogOut, Moon, Sun, Clipboard, ExternalLink, RefreshCw
} from "lucide-react";
import {
  MOCK_PETS, MOCK_RESCUES, MOCK_DONATIONS,
  MOCK_VOLUNTEERS, MOCK_SHELTERS, MOCK_MESSAGES
} from "../data";
import { resolveAssetUrl } from "../api/client";
import { createReport, getAllReports } from "../api/lostFound";

export default function Dashboard({ role, user, onLogout, onNavigateToAdmin, onNavigateToPublic, onNavigateToProfile }) {
  const isCitizen = role === "Citizen";
  const [activeTab, setActiveTab] = useState(role === "Citizen" ? "CitizenOverview" : "Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Critically injured dog reported in Sector 11 Overpass", time: "2 min ago", unread: true },
    { id: 2, text: "AI matching scanner detected 92% match for Coco", time: "1 hour ago", unread: true },
    { id: 3, text: "Dr. Catherine Shaw finalized Milo's vaccine reports", time: "4 hours ago", unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Messenger State
  const [selectedChatId, setSelectedChatId] = useState("chat-1");
  const [chatList, setChatList] = useState(MOCK_MESSAGES);
  const [currentMessageText, setCurrentMessageText] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Medical State
  const [selectedMedicalPet, setSelectedMedicalPet] = useState(MOCK_PETS[0]);

  // Rescue map zoom coordinate state
  const [mapHoverShelter, setMapHoverShelter] = useState(null);

  // Rescue dispatcher simulation actions
  const [rescuesList, setRescuesList] = useState(MOCK_RESCUES);
  const [showDispatchToast, setShowDispatchToast] = useState(null);

  // Dynamic states for Citizen interaction
  const [lostPetsList, setLostPetsList] = useState([]);
  const [lostPetsLoading, setLostPetsLoading] = useState(true);
  const [lostPetsError, setLostPetsError] = useState("");
  const [lostPetsSuccess, setLostPetsSuccess] = useState("");
  const [lostPetLoading, setLostPetLoading] = useState(false);
  const [donationsData, setDonationsData] = useState(MOCK_DONATIONS);
  const [selectedCampaign, setSelectedCampaign] = useState(null); // Campaign chosen for donation
  const [donationAmount, setDonationAmount] = useState("25");
  const [customDonationAmount, setCustomDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorCard, setDonorCard] = useState("");
  const [donorExpiry, setDonorExpiry] = useState("");
  const [donorCvv, setDonorCvv] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Stray reporting form states
  const [strayType, setStrayType] = useState("Dog");
  const [strayLocation, setStrayLocation] = useState("");
  const [straySeverity, setStraySeverity] = useState("Medium");
  const [strayDesc, setStrayDesc] = useState("");
  const [straySubmitted, setStraySubmitted] = useState(false);

  // Lost Pet reporting states
  const [lostPetName, setLostPetName] = useState("");
  const [lostPetType, setLostPetType] = useState("Dog");
  const [lostPetBreed, setLostPetBreed] = useState("");
  const [lostPetLocation, setLostPetLocation] = useState("");
  const [lostPetReward, setLostPetReward] = useState("");
  const [lostPetDesc, setLostPetDesc] = useState("");
  const [lostPetSubmitted, setLostPetSubmitted] = useState(false);
  const [lostFilter, setLostFilter] = useState("All");

  // Adoption search filter
  const [adoptionFilter, setAdoptionFilter] = useState("All");
  const [adoptionSuccessMsg, setAdoptionSuccessMsg] = useState("");

  const loadLostReports = async () => {
    setLostPetsLoading(true);
    setLostPetsError("");
    try {
      const data = await getAllReports();
      const normalized = (data.reports || []).map((report) => ({
        id: report.id || report._id,
        name: report.petName || report.title || "Unknown stray",
        type: report.animalType || "dog",
        breed: report.breed || "Mixed Breed",
        status: report.status || "Lost",
        lastSeen: report.location || "",
        date: report.createdAt ? new Date(report.createdAt).toISOString().split("T")[0] : "",
        owner: report.contactName || report.reportedBy?.name || "Community Report",
        phone: report.contactPhone || "",
        reward: report.reward || "None",
        description: report.description || "",
        image: report.image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600",
      }));
      setLostPetsList(normalized);
    } catch (err) {
      setLostPetsError(err?.response?.data?.message || err?.message || "Unable to load Lost & Found feed.");
    } finally {
      setLostPetsLoading(false);
    }
  };

  useEffect(() => {
    loadLostReports();
  }, []);

  const handleLostReportSubmit = async (e) => {
    e.preventDefault();
    setLostPetLoading(true);
    setLostPetsError("");
    setLostPetsSuccess("");

    try {
      const payload = {
        title: lostPetName || "Pet Alert",
        petName: lostPetName || "",
        animalType: lostPetType.toLowerCase(),
        breed: lostPetBreed || "",
        description: lostPetDesc || "",
        status: "Lost",
        location: lostPetLocation,
        contactName: "You (Citizen Account)",
        contactPhone: "+1 (555) 000-0000",
        reward: lostPetReward || "",
        image: "",
      };

      await createReport(payload);
      await loadLostReports();
      setLostPetSubmitted(true);
      setLostPetsSuccess("Lost & Found report submitted successfully.");
      setLostPetName("");
      setLostPetBreed("");
      setLostPetLocation("");
      setLostPetReward("");
      setLostPetDesc("");
    } catch (err) {
      setLostPetsError(err?.response?.data?.message || err?.message || "Failed to submit Lost & Found report.");
    } finally {
      setLostPetLoading(false);
    }
  };

  const toggleNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // Helper: Send message simulator
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessageText.trim()) return;

    setChatList(prev => prev.map(c => {
      if (c.chatId === selectedChatId) {
        return {
          ...c,
          conversation: [
            ...c.conversation,
            { sender: "user", text: currentMessageText, time: "Just now" }
          ]
        };
      }
      return c;
    }));

    const textToMatch = currentMessageText;
    setCurrentMessageText("");

    // Simulate AI clinical response
    setTimeout(() => {
      let automatedResponse = "Understood. The coordinates are updated. Keep safe.";
      if (selectedChatId === "chat-1") {
        automatedResponse = "Excellent, see you on Saturday at 10:00 AM! Bring his primary vaccination forms and a soft leash.";
      }
      setChatList(prev => prev.map(c => {
        if (c.chatId === selectedChatId) {
          return {
            ...c,
            conversation: [
              ...c.conversation,
              { sender: "doctor", text: automatedResponse, time: "Just now" }
            ]
          };
        }
        return c;
      }));
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex text-slate-900 font-sans antialiased">
      
      {/* ==================================================== */}
      {/* LEFT SAAS WORKSPACE SIDEBAR                           */}
      {/* ==================================================== */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-white text-slate-800 p-6 border-r border-[#EFE7DC] shrink-0 shadow-sm">
        <div className="space-y-8">
          
          {/* Platform Identity */}
          <button onClick={onNavigateToPublic} className="flex items-center gap-2 group text-left cursor-pointer">
            <div className="bg-[#8B5E3C] p-2.5 rounded-xl text-white group-hover:scale-105 transition-transform shadow-sm shadow-[#8B5E3C]/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#2C2C2C] tracking-tight">Paw<span className="text-[#8B5E3C]">Link</span></span>
              <span className="text-[10px] text-[#C68B59] font-bold uppercase tracking-wider block -mt-1">Smart Welfare</span>
            </div>
          </button>

          {/* Current login Profile capsule */}
          <div className="bg-[#FAF8F5] border border-[#EFE7DC] p-3.5 rounded-2xl flex items-center gap-3">
            <div className="bg-[#8B5E3C] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold uppercase text-xs">
              {role[0]}
            </div>
            <div className="text-left">
              <p className="font-extrabold text-xs text-[#2C2C2C] truncate max-w-[120px]">{role} Account</p>
              <p className="text-[9px] text-[#C68B59] font-extrabold uppercase tracking-widest">VERIFIED</p>
            </div>
          </div>

          {/* Sidebar Menu options */}
          <nav className="space-y-1.5 text-left text-xs font-semibold">
            {(isCitizen
              ? [
                  { id: "CitizenOverview", label: "Welfare Hub", icon: <Compass className="w-4 h-4" /> },
                  { id: "LostFound", label: "Lost & Found Finder", icon: <Search className="w-4 h-4" /> },
                  { id: "Donations", label: "Support Campaigns", icon: <Heart className="w-4 h-4" /> },
                  { id: "Map", label: "Facilities & Clinics", icon: <MapPin className="w-4 h-4" /> },
                  { id: "Messenger", label: "Comms Link Chat", icon: <MessageSquare className="w-4 h-4" /> }
                ]
              : [
                  { id: "Overview", label: "Control Center", icon: <Compass className="w-4 h-4" /> },
                  { id: "Medical", label: "Medical Ledger", icon: <Activity className="w-4 h-4" /> },
                  { id: "Messenger", label: "Comms Link Chat", icon: <MessageSquare className="w-4 h-4" /> },
                  { id: "Volunteers", label: "Responders Guild", icon: <Award className="w-4 h-4" /> },
                  { id: "Map", label: "Telemetry Locator", icon: <MapPin className="w-4 h-4" /> }
                ]
            ).map((menu) => {
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveTab(menu.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? "bg-[#8B5E3C] text-white shadow-sm shadow-[#8B5E3C]/20" 
                      : "text-slate-600 hover:text-[#8B5E3C] hover:bg-[#FAF8F5]"
                  }`}
                >
                  {menu.icon}
                  {menu.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-4">
          {role === "NGO" && (
            <button 
              onClick={onNavigateToAdmin}
              className="w-full bg-[#FAF8F5] hover:bg-[#EFE7DC] text-[#2C2C2C] border border-[#D8C3A5] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Shield className="w-4 h-4 text-[#8B5E3C]" />
              NGO Workspace
            </button>
          )}

          <button 
            onClick={onLogout}
            className="w-full bg-transparent hover:bg-red-50 text-red-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* MAIN CONTAINER WORKSPACE                              */}
      {/* ==================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top platform bar */}
        <header className="bg-white border-b border-slate-100 py-3.5 px-4 md:px-8 flex justify-between items-center z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm md:text-base font-extrabold text-slate-900">PawLink Secure Ecosystem</h1>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full border border-slate-200/50 uppercase tracking-wider">
              {role} Gateway
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Query clinical codes or rescues..." 
                className="bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 w-64 focus:outline-none" 
              />
            </div>

            {/* Notification Bell toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Notification drop menu */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 text-left space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-extrabold text-xs text-slate-900">Telemetry Notifications</span>
                      <button className="text-[10px] text-green-700 font-bold hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => toggleNotificationRead(n.id)}
                          className={`p-3 rounded-xl text-xs transition-colors cursor-pointer ${
                            n.unread ? "bg-green-50 border border-green-100" : "bg-slate-50"
                          }`}
                        >
                          <p className={`font-medium ${n.unread ? "text-green-950 font-bold" : "text-slate-600"}`}>{n.text}</p>
                          <span className="text-[9px] text-slate-400 font-mono block mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform home link */}
            <button 
              onClick={onNavigateToPublic}
              className="text-xs font-bold text-slate-500 hover:text-green-700 hover:underline flex items-center gap-1.5"
            >
              Public Hub <ExternalLink className="w-3 h-3" />
            </button>

            {/* Profile avatar / link - navigates to the real profile editor */}
            <button
              onClick={onNavigateToProfile}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl pl-1.5 pr-3 py-1.5 transition-colors cursor-pointer"
              title="My Profile"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                {user && user.avatar ? (
                  <img src={resolveAssetUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                {user && user.name ? user.name.split(" ")[0] : "Profile"}
              </span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-2 overflow-x-auto flex gap-1 whitespace-nowrap sticky top-[53px] z-25">
          {(isCitizen
            ? [
                { id: "CitizenOverview", label: "Welfare Hub" },
                { id: "LostFound", label: "Lost & Found" },
                { id: "Donations", label: "Support" },
                { id: "Map", label: "Locator" },
                { id: "Messenger", label: "Comms Link" }
              ]
            : [
                { id: "Overview", label: "Control" },
                { id: "Medical", label: "Medical" },
                { id: "Messenger", label: "Messenger" },
                { id: "Volunteers", label: "Volunteers" },
                { id: "Map", label: "Telemetry" }
              ]
          ).map(m => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                activeTab === m.id ? "bg-green-700 text-white" : "text-slate-600 bg-slate-50"
              }`}
            >
              {m.label}
            </button>
          ))}
          <button onClick={onNavigateToProfile} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-50">Profile</button>
          <button onClick={onLogout} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50">Logout</button>
        </div>

        {/* Inner page layouts */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {/* ==================== CITIZEN WELFARE HUB TAB ==================== */}
          {activeTab === "CitizenOverview" && (
            <div className="space-y-8 text-left animate-fade-in">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Citizen Welfare Hub</h2>
                  <p className="text-xs text-slate-500">Welcome to PawLink. Report local strays, request adoptions, and manage local community animal care.</p>
                </div>
                <button 
                  onClick={() => setActiveTab("Map")}
                  className="bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" /> Locate Nearby Clinics & Shelters
                </button>
              </div>

              {/* Grid block */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left side: Reporting stray and Adoption selection */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Stray Reporting Form */}
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-50">
                      <div className="bg-red-50 text-red-600 p-2 rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-950 text-sm">Report a Street Animal Emergency</h3>
                        <p className="text-[11px] text-slate-500">Dispatches real-time telemetry alerts to active rescue responders nearby.</p>
                      </div>
                    </div>

                    {straySubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center space-y-3"
                      >
                        <div className="bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md">
                          <Check className="w-5 h-5" />
                        </div>
                        <h4 className="font-extrabold text-sm text-green-950">Emergency Telemetry Dispatched!</h4>
                        <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed">
                          Your report for a <strong>{strayType}</strong> in <strong>{strayLocation}</strong> was received and processed. Nearby squads have been alerted. Thank you for saving a life.
                        </p>
                        <button 
                          onClick={() => setStraySubmitted(false)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
                        >
                          Report Another Emergency
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!strayLocation.trim()) {
                          alert("Please fill in the location field!");
                          return;
                        }
                        const newRescue = {
                          id: `res-${Date.now().toString().slice(-3)}`,
                          reporter: "You (Citizen Account)",
                          reporterPhone: "+1 (555) YOUR-ID",
                          petType: strayType,
                          location: strayLocation,
                          emergencyLevel: straySeverity,
                          status: "Reported",
                          description: strayDesc || "Reported via Citizen Welfare portal",
                          timestamp: new Date().toISOString(),
                          image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=600",
                          assignedVolunteer: null,
                          timeline: [
                            { status: "Reported", time: "Just now", desc: "Report filed by Citizen account." }
                          ]
                        };
                        setRescuesList([newRescue, ...rescuesList]);
                        setStraySubmitted(true);
                        // Reset form
                        setStrayLocation("");
                        setStrayDesc("");
                      }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Animal Type</label>
                            <select 
                              value={strayType}
                              onChange={(e) => setStrayType(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-700"
                            >
                              <option>Dog</option>
                              <option>Cat</option>
                              <option>Bird</option>
                              <option>Other / Injured Wildlife</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Emergency Severity</label>
                            <select 
                              value={straySeverity}
                              onChange={(e) => setStraySeverity(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-700"
                            >
                              <option>Medium</option>
                              <option>High</option>
                              <option>Critical</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Exact Location / Landmarks</label>
                          <input 
                            type="text"
                            placeholder="e.g. 5th Avenue block C, near grocery dumpster"
                            value={strayLocation}
                            onChange={(e) => setStrayLocation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Additional Details</label>
                          <textarea 
                            rows="2"
                            placeholder="Describe any injuries, temperament, or access barriers..."
                            value={strayDesc}
                            onChange={(e) => setStrayDesc(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-700"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/10"
                        >
                          <AlertTriangle className="w-4 h-4" /> Transmit Emergency Dispatch
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Adoption Grid Card Selection */}
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <div>
                        <h3 className="font-extrabold text-slate-950 text-sm">Compassionate Adoptions</h3>
                        <p className="text-[11px] text-slate-500">Provide a warm home to a recovered survivor animal.</p>
                      </div>
                      <div className="flex gap-1">
                        {["All", "Dog", "Cat"].map(cat => (
                          <button 
                            key={cat}
                            onClick={() => setAdoptionFilter(cat)}
                            className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                              adoptionFilter === cat ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-100"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {adoptionSuccessMsg && (
                      <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-green-800 font-bold text-xs flex justify-between items-center">
                        <span>{adoptionSuccessMsg}</span>
                        <button onClick={() => setAdoptionSuccessMsg("")} className="text-green-900 hover:underline text-[10px]">Dismiss</button>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {MOCK_PETS.filter(p => p.status === "Available" && (adoptionFilter === "All" || p.type.toLowerCase() === adoptionFilter.toLowerCase())).map(pet => (
                        <div key={pet.id} className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex flex-col justify-between">
                          <img src={pet.image} className="w-full h-32 object-cover" />
                          <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900">{pet.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium">{pet.breed} • {pet.age}</p>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5 italic font-light">"{pet.story}"</p>
                            </div>
                            
                            <button 
                              onClick={() => {
                                // Add a chat partner dynamically in Comms Link Chat
                                const adoptionChatId = `chat-adopt-${pet.id}`;
                                const partnerName = `Adoption Team (${pet.name})`;
                                
                                // Check if chat exists
                                const chatExists = chatList.some(c => c.chatId === adoptionChatId);
                                if (!chatExists) {
                                  const newChat = {
                                    chatId: adoptionChatId,
                                    partner: {
                                      name: partnerName,
                                      avatar: pet.image,
                                      role: "Shelter Coordinator",
                                      status: "Online"
                                    },
                                    conversation: [
                                      { sender: "doctor", text: `Hello! Thanks for your interest in adopting ${pet.name}. Would you like to schedule a visitor meet at our Sector-9 center?`, time: "Just now" }
                                    ]
                                  };
                                  setChatList([newChat, ...chatList]);
                                }
                                setSelectedChatId(adoptionChatId);
                                setActiveTab("Messenger");
                                setAdoptionSuccessMsg(`Adoption chat initiated for ${pet.name}! Check your Comms Link Chat.`);
                              }}
                              className="w-full mt-3 bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-xl text-[11px] cursor-pointer transition-colors"
                            >
                              Request Adoption Info
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right side widgets */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Stats card */}
                  <div className="bg-gradient-to-br from-green-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-green-400">Welfare Dashboard stats</span>
                    <h3 className="text-lg font-extrabold text-white leading-tight">My Community Impact Points</h3>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-green-700/30 p-3 rounded-2xl border border-green-700/40">
                        <Award className="w-8 h-8 text-green-400" />
                      </div>
                      <div>
                        <span className="block text-2xl font-extrabold text-green-400">1,250 pts</span>
                        <span className="text-[10px] text-slate-300">Level 3 Local Guardian</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Reported strays rescued</span>
                        <span className="font-bold text-white">4 survivors</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active volunteers matched</span>
                        <span className="font-bold text-white">12 nearby</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Direct Campaign contribution</span>
                        <span className="font-bold text-white">$150.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Teaser Fundraising Campaign */}
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">Featured Campaign</span>
                    <div className="rounded-2xl overflow-hidden relative h-32">
                      <img src={MOCK_DONATIONS.campaigns[0].image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-4">
                        <h4 className="text-white text-xs font-bold leading-snug">{MOCK_DONATIONS.campaigns[0].title}</h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {MOCK_DONATIONS.campaigns[0].desc}
                    </p>
                    <button 
                      onClick={() => setActiveTab("Donations")}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Fund Critical Surgery
                    </button>
                  </div>

                  {/* Pro Tips Section */}
                  <div className="bg-green-50 border border-green-100 p-5 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-700" />
                      <span className="font-bold text-xs text-green-950">AI Safe-Feeding Tip</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Always provide fresh tap water nearby when feeding strays. Dry kibble absorbs water, and dehydration is an unrecognized danger for summer strays.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ==================== LOST & FOUND TAB ==================== */}
          {activeTab === "LostFound" && (
            <div className="space-y-8 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Lost & Found Regional Finder</h2>
                  <p className="text-xs text-slate-500">Live community logs for recovering lost family pets and logging found strays.</p>
                </div>
                
                <div className="flex gap-1.5 shrink-0">
                  {["All", "Lost", "Found"].map((mode) => (
                    <button 
                      key={mode}
                      onClick={() => setLostFilter(mode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        lostFilter === mode ? "bg-green-700 text-white border-green-700" : "bg-white text-slate-600 border-slate-100"
                      }`}
                    >
                      {mode} List
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {lostPetsLoading && <div className="lg:col-span-12 text-xs text-slate-500">Loading recent reports...</div>}
                {lostPetsError && <div className="lg:col-span-12 text-xs text-red-600">{lostPetsError}</div>}
                {lostPetsSuccess && <div className="lg:col-span-12 text-xs text-green-700">{lostPetsSuccess}</div>}
                {/* Left: Interactive list of Lost & Found (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text"
                      placeholder="Search by breed, name, last seen location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-700"
                    />
                  </div>

                  {/* Roster cards */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {lostPetsList
                      .filter(p => lostFilter === "All" || p.status.toLowerCase() === lostFilter.toLowerCase())
                      .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.breed.toLowerCase().includes(searchQuery.toLowerCase()) || p.lastSeen.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(p => (
                        <div key={p.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                          <div className="relative">
                            <img src={p.image} className="w-full h-44 object-cover" />
                            <span className={`absolute top-4 right-4 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                              p.status === "Lost" ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                              {p.status}
                            </span>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-extrabold text-sm text-slate-900">{p.name || "Unknown stray"}</h4>
                              <p className="text-[10px] text-slate-400 font-medium">{p.breed} • Date: {p.date}</p>
                              
                              <div className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl space-y-1.5 text-[11px] text-slate-600">
                                <p className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                  <span className="truncate"><strong>Last seen:</strong> {p.lastSeen}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span><strong>Owner/Reporter:</strong> {p.owner}</span>
                                </p>
                                {p.reward !== "None" && (
                                  <p className="flex items-center gap-1.5 text-amber-700 font-extrabold">
                                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span>Reward: {p.reward}</span>
                                  </p>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-light line-clamp-3">"{p.description}"</p>
                            </div>

                            <button 
                              onClick={() => {
                                const chatPartnerId = `chat-lost-${p.id}`;
                                const partnerExists = chatList.some(c => c.chatId === chatPartnerId);
                                if (!partnerExists) {
                                  const newChat = {
                                    chatId: chatPartnerId,
                                    partner: {
                                      name: p.owner,
                                      avatar: p.image,
                                      role: p.status === "Lost" ? "Pet Owner" : "Finder / Volunteer",
                                      status: "Online"
                                    },
                                    conversation: [
                                      { sender: "doctor", text: `Hi! Regarding the ${p.status} case for ${p.name || "the pet"}. Do you have any updates?`, time: "Just now" }
                                    ]
                                  };
                                  setChatList([newChat, ...chatList]);
                                }
                                setSelectedChatId(chatPartnerId);
                                setActiveTab("Messenger");
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                            >
                              Contact Case Coordinator
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                </div>

                {/* Right: File a report (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
                  <div className="pb-2 border-b border-slate-50">
                    <h3 className="font-extrabold text-slate-950 text-sm">File a Lost/Found Report</h3>
                    <p className="text-[11px] text-slate-500 font-light">Add your missing pet details to activate our AI cross-matching regional locator scanner.</p>
                  </div>

                  {lostPetSubmitted ? (
                    <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center space-y-3">
                      <div className="bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-green-950 text-xs">Pet Logged successfully!</h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed">
                        Your listing was registered inside our regional lost & found search database. AI cross-checking is currently active.
                      </p>
                      <button 
                        onClick={() => setLostPetSubmitted(false)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-extrabold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Register New Report
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleLostReportSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Status Type</label>
                          <select 
                            value={lostPetType}
                            onChange={e => setLostPetType(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-2 py-2 focus:outline-none"
                          >
                            <option>Dog</option>
                            <option>Cat</option>
                            <option>Bird</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Pet Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Coco"
                            value={lostPetName}
                            onChange={e => setLostPetName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Breed Type</label>
                          <input 
                            type="text"
                            placeholder="e.g. Chihuahua"
                            value={lostPetBreed}
                            onChange={e => setLostPetBreed(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Reward ($)</label>
                          <input 
                            type="number"
                            placeholder="e.g. 200"
                            value={lostPetReward}
                            onChange={e => setLostPetReward(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Last Seen Location</label>
                        <input 
                          type="text"
                          placeholder="Specific street name, sector..."
                          value={lostPetLocation}
                          onChange={e => setLostPetLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Detailed Description</label>
                        <textarea 
                          rows="2"
                          placeholder="Describe color, accessories, scars, habits, behavior around humans..."
                          value={lostPetDesc}
                          onChange={e => setLostPetDesc(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={lostPetLoading}
                        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-slate-300 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        {lostPetLoading ? "Publishing..." : "Publish Report"}
                      </button>

                    </form>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* ==================== SUPPORT CAMPAIGNS TAB ==================== */}
          {activeTab === "Donations" && (
            <div className="space-y-8 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Direct Support Campaigns</h2>
                  <p className="text-xs text-slate-500">PawLink direct audit trace financial pledge system. 100% of funds go straight to clinical supplies.</p>
                </div>
                
                <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs flex gap-4">
                  <div>
                    <span className="block text-slate-400 text-[10px]">Total Raised today</span>
                    <span className="font-extrabold text-slate-900">$1,849.00</span>
                  </div>
                  <div className="border-l border-slate-100 pl-4">
                    <span className="block text-slate-400 text-[10px]">Direct Trace matches</span>
                    <span className="font-extrabold text-green-700">100% Audited</span>
                  </div>
                </div>
              </div>

              {/* Progress toward Monthly Goal */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Global Monthly Veterinary Care Pool Goal</span>
                  <span className="text-green-700">${donationsData.totalRaised.toLocaleString()} Raised of $250,000</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-700 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (donationsData.totalRaised / 250000) * 100)}%` }} 
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Completed: {Math.round((donationsData.totalRaised / 250000) * 100)}% of regional summer goal.</p>
              </div>

              {/* Active Campaigns List */}
              <div className="grid md:grid-cols-3 gap-6">
                {donationsData.campaigns.map(camp => {
                  const percent = Math.round((camp.raised / camp.goal) * 100);
                  return (
                    <div key={camp.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="relative h-44">
                        <img src={camp.image} className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 bg-slate-900/90 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-full">
                          {camp.category}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{camp.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-light">{camp.desc}</p>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-700 h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-900">${camp.raised.toLocaleString()} raised</span>
                            <span className="text-slate-400">Goal: ${camp.goal.toLocaleString()} ({percent}%)</span>
                          </div>

                          <button 
                            onClick={() => {
                              setSelectedCampaign(camp);
                              setDonationSuccess(false);
                            }}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                          >
                            Contribute Care Gift
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secure Payment Overlay Modal */}
              <AnimatePresence>
                {selectedCampaign && (
                  <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-left space-y-6 relative border border-slate-100"
                    >
                      <button 
                        type="button"
                        onClick={() => setSelectedCampaign(null)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                      >
                        ×
                      </button>

                      {donationSuccess ? (
                        <div className="text-center space-y-4 py-4">
                          <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                            <Check className="w-6 h-6" />
                          </div>
                          <h3 className="font-extrabold text-lg text-slate-900">Secure Pledge Processed!</h3>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Thank you! Your transaction code is <strong>PawLink-TX-{Math.floor(1000 + Math.random() * 9000)}</strong>.
                            Your care contribution has been logged to the public direct audit logs.
                          </p>
                          <button 
                            type="button"
                            onClick={() => setSelectedCampaign(null)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                          >
                            Return to campaigns
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">Direct Financial Trace Pledge</span>
                            <h3 className="text-base font-extrabold text-slate-900">{selectedCampaign.title}</h3>
                          </div>

                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const finalAmt = donationAmount === "custom" ? parseFloat(customDonationAmount) : parseFloat(donationAmount);
                            if (isNaN(finalAmt) || finalAmt <= 0) {
                              alert("Please specify a valid contribution amount!");
                              return;
                            }
                            if (!donorCard || donorCard.length < 12) {
                              alert("Please specify a valid mock card number!");
                              return;
                            }

                            // Update donationsData and active campaigns raised amounts
                            const updatedCampaigns = donationsData.campaigns.map(c => {
                              if (c.id === selectedCampaign.id) {
                                return { ...c, raised: c.raised + finalAmt };
                              }
                              return c;
                            });

                            const newHistoryTx = {
                              id: `tx-${Math.floor(904 + Math.random() * 5000)}`,
                              user: donorName.trim() ? donorName : "Anonymous Caregiver",
                              amount: finalAmt,
                              date: new Date().toISOString().split('T')[0],
                              campaign: selectedCampaign.title,
                              status: "Completed"
                            };

                            setDonationsData({
                              ...donationsData,
                              totalRaised: donationsData.totalRaised + finalAmt,
                              campaigns: updatedCampaigns,
                              history: [newHistoryTx, ...donationsData.history]
                            });

                            setDonationSuccess(true);
                          }} className="space-y-4">
                            
                            {/* Preset amount select */}
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Select Gift Amount</label>
                              <div className="grid grid-cols-4 gap-2">
                                {["10", "25", "100", "custom"].map(amt => (
                                  <button 
                                    key={amt}
                                    type="button"
                                    onClick={() => setDonationAmount(amt)}
                                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                      donationAmount === amt ? "bg-green-700 text-white border-green-700" : "bg-slate-50 text-slate-700 border-slate-100"
                                    }`}
                                  >
                                    {amt === "custom" ? "Custom" : `$${amt}`}
                                  </button>
                                ))}
                              </div>

                              {donationAmount === "custom" && (
                                <input 
                                  type="number"
                                  placeholder="Enter custom dollars..."
                                  value={customDonationAmount}
                                  onChange={e => setCustomDonationAmount(e.target.value)}
                                  className="w-full mt-2.5 bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none"
                                />
                              )}
                            </div>

                            {/* Donor Info */}
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Donor Name (Leave blank for Anonymous)</label>
                              <input 
                                type="text"
                                placeholder="Your Name"
                                value={donorName}
                                onChange={e => setDonorName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none"
                              />
                            </div>

                            {/* Card numbers */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                              <span className="block text-[9px] font-extrabold uppercase text-green-700 tracking-wider">SECURE MOCK STRIPE GATEWAY</span>
                              
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 mb-1">Card Number</label>
                                <input 
                                  type="text"
                                  placeholder="4111 2222 3333 4444"
                                  value={donorCard}
                                  onChange={e => setDonorCard(e.target.value)}
                                  className="w-full bg-white border border-slate-100 text-slate-800 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 mb-1">Expiry Date</label>
                                  <input 
                                    type="text"
                                    placeholder="MM/YY"
                                    value={donorExpiry}
                                    onChange={e => setDonorExpiry(e.target.value)}
                                    className="w-full bg-white border border-slate-100 text-slate-800 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 mb-1">CVV Security Code</label>
                                  <input 
                                    type="password"
                                    placeholder="***"
                                    value={donorCvv}
                                    onChange={e => setDonorCvv(e.target.value)}
                                    className="w-full bg-white border border-slate-100 text-slate-800 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            <button 
                              type="submit"
                              className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-green-700/10 flex items-center justify-center gap-1.5"
                            >
                              <Shield className="w-4 h-4" /> Process Secure Gift
                            </button>

                          </form>
                        </>
                      )}

                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Historic transaction logs */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-base">Direct Direct Audit Pledges Log</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Transaction Code</th>
                        <th className="py-2.5">Donor Caregiver</th>
                        <th className="py-2.5">Campaign Fund</th>
                        <th className="py-2.5">Pledge Amount</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5 text-right">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {donationsData.history.map(tx => (
                        <tr key={tx.id} className="text-slate-700">
                          <td className="py-3 font-mono text-slate-400">{tx.id}</td>
                          <td className="py-3 font-bold text-slate-900">{tx.user}</td>
                          <td className="py-3">{tx.campaign}</td>
                          <td className="py-3 text-green-700 font-extrabold">${tx.amount.toLocaleString()}</td>
                          <td className="py-3 font-mono text-slate-400">{tx.date}</td>
                          <td className="py-3 text-right">
                            <span className="text-[9px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded border border-green-100 uppercase">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== CONTROL CENTER TAB ==================== */}
          {activeTab === "Overview" && (
            <div className="space-y-8 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Telemetry Control Center</h2>
                  <p className="text-xs text-slate-500">Live indicators of incoming rescues and regional medical queues.</p>
                </div>
                <button 
                  onClick={() => { setActiveTab("Map"); }}
                  className="bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" /> Locate Active Responders
                </button>
              </div>

              {/* Stats dashboard bento */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Rescues Managed", val: "12,490", desc: "99.2% success index", icon: <Activity className="w-5 h-5 text-green-700" /> },
                  { title: "Active Emergency Incidents", val: rescuesList.length, desc: "Trauma ambulances en route", icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
                  { title: "Donations Collected Today", val: "$1,849", desc: "100% direct audit trace", icon: <DollarSign className="w-5 h-5 text-emerald-600" /> },
                  { title: "Volunteers Signed Up", val: "2,491", desc: "Active field roster", icon: <Award className="w-5 h-5 text-amber-500" /> }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                        {stat.icon}
                      </div>
                      <span className="block text-2xl font-extrabold text-slate-900">{stat.val}</span>
                      <span className="block font-bold text-xs text-slate-800 mt-1">{stat.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-3">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Inner details grid */}
              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Active emergency incident feeds */}
                <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="font-extrabold text-base">Active Field Dispatches</h3>
                    <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full border border-red-100">Live active</span>
                  </div>

                  <div className="space-y-3">
                    {rescuesList.map((res) => (
                      <div key={res.id} className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-2xl border border-slate-100/80 flex items-center justify-between gap-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={res.image} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                          <div>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              res.emergencyLevel === "Critical" ? "bg-red-500/15 text-red-500 border border-red-500/20" : "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                            }`}>
                              {res.emergencyLevel}
                            </span>
                            <h4 className="font-bold text-xs mt-1">{res.petType} • {res.location}</h4>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-full border border-green-100">
                            {res.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions box */}
                <div className="lg:col-span-5 bg-gradient-to-br from-green-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">Ecosystem Actions</span>
                    <h3 className="text-xl font-extrabold text-white">Perform Immediate Operations</h3>
                    <p className="text-slate-400 text-xs">Access specific sub-telemetry pages instantly to execute updates or issue dispatch alerts.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                      onClick={() => setActiveTab("Medical")}
                      className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left border border-slate-800 transition-all cursor-pointer"
                    >
                      <Activity className="w-5 h-5 text-green-400 mb-2" />
                      <span className="block font-bold text-xs text-white">Log Vet Treatment</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("Messenger")}
                      className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left border border-slate-800 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
                      <span className="block font-bold text-xs text-white">Comms Link</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== MEDICAL LEDGER TAB ==================== */}
          {activeTab === "Medical" && (
            <div className="space-y-8 text-left animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Unified Smart Veterinary Ledger</h2>
                <p className="text-xs text-slate-500 font-light">Secure ledger tracking active diagnostic, vaccination, and prescription histories.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Animals health profiles roster (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2">Hospitalized Roster</h3>
                  <div className="space-y-2">
                    {MOCK_PETS.map((p) => {
                      const isSelected = selectedMedicalPet.id === p.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => setSelectedMedicalPet(p)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-slate-50 text-slate-900 border-slate-50 hover:bg-slate-100/50"
                          }`}
                        >
                          <img src={p.image} className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate">{p.name}</h4>
                            <p className={`text-[10px] ${isSelected ? "text-slate-400" : "text-slate-500"}`}>{p.breed}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.status === "Available" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {p.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Health details & digital ledger card (8 Cols) */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <img src={selectedMedicalPet.image} className="w-14 h-14 object-cover rounded-2xl shadow-sm border border-slate-200" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Patient Code: {selectedMedicalPet.id}</span>
                        <h3 className="text-xl font-extrabold text-slate-900">{selectedMedicalPet.name} - Electronic Health Card</h3>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs font-extrabold px-3 py-1 rounded-full border border-green-100">
                      Sync Verified
                    </span>
                  </div>

                  {/* Vaccines & Clinical checks list */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                      <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>Immunization Matrix</span>
                        <Shield className="w-4 h-4 text-green-700" />
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">DHPP (Core)</span>
                          <span className="text-green-700 font-extrabold flex items-center gap-1"><Check className="w-4 h-4" /> Active</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">Rabies Vaccine</span>
                          <span className="text-green-700 font-extrabold flex items-center gap-1"><Check className="w-4 h-4" /> Active</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Bordetella</span>
                          <span className="text-amber-600 font-extrabold">Next Due: Aug 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Veterinary notes */}
                    <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                      <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>Clinical Status summary</span>
                        <Clipboard className="w-4 h-4 text-blue-600" />
                      </h4>
                      <div className="text-xs space-y-2">
                        <p className="text-slate-600 leading-relaxed italic">
                          "Excellent prognosis. Post-trauma suture lines are healing cleanly without edema. Diet has been transitioned to high-protein dry formula. Recommend microchipping session on the next evaluation."
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">Logged by Dr. Catherine Shaw • 12 hours ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Treatment progress bar timeline */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest block">Therapy & Suture Recovery Level (94%)</h4>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-700 h-full rounded-full transition-all duration-500" style={{ width: "94%" }} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== MESSENGER CHAT TAB ==================== */}
          {activeTab === "Messenger" && (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm h-[600px] flex overflow-hidden text-left animate-fade-in">
              
              {/* Inbox list (4 Cols) */}
              <div className="w-80 border-r border-slate-100 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-50">
                  <h3 className="font-extrabold text-base text-slate-900">Platform Messenger</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Coordinate logistics with clinics and squads</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
                  {chatList.map((chat) => {
                    const isSelected = selectedChatId === chat.chatId;
                    const lastMsg = chat.conversation[chat.conversation.length - 1];
                    return (
                      <div 
                        key={chat.chatId}
                        onClick={() => setSelectedChatId(chat.chatId)}
                        className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                          isSelected ? "bg-white text-slate-900 border-slate-100 shadow-sm" : "border-transparent hover:bg-slate-100/50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <img src={chat.partner.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100 shrink-0" />
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="font-extrabold text-xs text-slate-900 truncate block">{chat.partner.name}</span>
                              <span className="text-[9px] text-slate-400 shrink-0">{lastMsg ? lastMsg.time : "Today"}</span>
                            </div>
                            <span className="block text-[9px] text-green-700 font-bold uppercase tracking-wider">{chat.partner.role}</span>
                            <p className="text-[11px] text-slate-500 truncate mt-1">
                              {lastMsg ? lastMsg.text : "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat pane (8 Cols) */}
              <div className="flex-1 flex flex-col bg-slate-50">
                {(() => {
                  const activeChat = chatList.find(c => c.chatId === selectedChatId);
                  if (!activeChat) return <div className="m-auto text-slate-400 text-xs">No active conversation</div>;

                  return (
                    <>
                      {/* Top status header */}
                      <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={activeChat.partner.avatar} className="w-9 h-9 rounded-full object-cover shadow-sm border border-slate-100" />
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900">{activeChat.partner.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">{activeChat.partner.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">{activeChat.partner.status}</span>
                        </div>
                      </div>

                      {/* Chat messages body */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeChat.conversation.map((msg, index) => {
                          const isUser = msg.sender === "user";
                          return (
                            <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"} text-xs text-left`}>
                              <div className={`max-w-xs p-3.5 rounded-2xl space-y-1 relative shadow-sm ${
                                isUser ? "bg-green-700 text-white rounded-br-none" : "bg-white text-slate-900 rounded-bl-none border border-slate-100"
                              }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className={`block text-[9px] text-right font-mono ${isUser ? "text-green-300" : "text-slate-400"}`}>
                                  {msg.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Audio voice play demo row if chat-2 */}
                        {activeChat.chatId === "chat-2" && (
                          <div className="flex justify-start text-xs text-left">
                            <div className="bg-white text-slate-900 rounded-2xl rounded-bl-none border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                              <button 
                                onClick={() => setAudioPlaying(!audioPlaying)}
                                className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full cursor-pointer transition-transform"
                              >
                                {audioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              </button>
                              <div>
                                <span className="block font-bold text-[10px] text-slate-400">VOICE FILE DISPATCH</span>
                                <div className="flex gap-1 mt-1.5">
                                  {[1,2,3,4,3,2,1,2,3,4,2,3,4,1,2].map((h, i) => (
                                    <span key={i} className={`w-0.5 rounded-full ${audioPlaying ? "bg-green-700 animate-pulse" : "bg-slate-300"}`} style={{ height: `${h * 4}px` }} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input controls form */}
                      <form onSubmit={handleSendMessage} className="bg-white border-t border-slate-100 p-4 flex gap-2">
                        <button type="button" className="p-2.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer">
                          <Paperclip className="w-4 h-4" />
                        </button>
                        
                        <input 
                          type="text" 
                          placeholder="Type your message coordinate dispatch..." 
                          value={currentMessageText}
                          onChange={e => setCurrentMessageText(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-700" 
                        />

                        <button 
                          type="submit"
                          className="bg-green-700 hover:bg-green-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-green-700/10"
                        >
                          Send Message
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </>
                  );
                })()}
              </div>

            </div>
          )}

          {/* ==================== VOLUNTEERS GUILD TAB ==================== */}
          {activeTab === "Volunteers" && (
            <div className="space-y-8 text-left animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Ecosystem Responders Guild</h2>
                <p className="text-xs text-slate-500 font-light font-mono">Telemetry of verified life rescues and active community points.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Roster list (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                  <h3 className="font-extrabold text-base">Top Welfare Responders</h3>
                  <div className="space-y-4">
                    {MOCK_VOLUNTEERS.leaderboard.map((v) => (
                      <div key={v.rank} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-400 w-4">#{v.rank}</span>
                          <img src={v.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-inner" />
                          <div>
                            <p className="font-bold text-slate-900">{v.name}</p>
                            <p className="text-[10px] text-slate-400">{v.rescues} dispatch cases • {v.hours} active hours</p>
                          </div>
                        </div>
                        <span className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-lg">
                          {v.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training credentials & reward levels (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <h3 className="font-extrabold text-base">My Training Credentials</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Animal Trauma First Aid", status: "Verified Active", date: "Expiry: Oct 2028", code: "CRED-TRAUMA-92" },
                      { title: "Safe Slip-lead capture", status: "Verified Active", date: "Expiry: June 2029", code: "CRED-CAPTURE-01" },
                      { title: "Zoonotic Vector Hygiene", status: "Under evaluation", date: "Review: August 2026", code: "CRED-ZOON-77" }
                    ].map((cred, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs space-y-2">
                        <span className="block font-bold text-slate-900">{cred.title}</span>
                        <div className="flex justify-between items-center text-[10px] pt-1">
                          <span className="text-green-700 font-extrabold">{cred.status}</span>
                          <span className="text-slate-400 font-mono">{cred.code}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-green-950">Enroll in Zoonotic Vector course</p>
                      <p className="text-slate-500 text-[10px]">Gain +150 points and verify your clinical credential badge.</p>
                    </div>
                    <button className="bg-green-700 hover:bg-green-800 text-white font-extrabold px-4 py-2 rounded-xl text-[10px] uppercase cursor-pointer">
                      Start Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TELEMETRY LOCATOR MAP TAB ==================== */}
          {activeTab === "Map" && (
            <div className="space-y-8 text-left animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Interactive Facilities & Active Telemetry Map</h2>
                <p className="text-xs text-slate-500">Live coordinates plotter tracking verified clinics and responder rescue vans.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Shelters directory list (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">Live Directory Plotter</h3>
                  <div className="space-y-2">
                    {MOCK_SHELTERS.map((s) => {
                      const isHovered = mapHoverShelter?.id === s.id;
                      return (
                        <div 
                          key={s.id}
                          onMouseEnter={() => setMapHoverShelter(s)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isHovered ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-slate-50 text-slate-900 border-slate-50 hover:bg-slate-100/50"
                          }`}
                        >
                          <h4 className="font-extrabold text-xs">{s.name}</h4>
                          <p className={`text-[10px] mt-1 ${isHovered ? "text-slate-400" : "text-slate-500"}`}>{s.address}</p>
                          <div className="flex justify-between items-center mt-3 text-[9px] font-mono">
                            <span>Capacity: {s.capacity}</span>
                            <span>Rating: {s.rating} ★</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SVG Live map matrix renderer (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-4">
                  <div className="bg-slate-950 rounded-2xl h-96 relative overflow-hidden flex items-center justify-center">
                    {/* SVG grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="grid-dashboard" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid-dashboard)" />
                    </svg>

                    {/* Scanner scanning ray */}
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-green-500/5 to-transparent h-1/2 w-full animate-pulse pointer-events-none" />

                    {/* Coordinates plotted */}
                    {MOCK_SHELTERS.map((s) => {
                      const isHovered = mapHoverShelter?.id === s.id;
                      return (
                        <button 
                          key={s.id}
                          onMouseEnter={() => setMapHoverShelter(s)}
                          style={{ left: `${s.coords.x}%`, top: `${s.coords.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-transform ${
                            isHovered ? "bg-red-600 text-white z-20 scale-125 shadow-lg animate-bounce" : "bg-green-700 text-white hover:bg-green-600 scale-100"
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      );
                    })}

                    {/* Map hovering metrics box */}
                    {mapHoverShelter && (
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-800 p-3.5 rounded-xl text-white text-xs text-left flex gap-3 shadow-2xl">
                        <div className="bg-green-700 text-white p-2 rounded-xl flex items-center justify-center shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-green-400">{mapHoverShelter.name}</p>
                          <p className="text-[10px] text-slate-300">{mapHoverShelter.address} • {mapHoverShelter.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
