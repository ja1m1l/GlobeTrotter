"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { tripApi, TripData, City } from "@/lib/api";

export default function ItineraryBuilder() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<TripData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCityName, setNewCityName] = useState("");
  const [addingStop, setAddingStop] = useState(false);
  const [activityNote, setActivityNote] = useState("");

  useEffect(() => {
    if (!tripId) return;

    // Fetch trip details
    tripApi
      .getTripById(tripId)
      .then((res) => {
        setTrip(res.trip);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load trip.");
        setLoading(false);
      });

    // Fetch cities list
    tripApi
      .getCities()
      .then((res) => setCities(res.cities || []))
      .catch(() => {});
  }, [tripId]);

  const handleAddStop = async (cityNameToAdd?: string) => {
    const targetCity = cityNameToAdd || newCityName;
    if (!targetCity.trim()) return;

    setAddingStop(true);
    try {
      await tripApi.addTripStop(tripId, { cityName: targetCity.trim() });
      // Refresh trip details
      const updated = await tripApi.getTripById(tripId);
      setTrip(updated.trip);
      setNewCityName("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to add stop.");
    } finally {
      setAddingStop(false);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!confirm("Are you sure you want to remove this stop from your itinerary?")) return;
    try {
      await tripApi.deleteTripStop(tripId, stopId);
      const updated = await tripApi.getTripById(tripId);
      setTrip(updated.trip);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete stop.");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07090c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Loading trip itinerary...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ minHeight: "100vh", background: "#07090c", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 18, color: "#f87171" }}>⚠️ {error || "Trip not found"}</div>
        <button onClick={() => router.push("/")} style={{ padding: "10px 20px", background: "#14b8a6", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer" }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  const startDateFormatted = new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const endDateFormatted = new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#07090c", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 100 }}>
      {/* Background Orbs */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(20,184,166,0.06) 0%,transparent 70%)", top: "-15%", right: "-10%", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,9,12,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer" }}>
          GlobeTrotter
        </button>
        <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          Dashboard
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 28, position: "relative", zIndex: 1 }}>
        {/* Trip Banner Header */}
        <div style={{ width: "100%", borderRadius: 20, background: "linear-gradient(135deg, #0a2a26 0%, #0d3d38 40%, #0f5a52 70%, rgba(20,184,166,0.3) 100%)", border: "1px solid rgba(45,212,191,0.15)", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 11, color: "#2dd4bf", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              Itinerary Builder (Screen 5)
            </span>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{trip.name}</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>
              📅 {startDateFormatted} – {endDateFormatted}
            </p>
            {trip.description && (
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, maxWidth: 650 }}>{trip.description}</p>
            )}
          </div>
        </div>

        {/* Add Stop / City Section */}
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Add City / Destination Stop</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="e.g. Paris, Tokyo, Rome, Zurich..."
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              list="city-options"
              style={{ flex: 1, minWidth: 200, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }}
            />
            {cities.length > 0 && (
              <datalist id="city-options">
                {cities.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            )}
            <button
              onClick={() => handleAddStop()}
              disabled={addingStop || !newCityName.trim()}
              style={{
                padding: "12px 20px",
                background: "linear-gradient(135deg,#14b8a6 0%,#0d9488 100%)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: addingStop || !newCityName.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {addingStop ? "Adding..." : "+ Add Stop"}
            </button>
          </div>

          {/* Quick Add Popular Cities */}
          {cities.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Popular Destinations:</span>
              {cities.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleAddStop(c.name)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "4px 10px", color: "rgba(255,255,255,0.7)", fontSize: 12, cursor: "pointer" }}
                >
                  + {c.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Itinerary Stops Timeline */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
            Trip Stops & Itinerary ({trip.tripStops?.length || 0})
          </h2>

          {(!trip.tripStops || trip.tripStops.length === 0) ? (
            <div style={{ ...cardStyle, padding: "40px 24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
              No stops added to this itinerary yet. Use the form above to add your first destination!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {trip.tripStops.map((stop, idx) => (
                <div key={stop.id} style={{ ...cardStyle, borderLeft: "4px solid #2dd4bf", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#2dd4bf" }}>
                        {idx + 1}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{stop.city.name}</h3>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{stop.city.country} • {stop.city.region}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStop(stop.id)}
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "6px 12px", color: "#f87171", fontSize: 12, cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: 24,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};
