const categoryIcon = {
  "museum": "🏛️",
  "art gallery": "🎨",
  "zoo": "🦁",
  "theme park": "🎡",
  "tourist attraction": "📍",
  "viewpoint": "🌄",
  "picnic spot": "🧺",
  "park / nature": "🌿",
  "garden": "🌸",
  "sports centre": "🏃",
  "cafe": "☕",
  "restaurant": "🍽️",
  "shopping mall": "🛍️",
  "heritage / historic": "🏰",
  
};

export default function PlaceCard({ place }) {
  if (!place) return null;

  const rating =
    place.rating !== null && place.rating !== undefined
      ? place.rating
      : "N/A";

  const icon =
    categoryIcon[place.category?.toLowerCase()] || "📍";

  return (
    <div className="rounded-xl border border-white/8 bg-white/4 p-5 backdrop-blur transition hover:border-white/15 hover:bg-white/7">

      {/* Category icon + label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-medium capitalize text-slate-400">
          {place.category || "Attraction"}
        </span>
      </div>

      {/* Place name */}
      <h3 className="text-base font-bold text-white leading-snug">
        {place.name || "Unnamed Place"}
      </h3>

      {/* Rating + weather score */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-yellow-400"></span>
        {place.weatherScore !== undefined && (
          <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs text-green-300">
            {place.weatherScore}% weather match
          </span>
        )}
      </div>

      {/* Address */}
      {place.address && (
        <p className="mt-3 text-xs leading-5 text-slate-400">
          📍 {place.address}
        </p>
      )}

      {/* Maps link */}
      {place.mapsUrl && (
        <a
          href={place.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          View on Google Maps ↗
        </a>
      )}

    </div>
  );
}
