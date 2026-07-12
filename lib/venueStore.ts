export type ZoneStatus = {
  zoneId: string;
  zoneName: string;
  crowdLevel: "LOW" | "MODERATE" | "HIGH" | "AT_CAPACITY";
  gateOpen: boolean;
  note: string;
  updatedAt: string;
};

export type SustainabilityMetrics = {
  renewableEnergyPercent: number | null;
  wasteDivertedTons: number | null;
  co2SavedKg: number | null;
  updatedAt: string | null;
  reportedBy: string;
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

// Sustainability metrics start as null (unreported), never fabricated defaults.
const globalSustain = globalThis as unknown as { sustainMetrics?: SustainabilityMetrics };

export function getSustainability(): SustainabilityMetrics {
  if (!globalSustain.sustainMetrics) {
    globalSustain.sustainMetrics = {
      renewableEnergyPercent: null,
      wasteDivertedTons: null,
      co2SavedKg: null,
      updatedAt: null,
      reportedBy: "",
    };
  }
  return globalSustain.sustainMetrics;
}

export function updateSustainability(update: Partial<SustainabilityMetrics>) {
  const current = getSustainability();
  globalSustain.sustainMetrics = {
    ...current,
    ...update,
    updatedAt: new Date().toISOString(),
  };
  return globalSustain.sustainMetrics;
}
