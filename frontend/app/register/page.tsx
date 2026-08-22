"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    city: "", country: "",
    bio: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#07090c",
        padding: "32px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
        top: "-15%", right: "-10%", pointerEvents: "none",
        animation: "orbDrift 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)",
        bottom: "-10%", left: "-8%", pointerEvents: "none",
        animation: "orbDrift 18s ease-in-out infinite 5s",
      }} />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "40px 36px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
          position: "relative",
          zIndex: 1,
        }}
      >


        {/* Avatar upload */}
        <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              cursor: "pointer",
              position: "relative",
              background: avatar ? "transparent" : "rgba(20,184,166,0.07)",
              border: "2.5px solid rgba(45,212,191,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transition: "all 0.25s",
              animation: "avatarPulse 3s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(45,212,191,0.85)";
              e.currentTarget.style.background = avatar ? "transparent" : "rgba(20,184,166,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(45,212,191,0.4)";
              e.currentTarget.style.background = avatar ? "transparent" : "rgba(20,184,166,0.07)";
            }}
          >
            <input
              ref={fileRef}
              id="reg-avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              style={{ display: "none" }}
            />
            {avatar ? (
              <>
                <img src={avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <svg width="28" height="28" fill="none" stroke="rgba(45,212,191,0.65)" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span style={{ fontSize: 9, color: "rgba(45,212,191,0.55)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Photo
                </span>
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            {avatar ? "Click to change photo" : "Upload profile photo"}
          </span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Create Account
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Join millions of travelers worldwide
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Row 1: First + Last */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field id="reg-first-name" placeholder="First Name" value={form.firstName} onChange={(v) => set("firstName", v)}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <Field id="reg-last-name" placeholder="Last Name" value={form.lastName} onChange={(v) => set("lastName", v)}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
          </div>

          {/* Row 2: Email + Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field id="reg-email" type="email" placeholder="Email Address" value={form.email} onChange={(v) => set("email", v)} required
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <Field id="reg-phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={(v) => set("phone", v)}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            />
          </div>

          {/* Row 3: City + Country */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field id="reg-city" placeholder="City" value={form.city} onChange={(v) => set("city", v)}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <Field id="reg-country" placeholder="Country" value={form.country} onChange={(v) => set("country", v)}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          {/* Additional Info */}
          <TextArea
            id="reg-bio"
            placeholder="Additional Information ...."
            value={form.bio}
            onChange={(v) => set("bio", v)}
          />

          {/* Submit */}
          <button
            id="btn-register-submit"
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "rgba(20,184,166,0.4)" : "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              border: "none", borderRadius: 10, color: "#fff",
              fontSize: 15, fontWeight: 700, fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)",
              marginTop: 4,
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.boxShadow = "0 6px 28px rgba(20,184,166,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading
              ? <><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }}><path strokeLinecap="round" d="M12 4a8 8 0 0 1 8 8" /></svg>Creating account...</>
              : <>Register Users <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
            }
          </button>
        </form>

        {/* Login link */}
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" id="link-go-to-login"
            style={{ color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ─── Shared components ───── */
function Field({
  id, type = "text", placeholder, value, onChange, icon, required,
}: {
  id: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon: React.ReactNode;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{
        position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
        color: focused ? "#2dd4bf" : "rgba(255,255,255,0.25)",
        transition: "color 0.2s", display: "flex", alignItems: "center", pointerEvents: "none",
      }}>
        {icon}
      </span>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        style={{
          width: "100%",
          padding: "12px 12px 12px 34px",
          background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(45,212,191,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 10,
          color: "#fff",
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(45,212,191,0.1)" : "none",
        }}
      />
    </div>
  );
}

function TextArea({ id, placeholder, value, onChange }: {
  id: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rows={4}
      style={{
        width: "100%",
        padding: "13px 14px",
        background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(45,212,191,0.45)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 10,
        color: "#fff",
        fontSize: 13,
        fontFamily: "inherit",
        outline: "none",
        resize: "vertical",
        transition: "all 0.2s",
        boxShadow: focused ? "0 0 0 3px rgba(45,212,191,0.1)" : "none",
        minHeight: 100,
      }}
    />
  );
}
