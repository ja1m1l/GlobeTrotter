"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearAuth, getUser, authApi, User } from "@/lib/api";

interface Trip {
  id: string;
  title: string;
  region: string;
  location: string;
  date: string;
  status: "Completed" | "Upcoming" | "Draft";
  coverImage?: string;
}

const REGION_IMAGES: Record<string, string> = {
  Europe: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&auto=format&fit=crop",
  Asia: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&auto=format&fit=crop",
  Americas: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&auto=format&fit=crop",
  Africa: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&auto=format&fit=crop",
  Oceania: "https://images.unsplash.com/photo-1524820197278-540916411e20?w=400&auto=format&fit=crop",
};

const DEFAULT_TRAVEL_IMG = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop";

const REGIONS = [
  { id: "europe", name: "Europe", count: 12 },
  { id: "asia", name: "Asia", count: 8 },
  { id: "americas", name: "Americas", count: 15 },
  { id: "africa", name: "Africa", count: 5 },
  { id: "oceania", name: "Oceania", count: 4 },
];

const INITIAL_TRIPS: Trip[] = [
  { id: "1", title: "Summer in Paris", region: "Europe", location: "France", date: "July 2024", status: "Completed", coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
  { id: "2", title: "Tokyo Culinary Odyssey", region: "Asia", location: "Japan", date: "October 2024", status: "Completed", coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400" },
  { id: "3", title: "Patagonia Expedition", region: "Americas", location: "Chile & Argentina", date: "March 2025", status: "Upcoming", coverImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400" },
  { id: "4", title: "Safari & Victoria Falls", region: "Africa", location: "Zimbabwe", date: "December 2025", status: "Draft", coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Completed: { color: "#2dd4bf", bg: "rgba(45,212,191,0.1)", border: "rgba(45,212,191,0.3)" },
  Upcoming:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  Draft:     { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)" },
};

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Read from cache first to render immediately
    const cached = getUser();
    if (cached) {
      setUser(cached);
    }

    // Verify token & sync user with backend
    authApi.me()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        // Redirect to login if token is expired/invalid
        clearAuth();
        router.push("/login");
      });
  }, [router]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: "", region: "Europe", location: "", date: "" });

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.title || !newTrip.location) return;
    setTrips([{ id: Date.now().toString(), title: newTrip.title, region: newTrip.region, location: newTrip.location, date: newTrip.date || "TBD", status: "Upcoming" }, ...trips]);
    setNewTrip({ title: "", region: "Europe", location: "", date: "" });
    setIsModalOpen(false);
  };

  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          (t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q)) &&
          (selectedFilter === "all" || t.status.toLowerCase() === selectedFilter) &&
          (!selectedRegion || t.region === selectedRegion)
        );
      })
      .sort((a, b) => sortBy === "title" ? a.title.localeCompare(b.title) : sortBy === "region" ? a.region.localeCompare(b.region) : 0);
  }, [trips, searchQuery, selectedFilter, selectedRegion, sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "#07090c", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 100 }}>
      {/* Ambient background orbs */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(20,184,166,0.06) 0%,transparent 70%)", top: "-20%", right: "-10%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(13,148,136,0.05) 0%,transparent 70%)", bottom: "-15%", left: "-10%", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,9,12,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* left space — GlobeTrotter is in layout fixed header */}
        <div />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/admin/login" style={{ textDecoration: "none", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 12px", color: "#f87171", fontSize: 12, fontWeight: 700 }}>
            🔒 Admin Portal
          </Link>
          <Link href="/calendar" style={{ textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>
            📅 Calendar View
          </Link>
          <Link href="/community" style={{ textDecoration: "none", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, padding: "6px 12px", color: "#2dd4bf", fontSize: 12, fontWeight: 700 }}>
            💬 Community Tab
          </Link>
          <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
            {/* User avatar */}
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(20,184,166,0.15)", border: "1.5px solid rgba(45,212,191,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2dd4bf" }}>
              {user?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2dd4bf"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >
              {user?.firstName ?? "Traveler"}
            </span>
          </Link>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 32, position: "relative", zIndex: 1 }}>

        {/* ── Hero Banner ── */}
        <section style={{ width: "100%", borderRadius: 20, background: "linear-gradient(135deg, #0a2a26 0%, #0d3d38 40%, #0f5a52 70%, rgba(20,184,166,0.3) 100%)", border: "1px solid rgba(45,212,191,0.15)", padding: "40px 36px", position: "relative", overflow: "hidden", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.2) 0%,transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(45,212,191,0.7)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Welcome back</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              {user ? `${user.firstName}'s Travel Journal` : "Your Travel Journal"}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{trips.length} trips tracked · {trips.filter(t => t.status === "Upcoming").length} upcoming adventures</p>
          </div>
        </section>

        {/* ── Budget Cards ── */}
        <section>
          <SectionTitle>Budget Highlights</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {[
              { label: "Total Budget", value: "$5,000", sub: "Across 4 planned trips", icon: "💰" },
              { label: "Total Spent", value: "$3,250", sub: "Completed trips", icon: "✈️" },
              { label: "Remaining Fund", value: "$1,750", sub: "Available for upcoming", icon: "🏦" },
            ].map((card) => (
              <div key={card.label} style={glassCard}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.label}</span>
                  <span style={{ fontSize: 20 }}>{card.icon}</span>
                </div>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", display: "block", marginBottom: 4 }}>{card.value}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{card.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Regional Selections ── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <SectionTitle>Top Regional Selections</SectionTitle>
            {selectedRegion && (
              <button onClick={() => setSelectedRegion(null)} style={{ fontSize: 12, color: "#2dd4bf", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Clear ({selectedRegion}) ×
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12 }}>
            {REGIONS.map((r) => {
              const active = selectedRegion === r.name;
              return (
                <button key={r.id} onClick={() => setSelectedRegion(active ? null : r.name)}
                  style={{
                    position: "relative",
                    height: 100,
                    backgroundImage: `url(${REGION_IMAGES[r.name]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: `1.5px solid ${active ? "#2dd4bf" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "12px",
                    transition: "all 0.2s",
                    fontFamily: "inherit"
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  {/* Overlay to ensure text readability */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)", zIndex: 1 }} />
                  <div style={{ position: "relative", zIndex: 2, textAlign: "left", width: "100%" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "block" }}>{r.name}</span>
                    <span style={{ fontSize: 10, color: active ? "#2dd4bf" : "rgba(255,255,255,0.4)" }}>{r.count} trips</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Search + Filters ── */}
        <section style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
            </span>
            <input type="text" placeholder="Search trips..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
            />
          </div>
          {/* Dropdowns */}
          {[
            { value: selectedFilter, onChange: setSelectedFilter, options: [["all","All Status"],["completed","Completed"],["upcoming","Upcoming"],["draft","Draft"]] },
            { value: sortBy, onChange: setSortBy, options: [["recent","Sort: Recent"],["title","Sort: Title"],["region","Sort: Region"]] },
          ].map((sel, i) => (
            <select key={i} value={sel.value} onChange={(e) => sel.onChange(e.target.value)}
              style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "inherit", outline: "none", cursor: "pointer" }}
            >
              {sel.options.map(([v, l]) => <option key={v} value={v} style={{ background: "#0f1214" }}>{l}</option>)}
            </select>
          ))}
        </section>

        {/* ── Trips Grid ── */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.01em", margin: 0 }}>
              {selectedFilter === "all" ? "All Trips" : selectedFilter === "completed" ? "Completed Trips" : selectedFilter === "upcoming" ? "Upcoming Trips" : "Draft Trips"}
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 400, marginLeft: 8 }}>({filteredTrips.length})</span>
            </h2>
            <Link href="/trips" style={{ fontSize: 12, color: "#2dd4bf", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#14b8a6"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#2dd4bf"}
            >
              View Detailed Listing →
            </Link>
          </div>
          {filteredTrips.length === 0 ? (
            <div style={{ ...glassCard, padding: "48px 24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🗺️</div>
              No trips match your current filters.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {filteredTrips.map((trip) => {
                const s = STATUS_STYLE[trip.status];
                return (
                  <div key={trip.id} style={{ ...glassCard, padding: 0, overflow: "hidden", cursor: "pointer", transition: "all 0.25s" }}
                    onClick={() => router.push(`/itinerary/${trip.id}`)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(45,212,191,0.25)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Cover image or fallback */}
                    <div style={{
                      height: 130,
                      backgroundImage: `url(${trip.coverImage || REGION_IMAGES[trip.region] || DEFAULT_TRAVEL_IMG})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%"
                    }} />
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{trip.region}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 99, padding: "2px 8px" }}>
                          {trip.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{trip.title}</h3>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{trip.location} · {trip.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ── FAB ── */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 50 }}>
        <button onClick={() => router.push("/plan-trip")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "linear-gradient(135deg,#14b8a6 0%,#0d9488 100%)", border: "none", borderRadius: 999, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 28px rgba(20,184,166,0.4)", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 36px rgba(20,184,166,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(20,184,166,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Plan a trip
        </button>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div style={{ width: "100%", maxWidth: 420, background: "#0d1014", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 28px 24px", boxShadow: "0 24px 80px rgba(0,0,0,0.7)", animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Plan a New Trip</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 16 }}>×</button>
            </div>
            <form onSubmit={handleAddTrip} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Trip Title", key: "title", placeholder: "e.g. Tokyo Odyssey", required: true },
                { label: "Location", key: "location", placeholder: "e.g. Japan", required: true },
                { label: "Date", key: "date", placeholder: "e.g. November 2025" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder} required={f.required}
                    value={newTrip[f.key as keyof typeof newTrip]}
                    onChange={(e) => setNewTrip((p) => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Region</label>
                <select value={newTrip.region} onChange={(e) => setNewTrip((p) => ({ ...p, region: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                >
                  {REGIONS.map((r) => <option key={r.id} value={r.name} style={{ background: "#0d1014" }}>{r.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#14b8a6 0%,#0d9488 100%)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(20,184,166,0.3)" }}
                >
                  Save Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 14, letterSpacing: "0.01em" }}>
      {children}
    </h2>
  );
}

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "20px",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};
