import assert from "node:assert/strict";
import {
  buildRecommendationIdempotencyKey,
  canonicalRecommendationDraft,
  validateRecommendationBounds,
  type RecommendationDraft,
} from "../lib/recommendation-governance";

const draft: RecommendationDraft = {
  recommendationType: "refresh",
  title: "Improve the article title",
  rationale: "Search impressions are high while CTR is below the threshold.",
  score: 72,
  confidence: 0.8,
  provenance: { algorithm: "correlation-v1", signals: ["searchCtr", "opportunityPriority"] },
  sourceSnapshot: { searchImpressions: 1000, searchCtr: 0.02 },
  sourceTimestamps: { searchConsole: "2026-09-19T00:00:00Z" },
  generatedAt: "2026-09-19T01:00:00Z",
};

const reordered: RecommendationDraft = {
  ...draft,
  provenance: { signals: ["searchCtr", "opportunityPriority"], algorithm: "correlation-v1" },
};

assert.equal(canonicalRecommendationDraft(draft), canonicalRecommendationDraft(reordered));
assert.equal(buildRecommendationIdempotencyKey(draft), buildRecommendationIdempotencyKey(reordered));
assert.equal(buildRecommendationIdempotencyKey(draft).length, 64);

const changedSource = { ...draft, sourceSnapshot: { searchImpressions: 1001, searchCtr: 0.02 } };
assert.notEqual(buildRecommendationIdempotencyKey(draft), buildRecommendationIdempotencyKey(changedSource));

validateRecommendationBounds(0, 0);
validateRecommendationBounds(100, 1);
assert.throws(() => validateRecommendationBounds(101, 0.5), /score must be between/);
assert.throws(() => validateRecommendationBounds(50, 1.1), /confidence must be between/);
console.log("recommendation governance tests passed");
