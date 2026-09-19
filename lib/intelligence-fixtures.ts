import type { CorrelationFixture } from "./intelligence";

export const completeCorrelationFixture: CorrelationFixture = {
  opportunityPriority: 8,
  performanceScore: 80,
  searchCtr: 0.05,
  returnOnAdSpend: 3,
  completionRate: 0.8,
};

export const partialCorrelationFixture: CorrelationFixture = {
  opportunityPriority: 8,
  performanceScore: null,
  searchCtr: 0.05,
  returnOnAdSpend: null,
  completionRate: 0.8,
};

export const emptyCorrelationFixture: CorrelationFixture = {
  opportunityPriority: null,
  performanceScore: null,
  searchCtr: null,
  returnOnAdSpend: null,
  completionRate: null,
};
