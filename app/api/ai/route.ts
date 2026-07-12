import { NextResponse } from "next/server";
import { buildEvidenceObject, computeConfidence, type EvidenceSource } from "@/lib/evidence";

const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function fetchWeatherEvidence(location: string | undefined, origin: string): Promise<EvidenceSource> {
  if (!location) {
    return { name: "Weather", available: false, data: null, reason: "No location provided" };
  }
  try {
    const res = await fetch(`${origin}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    });
    const data = await res.json();
    if (!data.available) {
      return { name: "Weather", available: false, data: null, reason: data.reason || "Weather source unavailable" };
    }
    return { name: "Weather", available: true, data };
  } catch (err) {
    return { name: "Weather", available: false, data: null, reason: String(err) };
  }
}

async function fetchAlertsEvidence(location: string | undefined, origin: string): Promise<EvidenceSource> {
  if (!location) {
    return { name: "Official Alerts (NWS)", available: false, data: null, reason: "No location provided" };
  }
  try {
    const res = await fetch(`${origin}/api/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    });
    const data = await res.json();
    if (!data.available) {
      return { name: "Official Alerts (NWS)", available: false, data: null, reason: data.reason || "Alerts source unavailable" };
    }
    return { name: "Official Alerts (NWS)", available: true, data };
  } catch (err) {
    return { name: "Official Alerts (NWS)", available: false, data: null, reason: String(err) };
  }
}

export async function POST(request: Request) {
  try {
    const { zones, fanProfile, language, location } = await request.json();

    if (!zones || !fanProfile) {
      return NextResponse.json(
        { error: "zones and fanProfile are both required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set on the server" },
        { status: 500 }
      );
    }

    // --- Build the Evidence Object ---
    // Each source is validated as available/unavailable BEFORE Gemini sees
    // anything. "Missing data" is a fact computed in code, not a claim we
    // trust the model to make honestly on its own.
    const origin = new URL(request.url).origin;
    const [weatherEvidence, alertsEvidence] = await Promise.all([
      fetchWeatherEvidence(location, origin),
      fetchAlertsEvidence(location, origin),
    ]);

    const zoneEvidence: EvidenceSource = {
      name: "Venue Zone Status",
      available: Array.isArray(zones) && zones.length > 0,
      data: zones,
      reason: !zones || zones.length === 0 ? "No zone data reported by staff" : undefined,
    };

    const evidence = buildEvidenceObject([zoneEvidence, weatherEvidence, alertsEvidence]);
    const confidence = computeConfidence(evidence);

    const anyHighOrAtCapacity = Array.isArray(zones)
      ? zones.some((z: { crowdLevel: string }) => z.crowdLevel === "HIGH" || z.crowdLevel === "AT_CAPACITY")
      : false;

      const prompt = `
      You are VenueMind, an evidence-based operations copilot for a FIFA World Cup 2026 stadium.
      
      Your job is to answer ONE question:
      
      "Given the verified evidence available right now, what is the best operational recommendation for this fan?"
      
      STRICT RULES
      
      - Use ONLY the evidence provided below.
      - NEVER invent weather, alerts, crowd levels, or zone information.
      - If evidence is unavailable, explicitly say that you cannot determine that information.
      - Never guess.
      - Never hallucinate.
      - If no zone is HIGH or AT_CAPACITY, keep the urgency LOW unless official alerts indicate otherwise.
      - The recommendedZone MUST be one of the provided zone IDs.
      - Respond ONLY in ${language || "English"}.
      
      ==========================
      VERIFIED EVIDENCE
      ==========================
      
      ${JSON.stringify(evidence, null, 2)}
      
      ==========================
      FAN PROFILE
      ==========================
      
      ${JSON.stringify(fanProfile, null, 2)}
      
      ==========================
      AVAILABLE ZONE IDS
      ==========================
      
      ${zones.map((z: any) => z.zoneId).join(", ")}
      
      ==========================
      OUTPUT REQUIREMENTS
      ==========================
      
      Return ONLY valid JSON.
      
      Do not use markdown.
      
      Do not use code blocks.
      
      Do not include any explanation before or after the JSON.
      
      The response MUST be directly parseable using JavaScript JSON.parse().
      
      Return EXACTLY this structure:
      
      {
        "urgencyLevel": "LOW",
        "recommendation": "",
        "reasoning": "",
        "recommendedZone": "",
        "thresholdMet": ${anyHighOrAtCapacity},
        "monitoringNote": "",
        "missingDataNote": ""
      }
      
      Allowed values for urgencyLevel:
      
      LOW
      
      MODERATE
      
      HIGH
      
      Remember:
      
      - recommendation must reference ONLY the evidence above.
      - reasoning must explain WHY using the evidence.
      - recommendedZone MUST exactly match one of the available zone IDs.
      - If evidence is insufficient, clearly state that instead of guessing.
      `.trim();

    // Update the URL from gemini-1.5-flash to gemini-2.5-flash
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }),
  }
);

    if (!res.ok) {
      const errBody = await res.text();
      console.error("GEMINI HTTP ERROR:", res.status, errBody);
      return NextResponse.json(
        { error: "Gemini request failed", status: res.status, details: errBody },
        { status: res.status }
      );
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("========== GEMINI RAW ==========");
    console.log(rawText);
    console.log("================================================");

    if (!rawText) {
      console.error("GEMINI UNEXPECTED RESPONSE:", JSON.stringify(data));
      return NextResponse.json(
        { error: "No text returned from Gemini", details: data },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    // Confidence is attached from our own code-computed value, not whatever
    // (if anything) the model guessed - this keeps it trustworthy.
    return NextResponse.json({
      result: { ...parsed, confidence },
      evidence,
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);
    return NextResponse.json(
      { error: "AI request failed", details: String(error) },
      { status: 500 }
    );
  }
}
