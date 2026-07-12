// The Evidence Layer: every data source is validated and labeled as
// available/unavailable BEFORE it reaches Gemini. This means "missing data"
// is a structural fact we compute in code, not something we just ask the
// AI to claim about itself - which is a stronger, more honest guarantee.

export type EvidenceSource = {
  name: string;
  available: boolean;
  data: unknown;
  reason?: string; // why it's unavailable, if applicable
};

export type EvidenceObject = {
  sources: EvidenceSource[];
  availableCount: number;
  totalCount: number;
  missingSources: string[];
  generatedAt: string;
};

export function buildEvidenceObject(sources: EvidenceSource[]): EvidenceObject {
  const availableCount = sources.filter((s) => s.available).length;
  const missingSources = sources.filter((s) => !s.available).map((s) => s.name);

  return {
    sources,
    availableCount,
    totalCount: sources.length,
    missingSources,
    generatedAt: new Date().toISOString(),
  };
}

// A simple, defensible confidence calculation - NOT invented by the AI.
// Based purely on what fraction of expected evidence sources are actually
// available. This is computed in code so it can't be hallucinated.
export function computeConfidence(evidence: EvidenceObject): number {
  if (evidence.totalCount === 0) return 0;
  const ratio = evidence.availableCount / evidence.totalCount;
  return Math.round(ratio * 100);
}
