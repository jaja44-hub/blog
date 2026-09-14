# Addis Crown Blogger Hybrid Architecture Draft

**Status:** Discussion draft v0.1
**Date:** 2026-09-07
**Purpose:** Decide whether Blogger should replace, complement, or remain separate from the current Vercel + Neon Addis Crown platform.

## Executive finding

Blogger is a strong managed publishing and monetization surface. It already provides:

- Post drafts, publishing, scheduling, labels, preview, and basic editorial access.
- Custom themes, HTML/CSS editing, and layout gadgets.
- Built-in comments controls and moderation.
- Image/video insertion and media management.
- Google Analytics Measurement ID support.
- Blogger custom domains.
- Blogger-oriented AdSense onboarding, ad placement, earnings access, and custom ads.txt.
- Google Takeout backup and Blogger import/export paths.

It does **not** automatically become a backend for the existing Next.js public site. A Blogger custom domain points the public hostname at Blogger, while the current `blog.addiscrown.et` hostname points at Vercel. Running both as competing public versions of the same blog would split canonical URLs, analytics, comments, ad inventory, and editorial truth.

**Initial recommendation:** keep Vercel + Neon as the canonical Addis Crown platform and use Blogger as a controlled publishing/monetization experiment or a separate companion property until a measured migration decision is approved. Do not point `blog.addiscrown.et` at Blogger yet.

## Verified Blogger capabilities

### Publishing and editorial

Official Blogger documentation confirms that Blogger supports saving drafts, previewing, publishing, editing, reverting to draft, deleting posts, scheduling posts, and organizing posts with labels. This overlaps with our current Neon editorial workflow.

**Blogger can replace in an all-Blogger model:**

- Basic draft and publish UI.
- Basic post scheduling.
- Labels/categories for reader filtering.
- Basic multi-author access through Google Accounts.

**Our platform still adds:**

- Research briefs and source/evidence records.
- Revision/audit history designed for Addis Crown operations.
- Admin roles beyond Blogger's author/admin model.
- Advertiser, campaign, event, and decision-metric data.
- Custom moderation and engagement workflows.
- Import/export under our own application contract.

### Themes, layout, and brand control

Blogger supports themes, layout gadgets, HTML editing, CSS editing, and widget/page-element tags. That gives meaningful brand control, but the customization model is Blogger-template based rather than React/Tailwind component based.

**Implication:** A branded Blogger version is feasible, but reproducing the current Addis Crown visual system would be a new theme implementation. It is not a switch that imports the existing Next.js UI.

### Domain architecture

Blogger custom domains use a Google CNAME target (`ghs.google.com`) plus a blog/account-specific security CNAME. The current `blog.addiscrown.et` DNS is assigned to Vercel.

Possible domain arrangements:

| Arrangement | Result | Recommendation |
|---|---|---|
| `blog.addiscrown.et` stays on Vercel | Current canonical product remains intact | **Recommended now** |
| `blog.addiscrown.et` moves to Blogger | Blogger becomes the public site; current Vercel UI is no longer canonical | Only after migration proof |
| `journal.addiscrown.et` on Blogger | Separate Blogger experiment/companion publication | Viable experiment |
| Blogger at an iframe/embed path | Poor SEO, poor accessibility, awkward navigation, not a true backend integration | Reject |
| Vercel frontend pulls Blogger posts via an API | Possible in principle, but requires an explicit API/sync design and verification not assumed in this draft | Research only |

### Comments and audience interaction

Blogger has native comment settings and moderation. This may be more suitable for general readers than GitHub Discussions/Giscus, but the exact public identity/sign-in behavior must be tested in the user's Blogger instance before selecting it as the reader-comment solution.

Blogger comments would not automatically populate our Neon engagement or editorial intelligence tables. A bridge would be required for unified metrics.

**Recommendation:** Native comments should be evaluated in a Blogger sandbox or separate subdomain. Do not replace the current public comments fallback until the actual reader flow, moderation, privacy, export, and data ownership are tested.

### Analytics and measurement

Blogger supports a Google Analytics Measurement ID in Settings, with data collection potentially taking up to 24 hours. Blogger also exposes Blogger/AdSense-oriented reporting paths.

Our Vercel + Neon platform can capture product-specific events such as:

- Article views.
- Likes, saves, ratings, and quick feedback.
- Search terms and filter use.
- Research-to-published-content conversion.
- Editorial workflow time.
- Advertiser campaign and placement metrics.

**Recommendation:** Use Google Analytics for acquisition/traffic reporting where appropriate, but keep Neon as the operational decision-metrics store if the current platform remains canonical.

### AdSense and advertising

Official Blogger documentation confirms Blogger-specific AdSense onboarding through the Blogger Earnings area, ad placement between posts, sidebar/column AdSense gadgets, third-party ad code through HTML/JavaScript gadgets, earnings reporting, and custom ads.txt settings.

AdSense approval is not guaranteed by using Blogger. Google's AdSense eligibility guidance still emphasizes original, useful content, policy compliance, age/account requirements, and ownership/access to the submitted site. Blogger may reduce implementation work, but it does not replace content quality, trust, privacy, or policy readiness.

**Blogger can replace in an all-Blogger model:**

- AdSense placement plumbing.
- Some ads.txt administration.
- Basic earnings access.
- Basic ad layout controls.

**Our platform adds:**

- Advertiser campaign entities.
- Direct sponsorship records.
- Placement experiments and queue logic.
- Aggregate performance decisions.
- A controlled separation between editorial content and monetization operations.

**Important domain warning:** Blogger's ads.txt capability applies to the Blogger-hosted blog. It does not automatically solve ads.txt for the existing root-domain/legal-app architecture.

### Media and resources

Blogger supports inserting images and videos, including YouTube videos, and provides media management. Documentation notes that Blogger may compress/optimize images and does not offer original-quality storage for large images.

Our roadmap requires more than basic insertion:

- PDFs and downloadable resources.
- Access-controlled free/premium assets.
- Resource metadata and download events.
- Research attachments.
- Versioning and editorial ownership.
- Future paid products.

**Recommendation:** Blogger may cover simple public media embedding. Keep Neon/Vercel storage and access control for governed resources, premium files, research attachments, and analytics.

### Backup, migration, and ownership

Blogger supports Google Takeout backups, theme backups, and importing posts/pages/comments from Blogger backup feeds. This is valuable for reversibility.

However, backup/export is not the same as a live two-way synchronization contract. Before any migration, test:

- Frontmatter/metadata preservation.
- Slugs and redirects.
- Dates and scheduled state.
- Images/video URLs.
- Comments and moderation state.
- Canonical/SEO metadata.
- Ad placement and ads.txt state.

## Roadmap mapping

| Addis Crown capability | Blogger coverage | Keep/build in Addis platform? | Decision |
|---|---|---|---|
| Basic posts and drafts | Strong | Optional if Blogger becomes canonical | Do not duplicate blindly |
| Scheduling | Native | Keep only if Neon scheduling gives needed control | Compare |
| Categories/labels | Strong | Keep public category UX | Use Blogger labels only in Blogger model |
| Research briefs | None | Yes | Keep in Neon |
| Sources/evidence | None | Yes | Keep in Neon |
| Revision/audit history | Limited/basic | Yes | Keep in Neon |
| Admin roles | Google author/admin model | Yes for granular roles | Keep in Neon/provider auth |
| Native comments | Available | Evaluate | Test before choosing |
| Giscus | External integration | Not required if Blogger comments adopted | Do not make primary dependency |
| Ratings/likes/saves | Not native as Addis needs them | Yes | Keep in Vercel/Neon |
| Search/date/popularity | Partial/basic | Yes | Keep custom discovery |
| Image/video embed | Strong | Optional | Use where simple |
| PDF/resource governance | Not sufficient | Yes | Keep custom platform |
| AdSense onboarding | Strong | Optional | Leverage if Blogger is canonical |
| ads.txt | Native Blogger setting | Depends on host/domain | Verify domain architecture |
| Google Analytics | Native Measurement ID | Useful | Add to canonical platform too |
| Direct advertisers | Not a complete CRM/workflow | Yes | Keep in Neon |
| Paid downloads | Not a complete product system | Yes | Keep custom/Stripe path |
| Recommendations | Not Addis-specific | Yes | Keep in Neon |
| Custom React/Tailwind experience | No, template/gadget model | Yes | Vercel advantage |

## Three viable operating models

### Model A: Vercel canonical, Blogger as research/publishing lab

- Keep `blog.addiscrown.et` on Vercel.
- Use Blogger privately or on a non-canonical test blog to evaluate authoring, comments, Analytics, and AdSense workflows.
- Publish only selected approved content to the canonical site through Markdown/database workflow.

**Best for:** preserving brand/UI control and learning Blogger without SEO duplication.

### Model B: Blogger canonical, Neon/Vercel as operations and intelligence system

- Move the public blog hostname to Blogger.
- Use Blogger for public posts, comments, ads, and basic analytics.
- Keep Neon for research, advertiser planning, premium resources, and aggregate intelligence.
- Build an explicit sync/import process between Blogger and Neon.

**Risks:** public design changes, domain migration, sync failure, split analytics, limited custom engagement, and weaker control over the product surface.

### Model C: Two branded properties

- Keep `blog.addiscrown.et` as the flagship Addis Crown publication.
- Use a separate Blogger subdomain/property for a companion publication, experiments, or a distinct content series.
- Cross-link carefully without duplicating the same articles word-for-word.

**Best for:** experimentation without risking canonical SEO or the current production site.

## Proposed decision gate

Do not migrate the canonical domain yet. Run a bounded Blogger pilot first:

1. Confirm the Blogger blog's public URL and current theme.
2. Create one original test post, one scheduled post, one media-rich post, and one comment test.
3. Test custom-domain setup without changing `blog.addiscrown.et`.
4. Test Analytics Measurement ID and Blogger page/traffic reporting.
5. Test Blogger's AdSense/Earnings eligibility screen; do not assume approval.
6. Test custom ads.txt behavior on the pilot domain.
7. Export the pilot blog through Google Takeout and inspect reversibility.
8. Compare reader experience, mobile layout, comments, speed, SEO URLs, and ad placement with Vercel.
9. Decide whether Blogger becomes a separate property, a publishing lab, or a future canonical host.

## Current recommendation

**Adopt Blogger selectively, not as an immediate replacement.**

Use Blogger for capabilities it already handles well:

- Basic publishing experiments.
- Google Analytics connection.
- Blogger-native comments evaluation.
- AdSense workflow discovery.
- Simple media posts.
- Backup/export testing.

Keep the current Vercel + Neon system for what makes Addis Crown distinctive:

- Editorial research intelligence.
- Database-backed drafts and revisions.
- Admin workflow and audit trail.
- Custom engagement and recommendation metrics.
- Governed resources and downloads.
- Premium/free access logic.
- Custom branded UI and product navigation.
- Advertiser and campaign intelligence.

## Questions for next review round

1. What is the Blogger blog's current address and is it intended as a pilot or future canonical property?
2. Does the Blogger theme need to mirror Addis Crown exactly or only carry the brand mark/colors?
3. Is the first revenue priority AdSense, direct advertisers, premium resources, or a combination?
4. Are comments expected to be open to anonymous readers, Google-account readers, or moderated submissions?
5. Should the pilot publish the same two existing articles, or should it use new test content to avoid duplicate-content confusion?
6. Which system should own the canonical URL if Blogger and Vercel both publish?

## Official sources consulted

- Blogger: Create/edit/manage posts: https://support.google.com/blogger/answer/41378
- Blogger: Custom domains: https://support.google.com/blogger/answer/1233387
- Blogger: Access and team members: https://support.google.com/blogger/answer/42673
- Blogger: Create a blog: https://support.google.com/blogger/answer/1623800
- Blogger: Design, HTML/CSS, gadgets: https://support.google.com/blogger/answer/176245
- Blogger: Comments: https://support.google.com/blogger/answer/187141
- Blogger: Analytics: https://support.google.com/blogger/answer/7039627
- Blogger: Images/videos: https://support.google.com/blogger/answer/41641
- Blogger: Backup/import: https://support.google.com/blogger/answer/41387
- Blogger: AdSense, ads, ads.txt: https://support.google.com/blogger/answer/1269077
- Blogger: Search visibility/SEO: https://support.google.com/blogger/answer/41373
- AdSense eligibility: https://support.google.com/adsense/answer/9724
