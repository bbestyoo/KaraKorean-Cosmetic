"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { User, Settings, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
};

export default function AccountPage() {
  const { user, isLoggedIn, token, fetchWithAuth } = useAuth();
  const [active, setActive] = useState<"profile" | "settings">("profile");

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [originalProfile, setOriginalProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldpassword: "",
    password: "",
    password2: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Derive API base URL (same pattern as checkout page)
  const API_BASE_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return base.replace(/\/shop\/?$/, "");
  })();

  // ─── 1. Fetch user info ───────────────────────────────────────────────────
  const fetchUserInfo = useCallback(async () => {
    if (!token) return;

    setLoadingProfile(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/userauth/api/info/`);
      if (res.ok) {
        const data = await res.json();
        const fetched: ProfileData = {
          name: data.name || data.username || "",
          email: data.email || "",
          phone: data.phone || data.phone_number || "",
          address: data.address || data.shipping_address || "",
          city: data.city || "",
        };
        setProfile(fetched);
        setOriginalProfile(fetched);
      } else {
        console.error("Failed to fetch user info:", res.status);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    } finally {
      setLoadingProfile(false);
    }
  }, [API_BASE_URL, fetchWithAuth, token]);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchUserInfo();
    }
  }, [isLoggedIn, token, fetchUserInfo]);

  // ─── 2. Update user info (PATCH) ─────────────────────────────────────────
  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setStatus({ type: "error", message: "You are not authenticated." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/userauth/api/info/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated: ProfileData = {
          name: data.name || data.username || profile.name,
          email: data.email || profile.email,
          phone: data.phone || data.phone_number || profile.phone,
          address: data.address || data.shipping_address || profile.address,
          city: data.city || profile.city,
        };
        setProfile(updated);
        setOriginalProfile(updated);
        setStatus({ type: "success", message: "Profile updated successfully!" });
      } else {
        const errData = await res.json().catch(() => ({}));
        const message =
          typeof errData === "object"
            ? Object.values(errData).flat().join(" ")
            : "Update failed. Please try again.";
        setStatus({ type: "error", message });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
    }
  }

  // ─── Reset form to last fetched data ────────────────────────────────────
  function handleReset() {
    setProfile(originalProfile);
    setStatus({ type: "success", message: "Changes reverted to saved data." });
    setTimeout(() => setStatus(null), 2500);
  }

  // ─── 3. Change password ──────────────────────────────────────────────────
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setPasswordStatus({ type: "error", message: "You are not authenticated." });
      return;
    }

    if (!passwords.oldpassword || !passwords.password || !passwords.password2) {
      setPasswordStatus({ type: "error", message: "All password fields are required." });
      return;
    }

    if (passwords.password !== passwords.password2) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/userauth/api/change-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldpassword: passwords.oldpassword,
          password: passwords.password,
          password2: passwords.password2,
        }),
      });

      if (res.ok) {
        setPasswordStatus({ type: "success", message: "Password changed successfully!" });
        setPasswords({ oldpassword: "", password: "", password2: "" });
      } else {
        const errData = await res.json().catch(() => ({}));
        const message =
          typeof errData === "object"
            ? Object.values(errData).flat().join(" ")
            : "Failed to change password.";
        setPasswordStatus({ type: "error", message });
      }
    } catch (err) {
      setPasswordStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setChangingPassword(false);
      setTimeout(() => setPasswordStatus(null), 4000);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ── Sidebar ── */}
        <aside className="md:col-span-1 bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100">
              <Image src="/images/model1.png" alt="User avatar" fill className="object-cover" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-center">
              {loadingProfile ? (
                <span className="inline-block w-24 h-5 bg-gray-200 rounded animate-pulse" />
              ) : (
                profile.name || user?.username || "—"
              )}
            </h3>
            <p className="text-sm text-neutral-500 text-center mt-1">
              {loadingProfile ? (
                <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
              ) : (
                profile.email || user?.email || ""
              )}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            <button
              onClick={() => setActive("profile")}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${active === "profile"
                ? "bg-[#0f3b2b] text-white"
                : "text-neutral-700 hover:bg-neutral-100"
                }`}
            >
              <User size={16} /> Profile
            </button>
            <button
              onClick={() => setActive("settings")}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${active === "settings"
                ? "bg-[#0f3b2b] text-white"
                : "text-neutral-700 hover:bg-neutral-100"
                }`}
            >
              <Settings size={16} /> Settings
            </button>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <section className="md:col-span-3 bg-white border rounded-lg p-6 shadow-sm">
          {/* ── Profile Tab ── */}
          {active === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Profile</h2>
                {loadingProfile && (
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin" /> Loading…
                  </span>
                )}
              </div>

              {status && (
                <div
                  className={`p-3 rounded text-sm ${status.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                  {status.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600 mb-1">Full name</span>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                    disabled={loadingProfile}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600 mb-1">Email</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Your email"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                    disabled={loadingProfile}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600 mb-1">Phone</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="Your phone number"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                    disabled={loadingProfile}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600 mb-1">City</span>
                  <input
                    value={profile.city}
                    onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Your city"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                    disabled={loadingProfile}
                  />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-neutral-600 mb-1">Address</span>
                  <input
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Your street address"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                    disabled={loadingProfile}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving || loadingProfile}
                  className="px-6 py-3 cursor-pointer bg-[#0f3b2b] text-white rounded-md font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving || loadingProfile}
                  className="px-4 py-3 cursor-pointer border rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          )}

          {/* ── Settings / Change Password Tab ── */}
          {active === "settings" && (
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <h2 className="text-xl font-semibold">Change Password</h2>

              {passwordStatus && (
                <div
                  className={`p-3 rounded text-sm ${passwordStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                  {passwordStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-neutral-600 mb-1">Current password</span>
                  <input
                    type="password"
                    value={passwords.oldpassword}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, oldpassword: e.target.value }))
                    }
                    placeholder="Enter current password"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600 mb-1">New password</span>
                  <input
                    type="password"
                    value={passwords.password}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder="Enter new password"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600 mb-1">Confirm new password</span>
                  <input
                    type="password"
                    value={passwords.password2}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, password2: e.target.value }))
                    }
                    placeholder="Confirm new password"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3b2b]/30"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-3 cursor-pointer bg-[#0f3b2b] text-white rounded-md font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {changingPassword ? "Updating…" : "Change password"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPasswords({ oldpassword: "", password: "", password2: "" })
                  }
                  className="px-4 py-3 cursor-pointer border rounded-md text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
