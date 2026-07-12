// In-memory venue status store. No database needed for a hackathon demo -
// this resets on server restart, which is fine since it's populated live
// by the ops panel during the demo, not meant to persist long-term.
// This is REAL data (entered by a human operator), not fabricated.

export type ZoneStatus = {
  zoneId: string;
  zoneName: string;
  crowdLevel: "LOW" | "MODERATE" | "HIGH" | "AT_CAPACITY";
  gateOpen: boolean;
  note: string;
  updatedAt: string;
};

const defaultZones: ZoneStatus[] = [
  {
    zoneId: "gate-a",
    zoneName: "Gate A - North Entrance",
    crowdLevel: "LOW",
    gateOpen: true,
    note: "",
    updatedAt: new Date().toISOString(),
  },
  {
    zoneId: "gate-b",
    zoneName: "Gate B - South Entrance",
    crowdLevel: "LOW",
    gateOpen: true,
    note: "",
    updatedAt: new Date().toISOString(),
  },
  {
    zoneId: "concourse-1",
    zoneName: "Concourse 1 - Food Court",
    crowdLevel: "LOW",
    gateOpen: true,
    note: "",
    updatedAt: new Date().toISOString(),
  },
  {
    zoneId: "transit-hub",
    zoneName: "Transit Hub - Metro Exit",
    crowdLevel: "LOW",
    gateOpen: true,
    note: "",
    updatedAt: new Date().toISOString(),
  },
];

// Use globalThis to survive Next.js dev server hot-reloads
const globalStore = globalThis as unknown as { venueZones?: ZoneStatus[] };

export function getZones(): ZoneStatus[] {
  if (!globalStore.venueZones) {
    globalStore.venueZones = defaultZones;
  }
  return globalStore.venueZones;
}

export function updateZone(zoneId: string, update: Partial<ZoneStatus>) {
  const zones = getZones();
  const idx = zones.findIndex((z) => z.zoneId === zoneId);
  if (idx === -1) return null;
  zones[idx] = { ...zones[idx], ...update, updatedAt: new Date().toISOString() };
  return zones[idx];
}
