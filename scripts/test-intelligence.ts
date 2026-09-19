import assert from "node:assert/strict";
import { buildIntelligenceOverview } from "../lib/intelligence";

const overview = buildIntelligenceOverview({
  opportunityCount: 3,
  opportunityPriority: 7.5,
  performanceCount: 2,
  averagePerformanceScore: 81,
  searchImpressions: 1000,
  searchClicks: 50,
  searchCtr: 0.05,
  adSpend: 25,
  adRevenue: 100,
});

assert.equal(overview.version, "1");
assert.equal(overview.status, "ready");
assert.equal(overview.signals.returnOnAdSpend, 4);
assert.equal(overview.signals.opportunityCount, 3);

const zeroSpend = buildIntelligenceOverview({
  opportunityCount: 0,
  opportunityPriority: null,
  performanceCount: 0,
  averagePerformanceScore: null,
  searchImpressions: 0,
  searchClicks: 0,
  searchCtr: null,
  adSpend: 0,
  adRevenue: 10,
});

assert.equal(zeroSpend.signals.returnOnAdSpend, null);
assert.equal(zeroSpend.signals.opportunityPriority, null);
console.log("intelligence normalization tests passed");
