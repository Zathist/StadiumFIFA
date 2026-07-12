import { NextResponse } from "next/server";
import { findHostCity } from "@/lib/hostCities";

// api.weather.gov requires a descriptive User-Agent identifying the app -
// it rejects requests without one. No API key needed - this is free,
// official US government data (National Weather Service).
const USER_AGENT = "VenueMind-FIFA2026-Hackathon (contact: demo@example.com)";

export async function POST(request: Request) {
  try {
    const { location } = await request.json();

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    const city = findHostCity(location);

    if (!city) {
      // Honest miss, not a fake one: this source explicitly doesn't cover
      // non-US host venues (Canada/Mexico) or unrecognized city names.
      return NextResponse.json({
        available: false,
        reason: `No NWS coverage for "${location}" - this source only covers US host venues`,
      });
    }

    const res = await fetch(
      `https://api.weather.gov/alerts/active?point=${city.lat},${city.lon}`,
      { headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" } }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        available: false,
        reason: `NWS request failed: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const alerts = (data.features ?? []).map((f: { properties: Record<string, unknown> }) => ({
      event: f.properties.event,
      severity: f.properties.severity,
      headline: f.properties.headline,
      areaDesc: f.properties.areaDesc,
    }));

    return NextResponse.json({
      available: true,
      source: "National Weather Service (api.weather.gov)",
      city: city.name,
      activeAlertCount: alerts.length,
      alerts,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ALERTS ERROR:", error);
    return NextResponse.json({ available: false, reason: String(error) });
  }
}
