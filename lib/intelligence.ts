export type IntelligenceInputs = {
  opportunityCount: number;
  opportunityPriority: number | null;
  performanceCount: number;
  averagePerformanceScore: number | null;
  searchImpressions: number;
  searchClicks: number;
  searchCtr: number | null;
  adSpend: number;
  adRevenue: number;
};

export type IntelligenceOverview = {
  version: "1";
  status: "ready";
  signals: {
    opportunityCount: number;
    opportunityPriority: number | null;
    performanceCount: number;
    averagePerformanceScore: number | null;
    searchImpressions: number;
    searchClicks: number;
    searchCtr: number | null;
    adSpend: number;
    adRevenue: number;
    returnOnAdSpend: number | null;
  };
  sources: {
    contentOpportunities: "available";
    contentPerformance: "available";
    searchConsole: "available";
    advertising: "available";
  };
};

export type CorrelationFixture = {
  opportunityPriority?: number | null;
  performanceScore?: number | null;
  searchCtr?: number | null;
  returnOnAdSpend?: number | null;
  completionRate?: number | null;
};

export type CorrelationResult = {
  score: number | null;
  confidence: number;
  availableSignals: string[];
  missingSignals: string[];
  normalizedSignals: Record<string, number>;
};

const CORRELATION_SIGNALS = [
  "opportunityPriority",
  "performanceScore",
  "searchCtr",
  "returnOnAdSpend",
  "completionRate",
] as const;

function finiteOrNull(value: number | null | undefined): number | null {
  return value !== null && value !== undefined && Number.isFinite(value) ? value : null;
}

function clamp(value: number, minimum = 0, maximum = 100): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalize(value: number | null | undefined, maximum: number): number | null {
  const finite = finiteOrNull(value);
  return finite === null ? null : clamp((finite / maximum) * 100);
}

export function correlateSignals(fixture: CorrelationFixture): CorrelationResult {
  const normalizedSignals: Record<string, number> = {};
  const candidates: Array<[string, number | null]> = [
    ["opportunityPriority", normalize(fixture.opportunityPriority, 10)],
    ["performanceScore", normalize(fixture.performanceScore, 100)],
    ["searchCtr", normalize(fixture.searchCtr, 0.1)],
    ["returnOnAdSpend", normalize(fixture.returnOnAdSpend, 5)],
    ["completionRate", normalize(fixture.completionRate, 1)],
  ];

  for (const [name, value] of candidates) {
    if (value !== null) normalizedSignals[name] = value;
  }

  const availableSignals = Object.keys(normalizedSignals);
  const missingSignals = CORRELATION_SIGNALS.filter((name) => !availableSignals.includes(name));
  const score = availableSignals.length > 0
    ? Math.round(availableSignals.reduce((sum, name) => sum + normalizedSignals[name], 0) / availableSignals.length)
    : null;

  return {
    score,
    confidence: availableSignals.length / CORRELATION_SIGNALS.length,
    availableSignals,
    missingSignals,
    normalizedSignals,
  };
}

export function buildIntelligenceOverview(inputs: IntelligenceInputs): IntelligenceOverview {
  const adSpend = Number.isFinite(inputs.adSpend) ? inputs.adSpend : 0;
  const adRevenue = Number.isFinite(inputs.adRevenue) ? inputs.adRevenue : 0;
  const returnOnAdSpend = adSpend > 0 ? adRevenue / adSpend : null;

  return {
    version: "1",
    status: "ready",
    signals: {
      opportunityCount: Math.max(0, inputs.opportunityCount || 0),
      opportunityPriority: finiteOrNull(inputs.opportunityPriority),
      performanceCount: Math.max(0, inputs.performanceCount || 0),
      averagePerformanceScore: finiteOrNull(inputs.averagePerformanceScore),
      searchImpressions: Math.max(0, inputs.searchImpressions || 0),
      searchClicks: Math.max(0, inputs.searchClicks || 0),
      searchCtr: finiteOrNull(inputs.searchCtr),
      adSpend,
      adRevenue,
      returnOnAdSpend,
    },
    sources: {
      contentOpportunities: "available",
      contentPerformance: "available",
      searchConsole: "available",
      advertising: "available",
    },
  };
}
