import { calculateWeatherScore } from "./weatherRules";

export async function getNearbyPlaces(latitude, longitude, weather) {
  if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
    throw new Error("Latitude and longitude are required.");
  }

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    throw new Error("Invalid latitude or longitude.");
  }

  const radius = 7000;

  const query = `
[out:json][timeout:30];

(
  node["tourism"](around:${radius},${lat},${lon});
  way["tourism"](around:${radius},${lat},${lon});

  node["leisure"](around:${radius},${lat},${lon});
  way["leisure"](around:${radius},${lat},${lon});

  node["amenity"="cafe"](around:${radius},${lat},${lon});
  node["amenity"="restaurant"](around:${radius},${lat},${lon});

  node["shop"="mall"](around:${radius},${lat},${lon});
  way["shop"="mall"](around:${radius},${lat},${lon});

  node["historic"](around:${radius},${lat},${lon});
  way["historic"](around:${radius},${lat},${lon});
);

out center tags;
`;

  const overpassServers = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
  ];

  let data = null;
  let lastError = null;

  for (const server of overpassServers) {
    try {
      console.log(`Trying Overpass server: ${server}`);

      const response = await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Weather-AI-Day-Planner/1.0",
        },
        body: "data=" + encodeURIComponent(query),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`Overpass server failed: ${server}`, errorText);
        lastError = new Error(`Overpass server returned ${response.status}`);
        continue;
      }

      data = await response.json();
      console.log(`Overpass success: ${server}`);
      break;
    } catch (error) {
      console.error(`Overpass connection failed: ${server}`, error);
      lastError = error;
    }
  }

  if (!data) {
    throw new Error("Unable to find nearby places. All OpenStreetMap services are currently unavailable.");
  }

  const places = (data.elements || [])
    .map((place) => {
      const tags = place.tags || {};
      const placeLat = place.lat ?? place.center?.lat ?? null;
      const placeLon = place.lon ?? place.center?.lon ?? null;

      if (placeLat === null || placeLon === null) return null;

      const name = tags.name || tags["name:en"] || null;
      if (!name) return null;

      const category = getCategory(tags);
      const weatherScore = calculateWeatherScore(weather, category);
      const distance = calculateDistance(lat, lon, placeLat, placeLon);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${placeLat}, ${placeLon}`)}`;

      return {
        id: `${place.type}-${place.id}`,
        name,
        category,
        rating: tags.stars || null,
        address: buildAddress(tags),
        latitude: placeLat,
        longitude: placeLon,
        distance: Math.round(distance),
        mapsUrl,
        weatherScore,
      };
    })
    .filter(Boolean);

  const uniquePlaces = places.filter(
    (place, index, array) =>
      index === array.findIndex((item) => item.name.toLowerCase() === place.name.toLowerCase())
  );

  return uniquePlaces
    .sort((a, b) => {
      if (b.weatherScore !== a.weatherScore) return b.weatherScore - a.weatherScore;
      return a.distance - b.distance;
    })
    .slice(0, 10);
}

function getCategory(tags) {
  if (tags.tourism === "museum") return "Museum";
  if (tags.tourism === "gallery") return "Art Gallery";
  if (tags.tourism === "zoo") return "Zoo";
  if (tags.tourism === "theme_park") return "Theme Park";
  if (tags.tourism === "attraction") return "Tourist Attraction";
  if (tags.tourism === "viewpoint") return "Viewpoint";
  if (tags.tourism === "picnic_site") return "Picnic Spot";
  if (tags.leisure === "park") return "Park / Nature";
  if (tags.leisure === "garden") return "Garden";
  if (tags.leisure === "sports_centre") return "Sports Centre";
  if (tags.amenity === "cafe") return "Cafe";
  if (tags.amenity === "restaurant") return "Restaurant";
  if (tags.shop === "mall") return "Shopping Mall";
  if (tags.historic) return "Heritage / Historic";
  return "Tourist Attraction";
}

function buildAddress(tags) {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
  ].filter(Boolean);
  return parts.join(", ");
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}
