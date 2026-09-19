# Sprint 11 Update Summary

**Updated:** 2026-09-19  
**Repository:** `jaja44-hub/blog`  
**Current source commit:** `7c432b8` before the knowledge-source deletion hardening commit in this task  
**Production:** `https://blog.addiscrown.et`

## Completed remediation

Sprint 11 end-to-end testing found PostgreSQL missing-relation errors in Vercel production even though the verified Neon production branch contained the required schema. The root cause was a database-target mismatch: Vercel production pointed to a different Neon endpoint than branch `br-orange-rain-awpyfg18` in project `restless-cake-31725040`. The Vercel production `DATABASE_URL` was corrected, and deployment `dpl_J62sQV5xPM32eMDSXphCyVhjN2Bg` reached READY from commit `7c432b8`.

The verified Neon branch contains all 18 relations required by the Sprint 5–9 admin modules. No migration was applied because the relations already existed and duplicate creation would have been unsafe.

## Regression evidence

The authenticated production matrix passed session creation, admin GET routes, controlled POST creation for content opportunities, knowledge sources, media, and Search Console, and cleanup for successful records. The reader smoke matrix passed all tested reader pages, representative posts, category pages, feeds, robots, and sitemap routes with HTTP 200. Vercel runtime logs for the corrected deployment showed no missing-relation errors.

## Knowledge-source delete hardening

The admin UI already exposes a delete action for each knowledge source. This task hardens that existing path rather than duplicating it:

- UI path: `components/AdminWorkspace.tsx`
- API path: `DELETE /api/admin/knowledge-sources/:id`
- Database helper: `lib/knowledge-sources.ts`
- Missing source: HTTP 404
- Article-linked source protected by `source_usage`: HTTP 409 with a safe explanatory message
- Successful unused-source deletion: HTTP 200
- UI requires explicit confirmation before deletion
- Probe cleanup uses the dynamic `/:id` endpoint rather than the incorrect collection query-string endpoint

The deletion policy preserves referential integrity. It does not cascade-delete article evidence.

## Handoff method

Future agents should read `NEXT_AGENT_GUIDE.md`, `PROGRESS_SUMMARY.md`, this summary, `KNOWN_ISSUES.md`, `EVIDENCE_SPRINT_11_END_TO_END_TESTING.md`, `EVIDENCE_SPRINT_11_FINAL_REGRESSION.md`, and `EVIDENCE_SPRINT_11_SCHEMA_COMPARISON.md` before making changes. They should inspect the live Vercel deployment and Neon branch identifiers rather than assuming a local environment matches production.

Credentials must be loaded from protected environment variables. No token or connection string belongs in tracked source, scripts, evidence, or handoff files.

## Scope boundaries

Sprint 12 security, performance, and operational hardening remains open. Sprint 13 remains research-only until the user approves an implementation plan and supplies real Google API credentials. No legal-app deployment, root-domain configuration, Google campaign, or production credential integration was changed in Sprint 11.
