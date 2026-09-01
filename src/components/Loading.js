export default function Loading() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">

      {/* Spinning ring */}
      <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-white/10 border-t-blue-400 animate-spin" />

      <h2 className="text-lg font-semibold text-white">
        Building your day plan...
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Checking weather, finding nearby places, and crafting your itinerary.
      </p>

    </div>
  );
}
