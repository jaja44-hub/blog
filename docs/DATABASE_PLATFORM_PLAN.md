# Addis Crown Database Platform Plan

## Direction

Neon/Postgres is an inherent part of Addis Crown. The database is the
operational source of truth for platform management and intelligence, while
Markdown remains a dependable public-content import/export path.

## Initial bounded domains

- **Editorial:** posts, revisions, drafts, workflow states, authors, tags, and series.
- **Research:** topic briefs, source references, evidence notes, questions, and planned coverage.
- **Publishing:** scheduled releases, publication history, redirects, and content status changes.
- **Audience:** consent-aware sessions, comments integration references, ratings, and aggregate engagement events.
- **Advertisers:** advertiser accounts, campaigns, placements, creative references, delivery windows, and reporting events.
- **Intelligence:** daily aggregates, content performance, series performance, topic recommendations, and decision snapshots.
- **Administration:** users, roles, permissions, audit events, and configuration.

## Delivery principles

1. Keep the public reading path fast and resilient if an optional metric or dashboard query fails.
2. Store immutable audit events for administrative actions and publication transitions.
3. Separate personally identifiable data from aggregate analytics wherever possible.
4. Treat consent and retention as data-model concerns, not only UI concerns.
5. Use explicit workflow states rather than inferring publication status from timestamps.
6. Keep Markdown import/export available so the project never depends on one editing surface.
7. Add migrations and focused verification before connecting new admin screens.

## First schema milestone

The first migration should cover `admin_users`, `roles`, `posts`, `post_revisions`,
`content_series`, `research_briefs`, `scheduled_publications`, and `audit_events`.
Ratings should move into the same migration discipline rather than creating
tables opportunistically inside request handlers.

## Deferred until the foundation is reviewed

Advertiser billing, paid downloads, automated recommendations, and broad user
profiles should follow the editorial and audit foundation. Their interfaces
depend on stable identifiers, permissions, consent rules, and event contracts.

## Current implementation status

- `db/editorial-foundation.sql` contains the additive first schema contract.
- `lib/editorial.ts` contains typed draft, listing, status, and audit primitives.
- `scripts/verify-editorial-foundation.mjs` applies the contract and verifies the expected tables.
- Remote execution is complete: the Neon MCP transport remains unavailable, but
    the authorized Neon serverless connection successfully applied and verified
    the schema.
- The first admin workflow is present at `/admin`, protected by an
    `ADMIN_ACCESS_TOKEN` cookie session. Role-backed identity and provider
    integration remain the next security milestone; do not treat the token gate
    as the final authentication model.
- The admin workflow now lists database drafts, edits draft content, records
    revision snapshots, and supports the guarded `draft -> in_review -> published`
    path.
- The admin workflow now supports future scheduling, Markdown import/export,
    and research brief creation/listing with priority and target date fields.
- These routes are included in the Ready production deployment and use the live
    Neon database connection at runtime.
- End-to-end production verification passed for authentication, drafts,
    revisions, review/publish transitions, scheduling, research briefs, and
    Markdown import/export. Disposable records were removed afterward.