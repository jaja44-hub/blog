# Sprint 13 Roadmap Proposal: Production Readiness, Google Ownership, and Practical Monetization

**Status:** Phase 0/1 complete. Sprint 13 Phase 2 is **approved; execution started and partially complete** as a configuration-led workstream. This approval does not authorize code changes, database migrations, destructive account changes, paid campaigns, purchases, or legal/financial attestations without separate confirmation at the point of action.

> **REPOSITORY CONTINUITY RULE:** Every plan, research result, implementation, test result, known issue, deployment record, and handoff decision must be saved in this repository and committed to GitHub. The repository is the continuity memory for future agents and account handovers; important context must not remain only in chat or a temporary sandbox.

**Repository:** `https://github.com/jaja44-hub/blog`
**Canonical blog:** `https://blog.addiscrown.et`
**Other Addis Crown property:** Separate application and root domain.

## Executive decision

The revised Sprint 13 priority is **not** to build a general-purpose integration platform first. The priority is to make the existing blog dependable, complete practical Google ownership and indexing setup, and prepare for AdSense and Google Ads using the simplest safe configuration.

The recommended order is:

1. Verify the real live Vercel deployment, database target, reader routes, and admin operations.
2. Apply only focused hardening that protects everyday blogging and administration.
3. Organize both Addis Crown domains under one consistent brand and Google ownership structure without merging their users or databases.
4. Complete Search Console ownership, sitemap, indexing, and canonical-domain work.
5. Prepare AdSense and Google Ads configuration manually or with periodic agent assistance before building embedded automation.
6. Add a small Search Console read-only integration only if repeated manual reporting proves inefficient.
7. Add AdSense or Google Ads reporting inside the application only when the practical value justifies the maintenance cost.

This approach reaches publishing, indexing, and monetization readiness sooner and avoids spending development credits on integrations that can be completed as one-time or periodic account-configuration tasks.

## What the current system already provides

The production application is a Next.js blog on Vercel with Neon PostgreSQL and a token-gated admin area. Earlier work provides reader-facing pages, content and editorial operations, knowledge-source management with safe deletion rules, media operations, analytics foundations, content-planning foundations, a read-only intelligence overview, deterministic correlation tests, and governed recommendation storage.

The recommendation model can preserve explanation, source information, score, confidence, idempotency, and retirement reason. It is suitable for human-reviewed suggestions. It is not evidence that live Google Search Console, Google Ads, or AdSense synchronization is currently active.

The current intelligence overview reads information already stored in the database. It does not need to be changed merely to connect a Google Cloud project, verify domains, submit a sitemap, request indexing, apply for AdSense, or configure a Google Ads account.

## Revised product goals

### Goal 1: Stabilize the finished blog

Confirm that the public reader experience, admin login, content management, knowledge-source actions, media actions, and recommendation actions are working against the real production deployment and correct Neon database.

### Goal 2: Protect everyday admin work

Improve only the protections that directly reduce blogging risk: safer browser-origin checks for state-changing actions, strict input limits, clearer error handling, basic audit information, repeated-action controls, trusted media configuration, and regression checks for reader and admin routes.

A replacement authentication system is not part of this immediate roadmap. The current token flow should remain in place until any alternative passes an isolated compatibility test.

### Goal 3: Create one clear Addis Crown brand and Google ownership arrangement

Use one Google Cloud project or Google account structure where it is genuinely useful for API and property administration. Keep the blog and legal application as separate applications, databases, and visitor systems.

The goal is **shared ownership and brand clarity**, not shared visitor login. Consistent brand information, verified domains, Search Console properties, Organization details, and appropriate links can show common ownership without shared cookies or cross-domain identity.

### Goal 4: Become ready for indexing and earnings

Prioritize manual or agent-assisted completion of Search Console verification, sitemap submission, URL inspection, canonical-domain checks, blog quality requirements, AdSense readiness, and Google Ads account configuration.

These tasks should not be turned into permanent application features unless the repeated work later proves expensive or error-prone.

### Goal 5: Automate only proven recurring work

If repeated Search Console or earnings review becomes burdensome, add a small read-only background integration later. It should read persisted reports and show freshness and source information. It should not run Google calls during ordinary reader page loads and should not automatically publish content or change advertising budgets.

## What is deliberately removed from the active Sprint 13 scope

The following items are removed from the active implementation plan:

- Blogger or secondary-site publishing integration.
- Vercel Microfrontends and Next.js Multi-Zones.
- Shared cookies and shared visitor login across the two applications.
- Legal-app user-list export, legal-app remarketing reuse, and case-interest audience sharing.
- Automatic article publishing.
- Automatic campaign creation, budget changes, bidding, or optimization.
- A broad workflow, queue, or durable synchronization platform before a recurring business need is proven.
- Synchronous Google API calls from reader or ordinary admin request paths.
- A broad authentication replacement before an isolated compatibility spike.

Blogger may remain a future idea, but it is not worth Sprint 13 effort while the existing Vercel/Next.js blog is the canonical publication.

## Important distinction: shared brand versus shared identity

A single Google Cloud project is an administrative and API container. It does not require the two websites to share user accounts, cookies, databases, or sessions.

### Useful now: shared brand and ownership

This can include:

- Consistent Addis Crown name, logo, and ownership information.
- Search Console verification for each domain.
- One clearly managed Google account or organization structure.
- Correct Google Cloud project configuration for approved APIs.
- Appropriate public links between the properties.
- Organization structured data and canonical website information.
- Separate sitemaps and indexing checks for each site.

### Deferred: shared visitor identity

One visitor login across both domains is a separate product feature. It would require shared session management, logout behavior, permissions, privacy rules, and additional security testing. It is not required for publishing, indexing, AdSense approval, or Google Ads configuration.

## Revised phases

### Phase 0 — Verify the real production system

Record the active Vercel deployment, commit, environment, production domain, database target, Neon branch, applied schema, and current reader/admin smoke results. Confirm that test rows and temporary probe artifacts are absent.

**Gate:** Stop if the active deployment and database target cannot be identified or if reader/admin behavior is not reproducible.

### Phase 1 — Focused blogging and admin hardening

Keep the existing admin login. Add or verify browser-origin protection for state-changing requests, strict request validation, body and field limits, clear safe error responses, important-action audit details, repeated-action limits, security headers, and trusted image/media hosts. Preserve the current content and reader workflows.

Also verify the existing recommendation retirement path records the responsible administrator where the schema supports it. Keep all changes reversible and test them through the real reader and admin smoke paths.

**Gate:** The blogger can log in, manage content, manage sources and media, review recommendations, and receive clear safe outcomes without changing the normal publishing process.

### Phase 2 — Brand, Google Cloud, and property ownership setup

**Approval status (2026-09-20): APPROVED AND READY TO BE EXECUTED.** Execution is limited to configuration-led brand/domain alignment, Google Cloud/property ownership review, Search Console/indexing readiness, AdSense readiness, and Google Ads ownership/configuration review. Shared cookies, cross-domain identity, audience reuse, automatic publishing/campaign actions, microfrontends, and synchronous Google API calls in reader/admin request paths remain deferred.

This phase should be handled mainly through ordinary Google account configuration, manual work, or periodic AI-agent assistance rather than new application features.

Confirm the appropriate Google account or organization owns the Addis Crown properties. Verify both domains in Search Console. Confirm the blog’s canonical domain, sitemap, robots behavior, URL inspection, indexing status, Organization information, logo, and public brand links. Keep the blog and legal application as separate Search Console properties unless Google’s own property model justifies a grouping.

Create or confirm one Google Cloud project where shared API administration is useful. Configure only the APIs and OAuth credentials actually needed. Do not assume that one Cloud project automatically grants access to Google Ads customers, Search Console properties, or AdSense accounts; each service still requires its own property, account, permission, and policy checks.

**Gate:** Both properties have clear ownership, correct canonical information, working sitemap/indexing procedures, and documented account ownership without shared visitor identity.

### Phase 3 — AdSense and Google Ads readiness

Prepare AdSense through the normal publisher process. Confirm domain ownership, required site quality and publisher information, policy pages, contact information, and ad-placement readiness. Add advertising carefully after approval and review the result as a reader.

Confirm the correct Google Ads account/customer ID, Google Cloud project relationship, billing ownership, API eligibility if API access is actually needed, and any conversion or landing-page mapping. Keep campaigns and budgets under human control initially. A Google Ads API connection is not required just to configure or operate an ordinary Google Ads account.

Keep AdSense earnings, Google Ads costs, and Search Console traffic separate. They use different reporting meanings, dates, currencies, permissions, and attribution. Do not present a combined profit or return figure until the data relationships have been proven.

**Gate:** Account ownership, policy status, billing responsibility, and manual reporting are clear before any embedded automation is considered.

### Phase 4 — Optional Search Console reporting assistance

Only after Phases 0–3 are useful and stable should the project decide whether a built-in read-only Search Console view is worth maintaining.

The first possible automation should be one property, one finished reporting window, read-only access, and visible source date and completeness. It should help answer which articles appear in search, which pages have impressions but weak clicks, and which topics deserve review.

A manual or periodic agent-assisted process remains acceptable. The application should not make Google calls during ordinary reader requests. If automation is approved later, it should run as a bounded background or scheduled task and write a report that the admin can review.

**Gate:** Build this only if recurring manual review is demonstrably inefficient and the account/permission setup is already stable.

## Product gaps and what fills them

| Product gap | Blogger/admin meaning | Revised response |
|---|---|---|
| The live deployment and database target have previously drifted | A feature can appear to work while using the wrong environment | Phase 0 records the actual live deployment and database before any change |
| Admin protection is basic rather than fully hardened | A stolen session or unwanted browser request could affect admin actions | Phase 1 adds focused protections without replacing the working login |
| Some admin inputs and action histories are not strict enough | Bad or oversized input can create unclear failures; actor history may be incomplete | Phase 1 adds validation, limits, safe errors, and actor-aware records |
| Google data is not yet a live, trustworthy input | The dashboard cannot promise current search, ad, or earnings data | Phases 2–3 complete account setup first; Phase 4 adds reporting only if justified |
| Google services measure different things | A combined earnings or profit number could mislead the blogger | Keep Search Console, Ads, and AdSense separate until a documented comparison is valid |
| Shared brand setup is confused with shared visitor login | Time may be spent building a complex login system that does not help monetization | Use common ownership, branding, and Google configuration; keep user identity separate |
| Manual Google setup may be repeated too often | The blogger may spend time checking the same reports and properties | Automate only the recurring parts that prove worth the maintenance cost |

These are protection and readiness gaps. They do not mean the public blog is currently unusable.

## Earning and growth strategy

The fastest practical path to earning is not an automatic intelligence platform. It is a good canonical blog with consistent publishing, clear ownership, useful content, Search Console verification, indexing, AdSense readiness, and careful manual review of performance.

Search Console is useful for discovering visibility and content opportunities. AdSense is useful for publisher earnings after approval. Google Ads is useful for paid promotion and acquisition when there is a clear business reason. They should first be operated as separate services with human review.

Automatic budget planning, campaign changes, automatic publishing, and automatic cross-source profit claims should remain out of scope until the business rules, account permissions, data quality, and rollback process are mature.

## Rollback and operating boundaries

Every active feature must be disableable without taking down the public blog. Google credentials must remain outside the repository and browser code. A failed Google configuration should not block reader pages or ordinary admin content operations. The blog remains the canonical publication and the legal application remains separate.

The project should not create database or queue infrastructure merely because a platform offers it. It should add infrastructure only when a recurring, measured product need justifies the cost and operational responsibility.

## Approval checklist

Phase 0 and Phase 1 are complete. Phase 2 account and property configuration is approved and ready to execute. This does not require shared cookies or shared visitor identity.

Phase 3 AdSense and Google Ads readiness is included in the approved configuration-led Phase 2 work only to the extent of ownership, policy, and readiness review; paid campaigns, purchases, legal/financial attestations, and irreversible account changes remain separately gated. A further decision is required before embedded Search Console reporting is built in Phase 4.

No Blogger integration, microfrontend work, cross-domain identity work, legal-app audience reuse, synchronous Google calls, automatic campaign actions, or automatic publishing is included in this revised Sprint 13 roadmap.

## Research references

[1]: https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data "Google Search Console data"
[2]: https://developers.google.com/webmaster-tools/v1/searchanalytics/query "Search Console Search Analytics query"
[3]: https://developers.google.com/webmaster-tools/limits "Search Console usage limits"
[4]: https://developers.google.com/google-ads/api/docs/reporting/overview "Google Ads reporting overview"
[5]: https://developers.google.com/google-ads/api/docs/oauth/access-model "Google Ads account access model"
[6]: https://developers.google.com/adsense/management/ "Google AdSense Management API"
[7]: https://developers.google.com/adsense/management/reference/rest/v2/accounts.reports/generate "AdSense report generation"
[8]: https://developers.google.com/identity/protocols/oauth2/web-server "Google OAuth web-server flow"
[9]: https://developers.google.com/search/docs/appearance/structured-data/organization "Google Organization structured data"
[10]: https://vercel.com/docs/observability "Vercel Observability"
[11]: https://neon.tech/docs/introduction/branching "Neon branching"
[12]: https://nextjs.org/docs/app/guides/data-security "Next.js data security"
[13]: https://nextjs.org/docs/app/guides/authentication "Next.js authentication"
[14]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_FORGERY_Prevention_Cheat_Sheet.html "OWASP Cross-Site Request Forgery Prevention"
[15]: https://github.com/jaja44-hub/blog "Addis Crown Blog repository"

**Prepared:** 2026-09-19
**Author:** Manus AI

**Implementation reminder:** This is a roadmap revision only. Do not start any phase without a separate user approval for that phase.
