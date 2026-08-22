"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
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
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
        top: "-10%", left: "-10%", pointerEvents: "none",
        animation: "orbDrift 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)",
        bottom: "-10%", right: "-5%", pointerEvents: "none",
        animation: "orbDrift 15s ease-in-out infinite 4s",
      }} />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "40px 36px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
          position: "relative",
          zIndex: 1,
        }}
      >

        {/* Static avatar display — no upload */}
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "rgba(20,184,166,0.08)",
              border: "2px solid rgba(45,212,191,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "avatarPulse 3s ease-in-out infinite",
            }}
          >
            <svg width="38" height="38" fill="none" stroke="rgba(45,212,191,0.55)" strokeWidth={1.3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4, fontFamily: "inherit" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Email */}
          <Field
            id="login-email"
            type="email"
            placeholder="Username / Email"
            value={email}
            onChange={setEmail}
            required
            icon={
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* Password */}
          <div style={{ position: "relative" }}>
            <Field
              id="login-password"
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              required
              paddingRight={46}
              icon={
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <button
              type="button"
              id="toggle-password"
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", padding: 0,
              }}
            >
              {showPwd
                ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              }
            </button>
          </div>

          {/* Forgot password */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/forgot-password" id="link-forgot-password"
              style={{ fontSize: 12, color: "#2dd4bf", textDecoration: "none", fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <PrimaryButton id="btn-login-submit" loading={loading} label="Login" />
        </form>

        {/* Sign up */}
        <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          New here?{" "}
          <Link href="/register" id="link-go-to-register"
            style={{ color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ─── Shared components ─────────────────────────── */

function Field({
  id, type, placeholder, value, onChange, icon, required, paddingRight,
}: {
  id: string; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon: React.ReactNode;
  required?: boolean; paddingRight?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{
        position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
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
          padding: "13px 16px 13px 40px",
          paddingRight: paddingRight ?? 16,
          background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(45,212,191,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 10,
          color: "#fff",
          fontSize: 14,
          fontFamily: "inherit",
          outline: "none",
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(45,212,191,0.1)" : "none",
        }}
      />
    </div>
  );
}

function PrimaryButton({ id, loading, label }: { id: string; loading: boolean; label: string }) {
  return (
    <button
      id={id} type="submit" disabled={loading}
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
        ? <><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }}><path strokeLinecap="round" d="M12 4a8 8 0 0 1 8 8" /></svg> Signing in...</>
        : <>{label} <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
      }
    </button>
  );
}
