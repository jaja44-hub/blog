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

function finiteOrNull(value: number | null | undefined): number | null {
  return value !== null && value !== undefined && Number.isFinite(value) ? value : null;
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
