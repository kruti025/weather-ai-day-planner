export default function WeatherCard({ weather, location }) {
  if (!weather) return null;

  const city = weather.city || location || "Unknown Location";
  const description = weather.description || weather.condition || "Clear";
  const temp = weather.temperature ?? weather.temp ?? "--";
  const feelsLike = weather.feelsLike ?? weather.feels_like ?? "--";
  const humidity = weather.humidity ?? 0;
  const windSpeed = weather.windSpeed ?? weather.wind ?? 0;
  const clouds = weather.clouds ?? 0;
  const pressure = weather.pressure ?? 0;
  const rainChance = weather.rainChance ?? 0;

  // Dynamic tint based on condition
  const cond = description.toLowerCase();

  const tint =
    cond.includes("rain") || cond.includes("drizzle")
      ? "from-blue-900/40 to-slate-900/60"
      : cond.includes("cloud")
      ? "from-slate-700/40 to-slate-900/60"
      : cond.includes("thunder") || cond.includes("storm")
      ? "from-purple-900/40 to-slate-900/60"
      : cond.includes("snow")
      ? "from-sky-900/40 to-slate-900/60"
      : "from-amber-900/30 to-slate-900/60";

  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${tint} p-6 backdrop-blur`}>

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Today&apos;s Weather
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {city}
            {weather.country && (
              <span className="ml-2 text-base font-normal text-slate-400">
                {weather.country}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-sm capitalize text-slate-300">
            {description}
          </p>
        </div>

        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={description}
            className="h-20 w-20 drop-shadow-lg"
          />
        )}
      </div>

      {/* TEMPERATURE */}
      <div className="mb-6 flex items-end gap-4">
        <p className="text-6xl font-bold text-white leading-none">
          {temp}°
          <span className="text-3xl text-slate-300">C</span>
        </p>
        <div className="mb-1">
          <p className="text-xs text-slate-400">Feels like</p>
          <p className="text-lg font-semibold text-white">{feelsLike}°C</p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mb-5 h-px bg-white/10" />

      {/* WEATHER STATS */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <WeatherInfo label="💧 Humidity" value={`${humidity}%`} />
        <WeatherInfo label="💨 Wind" value={`${windSpeed} m/s`} />
        <WeatherInfo label="☁️ Clouds" value={`${clouds}%`} />
        <WeatherInfo label="🌡️ Pressure" value={`${pressure} hPa`} />
        <WeatherInfo label="Rain chance" value={`${rainChance}%`} />
      </div>

    </div>
  );
}

function WeatherInfo({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/5 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
