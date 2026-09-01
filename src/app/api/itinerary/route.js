import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getNearbyPlaces } from "@/lib/places";

export async function POST(request) {
  try {
    // 1. Get request data
    const { location, weather, preferences } = await request.json();

    if (!location) {
      return NextResponse.json({ error: "Location is required." }, { status: 400 });
    }

    if (!weather) {
      return NextResponse.json({ error: "Weather data is required." }, { status: 400 });
    }

    // 2. Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    // 3. Get nearby places (optional — AI works without them)
    let nearbyPlaces = [];

    if (
      weather.latitude !== undefined &&
      weather.latitude !== null &&
      weather.longitude !== undefined &&
      weather.longitude !== null
    ) {
      try {
        nearbyPlaces = await getNearbyPlaces(weather.latitude, weather.longitude, weather);
        console.log(`Found ${nearbyPlaces.length} nearby places.`);
      } catch (placesError) {
        console.warn("Nearby places unavailable:", placesError.message);
        nearbyPlaces = [];
      }
    }

    // 4. User preferences
    const budget = preferences?.budget || "medium";
    const pace = preferences?.pace || "moderate";
    const interests = preferences?.interests || [];

    // 5. Prepare places for Gemini
    const placesForAI = nearbyPlaces.map((place) => ({
      name: place.name,
      category: place.category,
      rating: place.rating || "N/A",
      distance: `${place.distance} meters`,
      weatherScore: place.weatherScore,
      address: place.address || "",
      mapsUrl: place.mapsUrl || "",
    }));

    // 6. Create AI prompt
    const prompt = `
You are an expert local travel planner.

Create a personalized ONE-DAY itinerary for:

LOCATION:
${location}

TODAY'S WEATHER:

Temperature:
${weather.temperature}°C

Feels Like:
${weather.feelsLike}°C

Condition:
${weather.description}

Humidity:
${weather.humidity}%

Wind:
${weather.windSpeed} m/s

Clouds:
${weather.clouds}%

Rain:
${weather.rain1h ?? 0} mm


USER PREFERENCES:

Budget:
${budget}

Pace:
${pace}

Interests:
${interests.length ? interests.join(", ") : "General sightseeing"}


NEARBY PLACES FOUND:

${JSON.stringify(placesForAI, null, 2)}


IMPORTANT:

1. The itinerary MUST be based on today's weather.

2. Prefer the nearby places supplied above.

3. NEVER invent a specific place name when
   a nearby-place list is available.

4. If the nearby-place list is empty,
   provide useful activity suggestions
   appropriate for the city and weather,
   but clearly make them general activities
   instead of pretending they are verified
   nearby places.

5. If the weather is hot:
   - Prefer outdoor activities in the morning
     and evening.
   - Prefer indoor, shaded or cool activities
     during the afternoon.
   - Recommend water, sunscreen and sunglasses.

6. If it is rainy:
   - Prefer museums, cafes, restaurants,
     malls and indoor activities.
   - Avoid outdoor activities during heavy rain.

7. If the weather is pleasant:
   - Outdoor sightseeing, parks,
     heritage locations and walking activities
     are suitable.

8. If there is severe weather:
   - Recommend staying indoors.

9. Respect the user's budget.

10. Respect the user's preferred pace.

11. Give practical weather precautions.

12. Give the best time to go outside.

13. Morning, afternoon and evening should
    be different activities.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "Short personalized summary of today's plan",

  "weatherAdvice": "How today's weather affects the plan",

  "morning": {
    "place": "Place or activity",
    "activity": "What to do",
    "time": "09:00 AM - 12:00 PM",
    "reason": "Why this is suitable for today's weather"
  },

  "afternoon": {
    "place": "Place or activity",
    "activity": "What to do",
    "time": "01:00 PM - 04:00 PM",
    "reason": "Why this is suitable for today's weather"
  },

  "evening": {
    "place": "Place or activity",
    "activity": "What to do",
    "time": "05:30 PM - 08:30 PM",
    "reason": "Why this is suitable for today's weather"
  },

  "carry": [
    "Practical item 1",
    "Practical item 2",
    "Practical item 3"
  ],

  "precautions": [
    "Weather precaution 1",
    "Weather precaution 2"
  ],

  "bestTime": "Best time to go outside today",

  "places": [
    {
      "name": "Place name",
      "category": "Category",
      "rating": "Rating or N/A",
      "weatherScore": 80
    }
  ]
}
`;

    // 7. Call Gemini AI
    const ai = new GoogleGenAI({ apiKey });

    let response = null;
    let lastError = null;

    const models = ["gemini-3.5-flash"];

    for (const model of models) {
      try {
        console.log(`Trying Gemini model: ${model}`);
        response = await ai.models.generateContent({ model, contents: prompt });
        console.log(`Gemini succeeded: ${model}`);
        break;
      } catch (error) {
        console.error(`Gemini failed: ${model}`, error);
        lastError = error;
      }
    }

    if (!response) {
      throw lastError || new Error("Gemini AI is currently unavailable.");
    }

    // 8. Parse AI response
    let rawText = response.text || "";
    rawText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    let planData;
    try {
      planData = JSON.parse(rawText);
    } catch (error) {
      console.error("Invalid Gemini JSON:", rawText);
      throw new Error("AI returned an invalid itinerary format.");
    }

    // 9. Return result
    return NextResponse.json({
      itinerary: planData,
      places: nearbyPlaces,
      placesAvailable: nearbyPlaces.length > 0,
    });

  } catch (error) {
    console.error("❌ Itinerary Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate itinerary." },
      { status: 500 }
    );
  }
}
