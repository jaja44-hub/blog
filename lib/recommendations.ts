import { query, queryOne } from "@/lib/db";
import {
  buildRecommendationIdempotencyKey,
  validateRecommendationBounds,
  type RecommendationDraft,
} from "@/lib/recommendation-governance";

export type { RecommendationDraft } from "@/lib/recommendation-governance";

export type ContentRecommendation = {
  id: string;
  idempotency_key: string;
  recommendation_type: string;
  title: string;
  rationale: string;
  score: number | null;
  confidence: number | null;
  status: "active" | "retired";
  provenance: Record<string, unknown>;
  source_snapshot: Record<string, unknown>;
  source_timestamps: Record<string, string | null>;
  generated_at: string;
  created_at: string;
  updated_at: string;
  retired_at: string | null;
  retired_by: string | null;
  retire_reason: string | null;
};

export async function listRecommendations(status?: "active" | "retired") {
  if (status) {
    return query<ContentRecommendation>(
      `SELECT * FROM content_recommendations WHERE status = $1 ORDER BY updated_at DESC`,
      [status]
    );
  }
  return query<ContentRecommendation>(
    `SELECT * FROM content_recommendations ORDER BY updated_at DESC`
  );
}

export async function createRecommendation(draft: RecommendationDraft): Promise<{ recommendation: ContentRecommendation; created: boolean }> {
  const recommendationType = draft.recommendationType.trim();
  const title = draft.title.trim();
  const rationale = draft.rationale.trim();
  if (!recommendationType || !title || !rationale) throw new Error("Recommendation type, title, and rationale are required.");

  const score = draft.score ?? null;
  const confidence = draft.confidence ?? null;
  validateRecommendationBounds(score, confidence);
  const generatedAt = draft.generatedAt ?? new Date().toISOString();
  const normalizedDraft = { ...draft, recommendationType, title, rationale, score, confidence, generatedAt };
  const idempotencyKey = buildRecommendationIdempotencyKey(normalizedDraft);

  const inserted = await queryOne<ContentRecommendation>(
    `INSERT INTO content_recommendations
      (idempotency_key, recommendation_type, title, rationale, score, confidence, provenance, source_snapshot, source_timestamps, generated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING *`,
    [
      idempotencyKey,
      recommendationType,
      title,
      rationale,
      score,
      confidence,
      JSON.stringify(draft.provenance),
      JSON.stringify(draft.sourceSnapshot),
      JSON.stringify(draft.sourceTimestamps),
      generatedAt,
    ]
  );

  if (inserted) return { recommendation: inserted, created: true };
  const existing = await queryOne<ContentRecommendation>(
    `SELECT * FROM content_recommendations WHERE idempotency_key = $1`,
    [idempotencyKey]
  );
  if (!existing) throw new Error("Recommendation idempotency lookup failed.");
  return { recommendation: existing, created: false };
}

export async function retireRecommendation(id: string, reason: string) {
  const trimmedReason = reason.trim();
  if (!trimmedReason) throw new Error("A retirement reason is required.");
  return queryOne<ContentRecommendation>(
    `UPDATE content_recommendations
     SET status = 'retired', retired_at = NOW(), retire_reason = $2, updated_at = NOW()
     WHERE id = $1 AND status = 'active'
     RETURNING *`,
    [id, trimmedReason]
  );
}
