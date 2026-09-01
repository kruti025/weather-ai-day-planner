"use client";

export default function Itinerary({ itinerary, location }) {
  const currentPlan = itinerary?.itinerary || itinerary;

  if (!currentPlan) return null;

  return (
    <div className="space-y-5">

      {/* ============================================= */}
      {/* TODAY'S ITINERARY */}
      {/* ============================================= */}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">

        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Personalized Day Plan
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            🗓️ Today&apos;s Itinerary
          </h2>
        </div>

        {/* Summary */}
        {currentPlan?.summary && (
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/8 px-5 py-4">
            <p className="text-sm leading-6 text-slate-300">
              {currentPlan.summary}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="grid gap-4 md:grid-cols-3">
          <TimeCard title="🌅 Morning" accent="blue" data={currentPlan?.morning} city={location} />
          <TimeCard title="☀️ Afternoon" accent="amber" data={currentPlan?.afternoon} city={location} />
          <TimeCard title="🌆 Evening" accent="purple" data={currentPlan?.evening} city={location} />
        </div>

      </div>

      {/* ============================================= */}
      {/* CARRY + PRECAUTIONS */}
      {/* ============================================= */}

      <div className="grid gap-4 md:grid-cols-2">

        {/* What to Carry */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="font-bold text-white flex items-center gap-2">
            🎒 <span>What to Carry</span>
          </h3>
          {currentPlan?.carry?.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {currentPlan.carry.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-0.5 text-blue-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No specific items recommended.</p>
          )}
        </div>

        {/* Weather Precautions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="font-bold text-white flex items-center gap-2">
            ⚠️ <span>Weather Precautions</span>
          </h3>
          {currentPlan?.precautions?.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {currentPlan.precautions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-0.5 text-yellow-400">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No major weather precautions.</p>
          )}
        </div>

      </div>

      {/* ============================================= */}
      {/* BEST TIME */}
      {/* ============================================= */}

      {currentPlan?.bestTime && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur flex items-center gap-4">
          <div className="text-2xl shrink-0">🕐</div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Best Time to Go Out
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              {currentPlan.bestTime}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}


/* ================================================= */
/* TIME CARD                                         */
/* ================================================= */

const accentMap = {
  blue:   { border: "border-blue-500/30",   bg: "bg-blue-500/8",   text: "text-blue-400"   },
  amber:  { border: "border-amber-500/30",  bg: "bg-amber-500/8",  text: "text-amber-400"  },
  purple: { border: "border-purple-500/30", bg: "bg-purple-500/8", text: "text-purple-400" },
};

function TimeCard({ title, accent = "blue", data, city }) {
  if (!data) return null;

  const placeName = data?.place || "Featured Location";
  const { border, bg, text } = accentMap[accent];

  const searchQuery = encodeURIComponent(
    city ? `${placeName}, ${city}` : placeName
  );
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-5 flex flex-col justify-between gap-4`}>

      {/* Title + time */}
      <div className="flex flex-col gap-1">
        <h3 className={`font-bold ${text}`}>{title}</h3>
        {data?.time && (
          <span className="text-xs text-slate-400">🕐 {data.time}</span>
        )}
      </div>

      {/* Place */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 text-base font-semibold text-white hover:text-blue-400 transition"
      >
        <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-blue-400">
          {placeName}
        </span>
        <span className="text-xs text-slate-500 group-hover:text-blue-400 transition">↗</span>
      </a>

      {/* Activity */}
      {data?.activity && (
        <div className="rounded-lg border border-white/5 bg-white/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Activity
          </p>
          <p className="mt-1 text-sm text-slate-200">{data.activity}</p>
        </div>
      )}

      {/* Reason */}
      {(data?.reason || data?.description) && (
        <p className="text-xs leading-5 text-slate-400 border-t border-white/5 pt-3">
          💡 {data.reason || data.description}
        </p>
      )}

    </div>
  );
}
