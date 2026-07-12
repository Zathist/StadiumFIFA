import { NextResponse } from "next/server";

// Uses WeatherAPI.com (same reliable pattern already proven). This is one
// evidence source among several the AI route combines - not the only input.
export async function POST(request: Request) {
  try {
    const { location } = await request.json();

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      // Not fatal - the evidence layer treats a missing source as
      // "unavailable" rather than crashing the whole recommendation.
      return NextResponse.json(
        { available: false, reason: "WEATHER_API_KEY not configured" },
        { status: 200 }
      );
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
      location
    )}&days=1&aqi=no&alerts=yes`;

    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { available: false, reason: `WeatherAPI request failed: ${errText}` },
        { status: 200 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      available: true,
      location: data.location?.name,
      condition: data.current?.condition?.text,
      tempC: data.current?.temp_c,
      precipMm: data.current?.precip_mm,
      windKph: data.current?.wind_kph,
      chanceOfRainToday: data.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain,
      alerts: data.alerts?.alert ?? [],
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("WEATHER ERROR:", error);
    // Same pattern - a failed source becomes "unavailable", not a crash.
    return NextResponse.json(
      { available: false, reason: String(error) },
      { status: 200 }
    );
  }
}
