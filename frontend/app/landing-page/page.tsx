"use client";

import { useState, useMemo } from "react";

interface Trip {
  id: string;
  title: string;
  region: string;
  location: string;
  date: string;
  status: "Completed" | "Upcoming" | "Draft";
}

const REGIONS = [
  { id: "europe", name: "Europe", count: 12 },
  { id: "asia", name: "Asia", count: 8 },
  { id: "americas", name: "Americas", count: 15 },
  { id: "africa", name: "Africa", count: 5 },
  { id: "oceania", name: "Oceania", count: 4 },
];

const INITIAL_TRIPS: Trip[] = [
  {
    id: "1",
    title: "Summer in Paris",
    region: "Europe",
    location: "France",
    date: "July 2024",
    status: "Completed",
  },
  {
    id: "2",
    title: "Tokyo Culinary Odyssey",
    region: "Asia",
    location: "Japan",
    date: "October 2024",
    status: "Completed",
  },
  {
    id: "3",
    title: "Patagonia Expedition",
    region: "Americas",
    location: "Chile & Argentina",
    date: "March 2025",
    status: "Upcoming",
  },
  {
    id: "4",
    title: "Safari & Victoria Falls",
    region: "Africa",
    location: "Zimbabwe",
    date: "December 2025",
    status: "Draft",
  },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState("");
  const [newTripRegion, setNewTripRegion] = useState("Europe");
  const [newTripLocation, setNewTripLocation] = useState("");
  const [newTripDate, setNewTripDate] = useState("");

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle || !newTripLocation) return;
    const newTrip: Trip = {
      id: Date.now().toString(),
      title: newTripTitle,
      region: newTripRegion,
      location: newTripLocation,
      date: newTripDate || "Upcoming",
      status: "Upcoming",
    };
    setTrips([newTrip, ...trips]);
    setNewTripTitle("");
    setNewTripLocation("");
    setNewTripDate("");
    setIsModalOpen(false);
  };

  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const matchesSearch =
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          selectedFilter === "all" ||
          trip.status.toLowerCase() === selectedFilter.toLowerCase();

        const matchesRegion =
          !selectedRegion ||
          trip.region.toLowerCase() === selectedRegion.toLowerCase();

        return matchesSearch && matchesFilter && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "region") return a.region.localeCompare(b.region);
        return 0; // Default order
      });
  }, [trips, searchQuery, selectedFilter, selectedRegion, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans pb-20">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">GlobeTrotter</h1>
        <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-medium text-gray-600">
          U
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-6">
        {/* Banner Image */}
        <section className="w-full h-48 sm:h-64 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 font-semibold text-lg sm:text-xl">
          Banner Image
        </section>

        {/* Search & Controls Bar */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search bar --"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Group By */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">Group by --</option>
              <option value="region">Region</option>
              <option value="status">Status</option>
            </select>

            {/* Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">Filter: All</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="draft">Draft</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="recent">Sort by --</option>
              <option value="title">Title</option>
              <option value="region">Region</option>
            </select>
          </div>
        </section>

        {/* Budget Highlights */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Budget Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-gray-500">Total Budget Allocated</span>
              <span className="text-2xl font-bold text-gray-900 mt-1">$5,000</span>
              <span className="text-[11px] text-gray-400 mt-1">Across 4 planned trips</span>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-gray-500">Total Spent</span>
              <span className="text-2xl font-bold text-gray-900 mt-1">$3,250</span>
              <span className="text-[11px] text-gray-500 mt-1">Completed trips</span>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-gray-500">Remaining Travel Fund</span>
              <span className="text-2xl font-bold text-gray-900 mt-1">$1,750</span>
              <span className="text-[11px] text-gray-500 mt-1">Available for upcoming trips</span>
            </div>
          </div>
        </section>

        {/* Top Regional Selections */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Top Regional Selections</h2>
            {selectedRegion && (
              <button
                onClick={() => setSelectedRegion(null)}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear Region Filter ({selectedRegion})
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() =>
                  setSelectedRegion(
                    selectedRegion === region.name ? null : region.name
                  )
                }
                className={`h-24 bg-white border border-gray-300 rounded-lg flex flex-col items-center justify-center p-3 text-center transition-all ${
                  selectedRegion === region.name
                    ? "ring-2 ring-black bg-gray-100"
                    : "hover:border-gray-400"
                }`}
              >
                <div className="w-8 h-8 rounded bg-gray-200 border border-gray-300 mb-1 flex items-center justify-center text-xs text-gray-600">
                  {region.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{region.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Previous Trips */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Previous Trips</h2>
          {filteredTrips.length === 0 ? (
            <div className="h-40 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              No trips match the current filter or search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-3 justify-between"
                >
                  <div className="h-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm font-medium">
                    Trip Image Placeholder
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{trip.region}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          trip.status === "Completed"
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : trip.status === "Upcoming"
                            ? "bg-gray-200 text-gray-800 border-gray-400"
                            : "bg-white text-gray-500 border-gray-300"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base">{trip.title}</h3>
                    <p className="text-xs text-gray-500">{trip.location} • {trip.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Action Button: + Plan a trip */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-black text-white text-sm font-semibold rounded-full border border-black shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <span>+</span>
          <span>Plan a trip</span>
        </button>
      </div>

      {/* Modal: Plan a trip */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-white border border-gray-300 rounded-lg max-w-md w-full p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Plan a New Trip</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTrip} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Trip Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo Odyssey"
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
                <select
                  value={newTripRegion}
                  onChange={(e) => setNewTripRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Americas">Americas</option>
                  <option value="Africa">Africa</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japan"
                  value={newTripLocation}
                  onChange={(e) => setNewTripLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  placeholder="e.g. November 2025"
                  value={newTripDate}
                  onChange={(e) => setNewTripDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded text-sm font-semibold hover:bg-gray-800"
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
