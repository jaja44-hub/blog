# Addis Crown Blogger Public Product Blueprint

**Version:** 0.1 discussion-ready
**Purpose:** Build the Blogger-hosted Addis Crown publication as a polished, trustworthy, broad-reach public blog. This blueprint is for Blogger only. It is not a React/Vercel compatibility specification.

## 1. Product position

Addis Crown Blogger should be a readable public publication about law, rights, policy, markets, technology, economics, migration, contracts, and institutional change.

The editorial promise:

> Practical, source-aware interpretation of the rules, risks, and changes shaping people, builders, enterprises, investors, and communities.

The publication should feel like a developed editorial journal, not a default hobby blog. It should remain accessible to general readers while preserving professional legal and analytical credibility.

Vercel/Neon may later host premium tools, deep legal resources, transactions, protected downloads, or research products. This Blogger product should stand on its own as the public discovery and audience-growth publication.

## 2. Canonical Blogger decisions

- Public host: the Blogger custom domain selected by the owner.
- Do not publish the same article at competing public URLs without a canonical/redirect plan.
- Keep one Blogger blog as the editorial source for this public property.
- Use Google Account access for owner/editor administration.
- Use Blogger's native draft, scheduling, labels, comments, Analytics, media, and AdSense tools where they are sufficient.
- Preserve the Blogger theme backup and export backup after every major theme revision.

## 3. Brand direction

### Brand character

- Credible but not bureaucratic.
- Contemporary African and globally aware.
- Analytical without sounding academic for its own sake.
- Warm enough for readers, precise enough for professionals.
- Visually editorial, calm, and distinctive.

### Colour system

Use a restrained multi-colour system rather than a single blue or purple theme:

- **Ink:** `#14213D` for header, navigation text, and authority.
- **Parchment:** `#FBF9F4` for the reading canvas.
- **Deep teal:** `#2F6F5E` for links, actions, and trust.
- **Ochre:** `#C08A2E` for labels, highlights, and calls to attention.
- **Mist teal:** `#EAF2ED` for discovery/sidebar sections.
- **Warm rose:** `#F4E8E2` for selected notices and editorial callouts.
- **Rule:** `#E4DFD3` for borders and quiet separators.

### Typography

- Use a readable editorial serif for article titles and section headings.
- Use a clean sans-serif for navigation, metadata, labels, and controls.
- Keep body text comfortable on mobile: generous line height, short paragraphs, strong subheadings.
- Avoid oversized hero text that pushes the first article below the fold.

## 4. Public page architecture

### Header

Persistent header contents:

1. Addis Crown wordmark.
2. Primary navigation:
   - Home
   - Latest
   - Weekly Brief
   - Law & Rights
   - Markets & Enterprise
   - Technology & AI
   - Migration & Borders
   - Global Policy
   - About
3. Search icon or compact search link.
4. Subscribe/Follow action.

On mobile, use a visible menu button. Do not hide navigation without replacement.

### Main homepage

Recommended order:

1. Slim top notice or weekly briefing strip.
2. Brand header/navigation.
3. Editorial hero area with one featured article and one short supporting line.
4. Topic navigation strip.
5. Main content grid:
   - Featured analysis
   - Latest articles
   - Weekly Brief
   - Practical Guides
6. Right sidebar on desktop; stacked sections on mobile.
7. Newsletter/subscribe module.
8. Resource and video discovery module.
9. Footer with legal, contact, social, and archive links.

### Article page

Recommended order:

1. Header/navigation.
2. Article header band:
   - Topic label
   - Headline
   - Short deck/summary
   - Author identity
   - Date and reading time
3. Article body with strong section headings and source links.
4. Related resource or video, where relevant.
5. Article engagement rail:
   - Like/reaction
   - Save/favorite if supported
   - Native Blogger comments or moderated short feedback
   - Share links
6. Related articles.
7. Subscribe module.
8. Footer.

## 5. Content taxonomy

Use Blogger labels as the operational taxonomy. Keep labels stable and avoid creating near-duplicates.

### Primary topic labels

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

### Format labels

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

### Audience labels

- For Individuals
- For Families
- For Founders
- For Employers
- For Investors
- For Professionals
- For Students
- For Public Institutions

### Series labels

- Addis Weekly Brief
- Law in Practice
- Market Signals
- Border and Mobility Watch
- AI and Social Welfare
- Contract Safety Desk
- Global Policy Radar

### Label rules

- Each post receives one primary topic label.
- Each post receives one format label.
- Add an audience label only when genuinely useful.
- Add one series label for recurring work.
- Do not use labels as keyword stuffing.
- Keep the visible navigation limited to the most important primary topics and series.

## 6. Sidebar blueprint

Use Blogger Layout gadgets or equivalent theme sections for:

1. **Search**
2. **Start here**
   - About Addis Crown
   - How to read this publication
   - Editorial standards
3. **Latest posts**
4. **Weekly Brief**
5. **Topic index**
6. **Series index**
7. **Popular posts**
8. **Archive by month**
9. **Subscribe/follow**
10. **Featured resource**
11. **Featured video**
12. **Advertiser/sponsor slot**, clearly labelled

Do not put every label in the sidebar. Use a curated topic index for scanning.

## 7. Discovery and navigation behavior

- Topic navigation should lead to label-filtered Blogger pages.
- Series navigation should use stable label URLs or linked index pages.
- Weekly Brief should be a recurring label and a visible homepage module.
- Every long article should link to two or three related articles.
- Every article should have a clear next action: read another piece, subscribe, view a resource, or watch a related video.
- Use “Read more” breaks on long homepage cards.
- Keep archive pages crawlable and readable.

## 8. Media and resource pattern

For public Blogger posts:

- Use compressed, descriptive images.
- Embed YouTube videos where they genuinely add value.
- Use captions and source credits.
- Link to public PDFs or resources with a clear description and file type.
- Do not upload material without rights or permission.
- For premium or protected resources, link to the Vercel/Neon resource experience instead of pretending Blogger provides access control.

Recommended resource callout:

```text
RESOURCE
Contract Safety Checklist
Format: PDF | Access: Free
[Read or download]
```

Recommended premium handoff:

```text
DEEPER TOOL
Use the Addis Crown resource workspace for the full checklist, templates, and guided analysis.
[Open resource workspace]
```

## 9. Advertising zones

Implement reserved, visually calm ad areas without making the site feel like an ad farm:

1. Top leaderboard zone below the header and above the main content.
2. In-feed ad after the first or second content block.
3. Sidebar ad zone between discovery modules.
4. Article ad zone after a meaningful section, not immediately after the headline.
5. Bottom ad zone before the footer.

Use Blogger AdSense gadgets or HTML/JavaScript gadgets where appropriate. Keep labels such as “Advertisement” visible. Do not use deceptive styling, forced clicks, or excessive fixed overlays.

A permanently fixed ad covering article text is not recommended. A sticky top ad may be tested only if it does not obscure navigation, impair mobile reading, or violate ad policies.

## 10. Blogger configuration checklist

### Basic settings

- Blog title: Addis Crown
- Description: source-aware law, rights, policy, markets, technology, and global affairs analysis
- Language: English unless a multilingual plan is approved
- Time zone: Africa/Addis_Ababa
- Reader access: Public
- Search engine visibility: Enabled
- HTTPS: Enabled
- Custom domain: only after the Blogger pilot is approved

### Theme

- Select a second-generation Layouts theme as the base.
- Back up the original theme before editing.
- Use Theme > Edit HTML for structural changes.
- Use Theme > Customize for basic colour/typography changes.
- Use Layout for gadgets and section ordering.
- Add custom CSS for spacing, bands, cards, labels, and responsive behavior.
- Test mobile and desktop before publishing theme changes.

### Gadgets

Use only the gadgets needed for the blueprint:

- Search
- Labels
- Blog archive
- Popular posts
- Pages
- HTML/JavaScript for subscribe, video, resources, and ad code
- Profile/about
- Follow/subscribe

## 11. AI execution prompt

Give the following prompt to Manus, Claude with browser control, or another approved agentic tool. The operator must be signed into the correct Google account and should approve every destructive or domain-changing step.

```text
You are configuring a Blogger publication called Addis Crown. Work only inside the Blogger blog selected by the owner. Do not change DNS, custom domains, AdSense account settings, or delete content without explicit confirmation.

Mission:
Turn the existing Blogger blog into a polished public editorial publication for law, rights, contracts, markets, investment, economics, migration, technology, AI, policy, global affairs, and Ethiopia/East Africa analysis.

Brand:
- Ink: #14213D
- Parchment: #FBF9F4
- Deep teal: #2F6F5E
- Ochre: #C08A2E
- Mist teal: #EAF2ED
- Warm rose: #F4E8E2
- Rule: #E4DFD3
- Editorial serif headings, clean sans-serif interface text.

Required navigation:
Home, Latest, Weekly Brief, Law & Rights, Markets & Enterprise, Technology & AI, Migration & Borders, Global Policy, About, Search, Subscribe.

Required labels:
Primary topics: Law & Rights, Contracts & Consumer Safety, Business & Enterprise, Markets & Investment, Real Estate & Housing, Economics & Finance, Migration & Borders, Technology & AI, Media & Information, Public Policy & Institutions, Global Affairs, Ethiopia & East Africa, Comparative Law.
Formats: Weekly Brief, News Analysis, Explainer, Practical Guide, Contract Checklist, Review, Essay, Interview, Case Note, Research Note, Resource, Video Brief.
Audiences: For Individuals, For Families, For Founders, For Employers, For Investors, For Professionals, For Students, For Public Institutions.
Series: Addis Weekly Brief, Law in Practice, Market Signals, Border and Mobility Watch, AI and Social Welfare, Contract Safety Desk, Global Policy Radar.

Homepage:
- Add a restrained header and visible mobile menu.
- Add a featured article area.
- Add latest articles, Weekly Brief, Practical Guides, Popular Posts, topic index, series index, subscribe, resource, and video modules.
- Add a desktop sidebar and a clean stacked mobile layout.
- Use Read more breaks for long cards.

Article pages:
- Show topic label, title, summary, author, date, and reading time.
- Keep article text highly readable.
- Add related articles, subscribe, public resource/video callouts, and clearly labelled ad zones.
- Keep comments moderated and easy to find.

Ads:
- Reserve top, in-feed, sidebar, article, and bottom zones.
- Use Blogger AdSense or HTML/JavaScript gadgets only where available.
- Label advertisements.
- Do not use deceptive clicks, intrusive overlays, or ads that cover reading content.

Safety:
- Back up the theme before changes.
- Save a second theme backup after changes.
- Never delete existing posts.
- Do not publish placeholder or fabricated author credentials.
- Preserve privacy, terms, contact, and editorial standards pages.
- At the end, report every changed Blogger setting, gadget, label, theme section, and any blocked step.
```

## 12. Validation checklist

Before declaring the Blogger setup complete:

- Check homepage at desktop width.
- Check homepage at mobile width.
- Open a label page.
- Open a series page.
- Search for a known article.
- Publish and schedule a private test post.
- Test comments and moderation.
- Test image and video rendering.
- Test the subscribe/follow action.
- Check every ad placeholder has stable spacing.
- Confirm no text is hidden behind sticky elements.
- Confirm the blog is public and visible to search engines.
- Back up the theme.
- Export the blog content.
- Record the final Blogger URL and settings.

## 13. Other options and AI assistance

- **Manus:** suitable for browser-guided Blogger setup if it can access Blogger, Theme, Layout, Settings, and the selected Google account. Require screenshots or a step log after each major change.
- **Claude browser agent:** suitable for navigation and theme editing where browser authorization is available. Keep domain/DNS actions manual and separately confirmed.
- **Google Antigravity or similar agent:** use only if its current plan and connectors explicitly support Blogger browser control. Do not assume support from the product name.
- **Prompt-only theme generation:** ask an AI to generate Blogger XML/CSS/HTML, then upload it through Theme > Edit HTML after backing up the current theme.
- **Gadget-first setup:** safer for a first iteration because it changes layout without replacing the entire theme.
- **Manual phone execution:** use the fallback guide and paste one bounded action at a time. Keep theme XML in a backup document before upload.

An AI agent should never receive the admin credentials file contents. Google authentication should happen interactively in the browser by the owner.
```
