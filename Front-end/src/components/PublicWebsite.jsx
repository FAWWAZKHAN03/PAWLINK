import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Shield, Bell, MapPin, Search, Plus, Filter, ArrowRight, User, Award,
  Activity, Phone, Mail, HelpCircle, ArrowUpRight, DollarSign, Send, BookOpen,
  Clock, Calendar, Check, AlertTriangle, FileText, Compass, Sparkles, CheckCircle,
  Users, Volume2, Star, ThumbsUp, ChevronDown
} from "lucide-react";
import {
  MOCK_PETS, MOCK_LOST_PETS, MOCK_DONATIONS,
  MOCK_VOLUNTEERS, MOCK_SHELTERS, FAQ_DATA
} from "../data";
import { createRescue, getAllRescues, acceptRescue, completeRescue } from "../api/rescue";

export default function PublicWebsite({ isAuthenticated, authRole, onLogout, onNavigateToLogin, onNavigateToSignup, onNavigateToDashboard }) {
  // Navigation & Sub-page state
  const [activeTab, setActiveTab] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Rescue Form States
  const [rescues, setRescues] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newRescue, setNewRescue] = useState({
    reporter: "", phone: "", petType: "Dog", location: "",
    emergencyLevel: "High", description: "", image: ""
  });
  const [activeTrackingId, setActiveTrackingId] = useState(null);
  const [rescueLoading, setRescueLoading] = useState(false);
  const [rescueError, setRescueError] = useState("");
  const [rescueFetchLoading, setRescueFetchLoading] = useState(true);
  const [rescueFetchError, setRescueFetchError] = useState("");
  const [rescueActionLoading, setRescueActionLoading] = useState(false);
  const [rescueActionError, setRescueActionError] = useState("");
  const [rescueActionSuccess, setRescueActionSuccess] = useState("");
  const [rescueSuccess, setRescueSuccess] = useState("");
  
  // Lost & Found States
  const [lostPets, setLostPets] = useState(MOCK_LOST_PETS);
  const [lfFilter, setLfFilter] = useState("All");
  const [showLostModal, setShowLostModal] = useState(false);
  const [newLost, setNewLost] = useState({
    name: "", type: "dog", breed: "", status: "Lost",
    lastSeen: "", owner: "", phone: "", reward: "", description: ""
  });
  const [searchLF, setSearchLF] = useState("");
  const [simulatedMatch, setSimulatedMatch] = useState(null);

  // Adoption States
  const [pets, setPets] = useState(MOCK_PETS);
  const [petFilter, setPetFilter] = useState("All");
  const [selectedPet, setSelectedPet] = useState(null);
  const [savedPetIds, setSavedPetIds] = useState([]);
  const [adoptionForm, setAdoptionForm] = useState({ name: "", email: "", phone: "", experience: "", notes: "" });
  const [adoptionSuccess, setAdoptionSuccess] = useState(false);

  // Donation States
  const [campaigns, setCampaigns] = useState(MOCK_DONATIONS.campaigns);
  const [donationHistory, setDonationHistory] = useState(MOCK_DONATIONS.history);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Volunteer States
  const [missions, setMissions] = useState(MOCK_VOLUNTEERS.missions);
  const [joinedMissions, setJoinedMissions] = useState([]);

  // Shelter Map States
  const [selectedShelter, setSelectedShelter] = useState(MOCK_SHELTERS[0]);

  // Contact States
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // FAQ Accordion
  const [faqOpenIdx, setFaqOpenIdx] = useState(null);

  // Auto scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Fetch rescue feed data on mount
  useEffect(() => {
    const loadRescues = async () => {
      setRescueFetchLoading(true);
      setRescueFetchError("");
      try {
        const data = await getAllRescues();
        const normalized = (data.rescues || []).map((rescue) => ({
          ...rescue,
          id: rescue.id || rescue._id,
        }));
        setRescues(normalized);
      } catch (err) {
        setRescueFetchError(err?.response?.data?.message || err?.message || "Unable to load rescue feed.");
      } finally {
        setRescueFetchLoading(false);
      }
    };

    loadRescues();
  }, []);

  // Helper: toggle saved pet
  const toggleSavePet = (id, e) => {
    e.stopPropagation();
    setSavedPetIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Helper: report rescue
  const handleReportRescue = async (e) => {
    e.preventDefault();
    setRescueLoading(true);
    setRescueError("");
    setRescueSuccess("");

    try {
      const payload = {
        reporter: newRescue.reporter || "Anonymous Reporter",
        reporterPhone: newRescue.phone || "+1 (555) 000-0000",
        petType: newRescue.petType,
        location: newRescue.location || "Co-ordinates Tracked",
        emergencyLevel: newRescue.emergencyLevel,
        description: newRescue.description || "No description provided.",
        image: newRescue.image || "",
      };

      const response = await createRescue(payload);
      const createdRescue = {
        ...response.rescue,
        id: response.rescue.id || response.rescue._id,
      };

      setRescues([createdRescue, ...rescues]);
      setActiveTrackingId(createdRescue.id);
      setRescueSuccess("Rescue report submitted successfully.");
      setNewRescue({ reporter: "", phone: "", petType: "Dog", location: "", emergencyLevel: "High", description: "", image: "" });

      setTimeout(() => {
        setShowReportModal(false);
        setActiveTab("Rescue");
      }, 800);
    } catch (err) {
      setRescueError(err?.response?.data?.message || err?.message || "Failed to submit rescue report.");
    } finally {
      setRescueLoading(false);
    }
  };

  const handleAcceptRescue = async (incidentId) => {
    setRescueActionLoading(true);
    setRescueActionError("");
    setRescueActionSuccess("");

    try {
      const response = await acceptRescue(incidentId);
      const updatedRescue = {
        ...response.rescue,
        id: response.rescue.id || response.rescue._id,
      };

      setRescues((prev) => prev.map((item) => item.id === incidentId ? updatedRescue : item));
      setRescueActionSuccess("Rescue accepted successfully.");
    } catch (err) {
      setRescueActionError(err?.response?.data?.message || err?.message || "Failed to accept rescue.");
    } finally {
      setRescueActionLoading(false);
    }
  };

  const handleCompleteRescue = async (incidentId) => {
    setRescueActionLoading(true);
    setRescueActionError("");
    setRescueActionSuccess("");

    try {
      const response = await completeRescue(incidentId);
      const updatedRescue = {
        ...response.rescue,
        id: response.rescue.id || response.rescue._id,
      };

      setRescues((prev) => prev.map((item) => item.id === incidentId ? updatedRescue : item));
      setRescueActionSuccess("Rescue completed successfully.");
    } catch (err) {
      setRescueActionError(err?.response?.data?.message || err?.message || "Failed to complete rescue.");
    } finally {
      setRescueActionLoading(false);
    }
  };

  // Helper: Lost and Found submission
  const handleReportLost = (e) => {
    e.preventDefault();
    const created = {
      id: `lost-${Date.now()}`,
      ...newLost,
      date: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=600"
    };
    setLostPets([created, ...lostPets]);
    setShowLostModal(false);

    // Trigger artificial premium matching algorithm simulation
    setTimeout(() => {
      setSimulatedMatch({
        lost: created,
        matchedWith: MOCK_PETS[0], // Milo match
        matchScore: 92
      });
    }, 2000);
  };

  // Helper: Submit adoption application
  const handleAdoptionSubmit = (e) => {
    e.preventDefault();
    setAdoptionSuccess(true);
    setTimeout(() => {
      setAdoptionSuccess(false);
      setSelectedPet(null);
    }, 4000);
  };

  // Helper: Submit donation
  const handleDonationSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(donationAmount) || 50;
    
    // Update campaign raised amount
    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaign.id) {
        return { ...c, raised: c.raised + amt, contributors: c.contributors + 1 };
      }
      return c;
    }));

    // Add to history
    const newTx = {
      id: `tx-${Date.now()}`,
      user: "You (Verified Contributor)",
      amount: amt,
      date: "Today",
      campaign: selectedCampaign.title,
      status: "Completed"
    };
    setDonationHistory([newTx, ...donationHistory]);
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setSelectedCampaign(null);
      setDonationAmount("");
    }, 3500);
  };

  // Helper: Join mission
  const toggleJoinMission = (id) => {
    if (joinedMissions.includes(id)) {
      setJoinedMissions(prev => prev.filter(mId => mId !== id));
      setMissions(prev => prev.map(m => {
        if (m.id === id) return { ...m, volunteersSigned: m.volunteersSigned - 1 };
        return m;
      }));
    } else {
      setJoinedMissions(prev => [...prev, id]);
      setMissions(prev => prev.map(m => {
        if (m.id === id) return { ...m, volunteersSigned: m.volunteersSigned + 1 };
        return m;
      }));
    }
  };

  // Render Section Selector Helper
  const renderNavButton = (tabName) => {
    const isMain = activeTab === tabName;
    return (
      <button
        key={tabName}
        id={`nav-${tabName}`}
        onClick={() => setActiveTab(tabName)}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 relative ${
          isMain ? "text-[#8B5E3C] bg-[#8B5E3C]/5" : "text-gray-600 hover:text-[#8B5E3C] hover:bg-gray-50"
        }`}
      >
        {tabName}
        {isMain && (
          <motion.div
            layoutId="activeTabUnderline"
            className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#8B5E3C] rounded-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    );
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 font-sans flex flex-col antialiased">
      
      {/* ==================================================== */}
      {/* TOP EMERGENCY BANNER                                 */}
      {/* ==================================================== */}
      <div className="bg-red-600 text-white text-xs md:text-sm font-semibold py-2 px-4 flex justify-between items-center relative z-50 shadow-md">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <p className="truncate">
            <span className="font-extrabold uppercase mr-1">[STRAY EMERGENCY]</span>
            Critically injured Golden Retriever under Sector 11 Overpass. Help is being dispatched.
          </p>
        </div>
        <button 
          onClick={() => { setActiveTab("Rescue"); setActiveTrackingId("res-101"); }}
          className="bg-white/10 hover:bg-white/25 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
        >
          Track Dispatch →
        </button>
      </div>

      {/* ==================================================== */}
      {/* PREMIUM GLASS NAVBAR                                  */}
      {/* ==================================================== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EFE7DC] px-4 md:px-8 py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-8">
          <button onClick={() => setActiveTab("Home")} className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-[#8B5E3C] p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-md shadow-[#8B5E3C]/10">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold text-[#2C2C2C] tracking-tight block">Paw<span className="text-[#8B5E3C]">Link</span></span>
              <span className="text-[10px] text-[#C68B59] font-bold uppercase tracking-wider block -mt-1">Smart Welfare</span>
            </div>
          </button>

          {/* Large desktop menu */}
          <nav className="hidden xl:flex items-center gap-1">
            {["Home", "Rescue", "Lost & Found", "Adoption", "Donations", "Contact"].map(tab => renderNavButton(tab))}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowReportModal(true)}
            className="hidden sm:flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-xs transition-all duration-300 cursor-pointer shadow-sm animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Distress
          </button>

          <button 
            onClick={() => onNavigateToDashboard(authRole || "Citizen")}
            className="flex items-center gap-1 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all duration-300 cursor-pointer shadow-md shadow-[#8B5E3C]/10"
          >
            <Compass className="w-3.5 h-3.5" />
            Portal Dashboard
          </button>

          <button 
            onClick={onLogout}
            className="text-red-600 hover:bg-red-50 font-bold px-4 py-2 rounded-xl text-xs transition-all duration-300 cursor-pointer border border-transparent hover:border-red-100"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* ==================================================== */}
      {/* RESPONSIVE SUB-MENU (MOBILE/TABLET SCROLLABLE)       */}
      {/* ==================================================== */}
      <div className="xl:hidden bg-white/95 border-b border-[#EFE7DC] px-4 py-2 overflow-x-auto flex gap-1 whitespace-nowrap sticky top-[69px] z-35 scrollbar-none">
        {["Home", "Rescue", "Lost & Found", "Adoption", "Donations", "Contact"].map(tab => renderNavButton(tab))}
      </div>

      {/* ==================================================== */}
      {/* SIMULATED MATCHING ALGORITHM OVERLAY                 */}
      {/* ==================================================== */}
      <AnimatePresence>
        {simulatedMatch && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-green-900 text-white px-6 py-4 shadow-2xl relative z-40 border-b border-green-800"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-full text-green-950">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base">PawLink AI Match Spotted! ({simulatedMatch.matchScore}% Probabilistic Match)</h4>
                  <p className="text-xs text-green-200">Our computer vision system has matched your reported lost pet <strong>"{simulatedMatch.lost.name}"</strong> with an active profile at Greenwood Shelter.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedPet(MOCK_PETS[0]); setActiveTab("Adoption"); setSimulatedMatch(null); }}
                  className="bg-white text-green-950 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-green-50 transition-all cursor-pointer"
                >
                  View Matched Pet
                </button>
                <button 
                  onClick={() => setSimulatedMatch(null)}
                  className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* PAGES COMPONENT ROUTING                              */}
      {/* ==================================================== */}
      <main className="flex-1">
        
        {/* ==================== HOME PAGE ==================== */}
        {activeTab === "Home" && (
          <div className="relative overflow-hidden">
            {/* HERO HERO HERO */}
            <div className="relative py-20 lg:py-32 bg-slate-950 text-white overflow-hidden">
              {/* Background gradient blur */}
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-900/30 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none" />
              
              {/* Floating Paw particles simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/10 w-2 h-2 bg-white rounded-full animate-pulse-subtle" />
                <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-float-slow" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-float-medium" />
                <div className="absolute top-3/4 right-1/10 w-3.5 h-3.5 bg-white rounded-full animate-pulse-subtle" />
              </div>

              <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-8 text-left">
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase animate-float-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    Welfare SaaS 2.0 Platform
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                    Every Stray Deserves <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">
                      A Connected Safe Haven.
                    </span>
                  </h1>

                  <p className="text-slate-400 text-base md:text-lg max-w-2xl font-light leading-relaxed">
                    PawLink combines community compassion with real-time dispatch technology, medical history tracking, smart adoption matching, and direct-to-shelter verified donations to rewrite animal welfare.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Report Injured Animal (Instant)
                    </button>
                    <button 
                      onClick={() => setActiveTab("Adoption")}
                      className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 cursor-pointer"
                    >
                      Browse Adoption Hub
                      <ArrowRight className="w-4 h-4 text-green-700" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-900">
                    <div>
                      <span className="block text-2xl md:text-4xl font-extrabold text-white">12,490+</span>
                      <span className="block text-xs text-slate-500 uppercase tracking-widest font-bold">Rescued Stray Life</span>
                    </div>
                    <div>
                      <span className="block text-2xl md:text-4xl font-extrabold text-white">150+</span>
                      <span className="block text-xs text-slate-500 uppercase tracking-widest font-bold">Partner Shelters</span>
                    </div>
                    <div>
                      <span className="block text-2xl md:text-4xl font-extrabold text-white">99.2%</span>
                      <span className="block text-xs text-slate-500 uppercase tracking-widest font-bold">Dispatch Accuracy</span>
                    </div>
                  </div>
                </div>

                {/* Hero Right Visual Column */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative w-full max-w-md">
                    {/* Floating Glow Frame */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[2.5rem] opacity-30 blur-2xl animate-pulse-subtle" />
                    
                    {/* Floating Small card widget */}
                    <div className="absolute top-4 -left-6 bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-white text-xs flex items-center gap-3 animate-float-slow shadow-xl">
                      <div className="bg-red-600 p-1.5 rounded-lg"><AlertTriangle className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold">Active Dispatch Nearby</p>
                        <p className="text-[10px] text-slate-300">2 min ago • Emergency Level High</p>
                      </div>
                    </div>

                    {/* Floating Small card widget 2 */}
                    <div className="absolute bottom-10 -right-6 bg-green-950/80 backdrop-blur-md border border-green-500/20 p-3.5 rounded-2xl text-white text-xs flex items-center gap-3 animate-float-medium shadow-xl">
                      <div className="bg-emerald-500 p-1.5 rounded-lg text-emerald-950"><Heart className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold">Milo Adopted Today!</p>
                        <p className="text-[10px] text-slate-300">Match calculated in 14ms</p>
                      </div>
                    </div>

                    <img 
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600" 
                      alt="Dog and Cat Welfare" 
                      className="rounded-[2rem] shadow-2xl object-cover w-full h-[380px] md:h-[480px] border border-white/10"
                    />
                  </div>
                </div>
              </div>
              
              {/* Premium wavy wave divisor */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-50" style={{ clipPath: "polygon(0 100%, 100% * 100%, 100% 100%, 0 0)" }} />
            </div>

            {/* QUICK STEPS TIMELINE SECTION */}
            <section className="py-20 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Unified Architecture</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">How PawLink Rewrites Animal Welfare</h2>
                  <p className="text-slate-500">A connected three-tier system combining citizens, rescue squads, and professional clinics into one high-performance dashboard.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                  {/* Connective line helper */}
                  <div className="hidden md:block absolute top-[40%] left-1/6 right-1/6 h-[2px] bg-slate-200 -z-1" />

                  {[
                    { step: "01", title: "Smart Citizens Report", desc: "Spotted an animal in need? Take a photo, state location, and set priority level in seconds.", icon: <AlertTriangle className="w-6 h-6 text-red-600" />, bg: "bg-red-50" },
                    { step: "02", title: "AI Dispatcher Network", desc: "PawLink algorithms route cases immediately to nearby active volunteer responders with real-time tracking.", icon: <Activity className="w-6 h-6 text-green-700" />, bg: "bg-green-50" },
                    { step: "03", title: "Safe Rehabilitation", desc: "Animals are brought to veterinary partners, medical records are synced, and adoption profiles are auto-generated.", icon: <Heart className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50" }
                  ].map((it, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-left relative"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${it.bg} flex items-center justify-center mb-6`}>
                        {it.icon}
                      </div>
                      <span className="absolute top-6 right-8 text-4xl font-extrabold text-slate-100">{it.step}</span>
                      <h3 className="text-xl font-bold mb-3">{it.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{it.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* LIVE DATA PREVIEWS GRID */}
            <section className="py-20 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="space-y-2 text-left">
                    <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Real-Time Activity Hub</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Active In Your Neighborhood</h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab("Rescue")}
                    className="flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800 transition-colors"
                  >
                    View Rescue Dispatch Board
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left Column: Live Emergency Feed (7 Cols) */}
                  <div className="lg:col-span-7 bg-slate-900 text-slate-100 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                        <h3 className="font-extrabold text-lg">Live Rescue Feed</h3>
                      </div>
                      <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {rescues.length} Active Incidents
                      </span>
                    </div>

                    <div className="space-y-4">
                      {rescueFetchLoading ? (
                        <div className="p-6 rounded-2xl border border-slate-800/70 bg-slate-800/40 text-slate-300 text-sm">
                          Loading rescue feed...
                        </div>
                      ) : rescueFetchError ? (
                        <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm">
                          {rescueFetchError}
                        </div>
                      ) : rescues.length === 0 ? (
                        <div className="p-6 rounded-2xl border border-slate-800/70 bg-slate-800/40 text-slate-300 text-sm">
                          No active rescue incidents available right now.
                        </div>
                      ) : (
                        rescues.slice(0, 3).map((res) => (
                          <div 
                            key={res.id} 
                            onClick={() => { setActiveTab("Rescue"); setActiveTrackingId(res.id); }}
                            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 cursor-pointer group"
                          >
                          <img src={res.image} className="w-16 h-16 object-cover rounded-xl border border-slate-700 group-hover:scale-105 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                res.emergencyLevel === "Critical" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}>
                                {res.emergencyLevel}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {res.timeline[res.timeline.length-1].time}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm truncate">{res.description}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-green-400" />
                              {res.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-lg font-bold">
                              {res.status}
                            </span>
                          </div>
                        </div>
                      ))) }
                    </div>
                  </div>

                  {/* Right Column: Active Adoption Spotlight (5 Cols) */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-green-50 to-emerald-50/40 p-6 md:p-8 rounded-3xl border border-green-100 flex flex-col justify-between text-left shadow-sm">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Spotlight Pet</span>
                        <div className="bg-green-700 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <Heart className="w-3 h-3 fill-current" /> Adoptable
                        </div>
                      </div>

                      <img src={pets[0].image} className="w-full h-48 object-cover rounded-2xl shadow-md border border-white" />

                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900">{pets[0].name}</h3>
                        <p className="text-sm text-green-800 font-semibold mb-2">{pets[0].breed} • {pets[0].age}</p>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{pets[0].story}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button 
                        onClick={() => { setSelectedPet(pets[0]); setActiveTab("Adoption"); }}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer text-center block"
                      >
                        Apply for Adoption
                      </button>
                      <button 
                        onClick={(e) => toggleSavePet(pets[0].id, e)}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-3 rounded-xl transition-all"
                      >
                        <Heart className={`w-4 h-4 ${savedPetIds.includes(pets[0].id) ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURE CARDS BLOCK */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Uncompromised Quality</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Standard Features Redefined</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "24/7 Verified Dispatch", desc: "No delays or static phone trees. Digitally reported emergencies route instantaneously with satellite data.", icon: <Activity className="w-5 h-5 text-green-700" /> },
                    { title: "Unified Medical Ledger", desc: "Vaccinations, clinical treatment summaries, and medication tracking synchronized across doctors.", icon: <Shield className="w-5 h-5 text-emerald-600" /> },
                    { title: "Probabilistic Alerts", desc: "AI matching system aggregates microchips, breed traits, and location matrix markers to scan lost pets.", icon: <Bell className="w-5 h-5 text-amber-500" /> },
                    { title: "Transparent Audit Logs", desc: "Every dollar donated can be traced to shelter invoices, medical expenditures, or food procurement logs.", icon: <FileText className="w-5 h-5 text-sky-500" /> }
                  ].map((feat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left hover:-translate-y-1 transition-all">
                      <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                        {feat.icon}
                      </div>
                      <h4 className="font-bold mb-2 text-slate-900">{feat.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PARTNERS & HERO TRUST STORIES */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-12">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">In Collaboration With Regional Giants</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                  <div className="font-black text-xl text-slate-400 flex items-center justify-center gap-1"><Shield className="w-5 h-5" /> GREEN HAVEN FOUNDATION</div>
                  <div className="font-black text-xl text-slate-400 flex items-center justify-center gap-1"><Heart className="w-5 h-5 text-red-500" /> APEX WILD RESCUE</div>
                  <div className="font-black text-xl text-slate-400 flex items-center justify-center gap-1"><Activity className="w-5 h-5" /> METRO CLINCAL GROUP</div>
                  <div className="font-black text-xl text-slate-400 flex items-center justify-center gap-1"><Users className="w-5 h-5" /> COMPASSION ALLIANCE</div>
                </div>
              </div>
            </section>

            {/* NGO VOLUNTEERS CALLOUT CARD */}
            <section className="py-16 bg-slate-900 text-slate-100 mx-4 md:mx-8 my-10 rounded-[2.5rem] relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-green-900/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-5xl mx-auto px-8 py-10 relative z-10 grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <span className="text-xs font-bold uppercase text-green-400 tracking-wider">Become a Registered Lifesaver</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Want to rescue, dispatch, or sponsor animals?</h3>
                  <p className="text-slate-400 text-sm max-w-xl font-light">Join 2,400+ active volunteer responders who carry the field emergency bags, handle transport logistics, and assist shelters during distress events.</p>
                </div>
                <div className="md:col-span-4 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setActiveTab("Volunteers")}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-4 px-6 rounded-2xl text-xs transition-all text-center cursor-pointer shadow-lg shadow-green-900/30"
                  >
                    View Mission Board
                  </button>
                  <button 
                    onClick={onNavigateToSignup}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-extrabold py-4 px-6 rounded-2xl text-xs transition-all text-center cursor-pointer"
                  >
                    Join Registered Ranks
                  </button>
                </div>
              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section className="py-20 bg-slate-50 border-t border-slate-100 text-left">
              <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Help Directory</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Got Questions? We Have Answers.</h2>
                </div>

                <div className="space-y-4">
                  {FAQ_DATA.map((faq, idx) => {
                    const isOpen = faqOpenIdx === idx;
                    return (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <button 
                          onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                          className="w-full px-6 py-4 flex justify-between items-center text-left font-bold text-slate-900 hover:bg-slate-50/50 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-2"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ==================== ABOUT PAGE ==================== */}
        {activeTab === "About" && (
          <div className="py-16 md:py-24 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Our Genesis</span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">Rewriting Stray Welfare from the Ground Up</h1>
              <p className="text-slate-600 text-lg leading-relaxed font-light">PawLink began as a local field dispatch script trying to optimize volunteer coordinates during rescue emergencies. Today, we stand as the ultimate high-precision web interface for pet rescue, loss mitigation, clinical tracking, and ngo fundraising.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <img src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl w-full h-[360px] object-cover" />
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Our Core Philosophy</h3>
                <p className="text-slate-500 text-sm leading-relaxed">We believe compassion without proper organization leads to inefficiencies. Too many injured animals suffer because dispatch phone chains are broken. Too many donations are lost to administrative overhead because of opaque tracing structures. PawLink provides the underlying software protocol to make animal care fast, transparent, and beautiful.</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                    <span><strong>Real-time Priority Mapping:</strong> Instantly sorting incidents into severity bands.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                    <span><strong>Traceable Charity Flow:</strong> Direct donor auditing directly connected with shelter needs.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                    <span><strong>SaaS Medical Ledger:</strong> Unifying medical records between volunteer transport groups and hospitals.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TIMELINE ARCHITECTURE */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8">
              <h3 className="text-2xl font-bold text-center">PawLink System Milestones</h3>
              <div className="border-l-2 border-slate-800 ml-4 md:ml-8 pl-6 space-y-8 text-left max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-green-500 border-4 border-slate-900" />
                  <span className="text-xs font-bold text-green-400">JULY 2024</span>
                  <h4 className="font-bold text-base">The Field Dispatch Pilot</h4>
                  <p className="text-slate-400 text-xs">Initially launched as a simple GPS alert tool in Sector 4, helping dispatch 3 local responders to injured strays.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900" />
                  <span className="text-xs font-bold text-emerald-400">MARCH 2025</span>
                  <h4 className="font-bold text-base">The Medical Ledger Standard</h4>
                  <p className="text-slate-400 text-xs">Partnered with 12 major veterinary clinics to sync medication, triage protocols, and discharge profiles onto the PawLink servers.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-green-700 border-4 border-slate-900 animate-pulse" />
                  <span className="text-xs font-bold text-green-500">TODAY (2026)</span>
                  <h4 className="font-bold text-base">PawLink Unified Platform</h4>
                  <p className="text-slate-400 text-xs">Managing over 12,000+ happy adoption placements, $180k+ in audited charity, and 24/7 high-priority live telemetry coverage.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SERVICES PAGE ==================== */}
        {activeTab === "Services" && (
          <div className="py-16 md:py-24 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Our Services</span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Engineered Services, Humane Outcomes</h1>
              <p className="text-slate-500">We don't do static listings. We build highly efficient operational services connecting distress reports directly with responsive actions.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "24/7 Trauma Dispatch", desc: "Our primary flagship dispatch protocol. Handles citizen geolocation pings, formats the distress reports, and notifies regional responder trucks instantly.", icon: <Activity className="w-8 h-8 text-red-600" /> },
                { title: "Unified Veterinary Health Link", desc: "A robust digital ledger tracking vaccinations, treatments, and prescriptions. Instantly transferable to any shelter or adoptive home via secure QR codes.", icon: <Shield className="w-8 h-8 text-green-700" /> },
                { title: "AI-Matching Adoption Protocol", desc: "No endless scrolling. Our recommendation system matches a pet's energy, space requirements, and diet traits to your home profile in seconds.", icon: <Sparkles className="w-8 h-8 text-amber-500" /> },
                { title: "Microchip Lost Alerts", desc: "Syncs directly with global scanning networks. If your microchipped lost pet is scanned anywhere, coordinates are mapped to your dashboard.", icon: <Bell className="w-8 h-8 text-sky-500" /> },
                { title: "Audited Shelter Crowdfunding", desc: "Direct-to-cause crowdfunding. No corporate pocket pools. Funds go straight to buying medicine, insulating kennels, or dispatching responders.", icon: <DollarSign className="w-8 h-8 text-emerald-600" /> },
                { title: "Field Academy & Certificates", desc: "A detailed micro-training curriculum for citizens wishing to learn animal first aid, safe slip-lead application, and disaster evacuation protocols.", icon: <Award className="w-8 h-8 text-purple-600" /> }
              ].map((serv, index) => (
                <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    {serv.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{serv.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{serv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== RESCUE DISPATCH BOARD ==================== */}
        {activeTab === "Rescue" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-red-600 flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                  Live Incident Room
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Emergency Incident Dispatch</h1>
                <p className="text-slate-500 mt-1">Real-time status tracking for animal welfare emergencies, citizen reports, and vehicle routing telemetry.</p>
              </div>
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-md shadow-red-900/10 cursor-pointer"
              >
                File Emergency Report
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Side: Incident List (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-2">Active Incidents ({rescues.length})</h3>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                  {rescues.map((res) => {
                    const isSelected = activeTrackingId === res.id || (!activeTrackingId && rescues[0].id === res.id);
                    return (
                      <div 
                        key={res.id}
                        onClick={() => setActiveTrackingId(res.id)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative ${
                          isSelected 
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                            : "bg-white text-slate-900 border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex gap-4">
                          <img src={res.image} className="w-14 h-14 object-cover rounded-xl shrink-0 border border-slate-100" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                res.emergencyLevel === "Critical" 
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}>
                                {res.emergencyLevel}
                              </span>
                              <span className={`text-[10px] font-bold ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                                {res.timeline[res.timeline.length-1]?.time || "Just now"}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm truncate">{res.petType} Distress Report</h4>
                            <p className={`text-xs truncate ${isSelected ? "text-slate-400" : "text-slate-500"}`}>{res.location}</p>
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            res.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {res.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: High Fidelity Tracking Console (7 Cols) */}
              <div className="lg:col-span-7">
                {(() => {
                  const currentIncident = rescues.find(r => r.id === activeTrackingId) || rescues[0];
                  if (!currentIncident) return <div className="p-8 text-center text-slate-400">No incident selected</div>;
                  
                  return (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Incident Code: {currentIncident.id}</span>
                          <h2 className="text-xl font-extrabold text-slate-900">{currentIncident.petType} - Geolocation Rescue</h2>
                        </div>
                        <span className="bg-red-50 text-red-700 text-xs font-extrabold px-3 py-1 rounded-full border border-red-100 animate-pulse">
                          Live Active Case
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <img src={currentIncident.image} className="w-full h-48 object-cover rounded-2xl shadow-sm border border-slate-100" />
                        <div className="space-y-4 text-xs text-slate-600">
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="font-extrabold block text-slate-900">Reporter Information</span>
                            <p className="mt-1">{currentIncident.reporter} • {currentIncident.reporterPhone}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <span className="font-extrabold block text-slate-900">Assigned First Responder</span>
                            {currentIncident.assignedVolunteer ? (
                              <div className="flex items-center gap-2 mt-2">
                                <img src={currentIncident.assignedVolunteer.avatar} className="w-6 h-6 rounded-full object-cover" />
                                <div>
                                  <p className="font-bold text-slate-950 text-[11px]">{currentIncident.assignedVolunteer.name}</p>
                                  <p className="text-[10px]">{currentIncident.assignedVolunteer.phone}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-amber-600 italic mt-1">Pending responder deployment...</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest block">Distress Log description</span>
                        <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                          "{currentIncident.description}"
                        </p>
                      </div>

                      {/* Timeline flow */}
                      <div className="space-y-4">
                        <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest block">Telemetry Dispatch History</span>
                        <div className="border-l-2 border-slate-100 ml-3 space-y-6">
                          {currentIncident.timeline.map((item, idx) => (
                            <div key={idx} className="relative pl-6 text-left">
                              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-green-600 border-2 border-white shadow-sm" />
                              <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                                <span>{item.status}</span>
                                <span className="text-slate-400 font-mono">{item.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {currentIncident.status !== "Completed" && (
                        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-green-800 font-medium">Want to coordinate dispatch with Markus Aurel?</p>
                            {rescueActionError && (
                              <p className="text-xs text-red-600 mt-2">{rescueActionError}</p>
                            )}
                            {rescueActionSuccess && (
                              <p className="text-xs text-green-700 mt-2">{rescueActionSuccess}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              disabled={rescueActionLoading}
                              onClick={() => handleAcceptRescue(currentIncident.id)}
                              className="bg-green-700 hover:bg-green-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer"
                            >
                              {rescueActionLoading ? "Processing..." : "Accept Rescue"}
                            </button>
                            <button 
                              disabled={rescueActionLoading || currentIncident.status === "Completed"}
                              onClick={() => handleCompleteRescue(currentIncident.id)}
                              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer"
                            >
                              {rescueActionLoading ? "Processing..." : "Complete Rescue"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ==================== LOST & FOUND ==================== */}
        {activeTab === "Lost & Found" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-green-700 mb-2 block">Pet Recovery Module</span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Lost & Found Directory</h1>
                <p className="text-slate-500 mt-1">Submit visual profiles of stray sightings or lost personal pets. Matches are automatically suggested using vision tags.</p>
              </div>
              <button 
                onClick={() => setShowLostModal(true)}
                className="bg-green-700 hover:bg-green-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-md shadow-green-900/10 cursor-pointer"
              >
                Register Pet Alert
              </button>
            </div>

            {/* Filter tags & search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
                {["All", "Lost", "Found"].map(t => (
                  <button 
                    key={t}
                    onClick={() => setLfFilter(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      lfFilter === t ? "bg-green-700 text-white" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t} Pets
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="Search breeds or locations..." 
                  value={searchLF}
                  onChange={e => setSearchLF(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-700"
                />
              </div>
            </div>

            {/* Grid of pets */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostPets
                .filter(p => lfFilter === "All" || p.status === lfFilter)
                .filter(p => searchLF === "" || p.breed.toLowerCase().includes(searchLF.toLowerCase()) || p.lastSeen.toLowerCase().includes(searchLF.toLowerCase()))
                .map((pet) => (
                  <div key={pet.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img src={pet.image} className="w-full h-48 object-cover" />
                      <span className={`absolute top-4 left-4 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                        pet.status === "Lost" ? "bg-red-600 text-white shadow-md" : "bg-green-700 text-white shadow-md"
                      }`}>
                        {pet.status}
                      </span>
                      {pet.reward !== "None" && pet.reward && (
                        <span className="absolute bottom-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                          Reward: {pet.reward}
                        </span>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900">{pet.name || "Stray Identification"}</h3>
                        <p className="text-xs text-green-700 font-bold mb-1">{pet.breed}</p>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {pet.lastSeen}
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {pet.description}
                      </p>

                      <div className="bg-slate-50 p-3 rounded-2xl text-[11px] border border-slate-100 flex justify-between items-center">
                        <div>
                          <span className="block text-slate-400 font-medium">Contact Handler</span>
                          <span className="font-bold text-slate-900">{pet.owner}</span>
                        </div>
                        <a href={`tel:${pet.phone}`} className="bg-white border border-slate-200 hover:bg-slate-50 p-2 rounded-xl text-green-700 transition-colors shadow-sm">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================== ADOPTION GALLERY ==================== */}
        {activeTab === "Adoption" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-green-700 mb-2 block">Match-Based Adoptions</span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Find Your Companion</h1>
                <p className="text-slate-500 mt-1">Browse verified shelter animals ready for transition. Submit structured home environment profiles to qualify.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPetFilter("dog")} 
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    petFilter === "dog" ? "bg-green-700 text-white" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Dogs Only
                </button>
                <button 
                  onClick={() => setPetFilter("cat")} 
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    petFilter === "cat" ? "bg-green-700 text-white" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cats Only
                </button>
                <button 
                  onClick={() => setPetFilter("All")} 
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    petFilter === "All" ? "bg-green-700 text-white" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All Pets
                </button>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets
                .filter(p => petFilter === "All" || p.type === petFilter)
                .map((pet) => (
                  <div 
                    key={pet.id} 
                    onClick={() => setSelectedPet(pet)}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative">
                      <img src={pet.image} className="w-full h-56 object-cover group-hover:scale-102 transition-transform duration-300" />
                      <button 
                        onClick={(e) => toggleSavePet(pet.id, e)}
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white p-2.5 rounded-2xl shadow-md text-slate-600 transition-all cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${savedPetIds.includes(pet.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                      <span className={`absolute bottom-4 left-4 text-[9px] font-extrabold uppercase px-3 py-1 rounded-full text-white shadow-md ${
                        pet.status === "Available" ? "bg-green-700" : "bg-amber-500"
                      }`}>
                        {pet.status}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-green-700 transition-colors">{pet.name}</h3>
                        <p className="text-xs text-slate-400 font-bold">{pet.breed} • {pet.age}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {pet.character.slice(0, 3).map((ch, idx) => (
                          <span key={idx} className="bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-bold px-2.5 py-0.5 rounded-full">
                            {ch}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {pet.story}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[10px] text-slate-400">
                        <span>Vaccinated: {pet.medicalHistory.vaccinated}</span>
                        <span>Neutered: {pet.medicalHistory.neutered}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* ADOPTION APPLICATION DETAIL MODAL */}
            <AnimatePresence>
              {selectedPet && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  >
                    <div className="grid md:grid-cols-2">
                      <div className="relative">
                        <img src={selectedPet.image} className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]" />
                        <span className="absolute top-4 left-4 bg-green-700 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-lg">
                          Spotlight Companion
                        </span>
                      </div>

                      <div className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-3xl font-extrabold text-slate-900">{selectedPet.name}</h2>
                            <p className="text-sm font-semibold text-green-700">{selectedPet.breed} • {selectedPet.age}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedPet(null)}
                            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">About Me</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedPet.story}
                          </p>
                        </div>

                        {/* Application Form panel */}
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4 text-xs">
                          <span className="font-extrabold block text-slate-800">Apply to Adopt {selectedPet.name}</span>
                          
                          {adoptionSuccess ? (
                            <div className="bg-green-100 text-green-800 p-4 rounded-xl font-bold flex items-center gap-2">
                              <Check className="w-5 h-5 shrink-0" /> Application registered successfully! Our matching agent will contact you shortly.
                            </div>
                          ) : (
                            <form onSubmit={handleAdoptionSubmit} className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Full Name" 
                                  required
                                  value={adoptionForm.name}
                                  onChange={e => setAdoptionForm({...adoptionForm, name: e.target.value})}
                                  className="bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-green-700" 
                                />
                                <input 
                                  type="email" 
                                  placeholder="Email Address" 
                                  required
                                  value={adoptionForm.email}
                                  onChange={e => setAdoptionForm({...adoptionForm, email: e.target.value})}
                                  className="bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-green-700" 
                                />
                              </div>
                              <input 
                                type="text" 
                                placeholder="Prior Pet Experience (e.g. Yes, had a lab for 5 years)" 
                                required
                                value={adoptionForm.experience}
                                onChange={e => setAdoptionForm({...adoptionForm, experience: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-green-700" 
                              />
                              <button 
                                type="submit" 
                                className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer"
                              >
                                Submit Application Flow
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ==================== DONATIONS PAGE ==================== */}
        {activeTab === "Donations" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="border-b border-slate-200 pb-8 space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Financial Audit Module</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Direct Charity Hub</h1>
              <p className="text-slate-500">Every donation routes instantly to purchase equipment or cover trauma medical invoices. Monitor expenditure reports live.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {campaigns.map((camp) => {
                const percent = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
                return (
                  <div key={camp.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                    <div>
                      <img src={camp.image} className="w-full h-44 object-cover" />
                      <div className="p-6 space-y-4">
                        <span className="bg-green-50 text-green-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-green-100">
                          {camp.category}
                        </span>
                        <h3 className="font-extrabold text-lg text-slate-900 leading-tight">{camp.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{camp.desc}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 space-y-4">
                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-900">
                          <span>${camp.raised.toLocaleString()} raised</span>
                          <span className="text-green-700">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-green-700 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Goal: ${camp.goal.toLocaleString()}</span>
                          <span>{camp.daysLeft} Days Left</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedCampaign(camp)}
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-3 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                      >
                        Sponsor Campaign
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DONATION HISTORY LIST */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold">Live Contributions Ledger</h3>
                <span className="text-xs text-green-400 font-mono">Blockchain Cryptographic Audit</span>
              </div>
              <div className="space-y-3">
                {donationHistory.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="bg-slate-800/40 border border-slate-800/80 p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold">{tx.campaign}</p>
                      <p className="text-[10px] text-slate-400">{tx.user} • {tx.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-extrabold text-sm">+${tx.amount}</span>
                      <span className="block text-[9px] text-slate-500 font-mono">{tx.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DONATE MODAL */}
            <AnimatePresence>
              {selectedCampaign && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl text-slate-900"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Campaign Gateway</span>
                        <h2 className="text-xl font-extrabold">{selectedCampaign.title}</h2>
                      </div>
                      <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
                    </div>

                    {donationSuccess ? (
                      <div className="space-y-4 text-center py-6">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Contribution Completed!</h3>
                        <p className="text-xs text-slate-500">Thank you for making a difference. A verified cryptographic invoice receipt has been saved in your history ledger.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleDonationSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <span className="block text-xs font-bold text-slate-500">Select Contribution Weight</span>
                          <div className="grid grid-cols-4 gap-2">
                            {[10, 25, 50, 100].map((val) => (
                              <button 
                                key={val}
                                type="button"
                                onClick={() => setDonationAmount(val.toString())}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                  donationAmount === val.toString() ? "bg-green-700 text-white border-green-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                ${val}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input 
                            type="number" 
                            placeholder="Or specify custom amount..." 
                            required
                            value={donationAmount}
                            onChange={e => setDonationAmount(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-green-700"
                          />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-500 space-y-1">
                          <p>✓ 100% direct allocation index</p>
                          <p>✓ Instant tax-exemption certificate generated</p>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-green-700/10"
                        >
                          Execute Payment
                        </button>
                      </form>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ==================== VOLUNTEERS ==================== */}
        {activeTab === "Volunteers" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="border-b border-slate-200 pb-8 space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Citizen Responders</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Active Responders Hub</h1>
              <p className="text-slate-500">Sign up for active animal welfare missions, track volunteer hours, and review the regional rescue points leaderboard.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Leaderboard Table (5 Cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-lg">Top Life Rescuers</h3>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>

                <div className="space-y-4">
                  {MOCK_VOLUNTEERS.leaderboard.map((v) => (
                    <div key={v.rank} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-400 w-4">#{v.rank}</span>
                        <img src={v.avatar} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900">{v.name}</p>
                          <p className="text-[10px] text-slate-400">{v.rescues} rescues • {v.hours} hours</p>
                        </div>
                      </div>
                      <span className="bg-green-50 text-green-700 font-extrabold px-3 py-1 rounded-lg">
                        {v.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Missions (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Active Field Missions</h3>
                <div className="space-y-4">
                  {missions.map((mis) => {
                    const isJoined = joinedMissions.includes(mis.id);
                    return (
                      <div key={mis.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              mis.status === "Urgent" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
                            }`}>
                              {mis.status}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {mis.date}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900">{mis.title}</h4>
                          <p className="text-slate-500 font-medium">{mis.volunteersSigned}/{mis.volunteersNeeded} Responders registered</p>
                        </div>

                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <span className="text-amber-600 font-extrabold block">+{mis.points} pts reward</span>
                          <button 
                            onClick={() => toggleJoinMission(mis.id)}
                            className={`px-4 py-2 rounded-xl font-bold transition-all text-[11px] cursor-pointer shadow-sm ${
                              isJoined 
                                ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-100" 
                                : "bg-green-700 hover:bg-green-800 text-white"
                            }`}
                          >
                            {isJoined ? "Cancel Sign up" : "Register For Mission"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SHELTERS & VETERINARY MAP DIRECTORY ==================== */}
        {activeTab === "Shelters & Vet" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="border-b border-slate-200 pb-8 space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Map Directory</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Facilities Map Locator</h1>
              <p className="text-slate-500">Find vetted partner shelters, certified animal trauma hospitals, and equipment distribution warehouses nearby.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Facilites List (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Verified Facilities Nearby</h3>
                <div className="space-y-3">
                  {MOCK_SHELTERS.map((s) => {
                    const isSelected = selectedShelter.id === s.id;
                    return (
                      <div 
                        key={s.id}
                        onClick={() => setSelectedShelter(s)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                          isSelected ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <h4 className="font-extrabold text-sm">{s.name}</h4>
                        <p className={`text-xs mt-1 ${isSelected ? "text-slate-400" : "text-slate-500"}`}>{s.address}</p>
                        
                        <div className="flex justify-between items-center mt-3 text-[10px]">
                          <span className="font-bold">{s.type}</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${isSelected ? "bg-slate-800 text-green-400" : "bg-green-50 text-green-800"}`}>
                            {s.capacity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Large styled SVG Custom Interactive Map (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Interactive Coordinates Plotter</span>
                  
                  {/* SVG map mock */}
                  <div className="bg-slate-950 rounded-2xl h-80 relative overflow-hidden flex items-center justify-center border border-slate-900">
                    {/* SVG grid lines for matrix tech-style map layout */}
                    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Animated green scanner glow */}
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-green-500/10 to-transparent h-1/2 w-full animate-pulse pointer-events-none" />

                    {/* Plot coordinates */}
                    {MOCK_SHELTERS.map((s) => {
                      const isSelected = selectedShelter.id === s.id;
                      return (
                        <button 
                          key={s.id}
                          onClick={() => setSelectedShelter(s)}
                          style={{ left: `${s.coords.x}%`, top: `${s.coords.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 ${
                            isSelected ? "bg-red-600 text-white z-20 scale-125 shadow-lg animate-bounce" : "bg-green-700 text-white hover:bg-green-600 scale-100"
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      );
                    })}

                    <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-white text-[10px] space-y-1 max-w-xs text-left">
                      <p className="font-extrabold text-green-400">Selected coordinate metrics</p>
                      <p className="font-bold">{selectedShelter.name}</p>
                      <p>{selectedShelter.address}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Dispatch Comms Link</p>
                      <p className="text-slate-500">{selectedShelter.phone}</p>
                    </div>
                    <a href={`tel:${selectedShelter.phone}`} className="bg-green-700 hover:bg-green-800 text-white font-extrabold px-4 py-2 rounded-xl text-[10px] uppercase cursor-pointer">
                      Call Center
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== AWARENESS & EDUCATION ==================== */}
        {activeTab === "Awareness" && (
          <div className="py-16 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="border-b border-slate-200 pb-8 space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Welfare Academy</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Welfare Knowledge Database</h1>
              <p className="text-slate-500">Educate yourself on basic animal trauma care, veterinary emergency protocols, and municipal wildlife protection laws.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Animal First Aid Essentials", author: "Dr. Catherine Shaw", date: "June 2026", desc: "Learn how to dress superficial wounds on stray cats, identify signs of heat exhaustion, and apply safe temporary splints safely.", category: "First Aid", icon: <Activity className="w-5 h-5 text-red-600" /> },
                { title: "Safe Slip-Lead Application", author: "Markus Aurel (Rescue Captain)", date: "May 2026", desc: "Step-by-step masterclass on capturing a scared dog without provoking defensive bites. Understand stress posture indexes.", category: "Field Skills", icon: <Shield className="w-5 h-5 text-green-700" /> },
                { title: "Understanding Stray Population Control", author: "Greenwood Trust Board", date: "April 2026", desc: "An architectural review on Trap-Neuter-Return (TNR) methodologies and how communities can systematically control rabies vectors.", category: "Research", icon: <BookOpen className="w-5 h-5 text-blue-600" /> },
                { title: "Feral Kitten Nutrition Schedules", author: "Elena Rostova", date: "March 2026", desc: "Critical bottle feeding schedules, formula mixing indexes, and hygiene requirements for newborn kittens separated from mothers.", category: "Feline Care", icon: <Heart className="w-5 h-5 text-pink-600" /> },
                { title: "Municipal Animal Cruelty Codes", author: "Legal Aid Alliance", date: "February 2026", desc: "Know your civil rights when reporting neighborhood animal neglect or illegal dog breeding operations to municipal squads.", category: "Welfare Law", icon: <FileText className="w-5 h-5 text-indigo-600" /> }
              ].map((art, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/50">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{art.date}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900">{art.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{art.desc}</p>
                  </div>

                  <div className="border-t border-slate-50 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-400">
                    <span>By {art.author}</span>
                    <button className="text-green-700 font-extrabold uppercase hover:underline flex items-center gap-0.5">Read Article <ArrowUpRight className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== CONTACT PAGE ==================== */}
        {activeTab === "Contact" && (
          <div className="py-16 max-w-4xl mx-auto px-4 md:px-8 text-left space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-green-700">Get In Touch</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Connect With Comms</h1>
              <p className="text-slate-500">Reach our dispatch team, NGO partners, shelter administrators, or technical engineers directly.</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* Contact Details (5 Cols) */}
              <div className="md:col-span-5 bg-slate-900 text-slate-100 rounded-3xl p-8 space-y-6">
                <h3 className="font-extrabold text-xl text-white">Office Telemetry</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <Phone className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-400">Trauma Hotline</p>
                      <p className="text-slate-200">+1 (555) 911-PAWS (Emergency only)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-400">General Enquiries</p>
                      <p className="text-slate-200">comms@pawlink.org</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-400">HQ Coordinate</p>
                      <p className="text-slate-200">404 Broadway, Block B, Sector 9</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form (7 Cols) */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                {contactSuccess ? (
                  <div className="bg-green-100 text-green-800 p-6 rounded-2xl font-bold flex items-center gap-2">
                    <Check className="w-6 h-6 shrink-0" /> Message dispatched! A comms officer will trace back to your coordinate.
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setContactSuccess(true); setTimeout(() => { setContactSuccess(false); setContactForm({ name: "", email: "", msg: "" }); }, 4000); }} className="space-y-4 text-xs text-slate-600">
                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-800">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700 text-xs" 
                        placeholder="Sophia Miller" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-800">Your Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700 text-xs" 
                        placeholder="sophia@domain.com" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-800">Your Enquiry Message</label>
                      <textarea 
                        required
                        rows="4"
                        value={contactForm.msg}
                        onChange={e => setContactForm({...contactForm, msg: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700 text-xs" 
                        placeholder="Write your detailed enquiry here..." 
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-3.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-green-700/10"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================================================== */}
      {/* NEWSLETTER ROW & FOOTER                              */}
      {/* ==================================================== */}
      <footer className="bg-slate-950 text-slate-400 text-xs text-left border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-12 gap-8 border-b border-slate-900">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 p-2 rounded-xl text-slate-950">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">PawLink</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">A professional SaaS animal welfare protocol providing unified telemetry dispatch, shared veterinary logs, and direct-to-shelter audited donations.</p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-extrabold text-white text-sm">System Subviews</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {["Home", "About", "Services", "Rescue", "Lost & Found", "Adoption", "Donations", "Volunteers", "Shelters & Vet", "Awareness", "Contact"].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setActiveTab(sub)}
                  className="text-left hover:text-white transition-colors"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Input Box */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-extrabold text-white text-sm">Join the Dispatch Alerts</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">Receive instant notifications when street dogs/cats in your selected sector require rescue support.</p>
            
            {newsletterSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl font-bold">
                Alert subscription registered!
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setNewsletterSuccess(true); setTimeout(() => { setNewsletterSuccess(false); setNewsletterEmail(""); }, 4000); }} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com" 
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none w-full" 
                />
                <button type="submit" className="bg-green-700 hover:bg-green-600 text-white font-extrabold px-4 py-2.5 rounded-xl cursor-pointer">Join</button>
              </form>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-bold">
          <p>© 2026 PawLink Smart Animal Welfare Protocol. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Telemetry Standards</a>
            <a href="#" className="hover:text-slate-400">NGO Credentials</a>
          </div>
        </div>
      </footer>

      {/* ==================================================== */}
      {/* DISTRESS REPORT FORM MODAL                           */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl text-slate-900 text-left space-y-6"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                  <div>
                    <h2 className="text-xl font-extrabold">Emergency Rescue Report</h2>
                    <p className="text-[10px] text-slate-400">Direct Comms to Regional Dispatchers</p>
                  </div>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleReportRescue} className="space-y-4 text-xs text-slate-600">
                {rescueError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-[11px]">
                    {rescueError}
                  </div>
                )}
                {rescueSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl text-[11px]">
                    {rescueSuccess}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Liam Oswald"
                      value={newRescue.reporter}
                      onChange={e => setNewRescue({...newRescue, reporter: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Contact Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +1 (555) 782-1201"
                      value={newRescue.phone}
                      onChange={e => setNewRescue({...newRescue, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Animal Classification</label>
                    <select 
                      value={newRescue.petType}
                      onChange={e => setNewRescue({...newRescue, petType: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none text-xs"
                    >
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Wildlife / Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Emergency Severity Band</label>
                    <select 
                      value={newRescue.emergencyLevel}
                      onChange={e => setNewRescue({...newRescue, emergencyLevel: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none text-xs"
                    >
                      <option>Critical (Collision, bleeding)</option>
                      <option>High (Trapped, fever, pregnant)</option>
                      <option>Medium (Stray, minor limp)</option>
                      <option>Low (Vaccination inquiry)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800">Physical Location Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Greenwood Rd, next to Block C construction gate"
                    value={newRescue.location}
                    onChange={e => setNewRescue({...newRescue, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800">Symptom / Context Description</label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Describe how the animal looks, any visible injuries, behavior traits, or if it can walk..."
                    value={newRescue.description}
                    onChange={e => setNewRescue({...newRescue, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-700" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={rescueLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-red-900/15 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {rescueLoading ? "Sending rescue report..." : "Dispatch Alerts to Network"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* REGISTER LOST PET FORM MODAL                         */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showLostModal && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl text-slate-900 text-left space-y-6"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-green-700 animate-bounce" />
                  <div>
                    <h2 className="text-xl font-extrabold">Register Recovery Alert</h2>
                    <p className="text-[10px] text-slate-400">Automated computer vision scanning active</p>
                  </div>
                </div>
                <button onClick={() => setShowLostModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleReportLost} className="space-y-4 text-xs text-slate-600">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Pet Name (if lost)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Coco"
                      value={newLost.name}
                      onChange={e => setNewLost({...newLost, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Alert Classification</label>
                    <select 
                      value={newLost.status}
                      onChange={e => setNewLost({...newLost, status: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    >
                      <option value="Lost">Lost (Personal Pet)</option>
                      <option value="Found">Found (Stray Sighting)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Breed Profile</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Chihuahua"
                      value={newLost.breed}
                      onChange={e => setNewLost({...newLost, breed: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Microchip ID (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. chip-9021-99"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800">Last Seen Coordinate Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 7th Avenue, near Central Park"
                    value={newLost.lastSeen}
                    onChange={e => setNewLost({...newLost, lastSeen: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Jessica Miller"
                      value={newLost.owner}
                      onChange={e => setNewLost({...newLost, owner: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800">Your Phone Link</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +1 (555) 381-0291"
                      value={newLost.phone}
                      onChange={e => setNewLost({...newLost, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800">Reward Weight (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $500"
                    value={newLost.reward}
                    onChange={e => setNewLost({...newLost, reward: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800">Detailed Visual Profile Marks</label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Describe collar markings, skin/fur marks, tail size, or special behavior markers..."
                    value={newLost.description}
                    onChange={e => setNewLost({...newLost, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold py-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-green-700/10"
                >
                  Activate Recovery Search Matrix
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
