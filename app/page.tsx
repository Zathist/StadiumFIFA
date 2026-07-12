"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// --- Internationalization ---
const TRANSLATIONS = {
  en: {
    welcome: "Tournament Intelligence Portal",
    sos: "EMERGENCY SOS",
    eco: "Sustainability Hub",
    ops: "Command Center",
    fan: "Fan Concierge",
    security: "Prohibited Items: No liquid > 100ml. Clear bags only.",
    systemStatus: "Evidence Connected",
    systemStatusLow: "Limited Data",
  },
  es: {
    welcome: "Portal de Inteligencia",
    sos: "S.O.S EMERGENCIA",
    eco: "Centro de Sostenibilidad",
    ops: "Centro de Mando",
    fan: "Asistente de Fan",
    security: "Prohibido: Líquidos > 100ml. Bolsas transparentes.",
    systemStatus: "Evidencia Conectada",
    systemStatusLow: "Datos Limitados",
  },
};

const LANG_TO_FULL: Record<"en" | "es", string> = { en: "English", es: "Spanish" };

type Theme = "dark" | "light" | "contrast";

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

type EvidenceSource = { name: string; available: boolean; data: unknown; reason?: string };
type EvidenceObject = {
  sources: EvidenceSource[];
  availableCount: number;
  totalCount: number;
  missingSources: string[];
};

type Decision = {
  urgencyLevel: "LOW" | "MODERATE" | "HIGH";
  recommendation: string;
  reasoning: string;
  recommendedZone: string;
  thresholdMet: boolean;
  monitoringNote: string;
  missingDataNote: string;
  confidence: number;
};

const THEME_CLASSES: Record<Theme, string> = {
  dark: "bg-[#05070a] text-white",
  light: "bg-slate-50 text-slate-900",
  contrast: "bg-black text-[#ffff00] font-mono border-4 border-[#ffff00]",
};

const CROWD_FILL: Record<string, string> = {
  LOW: "#10b981",
  MODERATE: "#f59e0b",
  HIGH: "#f43f5e",
  AT_CAPACITY: "#be123c",
};

// A real visual, not decoration: gate position/color is driven directly by
// live zone data from the ops panel. Nothing here is a fixed illustration.
function StadiumMap({ zones }: { zones: ZoneStatus[] }) {
  const cx = 200;
  const cy = 130;
  const rx = 150;
  const ry = 90;

  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto" role="img" aria-label="Live stadium zone map">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />
      <ellipse cx={cx} cy={cy} rx={rx * 0.55} ry={ry * 0.55} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.1} />
      {zones.map((z, i) => {
        const angle = (2 * Math.PI * i) / Math.max(zones.length, 1) - Math.PI / 2;
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        const fill = CROWD_FILL[z.crowdLevel] ?? "#64748b";
        return (
          <g key={z.zoneId}>
            <circle cx={x} cy={y} r={z.gateOpen ? 12 : 9} fill={fill} stroke="white" strokeWidth={z.gateOpen ? 2 : 1} strokeOpacity={0.5}>
              <title>{`${z.zoneName}: ${z.crowdLevel.replace("_", " ")}${z.gateOpen ? "" : " (closed)"}`}</title>
            </circle>
            {!z.gateOpen && (
              <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="white" strokeWidth={1.5} />
            )}
            <text
              x={x}
              y={y + (angle > -Math.PI / 2 && angle < Math.PI / 2 ? 24 : -18)}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="currentColor"
              opacity={0.7}
            >
              {z.zoneName.split(" - ")[0].toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ArenaIQ() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [persona, setPersona] = useState<"OPS" | "FAN">("OPS");
  const [sosActive, setSosActive] = useState(false);

  const [location, setLocation] = useState("Los Angeles");
  const [zones, setZones] = useState<ZoneStatus[]>([]);
  const [sustainability, setSustainability] = useState<Sustainability | null>(null);

  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [evidence, setEvidence] = useState<EvidenceObject | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  async function loadZones() {
    const res = await fetch("/api/venue");
    const data = await res.json();
    setZones(data.zones);
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

  const worstZone = zones.reduce<ZoneStatus | null>((worst, z) => {
    const rank = { LOW: 0, MODERATE: 1, HIGH: 2, AT_CAPACITY: 3 };
    if (!worst || rank[z.crowdLevel] > rank[worst.crowdLevel]) return z;
