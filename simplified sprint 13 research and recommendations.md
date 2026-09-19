# Simplified Sprint 13 Research and Recommendations

**Purpose:** Explain Sprint 13 from the point of view of someone using Addis Crown as a blogger and site owner, not as a developer.

**Status:** This is a planning and explanation document. Sprint 13 features are not automatically approved or implemented by this document.

## The short answer

The current blog is a working production website with a reader side and an admin side. The main publishing, content, knowledge-source, media, analytics, and recommendation foundations have already been built and tested during earlier sprints.

The main gap is not that the website is unusable. The gap is that several valuable services are still **foundations or placeholders**, rather than fully connected services that automatically bring in fresh Google data and help the blogger act on it.

Sprint 13 should first make the existing admin area safer and more reliable. After that, the safest useful product improvement is to connect **one Google Search Console property in read-only mode**. This would help identify which articles receive search impressions, which topics need improvement, and where new content may be worthwhile. Google Ads, AdSense, and Blogger publishing should be added only as separate, carefully tested steps.

## What is working now

### For readers

Readers can visit the public blog, open articles, use the reader-facing sections, and access the existing public content experience. The earlier production smoke tests verified the reader routes after the Sprint 11 and Sprint 12 changes.

The current work does not propose changing the public blog into a different platform. The reader experience should remain stable while admin and intelligence features are improved behind it.

### For the blogger and administrator

The admin area already has working foundations for managing content, knowledge sources, media, analytics, content planning, intelligence summaries, and recommendations. Knowledge-source deletion has been hardened so that an article-linked source cannot be removed accidentally.

The recommendation system can store a recommendation with its explanation, source information, score, confidence, and repeat-safe identity. It can also retire a recommendation with a reason. This means recommendations can be reviewed instead of being silently created and acted on.

The current intelligence panel can summarize information already available in the database. It does not yet automatically call Google Search Console, Google Ads, or AdSense and it does not automatically create recommendations from live Google data.

## What the identified risks mean in everyday product terms

| Identified issue | What it means to a blogger or administrator | Product protection proposed in Sprint 13 |
|---|---|---|
| Production and database settings have previously pointed at different places | The admin screen could appear to work while a request reaches the wrong database, or a new feature could report a missing table | Before every major change, verify the live deployment, database, schema, and real reader/admin tests together |
| Admin access is based on a working but basic token session | If the secret or session were stolen, someone could use admin functions until access expires or is rotated | Keep the working login for now, add stronger request checks, audit actions, rate limits, and later test a revocable session system separately |
| Browser requests that change data need stronger anti-forgery protection | A malicious webpage could try to make an already logged-in administrator submit an unwanted action | Require the request to come from the approved blog admin origin and include an additional browser safety check |
| Admin input limits are not fully strict | Very large or malformed requests could create errors or put unnecessary pressure on the service | Reject oversized, incomplete, or incorrectly shaped requests before they reach the database |
| Some actions are not yet fully actor-audited | The system may know that a recommendation was retired but not reliably record which administrator did it | Record the acting administrator, time, reason, and result for important actions |
| Google sources are not yet live connections | The intelligence screen cannot honestly promise fresh Search Console, Ads, or AdSense information today | Show each source as available, unavailable, stale, partial, or failed instead of pretending that missing data is zero |
| Different Google products measure different things | Search traffic, advertising cost, and AdSense earnings cannot automatically be treated as one exact profit calculation | Keep each source separate, show its date range and freshness, and only combine data when the relationship is proven |
| Recommendations could be misunderstood as guaranteed business advice | A score may be based on incomplete or differently timed data | Show the evidence, source dates, confidence, and missing information beside every recommendation |
| A future publishing connection could publish too quickly | An automatic integration could place an unfinished or incorrect article on another website | Keep Addis Crown as the main source, create an external draft first, and require a separate human approval to publish |

These are **risk controls**, not evidence that the reader website is currently broken. They are intended to prevent future integrations from weakening already working features.

## Which desired product features are currently complete, partial, or not yet available

| Desired feature | Current position | What would complete it |
|---|---|---|
| Public blog and reader experience | Working foundation and previously smoke-tested | Continue regression testing after each admin or database change |
| Admin content and operational workspace | Working foundation | Continue hardening and keep important actions auditable |
| Knowledge-source management and safe deletion | Available and hardened | Keep testing article-linked deletion protection |
| Media and editorial management | Available foundation | Continue normal content and reader regression tests |
| Content-planning intelligence | Available foundation | Connect better evidence sources only after the data lifecycle is reliable |
| Recommendation storage and retirement | Available as governed administration | Add live source data later; keep human review before important action |
| Search Console insight | Not yet a live production connection | Start with one read-only property and one completed reporting window |
| Google Ads reporting and earnings optimisation | Foundation or placeholder, not confirmed live | Verify Google account access, customer mapping, quotas, currency, and read-only reporting |
| AdSense earnings reporting | Foundation or placeholder, not confirmed live | Connect the publisher account safely and preserve account currency, dates, and report completeness |
| Automatic cross-source profit or return calculation | Not safely available yet | Prove that traffic, advertising cost, and publisher income refer to compatible content and time windows |
| Blogger or secondary-site publishing | Not connected | Test draft creation in a non-production blog, then require explicit publish approval |
| Automatic campaign changes or budget actions | Not proposed for Sprint 13 | Keep excluded until a separate business, policy, and safety review |
| Shared login between separate Addis Crown sites | Not proposed | Keep the applications and databases separate unless a future product decision justifies the added risk |

## What Sprint 13 hardening improves for the finished product

### Safer administration

The goal is that an administrator can still log in and manage the blog, but important actions are less likely to be triggered by an unwanted website, malformed input, repeated abuse, or an unclear failure. The system should explain whether an action succeeded, failed, or was rejected without exposing internal technical details.

### More trustworthy intelligence

The goal is not to display more numbers for their own sake. The goal is to show whether the information is fresh, incomplete, unavailable, or based on a specific reporting period. This prevents a missing Google report from looking like zero traffic or zero earnings.

### Better blogging decisions

A future Search Console connection could help answer practical questions such as:

- Which articles are being shown in Google but are not receiving enough clicks?
- Which pages have strong reader interest and deserve related follow-up articles?
- Which topics appear promising but have weak or incomplete coverage?
- Which content recommendations are based on real evidence rather than guesses?

The system should present these as **reviewable suggestions**, not automatic instructions.

### Safer earning optimisation

AdSense can eventually show publisher earnings by site, ad unit, or reporting period. Google Ads can eventually show paid campaign costs and performance. Search Console can show organic search activity. These are useful separately, but they do not automatically form a trustworthy profit number because they use different timing, attribution, currencies, identities, and reporting rules.

The safe product path is therefore:

1. Start with organic search visibility through Search Console.
2. Add AdSense reporting separately for publisher earnings.
3. Add Google Ads reporting separately for paid acquisition costs.
4. Combine information only when the content, account, currency, date range, and measurement purpose are clearly matched.
5. Never let the system automatically change campaigns, budgets, or public content based only on a generated score.

## Recommended delivery stages in plain language

### Stage 1: Confirm the real live system

Check which version is actually serving the public site, which database it uses, and whether reader and admin tests still pass. This prevents improving a copy that is not the real production system.

### Stage 2: Protect the existing admin features

Improve login-session safety, protect browser actions, reject bad or oversized inputs, limit repeated abuse, record who performed important actions, and add safe response headers. This stage should not change the blogger’s normal publishing workflow.

### Stage 3: Prepare a reliable evidence inbox

Create a controlled place where future Google reports can arrive with their date, source, completeness, and status. A repeated report should update the same evidence instead of creating confusing duplicates.

### Stage 4: Connect one Search Console property

Bring in one read-only Search Console report for a finished reporting period. The admin can inspect it, and the system can show where the data came from. No campaign or public-content action should happen automatically.

### Stage 5: Add AdSense and Google Ads only if useful

Connect each service separately after confirming ownership, permissions, account mapping, quotas, and privacy requirements. Keep earnings, paid costs, and organic traffic visibly separate until there is a defensible reason to compare them.

### Stage 6: Consider Blogger publishing separately

If secondary publishing is desired, Addis Crown remains the main editorial website. The external service receives a draft first. A human reviews it and explicitly approves publishing or scheduling. A failed or reversed external post must not silently change the main blog.

## What should not be done

Sprint 13 should not replace the working admin login with a new login system without a separate compatibility test. It should not merge the two Addis Crown applications, share cookies between them, or move them into a more complicated multi-application layout merely to connect analytics. It should not export legal-app user lists or case-related interests into advertising audiences. It should not make Google calls during normal reader page loads. It should not publish articles, change campaigns, or change advertising budgets automatically.

## Recommended approval boundary

The safest first approval is **Stage 1 and Stage 2 only: verify production reality and harden the existing product**. These steps do not require live Google credentials.

After those steps pass, the next separate approval can authorize **one read-only Search Console property in a test or carefully limited production path**. Google Ads, AdSense, and Blogger should each receive their own later approval because each introduces different permissions, data meanings, privacy concerns, and rollback requirements.

## Repository continuity rule

> **Every plan, research report, implementation, test result, known issue, deployment record, and handoff decision must be saved in this repository and committed to GitHub. The repository is the continuity memory for future agents and account handovers. No important project context should remain only in chat or in a temporary sandbox. Every future agent must read the relevant continuity files before changing code, database, deployment, or external integrations.**

The detailed technical roadmap remains in [SPRINT_13_ROADMAP_PROPOSAL.md](SPRINT_13_ROADMAP_PROPOSAL.md). This document is the shorter product-oriented explanation for planning and approval.

## References

[1]: https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data "Google Search Console data"
[2]: https://developers.google.com/google-ads/api/docs/reporting/overview "Google Ads reporting overview"
[3]: https://developers.google.com/adsense/management/ "Google AdSense Management API"
[4]: https://developers.google.com/blogger/docs/3.0/using "Blogger API usage"
[5]: https://vercel.com/docs/queues/concepts "Vercel Queues concepts"
[6]: https://vercel.com/docs/cron-jobs "Vercel Cron Jobs"
[7]: https://vercel.com/docs/caching/runtime-cache/data-cache "Vercel Data Cache"
[8]: https://nextjs.org/docs/app/guides/data-security "Next.js data security"
[9]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_FORGERY_Prevention_Cheat_Sheet.html "OWASP Cross-Site Request Forgery Prevention Cheat Sheet"
[10]: https://github.com/jaja44-hub/blog "Addis Crown Blog repository"

**Author:** Manus AI
**Prepared:** 2026-09-19
