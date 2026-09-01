import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  // Check location
  if (!location?.trim()) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }

  // Check API key
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ WEATHER_API_KEY is missing.");
    return NextResponse.json({ error: "Missing WEATHER_API_KEY on server" }, { status: 500 });
  }

  try {
    // Fetch from OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ OpenWeather Error:", data);
      return NextResponse.json(
        { error: data.message || "City not found" },
        { status: res.status }
      );
    }

    // Normalize weather data
    const temperature = Math.round(data.main?.temp ?? 0);
    const feelsLike = Math.round(data.main?.feels_like ?? 0);
    const humidity = data.main?.humidity ?? 0;
    const windSpeed = data.wind?.speed ?? 0;
    const clouds = data.clouds?.all ?? 0;
    const pressure = data.main?.pressure ?? 0;
    const description = data.weather?.[0]?.description ?? "Clear";
    const icon = data.weather?.[0]?.icon ?? "";

    // Rain data (actual mm, not probability)
    const rain1h = data.rain?.["1h"] ?? 0;
    const rain3h = data.rain?.["3h"] ?? 0;

    // Coordinates
    const latitude = data.coord?.lat ?? null;
    const longitude = data.coord?.lon ?? null;

    // Forecast rain probability for the next available 3-hour period
    let rainChance = 0;
    if (latitude !== null && longitude !== null) {
      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const forecastRes = await fetch(forecastUrl, { cache: "no-store" });

        if (forecastRes.ok) {
          const forecastData = await forecastRes.json();
          rainChance = Math.round((forecastData.list?.[0]?.pop ?? 0) * 100);
        }
      } catch (forecastError) {
        console.warn("Rain chance forecast unavailable:", forecastError);
      }
    }

    // Extra info
    const country = data.sys?.country ?? "";
    const sunrise = data.sys?.sunrise ?? null;
    const sunset = data.sys?.sunset ?? null;

    return NextResponse.json({
      city: data.name,
      country,
      latitude,
      longitude,
      temperature,
      feelsLike,
      humidity,
      windSpeed,
      clouds,
      pressure,
      description,
      icon,
      rain1h,
      rain3h,
      rainChance,
      sunrise,
      sunset,
    });

  } catch (error) {
    console.error("❌ Weather Fetch Exception:", error);
    return NextResponse.json({ error: "Failed to connect to weather service" }, { status: 500 });
  }
}
