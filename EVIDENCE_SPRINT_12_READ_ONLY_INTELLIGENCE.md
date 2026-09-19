# Sprint 12 Evidence: Read-Only Intelligence Vertical Slice

**Date:** 2026-09-19  
**Commit:** `cf7a909`  
**Production deployment:** `dpl_AVsmcfKLhCHVJ7wwLShuTh8kTJMb` (READY)  
**Production domain:** `https://blog.addiscrown.et`

## Delivered scope

Sprint 12 began the approved staged replacement for the failed Sprint 10 implementation. The first slice is intentionally read-only. It normalizes existing content-opportunity, content-performance, Search Console, Google Ads performance, and AdSense performance aggregates into a versioned response contract.

The protected endpoint is `GET /api/admin/intelligence/overview`. It returns HTTP 401 without an admin session and HTTP 200 with an authenticated session. The response includes contract version `1`, a ready status, an all-time aggregate window, normalized signal fields, and explicit source availability. It does not create recommendations, call external Google APIs, or modify database records.

The admin workspace now exposes an **Intelligence overview** action and a compact read-only panel. Existing editorial, analytics, content-planning, source, media, advertising, and Search Console sections remain unchanged.

## Implementation files

- `app/api/admin/intelligence/overview/route.ts`
- `lib/intelligence.ts`
- `components/AdminWorkspace.tsx`
- `scripts/test-intelligence.ts`
- `package.json` (`test-intelligence` script)

## Verification

The deterministic normalization test passed. TypeScript validation passed. The full production build passed and generated `/api/admin/intelligence/overview` as a dynamic route.

Production contract verification passed:

- Unauthenticated endpoint: HTTP 401 with `Unauthorized`.
- Authenticated endpoint: HTTP 200 with versioned signals and all four source groups available.
- Admin regression: all tested GET routes returned HTTP 200; four controlled POST probes returned HTTP 201; all four cleanup deletes returned HTTP 200.
- Reader regression: 21 reader, feed, metadata, post, and category routes returned HTTP 200.
- Runtime logs: no errors for the Sprint 12 deployment.
- Neon cleanup: zero remaining Sprint 11 probe rows.

## Deliberate limitations

This slice does not yet calculate persisted recommendations, use an LLM, synchronize live Google APIs, or replace the separate module dashboards. Those capabilities require the read-only contract and deterministic fixtures to mature first. The next safe step is fixture-based correlation scoring and partial-data tests, followed by explainable recommendations only after the contract remains stable.


## Phase 2: Deterministic correlation fixtures and partial-data tests

Phase 2 adds `correlateSignals()` to the pure intelligence library. It normalizes five bounded signals to a 0–100 scale: opportunity priority, performance score, Search Console CTR, return on ad spend, and completion rate. The score averages only available signals, while `confidence` reports the available-signal fraction. Missing signal names are returned explicitly. Values are clamped to their documented ranges, and an empty fixture returns a null score rather than inventing a result.

Fixtures now cover complete, partial, and empty input sets. The deterministic test suite also covers zero-spend behavior and out-of-range clamping. These tests run through `npm run test-intelligence` and do not access Neon or mutate production data.

Phase 2 verification passed:

- Complete fixture: score `70`, confidence `1`, no missing signals.
- Partial fixture: score `70`, confidence `0.6`, missing performance score and return on ad spend.
- Empty fixture: null score, confidence `0`, all five signals reported missing.
- Out-of-range values: clamped safely to the 0–100 normalized range.
- Existing zero-spend overview behavior: return on ad spend remains `null`.
- TypeScript validation: passed.
- Full production build: passed.


## Phase 3: Recommendation governance

Phase 3 adds governed recommendation persistence without automatic generation. The additive `content_recommendations` relation requires a unique deterministic idempotency key and stores the recommendation type, title, rationale, bounded score, confidence, provenance, source snapshot, source timestamps, generation time, lifecycle status, and retirement metadata.

The API is protected by the existing admin session:

- `GET /api/admin/recommendations` lists active or retired records.
- `POST /api/admin/recommendations` creates a governed record or returns the existing record for the same idempotency key.
- `PATCH /api/admin/recommendations/[id]` retires an active record and requires a retirement reason.

The Phase 3 governance test proves canonical key stability when object key order changes, key changes when source data changes, SHA-256 key length, and score/confidence bounds. The production probe created one marked governance record, retried the same payload, received HTTP 200 with `created: false` and the same ID, then retired it with HTTP 200. The returned record retained provenance and source timestamps. The probe remains retired as an audit record rather than being hard-deleted.

Phase 3 production verification passed:

- Unauthenticated recommendation listing: protected by the admin session gate.
- Authenticated recommendation creation: HTTP 201.
- Idempotent retry: HTTP 200 with the same recommendation ID and `created: false`.
- Retirement: HTTP 200 with `status: retired` and a recorded reason.
- Existing admin regression: all prior GET, POST, and cleanup checks passed.
- Reader regression: all 21 routes passed with HTTP 200.
- Vercel runtime error logs: no errors for the Phase 3 deployment.
- Neon migration: relation columns and governance fields verified in production.
