"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Navbar } from "@/components/Navbar";
import { LogoutModal } from "@/components/LogoutModal";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Camera, ShieldCheck, Eye, EyeOff, User, GraduationCap,
  LogOut, Loader2, ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "", email: "", phone: "", role: "STUDENT"
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Class selection
  const [selectedClass, setSelectedClass] = useState("");

  // Password
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const classOptions = [
    { value: "", label: "Select your class" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1),
      label: `Class ${i + 1}`,
    })),
  ];

  // Fetch initial data
  useEffect(() => {
    apiFetch(`${API_URL}/auth/me`, {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        const user = data.data;
        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "STUDENT"
        });
        setProfileImage(user.profile_image || null);
        if (user.class_level) {
          setSelectedClass(String(user.class_level));
          localStorage.setItem("praxes_selected_class", String(user.class_level));
        }
      })
      .catch(() => { })
      .finally(() => setPageLoading(false));
  }, []);

  // Handle class change
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("praxes_selected_class", value);
    }
    apiFetch(`${API_URL}/auth/update-profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ class_level: parseInt(value) }),
    }).catch(() => { });
  };

  // Upload profile image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiFetch(`${API_URL}/upload/profile-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        const imageUrl = json.data.url;
        setProfileImage(imageUrl);

        // Save image to profile immediately
        apiFetch(`${API_URL}/auth/update-profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ profile_image: imageUrl }),
        }).catch(() => { });
      }
    } catch { }
    setUploadingImage(false);
  };

  // Save profile
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await apiFetch(`${API_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update profile");
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err: any) {
      setProfileError(err.message);
    }
    setProfileSaving(false);
  };

  // Change password
  const handlePwdChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);
    if (pwdForm.next !== pwdForm.confirm) { setPwdError("New passwords do not match."); return; }
    if (pwdForm.next.length < 8) { setPwdError("Password must be at least 8 characters."); return; }

    setPwdSaving(true);
    try {
      const res = await apiFetch(`${API_URL}/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update password");

      setPwdSuccess(true);
      setPwdForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwdSuccess(false), 2500);
    } catch (err: any) {
      setPwdError(err.message);
    }
    setPwdSaving(false);
  };

  // Logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await apiFetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch { }
    setLogoutLoading(false);
    router.push("/auth/login");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const initials = profileForm.name ? profileForm.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          title="Profile"
          subtitle="Manage your account"
          profileImage={profileImage}
          userName={profileForm.name}
        />

        <div className="p-5 lg:p-8 max-w-4xl mx-auto">
          <div className="mb-6 flex">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft size={14} /> Back
            </Button>
          </div>
          {/* Avatar + Stats */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-lg shadow-md border border-gray-100 flex items-center justify-center hover:bg-brand-50 transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 size={13} className="text-brand-500 animate-spin" />
                  ) : (
                    <Camera size={13} className="text-gray-500" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{profileForm.name}</h2>
                <p className="text-sm text-gray-500">{profileForm.email}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full capitalize">
                  <ShieldCheck size={12} /> {profileForm.role.toLowerCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {/* {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-bold text-brand-600">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))} */}
              </div>
            </div>
          </Card>

          {/* Class Selection - Only for Students */}
          {profileForm.role === "STUDENT" && (
            <Card className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-brand-500" /> Class Selection
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Select your current class level. This determines which tests and content you see.
              </p>
              <div className="max-w-xs">
                <Select
                  label="Your Class"
                  options={classOptions}
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                />
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-5 mb-6">
            {/* Personal Info */}
            <Card>
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <User size={16} className="text-brand-500" /> Personal Information
              </h2>
              {profileError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm">
                  ✓ Profile updated successfully!
                </div>
              )}
              <form onSubmit={handleProfileSave} className="space-y-4">
                <Input label="Full Name" value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                <Input type="email" label="Email Address" value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
                <Input type="tel" label="Phone Number" value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 00000 00000" />
                <Button type="submit" disabled={profileSaving}>
                  {profileSaving ? "Saving…" : "Save Changes"}
                </Button>
              </form>
            </Card>

            {/* Change Password */}
            <Card>
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-500" /> Change Password
              </h2>
              {pwdSuccess && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm">✓ Password changed!</div>
              )}
              {pwdError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{pwdError}</div>
              )}
              <form onSubmit={handlePwdChange} className="space-y-4">
                <div className="relative">
                  <Input type={showCurrent ? "text" : "password"} label="Current Password" value={pwdForm.current}
                    onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))} placeholder="Enter current password" required />
                  <button type="button" onClick={() => setShowCurrent((p) => !p)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <Input type={showNext ? "text" : "password"} label="New Password" value={pwdForm.next}
                    onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))} placeholder="At least 8 characters" required />
                  <button type="button" onClick={() => setShowNext((p) => !p)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                    {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <Input type="password" label="Confirm New Password" value={pwdForm.confirm}
                  onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))} placeholder="Re-enter new password" required />
                <Button type="submit" disabled={pwdSaving}>
                  {pwdSaving ? "Updating…" : "Update Password"}
                </Button>
              </form>
            </Card>
          </div>


          {/* Logout */}
          <Card className="border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <LogOut size={16} className="text-red-500" /> Logout
                </h2>
                <p className="text-xs text-gray-500 mt-1">Sign out of your account</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setShowLogout(true)}>
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        loading={logoutLoading}
      />
    </>
  );
}
