# Sprint 13 Phase 0 and Phase 1 Evidence

**Date:** 2026-09-20  
**Repository commit:** `8a31667d71271742a2d7c61d9a7ff371c0222d67`  
**Production deployment:** `dpl_9qc4yL1cJWiPBDCF7a1eWaad8NpT`  
**Production domain:** https://blog.addiscrown.et  
**Deployment state:** READY and aliased to the canonical domain

> **Continuity rule:** This evidence belongs in the repository because the repository is the project memory. Future agents must read this file, `NEXT_AGENT_GUIDE.md`, `KNOWN_ISSUES.md`, and `EXECUTION_LOG.md` before changing production code, configuration, or database relations.

## Scope completed

Phase 0 verified the live deployment, canonical domain, Vercel project, Neon production target, production schema presence, reader routes, and unauthenticated admin boundaries. The production `DATABASE_URL` was confirmed to resolve to the active Neon compute attached to branch `br-orange-rain-awpyfg18` in project `restless-cake-31725040`. No migration or data mutation was needed.

Phase 1 added focused hardening that does not alter the editorial data model, Google integrations, reader content, or authentication contract. Admin browser mutations now reject cross-origin requests and request bodies larger than one megabyte. Responses passing through the middleware receive defensive security headers. The production admin session cookie is explicitly secure in Vercel production. Recommendation creation and retirement now enforce bounded text, structured provenance limits, numeric score validation, UUID validation, and bounded retirement reasons.

## Code and deterministic verification

The implementation is contained in `middleware.ts`, `lib/request-security.ts`, the recommendation and session routes, `scripts/test-request-security.ts`, and the package script `test-request-security`.

The following checks passed locally:

- `npm run test-intelligence`
- `npm run test-recommendation-governance`
- `npm run test-request-security`
- `npx tsc --noEmit`
- `npm run build` with a non-secret build-only `DATABASE_URL` placeholder
- `git diff --check`
- Secret scan for the changed files

The first local build attempt correctly failed during Next.js page-data collection because this sandbox did not have `DATABASE_URL`. The second build compiled, passed linting and type checking, and completed successfully with a non-secret placeholder. The production Vercel build is the authoritative database-backed build.

## Production verification

The deployment was created from commit `8a31667` and reached READY. It owns the aliases `blog.addiscrown.et` and the project aliases. Vercel returned no error or fatal runtime logs for the final verification window.

The reader smoke matrix passed all 20 tested routes with HTTP 200:

- Main, latest, new-this-week, and popular pages.
- Contact, search, about, corrections, accessibility, privacy policy, and terms.
- Feed, robots, and sitemap metadata endpoints.
- Three representative post pages.
- Three representative category pages.

The security checks passed against the canonical production domain:

- Cross-origin `POST /api/admin/session` returned HTTP 403 with `Cross-origin request rejected.`
- Unauthenticated `GET /api/admin/intelligence/overview` returned HTTP 401.
- Unauthenticated `GET /api/admin/recommendations` returned HTTP 401.
- Unauthenticated `GET /api/admin/knowledge-sources` returned HTTP 401.
- Production transport security remained active through HSTS.

The final authenticated API regression was run against the canonical production domain using the protected `ADMIN_ACCESS_TOKEN` process environment. The session endpoint succeeded, all nine tested admin GET routes returned HTTP 200 (`drafts`, `research`, `analytics`, `content-opportunities`, `content-performance`, `knowledge-sources`, `media`, `seo-recommendations`, and `search-console`), and all four controlled POST probes returned HTTP 201. Each created probe record was immediately deleted through its API cleanup path with HTTP 200. The token was not written to a file or repository artifact.

Post-run production database verification found zero remaining probe records in `content_opportunities`, `knowledge_sources`, or `media_assets`. The Search Console probe was also deleted through its API cleanup path; its backing relation is `search_console_data`.

## Remaining follow-up

Phase 0 and Phase 1 are now fully verified in production, including authenticated admin reads, writes, and cleanup. No database migration is required for Phase 1.

## Sprint 13 Phase 2 approval and execution boundary

**Approved and ready to be executed:** the user approved the following Phase 2 scope on 2026-09-20: (1) Addis Crown brand and domain alignment across the blog, legal app, Google Cloud project, and AdSense account; (2) Search Console ownership, sitemap, robots, canonical, and indexing readiness; (3) AdSense readiness review; (4) Google Cloud and Google Ads ownership/configuration review; and (5) manual or agent-assisted setup before considering recurring automation. The explicitly deferred items remain shared cookies, cross-domain identity, audience reuse, automatic publishing or campaign actions, microfrontends, and synchronous Google API calls in reader/admin request paths.

Phase 2 execution is configuration-led and must not change reader behavior, authentication, database relations, or production code unless a separately approved gap is found. Any external submission or account-ownership change must be reported with its exact result. Remaining items after this session must be recorded in the execution log and handed off through this file.

## References

[1]: https://github.com/jaja44-hub/blog/blob/main/NEXT_AGENT_GUIDE.md "Project handoff guide"
[2]: https://github.com/jaja44-hub/blog/blob/main/KNOWN_ISSUES.md "Known issues and safe operating contract"
[3]: https://github.com/jaja44-hub/blog/blob/main/SPRINT_13_ROADMAP_PROPOSAL.md "Sprint 13 roadmap proposal"
[4]: https://github.com/jaja44-hub/blog/blob/main/scripts/sprint11-reader-smoke.sh "Reader smoke script"
[5]: https://github.com/jaja44-hub/blog/blob/main/scripts/sprint11-api-probe.sh "Authenticated admin API probe"
