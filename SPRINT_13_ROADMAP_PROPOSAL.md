# Sprint 13 Roadmap Proposal: Governed Intelligence, Security Hardening, and Optional Publishing

**Status:** Proposal only. This document does not authorize implementation and no project files have been modified beyond this roadmap and its handoff reference. Sprint 13 remains research/discussion-only until the user explicitly approves a bounded milestone and supplies any required production credentials.

**Repository target:** Addis Crown Blog at `https://github.com/jaja44-hub/blog`. The reader-facing canonical publication remains `https://blog.addiscrown.et`; the other Addis Crown property remains a separate application and root domain.

## Executive decision

Sprint 13 should preserve the current two-application, two-database boundary and make the existing read-only intelligence and recommendation governance safer before adding external providers. The recommended path is a hardening-first, server-only, asynchronous adapter architecture. It adds no shared cookies, cross-domain identity, microfrontends, automatic campaign actions, automatic recommendation generation, or Blogger bidirectional synchronization.

The first implementation milestone, if approved, is a non-production or test-path proof that verifies the active Vercel deployment and Neon target, hardens the admin mutation boundary, and ingests one finalized Google Search Console window through an idempotent adapter. Google Ads and AdSense remain separate, opt-in read-only adapters. Blogger is a later, separately approved one-way publishing spike. Every external result is persisted as an auditable snapshot and normalized fact; the Next.js request path reads persisted facts and never performs a long-running provider call.

This recommendation follows the Sprint 12 boundary: the current safe outcome is a staged read-only intelligence contract, deterministic correlation tests, and governed recommendation persistence. It is not live Google synchronization or automatic recommendation generation. The repository evidence is contradictory about completion status, so no implementation should begin until the active deployment, commit, database branch, schema, and authenticated smoke tests are re-verified. Historical handoff and evidence deployment identifiers are not treated as authoritative without a live check.

## 1. Current baseline and governance boundary

The executable stack is Next.js 15.5.25 with React 18.3.1, TypeScript, App Router Route Handlers, Vercel, and Neon PostgreSQL through `@neondatabase/serverless`. `googleapis` is already present at `^178.1.1`, but that dependency proves neither Google authorization nor production access. The working admin boundary is the `ADMIN_ACCESS_TOKEN`-derived session gate. `next-auth` beta.32 is installed but was deferred after compatibility and build failures; it must not replace the working flow without an isolated compatibility spike.

`GET /api/admin/intelligence/overview` is read-only and returns contract version 1. `lib/intelligence.ts` currently computes existing aggregates, does not call Google, does not write records, and does not create recommendations. `correlateSignals()` is pure, bounded to five normalized inputs, reports missing inputs, and returns a null score for empty fixtures. The current intelligence type marks all four source literals as available, so the contract cannot yet represent an unavailable provider even though the roadmap requires that state.

Recommendation persistence is additive and governed. The existing model includes bounded score and confidence, provenance, source snapshots, source timestamps, generation time, active/retired status, retirement metadata, and a deterministic SHA-256-derived idempotency key. Generation and persistence are intentionally separate. A code-level audit gap remains: `retireRecommendation()` writes status, retirement time, reason, and update time but does not write the existing `retired_by` column.

The current boundary permits a small reversible adapter around the normalized contract, but it does not permit treating placeholders as live connectivity. Sprint 13 must retain route-level authorization checks, preserve the verified Neon schema, avoid revival of rolled-back Sprint 10 code, and keep all provider credentials out of the browser, repository, evidence artifacts, and ordinary logs.

## 2. Goals, non-goals, and success definition

### Goals

1. **Re-verify reality before change.** Record the active Vercel deployment ID and commit, `DATABASE_URL` target, Neon branch, schema inventory, environment separation, and authenticated reader/admin smoke-test results.
2. **Harden the existing boundary.** Add shared server-only authorization and DTO conventions, strict request schemas, body and field limits, CSRF protection for cookie-authenticated mutations, rate controls, security headers, narrower image sources, and actor-aware audit events.
3. **Make provider ingestion durable and bounded.** Define source status, freshness, windows, cursors, snapshots, normalized facts, jobs, leases, attempts, and idempotency before any live connection.
4. **Pilot the strongest editorial signal first.** Use finalized Search Console data for page and query opportunity signals, while preserving aggregation type, data state, omissions, row limits, and source freshness.
5. **Keep Ads and AdSense semantically separate.** Report customer/campaign economics and publisher monetization only when their accounts, currencies, time zones, windows, and content mappings are explicit.
6. **Preserve recommendation governance.** Generate only from completed snapshots, require authenticated admin review before persistence or retirement, and retain provenance, source timestamps, snapshots, confidence, and idempotency.
7. **Provide a controlled publishing option.** If separately approved, use Blogger only as a one-way secondary destination: local article and approval state remain canonical, Blogger receives drafts first, and publishing is explicit.

### Explicit non-goals

Sprint 13 does not include live production synchronization without approval; automatic recommendations or campaign actions; cross-domain cookies or identity; shared databases; Vercel Microfrontends or Next.js Multi-Zones; legal-app deployment changes; legal-app user-list export, remarketing identifiers, or case-interest audience reuse; Blogger as source of truth; bidirectional Blogger synchronization; automatic Blogger publishing; a broad authentication rewrite; or a synchronous Google call from a reader or admin overview request.

### Success definition

The milestone is successful only when a reviewer can identify the active deployment and database target, observe a complete read-only source lifecycle from job to snapshot to normalized fact, replay it without duplication, see explicit unavailable/stale/error states, verify that no secrets or sensitive payloads enter logs, and disable the feature without changing canonical editorial behavior. A recommendation is not considered safe merely because an API call succeeded.

## 3. Architecture options and decision

| Option | Description | Fit to current codebase | Decision |
|---|---|---|---|
| A. Hardening-only | Improve auth, request validation, headers, rate controls, audit, deployment probes, and contract types without live provider calls. | Lowest risk and fully compatible with the Sprint 12 boundary. | Required baseline and fallback if access, plan, or approval is unavailable. |
| B. Staged asynchronous adapters | Add server-only GSC, Ads, and AdSense adapters behind the existing intelligence contract. Use Neon for immutable snapshots and facts; use a bounded dispatcher and a durable queue when approved and available. | Best fit. It keeps Route Handlers short and preserves the existing pure intelligence and governed persistence layers. | **Recommended path.** Start with one Search Console property and one finalized window. |
| C. Workflow-backed orchestration | Use durable multi-step workflows for waits, human approvals, or genuinely multi-step provider processes. | Potentially useful later, but no workflow package is installed and the first pilot does not need multi-step orchestration. | Defer until a concrete multi-step requirement and plan/permission review exist. |
| D. Cron plus Neon lease fallback | Cron invokes an authenticated dispatcher; Neon stores the job, lease, attempts, and poison-job state. | Implementable without a queue product, but delivery guarantees are weaker and application-level retry handling is required. | Approved fallback when durable queue products are unavailable or not approved. |
| E. Synchronous provider calls | Call Google APIs from the overview or admin mutation request. | Conflicts with Vercel duration/body limits, provider quotas, retry needs, and the current read-only request contract. | Reject. |
| F. Microfrontends or Multi-Zones | Split the two root-domain applications into Vercel microfrontends or Next.js zones. | Poor fit: these patterns are designed around unique paths on one domain and would add asset, deployment-order, hard-navigation, and security coupling. | Reject for Sprint 13. Reconsider only for an approved move to paths such as `addiscrown.et/blog` and `addiscrown.et/legal`. |

Vercel Queues provide at-least-once delivery, leases, retries, and retention, but no built-in dead-letter queue and no strict FIFO guarantee. Consumers must therefore be idempotent. Vercel Workflows are reserved for later multi-step or human-approval processes. Vercel `waitUntil` or Fluid Compute is suitable only for short best-effort logging, metrics, or cache invalidation; it is not the durable synchronization mechanism. [1] [2] [3] [4] [5]

## 4. Recommended target architecture

The target is a small, server-only ingestion boundary around the existing normalized intelligence contract. The provider adapter owns authentication, pagination, source-specific limits, retries, and source semantics. The ingestion layer owns immutable snapshots, normalized facts, cursor/window state, and job idempotency. The existing intelligence layer reads facts and computes a bounded overview. The existing recommendation layer remains the only governed persistence path.

A typical flow is:

```text
UTC trigger
  -> authenticated dispatcher
  -> job row / idempotency check
  -> queue consumer or Neon lease fallback
  -> one bounded provider page or date window
  -> immutable raw snapshot
  -> normalized facts and source status
  -> governed read-only overview
  -> optional admin-reviewed recommendation draft
  -> existing idempotent recommendation persistence
```

The dispatcher must enqueue job IDs rather than provider payloads. A consumer claims one job in a short database operation, performs one bounded provider operation, writes the snapshot and facts, records an audit event, and acknowledges only after the database commit. Duplicate deliveries must converge through unique keys and upserts. A retry must never create a second recommendation or a second remote publication action.

Use the pooled Neon URL for ordinary one-shot request and job queries. Use a direct connection only for migrations or operations that require session semantics. Do not use session-level advisory locks, temporary-table assumptions, `LISTEN/NOTIFY`, or SQL prepare/deallocate behavior through PgBouncer transaction pooling. A WebSocket pool or client must not outlive a serverless request. [6] [7]

## 5. Phased roadmap and gates

### Phase 0 — Governance and deployment re-verification

**Purpose:** Confirm that the proposed changes target the live system rather than stale evidence.

**Work:** Verify the active Vercel deployment ID, commit, project, environment, and region. Verify the production `DATABASE_URL` target and Neon branch. Inventory applied migrations and relations. Run authenticated and unauthenticated smoke tests for the intelligence endpoint, recommendation reads, recommendation creation, retirement, method-not-allowed responses, and a zero-probe-row check. Confirm that current documentation is reconciled with the active state.

**Acceptance criteria:** The repository records one authoritative deployment/commit and database target; the schema inventory is reproducible; unauthenticated requests receive the expected denial; authorized reads work; protected mutations remain protected; no test row remains in production; and the user has explicitly approved the next phase. If any check fails, stop at Phase 0.

### Phase 1 — Security and contract hardening

**Purpose:** Reduce risk without changing the intelligence architecture.

**Work:** Keep route-level `hasAdminSession()` authorization as the source of truth and add a shared `requireAdmin()` helper or equivalent server-only DAL boundary. Add strict runtime validation for recommendation and retirement inputs, content-type checks, maximum body and string sizes, bounded object depth, and 400/413 responses. Add an Origin allowlist for `https://blog.addiscrown.et` and a CSRF token or same-origin custom-header requirement for browser mutations. Add WAF and application-level rate controls to login/session and mutation paths; do not use in-memory counters as the authoritative limiter.

Add `retired_by` actor propagation, an audit event for login, creation, idempotent retry, retirement, and rejected attempts, and a database rule that requires a retirement reason when status is retired if compatible with the verified schema. Add HSTS only after confirming all relevant subdomains are HTTPS, then add X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a tested CSP or report-only CSP. Narrow image remote patterns to trusted hosts. Verify the locked Next.js 15.5 dependency against the latest supported maintenance patch before deployment; do not assume the currently pinned patch remains sufficient. [8] [9] [10] [11] [12] [13] [14] [15] [16] [17] [18] [19] [20] [21]

**Acceptance criteria:** Every protected handler performs authorization internally; browser-origin mutations fail without the approved CSRF proof; oversized or malformed requests are rejected; rate-control behavior is observable; `retired_by` is populated; rejected actions have correlation IDs and audit records; production responses do not reveal raw errors; headers and image behavior pass a browser smoke test; the lockfile and deployment are tested together; and the existing token flow remains usable.

An Auth.js or Better Auth migration is not part of this phase. A separate spike may test an opaque, revocable Neon-backed session with rotation and idle/absolute expiry, but it must have an isolated build, middleware/proxy, login, logout, and rollback test before replacing the token gate.

### Phase 2 — Additive ingestion contract and job foundation

**Purpose:** Make future synchronization explicit, replayable, and reversible before connecting a provider.

**Work:** On a Neon branch, add additive job/run, source connection, snapshot, normalized fact, cursor, and audit structures. Do not alter the existing recommendation contract destructively or create duplicate relations in an unverified database target. Use a UTC job ID, job type, deterministic idempotency key, payload hash, status, attempt count, lease/started/finished timestamps, last error, source window, source timezone, and deployment correlation. Store raw snapshots immutably with provider, account/property/customer identifier, schema/version, fetched time, data-as-of time, date window, cursor, row count, truncation/coverage indicators, and content hash.

Define separate source status values that can express `available`, `unavailable`, `stale`, `partial`, and `error`, with a sanitized error code. Preserve provider/account/property identity rather than collapsing all sources into one boolean. Facts must be keyed by provider, account/property, date window, timezone, source timestamp, and stable dimension identifiers.

Use a small UTC Vercel Cron dispatcher. If the plan and permissions support Vercel Queues, publish only job IDs. Otherwise use the Cron plus Neon lease fallback and explicitly accept weaker delivery guarantees. Cron is a trigger, not a durable record of work. [3] [4] [5]

**Acceptance criteria:** A Neon branch test proves migrations, indexes, upserts, lease acquisition, lease expiry, bounded retries, duplicate delivery convergence, and poison-job handling. The dispatcher authenticates independently of the admin browser session. A consumer acknowledges only after commit. A forced timeout leaves a retryable job. A permanent failure becomes visible without an unbounded retry loop. A deployment smoke record captures deployment ID, commit, database branch, and zero probe rows.

### Phase 3 — Search Console read-only pilot

**Purpose:** Deliver the first useful editorial signal with the lowest cross-product semantic risk.

**Work:** Connect one approved Search Console property with least-privilege read-only OAuth. Pull finalized data no earlier than the provider's normal processing window; a conservative daily T-3 window is appropriate for the pilot. Partition by property and search type. Page through `rowLimit` up to 25,000 and retain `startRow`, `aggregationType`, `dataState`, query dimensions, coverage indicators, and source timestamps. Do not claim that detailed page/query rows are a complete truth table; Google may omit rows and page/property aggregation has different semantics. Reserve expensive long-range recomputation for an explicit admin action. [22] [23] [24]

Normalize clicks, impressions, CTR, position, page, query where present, device, country, and search appearance without fabricating missing values. Expose freshness and partial status in the overview. Feed recommendations only from a completed snapshot and retain the snapshot ID and source window in the recommendation provenance.

**Acceptance criteria:** One property can be connected without exposing a refresh token to the browser; a finalized window completes or reports a visible partial/error state; retries and duplicate runs converge; quotas and 429s trigger bounded backoff; truncated or omitted data is not presented as zero; the overview remains fast because it reads Neon facts; and a reviewer can trace a recommendation back to the exact snapshot, window, and source timestamp.

### Phase 4 — Optional Google Ads and AdSense reporting

**Purpose:** Add acquisition and publisher economics only after the Search Console pilot and explicit access approval.

**Google Ads:** Verify the Google Cloud project, production-capable developer-token access level, OAuth or service-account authorization, manager hierarchy, `login-customer-id`, customer roles, and explicit property-to-customer mapping. A normal Cloud OAuth client and the installed `googleapis` package do not establish Ads production access. Node has no Google-maintained official Ads client library, so isolate the adapter and its API-version/resource names. Start read-only, one customer, one bounded report window, and no mutate services. Preserve customer ID, campaign/resource identity, GAQL version, final URL, timezone, and source window. Do not label the existing `adRevenue / adSpend` ratio as Google Ads ROAS unless spend and revenue are proven to cover the same population. [25] [26] [27] [28] [29] [30] [31]

**AdSense:** Use the Management API with `adsense.readonly`. Store account, site, ad unit/channel dimensions, report currency, timezone, date window, row limit, total matched rows, and truncation state. Do not infer zero revenue from an omitted or truncated report. Keep AdSense publisher revenue separate from Ads spend and Search Console traffic until an explicit mapping and attribution policy exists. Respect published request and row quotas with bounded daily reports and backoff. [32] [33] [34]

**Acceptance criteria:** Each provider has independent connection, status, freshness, quota, and error reporting; a failed Ads or AdSense source does not make GSC unavailable; cross-source scores are disabled unless a documented content/account mapping is complete; 64 MB Ads responses, AdSense truncation, 429s, and provider schema changes are tested; credentials remain server-side; and all recommendations identify every source and window used.

For credential strategy, prefer Vercel OIDC Workload Identity Federation over stored GCP service-account keys where the project, IAM pool/provider, audience, subject mapping, and service-account-user bindings are correctly configured. WIF removes long-lived GCP JSON keys but does not grant Google Ads customer access; Ads roles, linking, and production access remain separate prerequisites. For user-owned accounts, use an offline OAuth web flow with least-privilege scopes and encrypted refresh-token storage. [35] [36] [37] [38]

### Phase 5 — Optional controlled Blogger publisher spike

**Purpose:** Test a one-way secondary publication channel without weakening Addis Crown editorial governance.

**Work:** Start with `blogger.readonly` discovery against a non-production test blog. If approved, use a dedicated OAuth client/account with the broad Blogger write scope only for the target blog. Add a local publication mapping containing canonical article ID, provider, Blogger blog/post ID, remote status, content hash, local and remote timestamps, last error, and action ID. On explicit admin approval, create or update a Blogger draft. Require a separate explicit publish or schedule action. Refetch the remote admin view after mutation and reconcile status and hash. Use narrow PATCH updates rather than blind PUT where possible.

Keep `https://blog.addiscrown.et` canonical. Do not import remote edits automatically, let Blogger publish from recommendation actions, or treat labels as equivalent to local categories and evidence. If Blogger is reverted remotely, create a reconciliation alert or local exception. Validate Amharic rendering, HTML, media URLs, canonical metadata, time zones, scheduling, quota/backoff, and duplicate-action recovery in a test blog. [39] [40] [41] [42] [43] [44] [45] [46] [47] [48] [49] [50] [51] [52]

**Acceptance criteria:** A draft can be created and reconciled with a stable local action record; repeated action delivery does not create an uncontrolled duplicate; publish and schedule require separate explicit approval; remote divergence is visible; emergency revert instructions are tested; the OAuth token is never in browser code or logs; and SEO/rendering review approves the output before any public syndication.

### Phase 6 — Review, enablement, and deferred work

**Purpose:** Decide whether any pilot becomes an operational feature.

Enablement requires a completed security review, quota and cost review, deployment-target evidence, rollback rehearsal, data-retention decision, legal/privacy review for any cross-site use, and explicit user approval. If a gate is not met, retain the code path disabled or stop at the hardening-only outcome.

## 6. Data contracts

### Source status and overview

The current `IntelligenceOverview` should evolve from an all-available literal to a per-source status object. A conceptual v2 shape is:

```ts
type SourceStatus = {
  source: "search_console" | "google_ads" | "adsense";
  status: "available" | "unavailable" | "stale" | "partial" | "error";
  accountRef: string;
  window: { start: string; end: string; timezone: string };
  dataAsOf: string | null;
  fetchedAt: string | null;
  snapshotId: string | null;
  rowCount: number | null;
  coverage: "complete" | "truncated" | "unknown";
  errorCode: string | null;
};
```

This is a contract sketch, not an instruction to edit the repository immediately. It must be finalized against the actual TypeScript types and migration conventions after approval. Unknown, unavailable, stale, partial, and error must remain distinguishable from zero.

### Job and snapshot identity

Every job has a deterministic idempotency key covering provider, account/property, operation, date window, timezone, and cursor. It also records payload hash, status, attempt count, lease timestamps, source-window metadata, deployment ID, and a sanitized last error. Every snapshot is immutable and records provider, account/property/customer ID, source API version or report shape, request window, source timestamp, fetch time, cursor/page, row count, truncation or coverage state, and content hash. A normalized fact references the snapshot and retains provider-specific dimension identity.

### Recommendation contract

Only completed snapshots can supply recommendation inputs. The existing bounded score/confidence checks remain authoritative. Each recommendation retains source snapshots, source timestamps, provenance, generation time, normalized input identity, and deterministic idempotency. Retirement records actor, time, reason, and status; no hard delete is introduced. A recommendation must not imply causality when source windows or populations differ.

### Blogger publication contract

Blogger publication is an action record, not a recommendation side effect. The local mapping stores canonical article ID, provider, blog/post IDs, local content hash, remote content hash, remote status, action ID, action type, approval actor, timestamps, and last error. Remote status is reconciled but does not replace local editorial state.

## 7. Security and privacy requirements

All Google calls and token handling are server-only. Search Console uses read-only access. AdSense uses `adsense.readonly`. Google Ads access is read-only and customer-scoped during the pilot. Blogger discovery uses `blogger.readonly`; write access is a separately approved broad scope. Refresh tokens, service-account material, `DATABASE_URL`, and raw provider payloads are never committed, returned to the browser, placed in workflow inputs, or emitted to logs.

A shared manager identity must never be treated as a shared property identity. Store explicit customer IDs and property mappings. Enforce property/customer scope in the adapter and database tenancy boundary. Default to read-only. WIF configuration must use least-privilege IAM and exact subject/audience mappings. It is an authentication transport, not an Ads authorization grant.

Do not share legal-app audience lists, remarketing identifiers, case-interest events, or user-level behavior with blog campaigns without formal legal/privacy review and confirmation that Google policy permits the use. Begin with contextual advertising and aggregated property-level reporting. Brand sharing is lower risk: use a versioned crawlable HTTPS logo and Organization JSON-LD on each site, with each site's own `url` and appropriate `sameAs` links. This signals common ownership without unifying databases, cookies, or authentication. [50] [51]

Keep the current token gate until any replacement passes an isolated compatibility spike. Add CSRF protection because cookie-authenticated POST, PATCH, and DELETE routes remain browser-sensitive even with `SameSite=Lax`. Keep state changes out of GET. Add rate controls at the edge and application layer. Narrow remote image hosts and test security headers against the deployed analytics, ads, and media behavior.

## 8. Observability and operations

Every dispatcher, consumer, provider request, database write, recommendation action, and Blogger action should carry a correlation ID and, where applicable, job ID, attempt, deployment ID, provider, account/property reference, duration, row count, outcome, and sanitized error code. Log metadata, not tokens, full query payloads, raw HTML, raw legal-app data, or `DATABASE_URL`.

Use Vercel logs and Observability for function errors, traces, duration, and status. Use Neon monitoring, active-query inspection, query performance, logs, and `pg_stat_statements` where available. Define alerts before enablement for repeated 5xx, 429, timeouts, lease expiry, poison jobs, stale source windows, failed migrations, and deployment/database-target mismatch. Do not invent a false freshness guarantee: Search Console commonly lags by two to three days, while Ads and AdSense processing windows differ. [56] [57]

Admin, session-dependent, and recommendation-management responses remain uncached with `force-dynamic` and `no-store` or equivalent private behavior. Public articles, feeds, and non-sensitive aggregate responses may use Next Data Cache/ISR or CDN stale-while-revalidate only with explicit tags and no cookie-varying data. Revalidate after a successful commit, not before. Never cache admin data, provider credentials, or personalized responses. [58] [59]

## 9. Rollback and failure handling

The feature is disabled by default behind configuration and deployment controls. To roll back, stop the dispatcher or consumer, revoke or disable provider connection records, prevent new recommendation generation, and leave immutable snapshots for audit. Existing canonical articles, admin routes, and governed recommendations remain operational. Additive job tables can be left inert; do not perform destructive rollback migrations against an unverified target.

Provider retries use bounded exponential backoff. Duplicate queue delivery, overlapping Cron runs, and replayed jobs converge through deterministic keys and transactional upserts. A job that exceeds the attempt policy becomes a visible poison job requiring an explicit operator decision; it must not retry forever. If Queues or Workflows are unavailable, the Neon lease fallback is acceptable only with the weaker guarantee documented.

Google access rollback means disabling the adapter, revoking the relevant OAuth grant or service-account binding, and removing the source connection from active scheduling. It does not require deleting historical snapshots. Blogger rollback means stop publication actions, reconcile the remote admin status, and use the documented remote revert-to-draft procedure when an already published copy must be withdrawn. A remote Blogger revert is an exception to reconcile, not a silent local article transition.

Every release must have a deployment smoke test that records active commit, Vercel deployment ID, database branch/target, migration state, 401/authorized behavior, rate-limit behavior, and zero probe rows. This directly addresses the repository's prior Vercel/Neon target drift and opaque mutation failures.

## 10. Cost and configuration controls

No paid Vercel, Queue, Workflow, WAF, Neon, or Google capability is assumed. Before selecting Queues or Workflows, verify the project's plan, product permissions, regional availability, retention, and pricing. Vercel function limits make large historical synchronization unsuitable for one invocation: documented request/response body limits are 4.5 MB, with duration limits dependent on plan. Split ingestion by provider, date window, page, and checkpoint. [2]

Vercel Queues retain messages from 60 seconds to seven days, with a default of 24 hours, and deliver at least once. The absence of a built-in DLQ means poison-job state belongs in the application contract. Workflows may retain step/run inputs and outputs; keep credentials and raw sensitive responses out of workflow inputs.

Neon branching is the default pre-production test mechanism for schema and backfill work. Scale to Zero can reduce cost for an intermittent blog but adds wake-up latency; disabling it is a deliberate latency-versus-cost choice. Pooled connections are for request/job queries; direct connections are for migrations or session-dependent work. Data retention, snapshot retention, audit retention, and source connection rotation must be agreed before production enablement. [6] [60] [61]

Configuration must be split into non-secret identifiers and protected credentials. Non-secret configuration includes provider/account/property IDs, customer mappings, UTC schedule, source windows, feature flags, and retry/attempt policy. Protected configuration includes OAuth client secrets, encrypted refresh-token references, WIF/IAM identifiers, queue credentials if required, cron authorization material, and database URLs. Exact environment-variable names should follow the repository's existing conventions and must not be invented or committed as part of this proposal.

## 11. Deferred scope

The following items are intentionally deferred: microfrontends and root-domain unification; shared cookies and cross-domain identity; legal-app data export or audience reuse; automatic campaign creation, mutation, bidding, or budget changes; same-day causal cross-source recommendations; production Google Ads synchronization before project and developer-token approval; a broad Auth.js/Better Auth migration; Blogger bidirectional sync or Blogger-first editorial workflows; automatic Blogger publishing; long-range Search Console recomputation as a routine job; workflow adoption without a multi-step requirement; and any data model rewrite that replaces the verified Sprint 12 recommendation contract.

## 12. Approval checklist and open decisions

Approval should be recorded separately for the hardening-only baseline; the one-property Search Console pilot; Ads customer and hierarchy access; AdSense account access; Blogger test-blog write access; Vercel Queues or Cron-plus-Neon fallback; any Workflow adoption; OAuth/WIF credential strategy; source retention; cost ceilings; legal/privacy review; and any cross-site brand or audience treatment.

The immediate decision is whether to authorize Phase 0 and Phase 1 only. No external credential or production migration is needed to begin those phases. The first external decision is whether to authorize one read-only Search Console property in a non-production/test path after the deployment and database checks pass.

## References

[1]: https://vercel.com/docs/fluid-compute "Vercel Fluid Compute"
[2]: https://vercel.com/docs/functions/limitations "Vercel Functions limitations"
[3]: https://vercel.com/docs/queues/concepts "Vercel Queues concepts"
[4]: https://vercel.com/docs/workflows "Vercel Workflows"
[5]: https://vercel.com/docs/cron-jobs "Vercel Cron Jobs"
[6]: https://neon.tech/docs/serverless/serverless-driver "Neon serverless driver"
[7]: https://neon.tech/docs/connect/connection-pooling "Neon connection pooling"
[8]: https://nextjs.org/docs/app/guides/data-security "Next.js data security"
[9]: https://nextjs.org/docs/app/guides/authentication "Next.js authentication"
[10]: https://nextjs.org/docs/app/getting-started/route-handlers "Next.js Route Handlers"
[11]: https://nextjs.org/docs/app/api-reference/file-conventions/proxy "Next.js Proxy"
[12]: https://nextjs.org/docs/app/guides/content-security-policy "Next.js Content Security Policy"
[13]: https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers "Next.js headers configuration"
[14]: https://vercel.com/kb/guide/add-rate-limiting-vercel "Adding rate limiting on Vercel"
[15]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html "OWASP Session Management Cheat Sheet"
[16]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_FORGERY_Prevention_Cheat_Sheet.html "OWASP Cross-Site Request Forgery Prevention Cheat Sheet"
[17]: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html "OWASP REST Security Cheat Sheet"
[18]: https://nextjs.org/blog/CVE-2025-66478 "Next.js CVE-2025-66478"
[19]: https://nextjs.org/blog/august-2026-security-release "Next.js August 2026 security release"
[20]: https://authjs.dev/getting-started/installation "Auth.js installation"
[21]: https://github.com/jaja44-hub/blog "Addis Crown Blog repository"
[22]: https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data "Search Console data"
[23]: https://developers.google.com/webmaster-tools/v1/searchanalytics/query "Search Analytics query"
[24]: https://developers.google.com/webmaster-tools/limits "Search Console usage limits"
[25]: https://developers.google.com/google-ads/api/docs/reporting/overview "Google Ads reporting overview"
[26]: https://developers.google.com/google-ads/api/docs/best-practices/quotas "Google Ads quotas"
[27]: https://developers.google.com/google-ads/api/docs/api-policy/access-levels "Google Ads API access levels"
[28]: https://developers.google.com/google-ads/api/docs/oauth/access-model "Google Ads OAuth access model"
[29]: https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy "Google Ads account hierarchy"
[30]: https://developers.google.com/google-ads/api/docs/client-libs "Google Ads client libraries"
[31]: https://developers.google.com/google-ads/api/docs/api-policy/developer-token "Google Ads developer token policy"
[32]: https://developers.google.com/adsense/management/ "AdSense Management API"
[33]: https://developers.google.com/adsense/management/reference/rest/v2/accounts.reports/generate "AdSense report generation"
[34]: https://developers.google.com/adsense/management/appendix/limits "AdSense limits"
[35]: https://developers.google.com/identity/protocols/oauth2/web-server "Google OAuth 2.0 for web server applications"
[36]: https://vercel.com/docs/oidc/gcp "Vercel OIDC with Google Cloud"
[37]: https://docs.cloud.google.com/iam/docs/best-practices-service-accounts "Google Cloud service-account best practices"
[38]: https://developers.google.com/google-ads/api/docs/oauth/overview "Google Ads OAuth overview"
[39]: https://developers.google.com/blogger/docs/3.0/using "Blogger API usage"
[40]: https://developers.google.com/blogger/docs/3.0/reference/posts "Blogger Posts resource"
[41]: https://developers.google.com/blogger/docs/3.0/reference/posts/insert "Blogger posts.insert"
[42]: https://developers.google.com/blogger/docs/3.0/reference/posts/publish "Blogger posts.publish"
[43]: https://developers.google.com/blogger/docs/3.0/reference/posts/update "Blogger posts.update"
[44]: https://developers.google.com/blogger/docs/3.0/reference/posts/patch "Blogger posts.patch"
[45]: https://developers.google.com/blogger/docs/3.0/reference/posts/list "Blogger posts.list"
[46]: https://developers.google.com/blogger/docs/3.0/reference/posts/revert "Blogger posts.revert"
[47]: https://developers.google.com/identity/protocols/oauth2/scopes "Google OAuth 2.0 scopes"
[48]: https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification "Google OAuth sensitive-scope verification"
[49]: https://github.com/googleapis/google-api-nodejs-client "Google APIs Node.js client"
[50]: https://developers.google.com/search/docs/appearance/structured-data/organization "Organization structured data"
[51]: https://support.google.com/adspolicy/answer/143465?hl=en "Google Ads personalized advertising policy"
[52]: https://vercel.com/docs/observability "Vercel Observability"
[53]: https://neon.tech/docs/introduction/monitoring "Neon monitoring"
[54]: https://vercel.com/docs/caching/runtime-cache/data-cache "Vercel Data Cache"
[55]: https://vercel.com/docs/caching/cache-control-headers "Vercel cache-control headers"
[56]: https://neon.tech/docs/introduction/branching "Neon branching"
[57]: https://neon.tech/docs/introduction/scale-to-zero "Neon scale to zero"
[58]: https://support.google.com/adspolicy/answer/143465?hl=en "Google Ads personalized advertising policy"
[59]: https://developers.google.com/google-ads/api/docs/oauth/access-model "Google Ads account access model"
[60]: https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy "Google Ads customer hierarchy"
[61]: https://developers.google.com/google-ads/api/docs/client-libs "Google Ads client library availability"
[62]: https://developers.google.com/google-ads/api/docs/api-policy/developer-token "Google Ads developer-token requirements"
[63]: https://developers.google.com/blogger/docs/3.0/reference/posts/insert "Blogger draft insertion"
[64]: https://developers.google.com/blogger/docs/3.0/reference/posts/publish "Blogger publishing and scheduling"
[65]: https://developers.google.com/blogger/docs/3.0/reference/posts/revert "Blogger revert"
[66]: https://developers.google.com/identity/protocols/oauth2/scopes "Google OAuth scope catalog"
[67]: https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification "Google OAuth production readiness"
[68]: https://vercel.com/docs/oidc/gcp "Vercel Google Cloud Workload Identity Federation"
[69]: https://docs.cloud.google.com/iam/docs/best-practices-service-accounts "Cloud IAM service-account best practices"
[70]: https://developers.google.com/identity/protocols/oauth2/overview "Google OAuth overview"
[71]: https://developers.google.com/google-ads/api/docs/reporting/overview "Google Ads reporting"
[72]: https://developers.google.com/google-ads/api/docs/best-practices/quotas "Google Ads quotas and pagination"
[73]: https://developers.google.com/adsense/management/reference/rest/v2/accounts.reports/generate "AdSense reports.generate"
[74]: https://developers.google.com/adsense/management/appendix/limits "AdSense report limits"
[75]: https://developers.google.com/blogger/docs/3.0/using "Blogger API"
[76]: https://nextjs.org/docs/app/guides/data-security "Next.js data-security guidance"
[77]: https://nextjs.org/docs/app/guides/authentication "Next.js authentication guidance"
[78]: https://nextjs.org/docs/app/guides/content-security-policy "Next.js CSP guidance"
[79]: https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers "Next.js response headers"
[80]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html "OWASP session management"
[81]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_FORGERY_Prevention_Cheat_Sheet.html "OWASP CSRF prevention"
[82]: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html "OWASP REST security"
[83]: https://vercel.com/docs/microfrontends "Vercel Microfrontends"
[84]: https://vercel.com/docs/microfrontends/routing "Vercel Microfrontends routing"
[85]: https://nextjs.org/docs/app/guides/multi-zones "Next.js Multi-Zones"
[86]: https://www.addiscrown.et "Addis Crown web property"
[87]: https://blog.addiscrown.et "Addis Crown blog property"
[88]: https://developers.google.com/identity/protocols/oauth2/overview "Google OAuth 2.0 overview"
[89]: https://developers.google.com/google-ads/api/docs/oauth/overview "Google Ads OAuth overview"
[90]: https://developers.google.com/google-ads/api/docs/oauth/access-model "Google Ads access model"
[91]: https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy "Google Ads hierarchy"
[92]: https://developers.google.com/google-ads/api/docs/api-policy/access-levels "Google Ads API access levels"
[93]: https://developers.google.com/google-ads/api/docs/api-policy/developer-token "Google Ads developer token"
[94]: https://developers.google.com/adsense/management/ "Google AdSense Management API"
[95]: https://developers.google.com/blogger/docs/3.0/using "Blogger API"
[96]: https://github.com/googleapis/google-api-nodejs-client "Google APIs Node.js client"
[97]: https://github.com/jaja44-hub/blog "Addis Crown Blog repository"
