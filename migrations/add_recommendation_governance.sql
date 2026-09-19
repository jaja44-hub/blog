-- Sprint 12 Phase 3: governed recommendation persistence.
-- This relation is intentionally additive. No existing table or workflow is changed.
CREATE TABLE IF NOT EXISTS content_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  recommendation_type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  rationale TEXT NOT NULL,
  score DECIMAL CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  confidence DECIMAL CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'retired')),
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_timestamps JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  retired_at TIMESTAMP WITH TIME ZONE,
  retired_by UUID REFERENCES users(id),
  retire_reason TEXT
);

CREATE INDEX IF NOT EXISTS content_recommendations_status_idx
  ON content_recommendations (status, updated_at DESC);

CREATE INDEX IF NOT EXISTS content_recommendations_type_idx
  ON content_recommendations (recommendation_type, updated_at DESC);
