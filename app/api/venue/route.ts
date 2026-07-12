import { NextResponse } from "next/server";
import { getZones, updateZone } from "@/lib/venueStore";

export async function GET() {
  return NextResponse.json({ zones: getZones() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zoneId, crowdLevel, gateOpen, note } = body;

    if (!zoneId) {
      return NextResponse.json({ error: "zoneId is required" }, { status: 400 });
    }

    // Only include fields that were actually provided - avoids silently
    // overwriting existing values with undefined for omitted fields.
    const partialUpdate: Record<string, unknown> = {};
    if (crowdLevel !== undefined) partialUpdate.crowdLevel = crowdLevel;
    if (gateOpen !== undefined) partialUpdate.gateOpen = gateOpen;
    if (note !== undefined) partialUpdate.note = note;

    const updated = updateZone(zoneId, partialUpdate);

    if (!updated) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    return NextResponse.json({ zone: updated });
  } catch (error) {
    console.error("VENUE UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update venue status", details: String(error) },
      { status: 500 }
    );
  }
}
