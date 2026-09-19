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
