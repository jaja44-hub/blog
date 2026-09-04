# Addis Crown Blog — Project Handoff Log
**Last updated:** September 3, 2026
**Status:** Pre-build — blocked only on GitHub connector access, all planning complete

---

## How to use this file
This is the single source of truth for the blog project. If you're picking this up on a different AI platform or a new session, paste this whole file in as context first. Update the "Current Status" section at the top each time something changes, so the next handoff stays accurate.

---

## Current status
- Domain: `addiscrown.et` owned, registered Feb 18, 2026, renews **Feb 18, 2027**
- Existing asset: legal-AI platform already live on the domain (Ethiopian legal document generation, Civil Code/Labour Proclamations/Cassation Court grounded), repo at `github.com/jaja44-hub/jaja44-hub`
- Decision made: **new blog lives on `blog.addiscrown.et` subdomain**, separate repo, brand-inherited but independently designed
- Blocker: GitHub connector shows "connected" in the UI but is not reaching the AI assistant as a usable tool — repo access, branch creation, and file pushes are all blocked until this resolves
- Everything below is fully decided and ready to execute the moment repo access works

## Key decisions log
1. **Blog platform:** Next.js 15 (App Router) + Tailwind CSS, hosted on Vercel, connected via GitHub — chosen over WordPress/Ghost/Wix for full brand control, matches user's existing Vercel familiarity
2. **Content model:** Markdown files with frontmatter, no CMS/database in Phase 1 — keeps zero technical burden on the user; AI operator writes and pushes every post
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
- **Phase 1 (launch-ready minimal):** full site structure, YouTube embeds, PDF downloads, external CTA/affiliate components, Giscus comments (free, no database), cookie consent + privacy/terms pages, ad slot placeholders, ads.txt, Vercel Analytics
- **Phase 2 (community/discovery):** ratings, search/filter, RSS, related posts
- **Phase 3 (advanced):** database added (Vercel Postgres/Supabase), authenticated admin panel with multi-format drag-and-drop uploads, analytics dashboard, Stripe-based paid downloads

## Content niches decided
- Primary blog focus: legal/rights/policy explainers (native fit for the existing domain's authority)
- Companion "Brilliance" YouTube-aligned content: philosophy, AI/policy futures, media literacy/institutional accountability — kept as a **separate** property to avoid diluting either brand
- Niche note: "faceless AI channel how-to" content (not this user's niche, but researched as a benchmark) shows realistic net income of roughly $2,000-$6,500/month all-in once affiliate income is included, for context on what "successful" looks like in this content category

## Immediate next actions (in order)
1. **Resolve GitHub connector access** — check Settings → Applications → Installed GitHub Apps → Configure → confirm repository access is set (not just OAuth authorization)
2. Once resolved: AI reads `jaja44-hub` repo for brand assets (logo, color tokens)
3. AI scaffolds new blog repo per Phase 1 spec
4. User imports repo into Vercel, adds CNAME for `blog.addiscrown.et`
5. AI opens PR on legal app repo adding `ads.txt` line — user reviews/merges
6. Publish 5-10 posts before applying for AdSense on the blog

## Open questions still needing user input
- Final accent color/typography direction (left to AI's design judgment per user's last instruction — "modern, common yet distinct")
- First 5 post topics (offered, not yet drafted — say the word and this gets done immediately, independent of the GitHub blocker)
