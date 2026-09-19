# Sprint 12 Roadmap Proposal

**Purpose:** Safely progress toward the original Sprint 10 intelligence scope without repeating the failed broad implementation.

**Phase 1 status:** Complete in commit `cf7a909`. The read-only normalized endpoint, deterministic normalization tests, admin panel, production deployment, and regression evidence are now live. The remaining sections are the next Sprint 12 increments.

## Recommended sequence

### 12.1 Production contract and observability tests

Add repository tests for the protected admin session, required relation inventory, route authorization, and sanitized error responses. Add a deployment smoke command that checks the active Vercel commit and database target before any migration is considered. This protects the exact failure mode found in Sprint 11.

### 12.2 Read-only normalized intelligence endpoint

Implement one server-side route that reads existing `content_opportunities`, `content_performance`, `search_console_data`, and advertising metrics through typed helpers. Return a documented, versioned JSON shape with explicit nulls when a data source is unavailable. Do not write recommendations, trigger external APIs, or add a dashboard until this contract is stable.

### 12.3 Deterministic correlation tests

Create fixtures for demand, competition, monetization, effort, search impressions, clicks, CTR, views, completion, and revenue. Test normalization, missing-data behavior, division-by-zero handling, date-window boundaries, and stable ordering. Use pure functions for calculations so the test suite does not depend on production Neon data.

### 12.4 Admin read-only panel

Add a small admin panel that displays the normalized endpoint’s status, date window, source availability, and top signals. Include loading, empty, partial-data, and error states. Keep the current separate module sections intact until parity and visual regression checks pass.

### 12.5 Recommendation governance

Only after the read-only slice passes should the project decide whether recommendations are calculated on demand or persisted. Any persisted recommendation feature needs provenance, source timestamps, explainability fields, idempotent keys, and an explicit delete/retire path.

### 12.6 Security and operational hardening

Replace the interim token gate with provider-backed authentication only after a NextAuth v5 compatibility spike passes in isolation. Add rate limits and audit events for destructive admin operations. Continue secret scanning and prohibit credentials in scripts, evidence, or handoff files.

## Explicitly out of scope until approved

Google Ads production credentials, live Google API synchronization, legal-app deployment changes, microfrontend integration, cross-domain user identity, automatic campaign actions, and any broad rewrite based on the rolled-back Sprint 10 code.

## Definition of done

Sprint 12 should not be marked fully complete until the read-only intelligence contract has passing unit tests, a production API smoke test, admin UI verification, reader regression verification, deployment commit evidence, and an updated execution log. Phase 1 met those criteria. The remaining work must stay small enough to roll back without affecting the current blog, admin, or database relations.
