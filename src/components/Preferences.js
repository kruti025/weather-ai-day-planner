"use client";

export default function Preferences({ preferences, setPreferences, onGenerate }) {

  const handleBudgetChange = (e) => {
    setPreferences((prev) => ({ ...prev, budget: e.target.value }));
  };

  const handlePaceChange = (e) => {
    setPreferences((prev) => ({ ...prev, pace: e.target.value }));
  };

  const handleInterestChange = (interest) => {
    setPreferences((prev) => {
      const currentInterests = prev.interests || [];
      const alreadySelected = currentInterests.includes(interest);
      return {
        ...prev,
        interests: alreadySelected
          ? currentInterests.filter((item) => item !== interest)
          : [...currentInterests, interest],
      };
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur space-y-6">

      <div>
        <h2 className="text-xl font-semibold text-white">Your Trip Preferences</h2>
        <p className="mt-1 text-sm text-slate-400">Tell the AI what kind of day you prefer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm text-slate-400 mb-2">Budget Level</label>
          <select
            value={preferences?.budget || "moderate"}
            onChange={handleBudgetChange}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="budget">Low Budget ($)</option>
            <option value="moderate">Moderate ($)</option>
            <option value="luxury">Luxury ($$)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Trip Pace</label>
          <select
            value={preferences?.pace || "moderate"}
            onChange={handlePaceChange}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="relaxed">Relaxed</option>
            <option value="moderate">Moderate</option>
            <option value="fast">Packed / Fast</option>
          </select>
        </div>

      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-3">What are you interested in?</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {["Heritage", "Food", "Nature", "Beach", "Shopping", "Museums", "Adventure"].map((interest) => {
            const selected = preferences?.interests?.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestChange(interest)}
                className={`rounded-lg border p-3 text-sm font-medium transition ${
                  selected
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                }`}
              >
                {selected ? "✓ " : ""}{interest}
              </button>
            );
          })}
        </div>
      </div>

      {(preferences?.interests?.length > 0 || preferences?.budget || preferences?.pace) && (
        <div className="rounded-lg border border-white/5 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            AI will consider
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences?.budget && (
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                Budget: {preferences.budget}
              </span>
            )}
            {preferences?.pace && (
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                Pace: {preferences.pace}
              </span>
            )}
            {preferences?.interests?.map((interest) => (
              <span key={interest} className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onGenerate}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
      >
        ✨ Generate Weather-Based Itinerary
      </button>

    </div>
  );
}
