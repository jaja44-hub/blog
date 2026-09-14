# Addis Crown Blogger Manual Setup Guide

**Purpose:** Phone-friendly fallback for configuring the Blogger public publication when an AI browser agent cannot complete the work.

This guide changes Blogger only. It does not change Vercel, Neon, DNS, or the admin credentials file.

## Before you begin

Have these ready:

- The Google account that owns the Blogger blog.
- The Blogger blog selected in Blogger.com.
- A copy of the current Blogger theme backup.
- The [Blogger Public Product Blueprint](BLOGGER_PUBLIC_PRODUCT_BLUEPRINT.md) open on another device.
- One test post that contains no sensitive or unpublished material.

Do not start with a custom-domain change. First configure and test the Blogger blog at its current Blogspot address.

## Phase 1: Basic blog identity

1. Open `blogger.com`.
2. Select the Addis Crown blog.
3. Open **Settings**.
4. Under **Basic**, set:
   - Title: `Addis Crown`
   - Description: `Law, rights, contracts, markets, technology, policy, and global affairs explained with practical context.`
   - Language: English unless a multilingual decision is made.
   - Time zone: `Africa/Addis_Ababa`.
5. Under **Privacy**, turn on **Visible to search engines**.
6. Confirm reader access is **Public**.
7. Confirm HTTPS is enabled.
8. Save each section before leaving it.

## Phase 2: Back up before design work

1. Open **Settings**.
2. Find **Manage blog**.
3. Choose **Back up content**.
4. Download the content backup.
5. Open **Theme**.
6. Use the theme menu beside **Customize**.
7. Choose **Backup** and download the theme.
8. Name the files with the date, for example:
   - `addis-crown-blogger-content-2026-09-07`
   - `addis-crown-blogger-theme-before-branding-2026-09-07`

Never replace a theme without a recent backup.

## Phase 3: Theme and brand

1. Open **Theme**.
2. Prefer a second-generation **Layouts** theme.
3. Use **Customize** for the first pass:
   - Background: `#FBF9F4`
   - Primary text/header: `#14213D`
   - Links/actions: `#2F6F5E`
   - Highlights/labels: `#C08A2E`
   - Sidebar background: `#EAF2ED`
   - Callout background: `#F4E8E2`
4. Use a serif display font for article titles if available.
5. Use a clean sans-serif for navigation and metadata.
6. Save and preview before publishing.

For more control:

1. Open **Theme**.
2. Open the theme menu.
3. Choose **Edit HTML**.
4. Only paste a prepared, backed-up Blogger XML theme.
5. Preview first.
6. Do not publish if the preview has missing widgets, broken navigation, or unreadable mobile text.

## Phase 4: Header and navigation

Open **Layout** and arrange the header/navigation area in this order:

1. Addis Crown logo or wordmark.
2. Home.
3. Latest.
4. Weekly Brief.
5. Law & Rights.
6. Markets & Enterprise.
7. Technology & AI.
8. Migration & Borders.
9. Global Policy.
10. About.
11. Search.
12. Subscribe/Follow.

On a narrow screen, use the theme's mobile menu. If the theme cannot collapse navigation cleanly, reduce the visible top links and move the complete topic index into the sidebar.

## Phase 5: Create labels

Create stable labels by publishing or editing posts. Use these label groups:

### Topics

- Law & Rights
- Contracts & Consumer Safety
- Business & Enterprise
- Markets & Investment
- Real Estate & Housing
- Economics & Finance
- Migration & Borders
- Technology & AI
- Media & Information
- Public Policy & Institutions
- Global Affairs
- Ethiopia & East Africa
- Comparative Law

### Formats

- Weekly Brief
- News Analysis
- Explainer
- Practical Guide
- Contract Checklist
- Review
- Essay
- Interview
- Case Note
- Research Note
- Resource
- Video Brief

### Audiences

- For Individuals
- For Families
- For Founders
- For Employers
- For Investors
- For Professionals
- For Students
- For Public Institutions

### Series

- Addis Weekly Brief
- Law in Practice
- Market Signals
- Border and Mobility Watch
- AI and Social Welfare
- Contract Safety Desk
- Global Policy Radar

Label discipline:

- One primary topic per post.
- One format per post.
- One series label for recurring work.
- Audience label only when useful.
- Do not add every label to the navigation.

## Phase 6: Sidebar layout

Open **Layout** and add or arrange these gadgets:

1. Search.
2. Pages or navigation links.
3. Labels, configured to show only the main topic labels.
4. Popular Posts.
5. Blog Archive.
6. HTML/JavaScript gadget for **Start Here** links.
7. HTML/JavaScript gadget for **Weekly Brief**.
8. HTML/JavaScript gadget for **Subscribe/Follow**.
9. HTML/JavaScript gadget for **Featured Resource**.
10. HTML/JavaScript gadget for **Featured Video**.
11. Advertisement/AdSense gadget where appropriate.

Keep the sidebar short on mobile. Move less important sections below the main post list rather than creating a very long top sidebar.

## Phase 7: Homepage content blocks

Configure the homepage to show:

1. Featured article.
2. Latest posts.
3. Weekly Brief.
4. Practical Guides.
5. Popular Posts.
6. Topic index.
7. Subscribe/Follow.
8. Resource and video callouts.

Use Blogger's **Read more** break on long posts so the homepage remains scannable.

## Phase 8: Article format

Use this structure for every article:

1. Clear headline.
2. One-sentence summary.
3. Topic and format labels.
4. Author identity.
5. Date.
6. Short introduction.
7. Section headings.
8. Source links and caveats.
9. Practical implications.
10. Related post links.
11. Resource/video callout when relevant.
12. Comment invitation.
13. Subscribe/Follow callout.

For legal or policy writing, separate:

- What is confirmed.
- What is interpretation.
- What remains uncertain.
- What the reader should verify.

## Phase 9: Media and resource blocks

### Image

Use descriptive filenames, alt text, captions, and source credit. Do not upload material without permission.

### YouTube

Use Blogger's video insert tool for relevant videos. Add a written summary so the post remains useful if the video is unavailable.

### Public PDF/resource

Use an HTML/JavaScript gadget or post link with:

- Resource title.
- File format.
- Short purpose.
- Free/premium status.
- Source or author note.

### Premium handoff

For protected transactions or premium resources, link to the Addis Crown Vercel resource workspace. Do not put payment credentials or private files directly into a public Blogger gadget.

## Phase 10: Comment and reader settings

Open **Settings** and locate comment settings.

Choose the least-friction setting that still gives useful moderation. Test:

- Whether anonymous comments are allowed.
- Whether Google sign-in is required.
- Whether comments are moderated before publication.
- Whether readers can report inappropriate comments.
- How comment notifications reach the owner.

For a broad public audience, moderation is more important than forcing a technical identity provider.

## Phase 11: Analytics and search visibility

### Google Analytics

1. Create or open the Google Analytics property.
2. Copy the `G-` Measurement ID.
3. In Blogger, open **Settings**.
4. Under **Basic**, find **Google Analytics Measurement**.
5. Paste the ID.
6. Save.
7. Allow up to 24 hours for data.

### Search visibility

1. Confirm **Visible to search engines** is on.
2. Use descriptive titles and headings.
3. Add alt text to images.
4. Avoid copying the same full article to multiple public sites.
5. Keep one canonical public URL per article.

## Phase 12: Ad zones, without monetization pressure

Do not apply for AdSense solely because the gadgets exist. First make the publication useful and substantial.

When ready, reserve:

1. Header/leaderboard area.
2. In-feed area.
3. Sidebar area.
4. Article area after meaningful content.
5. Footer area.

Use **Layout > Add a Gadget > AdSense** for Blogger-native ads, or **HTML/JavaScript** only with approved provider code. Label advertising clearly. Do not cover text, navigation, or controls with sticky ads.

## Phase 13: Test checklist

Open the public Blogspot address and test:

- Homepage desktop.
- Homepage mobile.
- Menu/navigation.
- Search.
- Topic label page.
- Weekly Brief label.
- Popular posts.
- Article page.
- Read more break.
- Image and video.
- Resource link.
- Comment submission and moderation.
- Subscribe/Follow action.
- Analytics configuration.
- Page speed and layout stability.
- Privacy, contact, and about pages.

Take screenshots before and after major theme changes.

## Phase 14: Custom domain, only after the pilot passes

Do not change `blog.addiscrown.et` until the Blogger version is approved.

When ready:

1. In Blogger, open **Settings > Publishing > Custom domain**.
2. Enter the desired domain.
3. Blogger will provide:
   - Main CNAME, normally pointing to `ghs.google.com`.
   - A unique security/verification CNAME.
4. Because the domain currently uses Vercel DNS, update the DNS records in the active Vercel DNS control plane, not blindly at Ethio Telecom.
5. Remove the current `blog` CNAME pointing to Vercel.
6. Add Blogger's two CNAME records exactly as provided.
7. Wait for DNS and SSL propagation.
8. Reopen Blogger custom-domain settings and verify.
9. Confirm the Blogspot address redirects to the custom domain.
10. Verify canonical URLs, search visibility, Analytics, comments, and ads.txt.

Do not leave Vercel and Blogger competing for the same hostname.

## Phase 15: Rollback

If the Blogger result is not acceptable:

1. Restore the previous Blogger theme backup.
2. Do not change the custom domain until a rollback decision is made.
3. If the domain was moved, restore the previous Vercel DNS CNAME.
4. Wait for DNS/SSL propagation.
5. Confirm the Vercel production alias.
6. Check canonical URLs and redirects.
7. Record what failed before trying another theme.

## AI-agent operating rules

An AI browser agent may:

- Open Blogger settings, theme, layout, posts, labels, comments, and Analytics screens.
- Add or reorder gadgets.
- Edit theme CSS/HTML after creating a backup.
- Create labels and draft test posts.
- Capture screenshots and a change log.

The agent must ask for owner confirmation before:

- Moving the custom domain.
- Changing DNS.
- Publishing a non-test article.
- Enabling AdSense or ad code.
- Deleting posts, themes, labels, or comments.
- Making the blog private.
- Sharing Google account data.

The owner must sign in interactively. Never paste Google passwords, recovery codes, or private tokens into an AI prompt.

## Completion record

Fill this after the setup:

- Blogger blog address:
- Custom domain status:
- Theme name/version:
- Theme backup filename:
- Content backup filename:
- Main navigation complete: yes/no
- Sidebar complete: yes/no
- Mobile tested: yes/no
- Comments tested: yes/no
- Analytics Measurement ID configured: yes/no
- AdSense status: not started / applied / approved / rejected
- ads.txt status:
- Final blockers:
