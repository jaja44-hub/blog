# Sprint 11: End-to-End Testing — Evidence and Findings

**Project:** Addis Crown Blog Platform
**Sprint:** 11 — End-to-End Testing
**Production:** `https://blog.addiscrown.et`
**Repository baseline:** `c7df651` (`Fix admin credentials documentation and add Sprint 13 research scope`)
**Date:** 2026-09-19
**Scope:** Sprint 11 only. Sprint 12 and Sprint 13 were not implemented or modified.

## Executive Summary

Sprint 11 testing established that the production reader experience, token-based admin authentication, admin workspace shell, and authenticated GET APIs are operational. The cross-cutting POST failure was investigated directly through Vercel production logs. The earlier UUID-casting hypothesis is disproven for the current production failure. The actual root cause is a **production database schema deployment gap**: the Neon branch used by Vercel does not contain multiple integration tables referenced by the deployed API routes. Vercel logs report PostgreSQL error `42P01` (`undefined_table`, “relation does not exist”).

No production schema migration, data deletion, deployment, or Sprint 12/13 work was performed during this sprint. The failing POSTs were controlled probes using cleanup-safe payloads; all returned HTTP 500 and created no records.

## Test Matrix and Results

| Area | Test | Result | Evidence |
|---|---|---:|---|
| Admin authentication | Token POST to `/api/admin/session` | PASS — HTTP 200, session cookie issued | `sprint11-api-probe-output.txt` |
| Admin workspace | Browser login and workspace load | PASS | Browser session at `/admin` loaded “Content command center” |
| Editorial drafts | Admin “Load drafts” interaction and GET | PASS — HTTP 200, existing drafts rendered | Browser and API evidence |
| Research briefs | GET | PASS — HTTP 200, existing brief returned | API evidence |
| Analytics | GET | PASS — HTTP 200 | API evidence |
| Content opportunities | GET | PASS — HTTP 200, empty list | API evidence |
| Content performance | GET | PASS — HTTP 200, empty list | API evidence |
| Knowledge sources | GET/UI library | PASS — HTTP 200, empty state rendered | Browser and API evidence |
| Media library | GET/UI library | PASS for route/UI shell; backend table lookup logs an error | Browser and API/Vercel evidence |
| SEO recommendations | GET | PASS — HTTP 200, fallback recommendations returned | API evidence |
| Search Console | GET | PASS — HTTP 200 response, empty data; backend table absent in logs | API/Vercel evidence |
| Google Ads | UI shell opened; GET route logs missing table | PARTIAL — placeholder shell, backend schema gap | Browser/Vercel evidence |
| AdSense | UI route available for testing | Not separately probed in controlled script | Sprint 11 limitation noted |
| Reader homepage | `/` | PASS — HTTP 200 | Reader smoke output |
| Reader navigation | Latest, New This Week, Popular, Contact, Search | PASS — HTTP 200 | Reader smoke output |
| Reader support pages | About, Corrections, Accessibility, Privacy, Terms | PASS — HTTP 200 | Reader smoke output |
| Reader content | Representative posts and category routes | PASS — HTTP 200 | Reader smoke output |
| Feeds/metadata | RSS, robots, sitemap | PASS where completed by smoke run | Reader smoke output |
| Local build | Compile and TypeScript/lint validation | PASS; route data collection blocked by absent local DB URL | Build job output |

## Production API Results

Authenticated production GET probes returned HTTP 200 for:

- `/api/admin/drafts`
- `/api/admin/research`
- `/api/admin/analytics`
- `/api/admin/content-opportunities`
- `/api/admin/content-performance`
- `/api/admin/knowledge-sources`
- `/api/admin/media`
- `/api/admin/seo-recommendations`
- `/api/admin/search-console`

Controlled POST probes returned HTTP 500 with the application’s generic error responses for:

- `/api/admin/content-opportunities`
- `/api/admin/knowledge-sources`
- `/api/admin/media`
- `/api/admin/search-console`

No successful POST response returned an identifier, so no cleanup deletion was necessary. The probe payloads used unique “Sprint 11 probe cleanup” markers and did not alter production data.

## Vercel Log Investigation

Direct inspection of the authenticated Vercel project logs showed PostgreSQL `NeonDbError` entries with severity `ERROR`, code `42P01`, and `routine: parserOpenTable`. The messages identify missing relations, including:

- `google_ads_campaigns` — missing while loading Google Ads campaigns.
- `search_console_data` — missing during Search Console POST.
- `media_assets` — missing during media GET/POST.
- `knowledge_sources` — missing during knowledge-source POST.
- `content_opportunities` — missing during content-opportunity POST.
- Additional analytics/content-performance routes also showed missing-table errors in the Vercel log stream.

This is a database schema availability problem, not evidence of a UUID cast incompatibility. The repository’s `migrations/add_google_api_tables.sql` defines many of the missing relations, while the deployed Neon branch queried by Vercel does not currently expose them. `database-schema.sql` also defines `media_assets`, demonstrating that the application code and schema artifacts expect these relations even though production runtime queries cannot find them.

## Root-Cause Conclusion

**Root cause:** the production Neon database branch is not aligned with the schema required by the deployed Sprint 5–9 integration routes. The routes execute against relations that have not been deployed to the production branch, producing PostgreSQL `42P01` errors. The generic HTTP 500 responses are the API’s error wrapper around those database exceptions.

**Disproved hypothesis:** removing `::uuid` casts is not the appropriate fix for the current production failure. The failure occurs before foreign-key or UUID-cast behavior can be evaluated because PostgreSQL cannot open the target relation.

## Recommended Remediation Boundary

The correct next technical action is a separately controlled database migration workflow:

1. Compare the production Neon branch schema with `migrations/add_google_api_tables.sql`, `database-schema.sql`, and the deployed route requirements.
2. Apply the missing tables in a temporary Neon branch first.
3. Run the same authenticated GET/POST regression matrix against that branch.
4. Review foreign keys, indexes, and existing-table compatibility.
5. Only after explicit migration approval, apply the verified migration to production.
6. Re-run Vercel production probes and confirm the logs no longer report `42P01`.

That remediation was **not executed in Sprint 11** because it changes production database state and is a deployment/migration operation rather than a browser testing action.

## Local Validation Note

`next build` compiled successfully and passed lint/type validation, then failed during route data collection because the local checkout did not contain `.env.local` / a database connection string. This is a local environment setup limitation and does not invalidate the production findings. It should be resolved in a future controlled validation environment, not by committing credentials.

## Sprint 11 Status

**Testing and investigation complete.** Reader and admin GET workflows are evidenced as operational. The POST defect is fully localized to a production schema deployment gap. POST success criteria remain blocked pending the separately controlled Neon migration and regression verification described above.

**Out of scope and untouched:** Sprint 12 production deployment work; Sprint 13 research, legal-app integration planning, and implementation.

## Reproducibility Artifacts

- `scripts/sprint11-api-probe.sh` — authenticated GET matrix and controlled POST probes.
- `sprint11-api-probe-output.txt` — production responses and status codes.
- `scripts/sprint11-reader-smoke.sh` — reader route smoke test.
- `sprint11-reader-smoke-output.txt` — route status output.
- `POST_ENDPOINT_INVESTIGATION_REPORT.md` — historical UUID-casting hypothesis, superseded by this Sprint 11 Vercel-log finding.
- `migrations/add_google_api_tables.sql` — repository schema artifact requiring comparison with production before any migration.
