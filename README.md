# VenueMind — Evidence-Based Operations Copilot
### FIFA World Cup 2026 Stadium Assistant

Not a chatbot. Not a dashboard. VenueMind answers one question:
**"Given the evidence we have right now, what is the best decision for this fan?"**

Every recommendation is traceable to specific, validated evidence sources.
If a source is unavailable, VenueMind says so explicitly instead of guessing.

## Setup (5 minutes)

1. `npm install`
2. `cp .env.local.example .env.local`
3. Add your keys:
   - `GEMINI_API_KEY` from https://aistudio.google.com/apikey (required)
   - `WEATHER_API_KEY` from https://www.weatherapi.com/ (optional - if missing,
     the Weather evidence source will honestly show as unavailable rather
     than crash)
4. `npm run dev`
5. Open http://localhost:3000 for the fan view
6. Open http://localhost:3000/ops in a second tab to act as venue staff

No key needed for the third evidence source (official NWS alerts) - it's a
free US government API.

## Architecture: The Evidence Layer

```
Real Sources                Evidence Layer              AI
─────────────               ──────────────              ──
Venue Zone Status     ──┐
(real staff input)      │
                         │    Validates each source
Weather (WeatherAPI) ────┼──► as available/unavailable ──► Gemini sees ONLY
                         │    BEFORE Gemini sees          the structured
Official Alerts      ────┘    anything. Confidence is     evidence object.
(api.weather.gov,             computed in CODE, not       Cannot invent data
free, no key, US gov)         guessed by the model.        for missing sources.
```

This means:
- **Confidence score is computed in code** (`lib/evidence.ts`), not asked-for
  from the AI. A missing source can't be hidden by a model that "feels
  confident" anyway.
- **Missing data is a structural fact.** If `WEATHER_API_KEY` isn't set, or a
  venue is outside NWS's US-only coverage (e.g. Canada/Mexico host cities),
  the evidence object marks that source unavailable and the UI shows exactly
  why - honestly, not silently.

## The three evidence sources

1. **Venue Zone Status** (`/api/venue`) — real, staff-entered data via the
   `/ops` panel. Crowd level, gate status, notes per zone.
2. **Weather** (`/api/weather`) — WeatherAPI.com, current conditions +
   today's forecast for the host city.
3. **Official Alerts** (`/api/alerts`) — api.weather.gov (National Weather
   Service), free, no key required. Real active government weather alerts
   for FIFA 2026's US host cities (LA, Bay Area, Seattle, Kansas City,
   Dallas, Houston, Atlanta, Miami, NYC/NJ, Philadelphia, Boston). Honestly
   reports "no coverage" for non-US venues rather than faking data.

## Demo script

1. Open `/ops`, set Gate A to HIGH with a note ("queue after bag check")
2. Open `/`, set location to a host city (e.g. "Los Angeles"), preferred
   gate to Gate A
3. Click "Get My Navigation Advice" — watch it reroute you, citing the real
   staff-entered data, weather, and any active NWS alerts
4. Point out the **Evidence Used** panel — checkmarks/X's per source,
   confidence percentage, and (if applicable) the amber "Missing data" box
5. Try a Canada/Mexico venue name to show the honest "no coverage" behavior
   for that source - this is a *feature*, not a bug: it proves the system
   doesn't fabricate data it doesn't have
6. Switch language to Kannada/Hindi/Spanish, re-run, show multilingual output

## Deploying to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add `GEMINI_API_KEY` and `WEATHER_API_KEY` in Environment Variables
4. Deploy

Note: the in-memory venue store resets on redeploy/restart - re-set zone
statuses via `/ops` before demoing live.
