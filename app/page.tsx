"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ZoneStatus = {
  zoneId: string;
  zoneName: string;
  crowdLevel: "LOW" | "MODERATE" | "HIGH" | "AT_CAPACITY";
  gateOpen: boolean;
  note: string;
  updatedAt: string;
};

type Sustainability = {
  renewableEnergyPercent: number | null;
  wasteDivertedTons: number | null;
  co2SavedKg: number | null;
  updatedAt: string | null;
  reportedBy: string;
};

export default function OpsPanel() {
  const [zones, setZones] = useState<ZoneStatus[]>([]);
  const [sustainability, setSustainability] = useState<Sustainability | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadZones() {
    const res = await fetch("/api/venue");
    const data = await res.json();
    setZones(data.zones);
    setLoading(false);
  }

  async function loadSustainability() {
    const res = await fetch("/api/sustainability");
    const data = await res.json();
    setSustainability(data);
  }

  useEffect(() => {
    loadZones();
    loadSustainability();
  }, []);

  async function updateZone(zoneId: string, update: Partial<ZoneStatus>) {
    await fetch("/api/venue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneId, ...update }),
    });
    loadZones();
  }

  async function updateSustainability(update: Partial<Sustainability>) {
    await fetch("/api/sustainability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    loadSustainability();
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-1">
          <Link href="/" className="text-sm text-slate-500 underline">
            ← Back to fan view
          </Link>
          <h1 className="text-3xl font-bold">Venue Ops Panel</h1>
          <p className="text-slate-500 text-sm">
            Staff use this to report real zone conditions — this feeds the fan-facing AI directly.
          </p>
        </header>

        <div className="space-y-4">
          {zones.map((zone) => (
            <div
              key={zone.zoneId}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{zone.zoneName}</h2>
                <span className="text-xs text-slate-400">
                  Updated {new Date(zone.updatedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["LOW", "MODERATE", "HIGH", "AT_CAPACITY"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateZone(zone.zoneId, { crowdLevel: level })}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
                      zone.crowdLevel === level
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                  >
                    {level.replace("_", " ")}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={zone.gateOpen}
                  onChange={(e) => updateZone(zone.zoneId, { gateOpen: e.target.checked })}
                />
                Gate open
              </label>
              <input
                value={zone.note}
                onChange={(e) => updateZone(zone.zoneId, { note: e.target.value })}
                placeholder="Optional note (e.g. 'delay due to bag check')"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h2 className="font-semibold">Sustainability Metrics</h2>
          <p className="text-xs text-slate-500">
            Enter real figures from venue systems. Leave blank if unavailable — the fan view
            will show &quot;not reported&quot; rather than a fabricated number.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs space-y-1">
              <span className="text-slate-500">Renewable %</span>
              <input
                type="number"
                defaultValue={sustainability?.renewableEnergyPercent ?? ""}
                onBlur={(e) =>
                  updateSustainability({
                    renewableEnergyPercent: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-full border border-slate-300 rounded-lg px-2 py-1.5"
              />
            </label>
            <label className="text-xs space-y-1">
              <span className="text-slate-500">Waste diverted (tons)</span>
              <input
                type="number"
                defaultValue={sustainability?.wasteDivertedTons ?? ""}
                onBlur={(e) =>
                  updateSustainability({
                    wasteDivertedTons: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-full border border-slate-300 rounded-lg px-2 py-1.5"
              />
            </label>
            <label className="text-xs space-y-1">
              <span className="text-slate-500">CO₂ saved (kg)</span>
              <input
                type="number"
                defaultValue={sustainability?.co2SavedKg ?? ""}
                onBlur={(e) =>
                  updateSustainability({
                    co2SavedKg: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-full border border-slate-300 rounded-lg px-2 py-1.5"
              />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}
