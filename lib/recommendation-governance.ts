import { createHash } from "node:crypto";

export type RecommendationDraft = {
  recommendationType: string;
  title: string;
  rationale: string;
  score?: number | null;
  confidence?: number | null;
  provenance: Record<string, unknown>;
  sourceSnapshot: Record<string, unknown>;
  sourceTimestamps: Record<string, string | null>;
  generatedAt?: string;
};

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortKeys(child)])
    );
  }
  return value;
}

export function canonicalRecommendationDraft(draft: RecommendationDraft): string {
  return JSON.stringify(sortKeys({
    recommendationType: draft.recommendationType.trim(),
    title: draft.title.trim(),
    rationale: draft.rationale.trim(),
    score: draft.score ?? null,
    confidence: draft.confidence ?? null,
    provenance: draft.provenance,
    sourceSnapshot: draft.sourceSnapshot,
    sourceTimestamps: draft.sourceTimestamps,
    generatedAt: draft.generatedAt ?? null,
  }));
}

export function buildRecommendationIdempotencyKey(draft: RecommendationDraft): string {
  return createHash("sha256").update(canonicalRecommendationDraft(draft)).digest("hex");
}

export function validateRecommendationBounds(score?: number | null, confidence?: number | null) {
  if (score !== undefined && score !== null && (!Number.isFinite(score) || score < 0 || score > 100)) {
    throw new Error("score must be between 0 and 100.");
  }
  if (confidence !== undefined && confidence !== null && (!Number.isFinite(confidence) || confidence < 0 || confidence > 1)) {
    throw new Error("confidence must be between 0 and 1.");
  }
}
