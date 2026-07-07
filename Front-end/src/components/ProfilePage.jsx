import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Shield, User, Mail, Phone, MapPin, FileText, Award, Camera,
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, Trash2, Lock
} from "lucide-react";
import { getProfile, updateProfile, uploadAvatar, deleteAvatar, updatePassword } from "../api/user";
import { resolveAssetUrl } from "../api/client";

export default function ProfilePage({ onNavigateBack, onUserUpdated }) {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", bio: "", licenseId: "" });

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch the real profile from the backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getProfile();
        if (!mounted) return;
        setProfile(user);
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          bio: user.bio || "",
          licenseId: user.licenseId || "",
        });
      } catch (err) {
        if (mounted) setError(err.message || "Could not load your profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      onUserUpdated && onUserUpdated(updated);
      setSuccessMsg("Profile saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPick = () => fileInputRef.current && fileInputRef.current.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setError("");
    setSuccessMsg("");
    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
      onUserUpdated && onUserUpdated(updated);
      setSuccessMsg("Profile image updated.");
    } catch (err) {
      setError(err.message || "Could not upload image.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    setError("");
    setSuccessMsg("");
    setUploadingAvatar(true);
    try {
      const updated = await deleteAvatar();
      setProfile(updated);
      onUserUpdated && onUserUpdated(updated);
      setSuccessMsg("Profile image removed.");
    } catch (err) {
      setError(err.message || "Could not remove image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErr("");
    setPasswordMsg("");
    if (!currentPassword || !newPassword) {
      setPasswordErr("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErr("New password must be at least 6 characters long.");
      return;
    }
    setChangingPassword(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPasswordMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordErr(err.message || "Could not update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs font-bold">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold text-slate-900">My Profile</span>
          </div>
        </div>

        {/* Top-level feedback banners */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 text-xs text-red-600 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2 text-xs text-green-700 font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Avatar + identity card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6"
        >
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
              {profile.avatar ? (
                <img src={resolveAssetUrl(profile.avatar)} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-slate-300" />
              )}
            </div>
            <button
              type="button"
              onClick={handleAvatarPick}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 bg-green-700 hover:bg-green-600 text-white p-2 rounded-full shadow-lg cursor-pointer transition-colors disabled:opacity-60"
              title="Upload new photo"
            >
              {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-extrabold text-slate-900">{profile.name}</h2>
            <p className="text-xs text-slate-500 mt-1">{profile.email}</p>
            <span className="inline-block mt-2 text-[10px] bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full border border-green-100 uppercase tracking-wider">
              {profile.role}
            </span>
            {profile.avatar && (
              <div className="mt-3">
                <button
                  onClick={handleAvatarRemove}
                  disabled={uploadingAvatar}
                  className="text-[11px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 mx-auto md:mx-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove photo
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Editable profile details */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSave}
          className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 text-left"
        >
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-50 pb-3">Profile Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="City, Region"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            {(profile.role === "Responder" || profile.role === "NGO") && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Credentials / Licensing ID</label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={form.licenseId}
                    onChange={handleChange("licenseId")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bio / Extra Information</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  value={form.bio}
                  onChange={handleChange("bio")}
                  rows={4}
                  maxLength={500}
                  placeholder="Tell the community a little about yourself..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">{form.bio.length}/500</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-green-700 hover:bg-green-600 text-white font-extrabold py-3 px-8 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-700/10 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.form>

        {/* Password change */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm text-left"
        >
          <button
            type="button"
            onClick={() => setShowPasswordForm((s) => !s)}
            className="w-full flex items-center justify-between text-sm font-extrabold text-slate-900 cursor-pointer"
          >
            <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> Change Password</span>
            <span className="text-xs text-slate-400 font-bold">{showPasswordForm ? "Hide" : "Show"}</span>
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
              {passwordErr && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 text-xs text-red-600 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {passwordErr}
                </div>
              )}
              {passwordMsg && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2 text-xs text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4 shrink-0" /> {passwordMsg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
