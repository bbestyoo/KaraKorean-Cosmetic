"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, MapPin, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Address = {
  id: string;
  label?: string;
  line1: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export default function AccountPage() {
  const { user, isLoggedIn } = useAuth();
  const [active, setActive] = useState<"profile" | "addresses" | "settings">("profile");
  const [profile, setProfile] = useState({ name: "Jane Doe", email: "jane@example.com", phone: "+1 (555) 123-4567" });
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", label: "Home", line1: "123 Main St", city: "Springfield", state: "CA", zip: "90210", country: "USA" },
  ]);
  const [newAddress, setNewAddress] = useState<Address>({ id: "", label: "", line1: "", city: "", state: "", zip: "", country: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...profile, addresses }),
      });
      const json = await res.json();
      if (res.ok) setStatus({ type: "success", message: "Profile updated" });
      else setStatus({ type: "error", message: json?.error || "Update failed" });
    } catch (err) {
      setStatus({ type: "error", message: "Network error" });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddress.line1) {
      setStatus({ type: "error", message: "Address line required" });
      setTimeout(() => setStatus(null), 2000);
      return;
    }
    const addr = { ...newAddress, id: String(Date.now()) };
    const updated = [...addresses, addr];
    setAddresses(updated);
    setNewAddress({ id: "", label: "", line1: "", city: "", state: "", zip: "", country: "" });
    try {
      await fetch("/api/account/update", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...profile, addresses: updated }) });
    } catch (_) {
      /* ignore */
    }
    setStatus({ type: "success", message: "Address added" });
    setTimeout(() => setStatus(null), 2000);
  }

  async function handleDeleteAddress(id: string) {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    try {
      await fetch("/api/account/update", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...profile, addresses: updated }) });
    } catch (_) {
      /* ignore */
    }
    setStatus({ type: "success", message: "Address removed" });
    setTimeout(() => setStatus(null), 2000);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const res = await fetch("/api/account/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(passwords) });
      const json = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Password changed" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setStatus({ type: "error", message: json?.error || "Change failed" });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error" });
    } finally {
      setChangingPassword(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  useEffect(() => {
    if (isLoggedIn && user) {
      setProfile((p) => ({
        name: (user.username || user.name) ?? p.name,
        email: user.email ?? p.email,
        phone: user.phone ?? p.phone,
      }));
    }
  }, [isLoggedIn, user]);

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100">
              <Image src="/images/model1.png" alt="User avatar" fill className="object-cover" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{profile.name}</h3>
            <p className="text-sm text-neutral-500">{profile.email}</p>
          </div>

          <nav className="mt-6 space-y-2">
            <button onClick={() => setActive("profile")} className={`w-full text-left px-3 py-2 rounded-md ${active === "profile" ? "bg-[#0f3b2b] text-white" : "text-neutral-700 hover:bg-neutral-100"}`}>
              <User className="inline mr-2" /> Profile
            </button>
            <button onClick={() => setActive("addresses")} className={`w-full text-left px-3 py-2 rounded-md ${active === "addresses" ? "bg-[#0f3b2b] text-white" : "text-neutral-700 hover:bg-neutral-100"}`}>
              <MapPin className="inline mr-2" /> Addresses
            </button>
            <button onClick={() => setActive("settings")} className={`w-full text-left px-3 py-2 rounded-md ${active === "settings" ? "bg-[#0f3b2b] text-white" : "text-neutral-700 hover:bg-neutral-100"}`}>
              <Settings className="inline mr-2" /> Settings
            </button>
          </nav>
        </aside>

        <section className="md:col-span-3 bg-white border rounded-lg p-6 shadow-sm">
          {status && <div className={`mb-4 p-3 rounded ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{status.message}</div>}

          {active === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600">Full name</span>
                  <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="mt-1 p-3 border rounded-md" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600">Email</span>
                  <input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="mt-1 p-3 border rounded-md" />
                </label>
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-neutral-600">Phone</span>
                  <input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="mt-1 p-3 border rounded-md" />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving} className="px-6 py-3 bg-[#0f3b2b] text-white rounded-md font-semibold hover:opacity-95">
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button type="button" onClick={() => { setProfile({ name: "Jane Doe", email: "jane@example.com", phone: "+1 (555) 123-4567" }); setStatus({ type: "info", message: "Changes reverted" }); setTimeout(() => setStatus(null), 2000); }} className="px-4 py-3 border rounded-md">
                  Reset
                </button>
              </div>
            </form>
          )}

          {active === "addresses" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Addresses</h2>
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start justify-between p-4 border rounded-md">
                    <div>
                      <div className="font-semibold">{addr.label || "Address"}</div>
                      <div className="text-sm text-neutral-600">{addr.line1}</div>
                      <div className="text-sm text-neutral-600">{addr.city}, {addr.state} {addr.zip}</div>
                      <div className="text-sm text-neutral-600">{addr.country}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => { navigator.clipboard?.writeText(`${addr.line1}, ${addr.city}`); setStatus({ type: "success", message: "Address copied" }); setTimeout(() => setStatus(null), 2000); }} className="text-sm text-neutral-600 hover:text-black">
                        Copy
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm text-red-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Label (Home, Work)" value={newAddress.label} onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))} className="p-3 border rounded-md" />
                <input placeholder="Address line" value={newAddress.line1} onChange={(e) => setNewAddress((p) => ({ ...p, line1: e.target.value }))} className="p-3 border rounded-md md:col-span-2" />
                <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))} className="p-3 border rounded-md" />
                <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))} className="p-3 border rounded-md" />
                <input placeholder="ZIP" value={newAddress.zip} onChange={(e) => setNewAddress((p) => ({ ...p, zip: e.target.value }))} className="p-3 border rounded-md" />
                <input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress((p) => ({ ...p, country: e.target.value }))} className="p-3 border rounded-md" />
                <div className="md:col-span-2 flex items-center gap-3">
                  <button type="submit" className="px-5 py-3 bg-[#0f3b2b] text-white rounded-md">Add address</button>
                </div>
              </form>
            </div>
          )}

          {active === "settings" && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h2 className="text-xl font-semibold">Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600">Current password</span>
                  <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} className="mt-1 p-3 border rounded-md" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-600">New password</span>
                  <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} className="mt-1 p-3 border rounded-md" />
                </label>
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-neutral-600">Confirm new password</span>
                  <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))} className="mt-1 p-3 border rounded-md" />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={changingPassword} className="px-6 py-3 bg-[#0f3b2b] text-white rounded-md font-semibold">
                  {changingPassword ? "Updating..." : "Change password"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
