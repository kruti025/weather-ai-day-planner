"use client";

import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import WeatherCard from "@/components/WeatherCard";
import Preferences from "@/components/Preferences";
import Itinerary from "@/components/Itinerary";
import Loading from "@/components/Loading";
import PlaceCard from "@/components/PlaceCard";

export default function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [preferences, setPreferences] = useState({
    budget: "medium",
    pace: "moderate",
    interests: [],
  });
  const [places, setPlaces] = useState([]);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
//handle search
  const handleSearch = async (searchedLocation) => {
    if (!searchedLocation?.trim()) return;

    setLocation(searchedLocation);
    setLoading(true);
    setError(null);
    setWeather(null);
    setPlaces([]);
    setItinerary(null);

    try {
      const weatherRes = await fetch(
        `/api/weather?location=${encodeURIComponent(searchedLocation)}`,
        { cache: "no-store" }
      );
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) {
        throw new Error(weatherData.error || "Failed to fetch weather data");
      }

      setWeather(weatherData);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (!weather || !location) {
      setError("Please search for a location first.");
      return;
    }

    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, weather, preferences, places }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate itinerary");
      }

      setItinerary(data.itinerary || data);

      if (data.places) {
        setPlaces(data.places);
      }
    } catch (err) {
      console.error("Itinerary Error:", err);
      setError(err.message || "Could not generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020817] text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">

        <header className="text-center space-y-3 py-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400 mb-2">
            ✦ AI-Powered Day Planner
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Weather & Day Planner
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            Real-time weather with a smart itinerary tailored to your day.
          </p>
        </header>

        <div className="flex justify-center">
          <SearchBox onSearch={handleSearch} />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {loading && <Loading />}

        {weather && !loading && (
          <div className="space-y-8">

            <WeatherCard weather={weather} location={location} />

            <Preferences
              preferences={preferences}
              setPreferences={setPreferences}
              onGenerate={handleGenerateItinerary}
            />

            {itinerary && (
              <Itinerary itinerary={itinerary} location={location} />
            )}

            {places.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Recommended Places</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(showAllPlaces ? places : places.slice(0, 2)).map((place, index) => (
                    <PlaceCard key={place.id || index} place={place} />
                  ))}
                </div>

                {places.length > 2 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAllPlaces((prev) => !prev)}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      {showAllPlaces ? "Show less ↑" : `Show all ${places.length} places ↓`}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
