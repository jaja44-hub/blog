# Known Issues and Safe Operating Contract

**Updated:** 2026-09-19

## Active issues

### NextAuth v5 integration remains deferred

Production admin access intentionally uses the token-based `ADMIN_ACCESS_TOKEN` gate. NextAuth v5 integration was deferred after earlier compatibility/build errors. Do not replace the working token flow without a separate compatibility plan and end-to-end verification.

### Integration modules remain partially scaffolded

Google Ads, AdSense, and some analytics surfaces remain placeholder or integration-ready modules. Do not treat placeholder data as evidence of live Google connectivity. Real credentials require a separate approved Sprint 13 research and implementation decision.

### Knowledge-source deletion preserves article evidence

`DELETE /api/admin/knowledge-sources/:id` rejects article-linked sources with HTTP 409 because `source_usage` foreign keys are intentionally not cascaded. This prevents deleting evidence attached to published or drafted articles. Delete only unused sources, or first implement an explicit evidence-reassignment workflow.

### Historical documentation was sanitized

Tracked files must not contain admin tokens, database passwords, or full connection strings. Load `ADMIN_ACCESS_TOKEN` and `DATABASE_URL` from protected environment configuration. Historical evidence uses redacted placeholders.

## Resolved issues

### Vercel/Neon target mismatch

Resolved in Sprint 11. Vercel production now targets the verified Neon production branch. Re-check the actual Vercel environment target before applying any future schema migration.

### Sprint 11 probe cleanup mismatch

Resolved in this task. The knowledge-source resource is dynamic and must be deleted with `DELETE /api/admin/knowledge-sources/:id`, not `DELETE /api/admin/knowledge-sources?id=...`.

## Safe operating contract

Preserve the verified Neon relation inventory. Do not create duplicate tables to address a runtime failure until the Vercel database target has been compared with the Neon branch. Run the authenticated API probe and reader smoke scripts after deployment. Set `ADMIN_ACCESS_TOKEN` in the shell before running the API probe; never hard-code it. Remove every successful probe record and verify zero test rows remain.

When editing production settings, record the exact deployment ID, commit, target branch, and verification result in `EXECUTION_LOG.md`. Keep Sprint 13 research-only until explicit user approval is present.


### Sprint 13 Phase 1 admin-boundary hardening

Phase 1 is deployed in commit `8a31667` and verified by Vercel deployment `dpl_9qc4yL1cJWiPBDCF7a1eWaad8NpT`. Admin browser mutations reject cross-origin requests and oversized request bodies. Defensive response headers are applied by middleware, and the production admin cookie is explicitly secure. Recommendation inputs are bounded and identifier-validated. Deterministic tests and production unauthenticated/security checks passed. The authenticated admin regression remains a follow-up when a protected `ADMIN_ACCESS_TOKEN` is available to the executing agent.
