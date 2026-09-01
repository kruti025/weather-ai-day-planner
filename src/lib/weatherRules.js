export function calculateWeatherScore(weather, category) {
  const condition = (weather?.description || weather?.condition || "").toLowerCase();
  const temperature = Number(weather?.temperature ?? weather?.temp ?? 25);
  const categoryName = (category || "").toLowerCase();

  let score = 50;

  // Rainy weather
  if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) {
    if (categoryName.includes("museum") || categoryName.includes("indoor") || categoryName.includes("mall") || categoryName.includes("cafe") || categoryName.includes("restaurant") || categoryName.includes("cinema")) {
      score += 40;
    }
    if (categoryName.includes("park") || categoryName.includes("garden") || categoryName.includes("beach") || categoryName.includes("outdoor")) {
      score -= 35;
    }
  }

  // Hot weather
  if (temperature >= 32) {
    if (categoryName.includes("museum") || categoryName.includes("mall") || categoryName.includes("indoor") || categoryName.includes("cafe") || categoryName.includes("cinema")) {
      score += 25;
    }
    if (categoryName.includes("park") || categoryName.includes("hiking") || categoryName.includes("outdoor")) {
      score -= 20;
    }
  }

  // Pleasant weather
  if (
    temperature >= 20 &&
    temperature <= 30 &&
    !condition.includes("rain") &&
    !condition.includes("drizzle") &&
    !condition.includes("thunderstorm")
  ) {
    if (categoryName.includes("park") || categoryName.includes("garden") || categoryName.includes("beach") || categoryName.includes("heritage") || categoryName.includes("landmark") || categoryName.includes("outdoor")) {
      score += 25;
    }
  }

  // Severe weather
  if (condition.includes("storm") || condition.includes("thunder")) {
    if (categoryName.includes("outdoor") || categoryName.includes("park") || categoryName.includes("beach")) {
      score -= 50;
    }
  }

  return Math.max(0, Math.min(100, score));
}
