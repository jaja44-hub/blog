# Simplified Sprint 13 Research and Recommendations

**Purpose:** Explain the revised Sprint 13 direction from the point of view of an Addis Crown blogger and site owner.

**Status:** Planning document only. This revision does not authorize implementation or account changes.

> **Repository continuity rule:** Every roadmap, research result, implementation, test result, known issue, deployment record, and handoff decision must be saved in this repository and committed to GitHub. The repository is the continuity memory for future agents and account handovers. Important project context must not remain only in chat or a temporary sandbox.

## The simple conclusion

Your correction is reasonable. Sprint 13 should not begin by building Blogger integration, microfrontends, a shared login system, or a large background automation platform.

The practical priority is to make the current blog dependable, make both Addis Crown websites clearly organized under one brand and Google ownership structure, complete Search Console and indexing setup, and prepare AdSense and Google Ads through the normal account processes.

The blog and legal application can use one Google Cloud project where useful while remaining separate applications, databases, and visitor systems. A shared Google Cloud project is not the same thing as shared visitor login.

## What is working already

The public blog and its main reader experience are working foundations. The admin side already has content, knowledge-source, media, analytics, content-planning, intelligence, and recommendation foundations. Knowledge-source deletion has been made safer, and recommendations can be stored with explanations, source details, scores, confidence, and retirement reasons.

The current intelligence panel does **not** yet automatically fetch live Google Search Console, Google Ads, or AdSense data. That is a limitation of the intelligence feature, not a reason to delay ordinary publishing, domain verification, sitemap submission, indexing, or AdSense preparation.

## What needs attention from a blogger’s point of view

| Current gap | What it means in everyday use | Revised solution |
|---|---|---|
| The live website and database have previously drifted apart | A feature can appear to work while using the wrong production environment | First confirm the real Vercel deployment, database, schema, reader pages, and admin actions |
| Admin protection is functional but basic | An unwanted browser request or stolen session could affect an admin action | Add focused browser checks, input limits, safe errors, repeated-action controls, and action records |
| Some action history can be more complete | It may not always be obvious which administrator performed a change | Record the administrator, time, reason, and outcome for important actions |
| Google reporting is not yet live inside the app | The dashboard cannot promise fresh Search Console, Ads, or earnings data | Complete account setup manually first; add reporting automation only if repeated work becomes costly |
| Google products measure different things | Search visibility, ad costs, and AdSense earnings could be wrongly combined into one number | Keep the services separate and show dates, account, currency, and source clearly |
| Common brand ownership is confused with shared user identity | Time could be wasted building one login for two sites when Google setup does not require it | Share brand and ownership information; keep visitor login, cookies, and databases separate |

These are readiness and protection gaps. They do not mean that the public blog is currently unusable.

## Revised Sprint 13 stages

### Stage 1: Confirm the actual live blog

Check which Vercel deployment serves the public site, which Neon database it uses, and whether the reader and admin workflows still pass. Confirm that no temporary test records remain.

This prevents future work from being applied to the wrong environment.

### Stage 2: Protect everyday blogging and administration

Keep the current admin login. Improve only the safeguards that support normal blogging:

- Protect browser actions that change data.
- Reject malformed or oversized input.
- Give clear success and failure messages without exposing internal details.
- Record important administrator actions.
- Reduce repeated accidental or abusive requests.
- Keep trusted media and security settings.
- Retest both reader and admin pages.

This stage should not replace the working login or change the normal publishing workflow.

### Stage 3: Organize the two Addis Crown sites under one brand and Google ownership structure

This is primarily account and property configuration, not a new application feature.

The practical work is to:

- Confirm which Google account or organization owns both properties.
- Verify both domains in Google Search Console.
- Confirm the blog’s canonical domain.
- Submit and inspect the blog sitemap.
- Check robots and indexing behavior.
- Confirm the correct Organization and brand information.
- Use consistent logo and ownership information.
- Keep separate Search Console properties and separate site responsibilities where appropriate.
- Use one Google Cloud project only where it genuinely simplifies approved API administration.

One Google Cloud project does not automatically grant access to every Ads account, Search Console property, or AdSense account. Each service still needs its own permissions and verification.

### Stage 4: Prepare AdSense and Google Ads

For AdSense, confirm site ownership, publisher information, policy pages, contact information, site quality, and approval readiness. Add ads carefully only after the normal Google approval process.

For Google Ads, confirm the correct customer account, billing owner, Cloud project relationship, and any conversion or landing-page configuration. Keep campaigns and budgets under human control at first.

A Google Ads API connection is not required just to configure and operate an ordinary Google Ads account.

Keep these measurements separate:

- Search Console shows organic search visibility.
- AdSense shows publisher earnings.
- Google Ads shows paid advertising costs and campaign performance.

They should not be combined into a profit or return number until their content, accounts, currencies, dates, and measurement purposes are clearly compatible.

### Stage 5: Add automation only if manual work becomes inefficient

At first, you or an AI agent can periodically inspect Search Console, indexing, AdSense, and Ads reports. This avoids spending development effort on integrations before there is a proven need.

If repeated reporting becomes burdensome, the first useful built-in feature would be a small read-only Search Console report for one property and one completed reporting period. It should show where the information came from, how fresh it is, and whether it is incomplete.

It should not run Google calls during normal reader page loads. It should not automatically publish content, change campaigns, or change budgets.

## What is removed from the active Sprint 13 plan

The following items are deliberately removed from active Sprint 13 implementation:

- Blogger or secondary-site publishing integration.
- Vercel Microfrontends and Next.js Multi-Zones.
- Shared cookies and shared visitor login across the two applications.
- Legal-app user-list export, remarketing reuse, and case-interest audience sharing.
- Automatic publishing.
- Automatic campaign, budget, bidding, or optimization actions.
- Large queue/workflow infrastructure before a recurring need is proven.
- Synchronous Google API calls from reader or ordinary admin request paths.
- Broad authentication replacement before a separate compatibility test.

Blogger can remain a future idea, but it is not needed while the Vercel/Next.js blog is the canonical publication.

## Brand identity versus visitor identity

### Brand and ownership identity: useful now

This means the two websites clearly belong to the same Addis Crown organization. It can use consistent branding, public links, Organization information, Google property ownership, Search Console verification, and one carefully managed Google Cloud project.

This helps with organization and monetization without changing how visitors log in.

### Shared visitor identity: deferred

This means one visitor account would work across both domains. It would require shared sessions, cookies, permissions, logout behavior, privacy rules, and additional security testing.

It is not required for publishing, indexing, Search Console, AdSense approval, Google Ads configuration, or a common brand.

## What this means for earning and growth

The fastest path to earnings is not a large automation system. It is a stable canonical blog with useful content, consistent publishing, clear ownership, correct indexing, Search Console verification, AdSense readiness, and careful reporting.

The practical order is:

1. Stabilize the production blog.
2. Protect the admin workflow.
3. Verify the Addis Crown domains and sitemap.
4. Start indexing and reviewing Search Console manually.
5. Prepare and request AdSense approval.
6. Configure Google Ads only when there is a clear paid-growth reason.
7. Automate repeated reporting only after manual work proves inefficient.

## Approval boundary

The revised immediate approval boundary is **Stage 1 and Stage 2 only**: confirm production reality and protect the existing blogging/admin experience.

A later approval can authorize Stage 3 account and property configuration. This does not require shared cookies or shared visitor login.

A separate later decision can authorize AdSense and Google Ads readiness work. A further decision is required before building embedded Search Console reporting.

No Sprint 13 roadmap execution has started as part of this document update.

The detailed roadmap is in [SPRINT_13_ROADMAP_PROPOSAL.md](SPRINT_13_ROADMAP_PROPOSAL.md). This file is the short product-level explanation for blogger and admin planning.

## References

[1]: https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data "Google Search Console data"
[2]: https://developers.google.com/google-ads/api/docs/reporting/overview "Google Ads reporting overview"
[3]: https://developers.google.com/adsense/management/ "Google AdSense Management API"
[4]: https://developers.google.com/identity/protocols/oauth2/web-server "Google OAuth web-server flow"
[5]: https://developers.google.com/search/docs/appearance/structured-data/organization "Google Organization structured data"
[6]: https://nextjs.org/docs/app/guides/data-security "Next.js data security"
[7]: https://github.com/jaja44-hub/blog "Addis Crown Blog repository"

**Prepared:** 2026-09-19  
**Author:** Manus AI
