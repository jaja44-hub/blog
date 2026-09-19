import assert from "node:assert/strict";
import { buildIntelligenceOverview, correlateSignals } from "../lib/intelligence";
import {
  completeCorrelationFixture,
  emptyCorrelationFixture,
  partialCorrelationFixture,
} from "../lib/intelligence-fixtures";

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

const complete = correlateSignals(completeCorrelationFixture);
assert.equal(complete.score, 70);
assert.equal(complete.confidence, 1);
assert.deepEqual(complete.missingSignals, []);
assert.equal(complete.normalizedSignals.searchCtr, 50);

const partial = correlateSignals(partialCorrelationFixture);
assert.equal(partial.score, 70);
assert.equal(partial.confidence, 0.6);
assert.deepEqual(partial.missingSignals, ["performanceScore", "returnOnAdSpend"]);
assert.equal(partial.availableSignals.length, 3);

const empty = correlateSignals(emptyCorrelationFixture);
assert.equal(empty.score, null);
assert.equal(empty.confidence, 0);
assert.equal(empty.availableSignals.length, 0);
assert.deepEqual(empty.missingSignals, [
  "opportunityPriority",
  "performanceScore",
  "searchCtr",
  "returnOnAdSpend",
  "completionRate",
]);

const clamped = correlateSignals({
  opportunityPriority: 20,
  performanceScore: -10,
  searchCtr: 1,
  returnOnAdSpend: 20,
  completionRate: 2,
});
assert.equal(clamped.normalizedSignals.opportunityPriority, 100);
assert.equal(clamped.normalizedSignals.performanceScore, 0);
assert.equal(clamped.normalizedSignals.searchCtr, 100);
assert.equal(clamped.normalizedSignals.returnOnAdSpend, 100);
assert.equal(clamped.normalizedSignals.completionRate, 100);

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
console.log("intelligence normalization and correlation tests passed");
