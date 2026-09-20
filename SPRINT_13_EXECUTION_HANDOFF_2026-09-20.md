# Sprint 13 Execution Handoff and Monetization/Indexing Audit

**Prepared:** 20 September 2026  
**Primary repository:** `jaja44-hub/blog`  
**Connected secondary repository:** `jaja44-hub/studio-legacy-updates` (legal app)  
**Purpose:** Persist the complete execution state so the next agent can continue hands-on work without repeating the investigation or confusing external Google lifecycle states with code defects.

## Executive status

Sprint 13 is **operationally deployed**, but not every external platform has completed its own processing. The blog production deployment is READY, the legal-app production deployment is READY, the AdSense ownership/review/CMP prerequisites have been submitted, the required root `ads.txt` is publicly reachable, the Search Console sitemaps are successful, and the production Neon tables now exist. The Google Ads customer remains **not enabled**. This is still a Google account lifecycle/onboarding state and was not resolved by the AdSense work.

A second actionable issue was found and fixed: the legal app had five local typecheck defects. The repair was committed and pushed to `studio-legacy-updates` as commit `a0cc458` (`fix: restore legal app typecheck`). Blog deterministic tests and typecheck were already passing. The legal app now passes `npm run typecheck` and `npm run build` locally; the build emits only non-blocking Browserslist/deprecation/Tailwind warnings.

## Verified state matrix

| Area | Current state | Classification | Evidence / next action |
|---|---|---|---|
| Blog Vercel | READY production deployment at commit `7ac0f4f` | Resolved | Vercel deployment `dpl_43GGACKZfuH6SzFQR5w1Qok9vDDD` |
| Legal Vercel | READY production deployment at commit `7aae4d2` before the latest code repair; new repair pushed as `a0cc458` | Deployment path healthy; new build should be confirmed | Latest known READY deployment was `dpl_5WMWZ42GhKVGroRCCx6MRKRPHGLG`; inspect the next deployment for `a0cc458` |
| Legal public routes | `/robots.txt`, `/sitemap.xml`, `/ads.txt`, and `/privacy-policy` return HTTP 200 | Resolved | `https://addiscrown.et/ads.txt` serves the exact publisher line |
| AdSense ownership | Ownership verification script deployed and property attached | Resolved on code/setup side | Google dashboard showed ownership verified in the prior authenticated review |
| AdSense site review | Review request submitted | Waiting on Google | Dashboard state was `Getting ready`; do not repeatedly resubmit |
| AdSense CMP | Google three-choice CMP configured/submitted for EEA/UK/Switzerland | Setup submitted; waiting for Google propagation | Privacy and messaging dashboard was used; no extra custom CMP code is needed unless Google reports a site-level failure |
| AdSense ads.txt | Public file works; dashboard had previously shown `Not found` | Public setup resolved; crawler status pending | `google.com, pub-2006507251466560, DIRECT, f08c47fec0942fa0` |
| Google Ads customer `7251926003` | Still `CUSTOMER_NOT_ENABLED` / 403 | External account lifecycle blocker | Connector result: standalone customer, manager=false, level 0, not enabled/deactivated; requires owner-side Google Ads signup/account activation |
| Google Cloud ownership | Not implicated by the error | Not a blocker | API caller can see the customer but cannot query it because customer state is disabled |
| Search Console property | Authenticated property available | Resolved | `sc-domain:addiscrown.et` opens in Search Console |
| Search Console sitemaps | Both submitted sitemaps show Success | Resolved for transport/submission | Blog sitemap last read 20 Sept with 24 discovered pages; root sitemap last read 4 Mar with 8 discovered pages |
| Search indexing | 2 indexed, 5 not indexed, 1 web-search click | Google processing/coverage work remains | Inspect Pages report and URL Inspection; do not treat this as a broken sitemap |
| Neon schema | Required tables exist in production | Resolved for table existence | Project `restless-cake-31725040`, database `neondb`; inventory includes `search_console_data`, `knowledge_sources`, analytics, media, Ads, and editorial tables |
| Neon production data | `posts=0`, `editorial_posts=0`, `search_console_data=0`, `engagement_events=0`, `knowledge_sources=1` | Data/content population gap | Blog public Markdown content is separate from empty admin/database tables; do not invent rows without a content-import plan |
| Blog runtime errors | Aggregator contains historical missing-relation errors from 16–19 Sept | Historical evidence, not proof of current failure | Those errors predate the schema repair; query a fresh window after the latest deployment before reopening |
| Legal runtime errors | None in the selected 7-day window | Resolved | Vercel runtime error tool returned no clusters |
| Legal local typecheck/build | Passed after repair | Resolved in source | Commit `a0cc458` in legal repo |

## Google Ads diagnosis: what is and is not resolved

The target customer still returns:

> `403 PERMISSION_DENIED: The caller does not have permission; authorizationError=CUSTOMER_NOT_ENABLED: The customer account can't be accessed because it is not yet enabled or has been deactivated.`

The connected Google Ads discovery call sees `7251926003` as a standalone customer (`manager=false`, hierarchy level 0), but the API cannot read it. This is not a manager-link visibility problem and is not fixed by being the owner of the repository, Vercel team, domain, or Google Cloud project. Google Ads customer activation is a separate advertiser-account lifecycle.

Earlier authenticated UI evidence showed the customer opening into a **New campaign / signup wizard** rather than a normal campaign dashboard. That is the decisive clue: the account has not completed Google Ads advertiser onboarding. AdSense publisher monetization is a different product. AdSense Auto ads and publisher revenue do not require the blog owner to create an advertiser campaign. Google Ads API access also does not become usable merely because the Cloud project owner owns the domain; the customer itself must be enabled and the API user must be authorized against an enabled customer.

The account-side action was intentionally left unchanged after the owner chose not to continue the signup wizard. No billing, campaign, budget, payment method, or advertiser representation was submitted. The blocker therefore remains open and is correctly classified as **personal/account-side input required**, not as a code or domain defect.

## AdSense and CMP work completed

The legal app now has all code-side prerequisites previously identified:

1. Root `ads.txt` is publicly served through an explicit Next.js route inside `src/app/ads.txt/route.ts` and returns HTTP 200.
2. The AdSense ownership verification script is in the legal app root layout.
3. The public privacy policy route resolves successfully.
4. AdSense site ownership/review flow was submitted for `addiscrown.et`.
5. Google’s three-choice CMP was configured for the European regulations flow and submitted from Privacy and messaging.
6. The public ads.txt body is:

```text
google.com, pub-2006507251466560, DIRECT, f08c47fec0942fa0
```

Google’s crawler and policy systems may take time to update. A dashboard label such as `Getting ready` or a delayed ads.txt timestamp is not a deploy failure after the public endpoint is confirmed.

## Search Console and indexing state

Search Console is authenticated and the property `sc-domain:addiscrown.et` is accessible. The current overview showed **2 indexed pages**, **5 not indexed pages**, **1 total web search click**, and valid HTTPS coverage. The Sitemaps page showed:

| Sitemap | Submitted | Last read | Status | Discovered pages |
|---|---:|---:|---|---:|
| `https://blog.addiscrown.et/sitemap.xml` | 20 Sept 2026 | 20 Sept 2026 | Success | 24 |
| `https://addiscrown.et/sitemap.xml` | 19 Feb 2026 | 4 Mar 2026 | Success | 8 |

The blog sitemap is newly read and has 24 discovered pages. The root-domain sitemap is older but successful. The next useful action is not another blind sitemap submission; it is to inspect the Pages report, determine which five URLs are excluded and why, then inspect/request indexing only for high-value URLs if Search Console offers the control. Google indexing is asynchronous and cannot be forced into immediate completion by code changes.

## Neon database state and the zero-row explanation

The production Neon project is `restless-cake-31725040` (`addis-crown-blog-platform`), database `neondb`. The table inventory now includes all previously reported missing relations, including:

`knowledge_sources`, `regional_analytics`, `content_opportunities`, `media_assets`, `content_performance`, `search_console_data`, `google_ads_campaigns`, `adsense_ad_units`, `media_usage`, `editorial_posts`, `posts`, `engagement_events`, and the Sprint 13 editorial foundation tables.

The read-only production count query returned:

```text
posts_count = 0
editorial_posts_count = 0
search_console_data_count = 0
engagement_events_count = 0
knowledge_sources_count = 1
```

The prior Vercel runtime errors saying that these relations did not exist were generated before the additive migration was applied and are historical clusters. The current table inventory proves the migration/table-existence portion is repaired. The zero-row content result is a separate data-population issue. The public blog is driven by tracked Markdown content, so an empty admin database does not necessarily mean the public blog has no pages. The next agent should first compare the app’s canonical content loader and admin routes before considering a data import. Any bulk seed/import should be planned and reviewed, not generated from assumptions.

## Legal-app local repair that was persisted

The legal app typecheck originally failed in five areas. The following minimal fixes were applied and pushed as `a0cc458`:

- Imported `VariantProps` in `src/components/ui/toggle-group.tsx` and typed the context with `VariantProps<typeof toggleVariants>`.
- Redirected the missing `./types` import in `src/legal_branches/contract_law.ts` to the canonical `@/lib/types` module.
- Added `isAdmin: false` to `src/lib/initial-state.ts`.
- Renamed the unused legacy duplicate `resolvePropertyLRG(selectedFacts)` method to `resolvePropertyLRGFromIds`, preserving the active state-based method used by `facts-tab.tsx`.
- Excluded standalone legacy `INGESTION_ENGINE_V2.ts` from the Next.js application typecheck because it imports removed LangChain v0 paths and is not part of the app runtime. This is a deliberate scope boundary; if the ingestion script is revived, migrate it to current LangChain packages separately.
- Added the missing shared-state fields to the contract-law module’s exported `INITIAL_STATE`.

Validation after the repair: `npm run typecheck` passed and `npm run build` passed. Build warnings were non-blocking: outdated Browserslist data, Node punycode deprecation, and one ambiguous Tailwind duration class.

## Remaining work classified by who can act

### Immediate agent-owned follow-ups

- Confirm the first Vercel deployment generated from legal commit `a0cc458` is READY and production-linked.
- Query Vercel runtime errors for a fresh 24-hour window after that deployment; historical clusters should not be treated as current.
- Re-run the blog validation suite and typecheck after any future source change.
- Inspect Search Console Pages exclusions and URL Inspection for the five not-indexed URLs.
- Query Neon counts again after any approved content or Search Console sync job; do not seed fake analytics.
- Review the blog’s current handoff files before editing: `NEXT_AGENT_GUIDE.md`, `KNOWN_ISSUES.md`, `EXECUTION_LOG.md`, `SPRINT_13_PRODUCTION_SIGNOFF_2026-09-20.md`, `GOOGLE_ADS_CUSTOMER_7251926003_STATUS.md`, and `GOOGLE_ADS_VS_ADSENSE_ONBOARDING_RUNBOOK.md`.

### Owner-side Google Ads input required

To clear `CUSTOMER_NOT_ENABLED`, the owner must complete Google Ads advertiser onboarding in the authenticated Google Ads UI. The next agent should guide the user through each screen and explain impact before any consequential submission. Likely information to prepare:

- advertiser/business name exactly as it should appear in Google Ads;
- business or individual advertiser identity and country/region;
- business website URL and contact details;
- advertising objective and intended landing page;
- campaign basics if the wizard requires a first campaign: campaign type, target locations, language, ad text/assets, and a daily budget;
- billing profile/payment method and billing address if Google requires it;
- any advertiser verification or identity documents requested by Google;
- explicit confirmation before creating a paid campaign, adding a payment method, or enabling billing.

Do not claim that this is needed for AdSense publisher revenue. It is needed only if the user wants this Google Ads advertiser customer activated or wants Google Ads API access against it. If the user’s actual goal is publisher monetization, leave Google Ads unchanged and continue with AdSense review/CMP/indexing work.

### Google-controlled waiting states

- AdSense site review and policy processing.
- AdSense ads.txt crawler timestamp and dashboard status after the public endpoint is fixed.
- Search Console indexing and excluded-page processing.
- Search Console performance accumulation.

These cannot be honestly marked complete until Google changes the dashboards. The code-side prerequisites are complete.

## Continuation prompts for the next agent

Use these prompts verbatim or adapt them after reading this file:

### Prompt A — Google Ads activation, only if the owner wants advertiser onboarding

> Read `SPRINT_13_EXECUTION_HANDOFF_2026-09-20.md`, `GOOGLE_ADS_CUSTOMER_7251926003_STATUS.md`, and `GOOGLE_ADS_VS_ADSENSE_ONBOARDING_RUNBOOK.md` in the blog repo. Recheck customer `7251926003` with the Google Ads connector and open the authenticated Google Ads UI. If it still shows the signup/new-campaign flow, explain each screen’s meaning and financial/account impact before asking for any missing owner data. Do not confuse this with AdSense publisher monetization. Do not submit a paid campaign, billing profile, payment method, or advertiser attestation without explicit confirmation of the exact payload. If the owner supplies the required details and confirms, finish onboarding and then recheck the API until `CUSTOMER_NOT_ENABLED` is replaced by an enabled customer response.

### Prompt B — AdSense and indexing follow-up

> Read `SPRINT_13_EXECUTION_HANDOFF_2026-09-20.md` and the existing Sprint 13 handoff/signoff files. Open the authenticated AdSense site detail and Privacy and messaging pages for `addiscrown.et`; record whether review, CMP, and ads.txt states have advanced. Open Search Console for `sc-domain:addiscrown.et`, inspect the Pages exclusions and URL Inspection, and request indexing only for a small set of high-value URLs when the UI supports it. Do not resubmit successful sitemaps blindly. Verify the public endpoints before attributing any failure to code.

### Prompt C — Neon/content data follow-up

> Read `SPRINT_13_EXECUTION_HANDOFF_2026-09-20.md`, `SPRINT_13_PRODUCTION_SIGNOFF_2026-09-20.md`, and the blog schema/migration files. Query the production Neon project `restless-cake-31725040` read-only. Confirm table existence and counts for `posts`, `editorial_posts`, `search_console_data`, `engagement_events`, and `knowledge_sources`. Trace the public Markdown content loader versus admin/database routes. If the database remains empty, prepare a reversible import plan from canonical tracked content; do not invent rows or run a bulk write without explicit approval.

### Prompt D — Deployment health follow-up

> Read `SPRINT_13_EXECUTION_HANDOFF_2026-09-20.md`. Check Vercel project `blog` (`prj_Ox7kkCUN94CSR14j0I5D3Wjc8cWo`) and legal app `studio-legacy-updates` (`prj_hZLaEv07DFG5nXcwQW59VSXYQGiB`) for production deployments after commits `7ac0f4f` and `a0cc458`. Query fresh runtime errors only after the newest deployment timestamp. Verify `robots.txt`, `sitemap.xml`, `ads.txt`, and privacy-policy publicly. Roll back only if a current deployment is demonstrably broken; both projects have READY rollback candidates.

## Persistence checklist

- [x] Google Ads diagnosis persisted in `GOOGLE_ADS_CUSTOMER_7251926003_STATUS.md` and execution log.
- [x] AdSense versus Google Ads distinction persisted in `GOOGLE_ADS_VS_ADSENSE_ONBOARDING_RUNBOOK.md`.
- [x] Sprint 13 production signoff exists.
- [x] Neon schema comparison and additive migration records exist.
- [x] Legal-app typecheck repair committed and pushed as `a0cc458`.
- [x] This exhaustive cross-system handoff is ready to commit in the blog repository.
- [ ] Google Ads customer activation remains owner-side and unresolved.
- [ ] AdSense review/ads.txt crawler status remains Google-side pending.
- [ ] Search Console coverage remains partially indexed (2 indexed, 5 not indexed).
- [ ] Neon content/analytics tables remain mostly empty despite schema repair.

## Final boundary

The current state is not a failed deployment emergency. The two deployed applications are reachable, their core monetization/indexing endpoints respond successfully, and the legal app’s local compile defect is fixed. The material unresolved account issue is Google Ads customer activation. The material unresolved platform-processing issues are AdSense review/crawl and Search Console indexing. The material unresolved product-data issue is whether and how to populate the empty Neon content/analytics tables from canonical sources.
