# Addis Crown Blog — Project Handoff Log
**Last updated:** September 6, 2026
**Status:** Active build — public blog core and editorial workflow are deployed and verified end to end against Neon

---

## How to use this file
This is the single source of truth for the blog project. If you're picking this up on a different AI platform or a new session, paste this whole file in as context first. Update the "Current Status" section at the top each time something changes, so the next handoff stays accurate.

---

## Current status
- Domain: `addiscrown.et` owned, registered Feb 18, 2026, renews **Feb 18, 2027**
- Existing asset: legal-AI platform already live on the domain (Ethiopian legal document generation, Civil Code/Labour Proclamations/Cassation Court grounded), repo at `github.com/jaja44-hub/jaja44-hub`
- Decision made: **new blog lives on `blog.addiscrown.et` subdomain**, separate repo, brand-inherited but independently designed
- Repository: `github.com/jaja44-hub/blog`, linked to the Vercel project `blog`
- Framework contract: Next.js `15.5.25`, pinned to the version used by the verified Vercel deployment
- Database direction: Neon/Postgres is a required platform foundation, not a deferred optional feature
- The public blog core and first admin/editorial workflow are implemented; analytics, advertiser, and recommendation modules remain to be built
- Editorial foundation SQL and typed repository primitives are present locally and the remote Neon schema is live
- First protected admin workflow is present at `/admin`; it requires the encrypted `ADMIN_ACCESS_TOKEN` environment variable and is an interim gate before provider-backed role authentication
- Admin draft queue now supports database listing, editing, revision snapshots, review submission, and guarded publishing
- Admin workspace now supports future scheduling, Markdown import/export, and research brief planning
- Public UI now includes a responsive discovery sidebar, category/latest/popular/new navigation, subscribe entry, and local favorites on article cards and pages
- Public article comments now show a visible Community panel with a GitHub Discussions fallback; embedded Giscus activates when public IDs are configured
- Giscus is intentionally disabled by default until the GitHub Giscus app is installed for `jaja44-hub/blog` and real public IDs plus `NEXT_PUBLIC_GISCUS_ENABLED=true` are configured; the fallback is live in production
- Article footers now group Like, Save, Rating, and article-specific discussion into one post engagement area; latest deployment is Ready at `blog.addiscrown.et`
- Article pages now use a dark ink cinematic header band, a distinct warm ochre engagement band directly beneath the body, and compact quick reactions (`Useful`, `Thought-provoking`, `Needs more detail`) separate from long-form Giscus/GitHub Discussions
- Giscus public configuration is now provisioned in Vercel Production from the locally saved repository/category IDs; article HTTP checks return `200`, GitHub Discussions returns `200`, and the latest production deployment is Ready
- Vercel is now the sole canonical implementation path; Giscus was removed from the public article flow and its public Vercel variables were removed. Article engagement remains Like, Save, Rating, and Quick Feedback.
- Homepage hero now carries the source-aware promise and the line “Understand the forces shaping decisions, rights, and opportunity.” About now explains the legal-career foundation and interdisciplinary coverage across law, contracts, markets, economics, migration, technology, AI, policy, and global affairs.
- Public search now supports newest/popular sorting, category filtering, and date ranges; favorites emit Neon engagement events when the engagement table is available
- Latest production deployment `blog-hgd9zf9w7-jafers-projects-761b2f62.vercel.app` is Ready and aliased to `blog.addiscrown.et`; Vercel build generated 22 routes successfully
- End-to-end production verification passed for login, draft creation, editing, review, scheduling, research brief creation, Markdown import/export, and publishing; temporary records were removed afterward

## Key decisions log
1. **Blog platform:** Next.js 15 (App Router) + Tailwind CSS, hosted on Vercel, connected via GitHub — chosen over WordPress/Ghost/Wix for full brand control, matches user's existing Vercel familiarity
2. **Content model:** Markdown remains supported for the existing public corpus and developer publishing path, while Neon/Postgres becomes the operational source of truth for drafts, research, scheduling, publishing, and platform intelligence
3. **Monetization reality established:**
   - YouTube AdSense/YPP: blocked by country eligibility (Ethiopia not on YPP list) — no compliant workaround exists without a third party
   - Website AdSense: likely available (broader country list than YPP, only OFAC-sanctioned countries excluded) — **needs direct verification by applying at google.com/adsense**, not yet confirmed firsthand
   - Primary near-term income plan: affiliate links + direct sponsorships (no country gate, no third-party dependency)
   - Google Ads ($500 credit) = a spend tool for driving traffic, NOT a revenue-share program — corrected misunderstanding early on
   - Selling downloads/paid content = needs Stripe or similar, not a Google/AdSense feature
4. **Domain architecture:** subdomain (`blog.addiscrown.et`) chosen over subdirectory — zero risk to the live legal app, simple CNAME setup
5. **AdSense technical requirement:** `ads.txt` must live at root domain (`addiscrown.et/ads.txt`) even though blog is on the subdomain — to be added via a pull request against the legal app's repo (not a direct commit), reviewed before merge
6. **Brand approach:** inherit logo + core color palette from the legal app's repo (`studio updates` / production branch), but design the blog's actual layout fresh for long-form reading + ad placement

## Phased build plan (full detail in `blog_addiscrown_build_spec.md`)
- **Phase 1 (launch-ready minimal):** full site structure, YouTube embeds, PDF downloads, external CTA/affiliate components, Giscus comments, cookie consent + privacy/terms pages, ad slot placeholders, ads.txt, Vercel Analytics
- **Phase 2 (community/discovery):** ratings, search/filter, RSS, related posts
- **Phase 3 (advanced):** Neon-backed authenticated admin panel with multi-format uploads, editorial workflow, research planning, scheduling, analytics dashboard, advertiser records, recommendations, and Stripe-based paid downloads

## Content niches decided
- Primary blog focus: legal/rights/policy explainers (native fit for the existing domain's authority)
- Companion "Brilliance" YouTube-aligned content: philosophy, AI/policy futures, media literacy/institutional accountability — kept as a **separate** property to avoid diluting either brand
- Niche note: "faceless AI channel how-to" content (not this user's niche, but researched as a benchmark) shows realistic net income of roughly $2,000-$6,500/month all-in once affiliate income is included, for context on what "successful" looks like in this content category

## Immediate next actions (in order)
1. Verify the latest deployment and `engagement_events` Neon table through the live UI/API.
2. Add a native/Google-account comment and subscription decision only when the audience identity model is approved.
3. Add database-backed likes, post views, and popular-post ranking dashboards.
4. Replace the interim admin token gate with provider-backed authentication and database role enforcement.
5. Add authenticated revision-history viewing and scheduled-publication execution.
6. Add research source management, evidence tracking, analytics, and aggregate decision metrics.
7. Publish 5-10 substantive posts before applying for AdSense on the blog.

## Open questions still needing user input
- Final accent color/typography direction (left to AI's design judgment per user's last instruction — "modern, common yet distinct")
- First 5 post topics (offered, not yet drafted — say the word and this gets done immediately, independent of the GitHub blocker)
