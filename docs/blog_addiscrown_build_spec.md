# Addis Crown Blog — Build Specification
**Target domain:** blog.addiscrown.et (subdomain CNAME → Vercel)
**Status:** Ready to execute once GitHub is connected

---

## 1. Tech stack (deliberately minimal, no database)

- **Framework:** Next.js 15 (App Router) — best-in-class for SEO/AdSense page-speed signals, native Vercel support
- **Styling:** Tailwind CSS — fast to theme, easy for me to iterate on branding with you
- **Content:** Markdown files with frontmatter (no CMS, no database) — each post is one `.md` file in `/content/posts/`
- **Deployment:** GitHub repo → Vercel (auto-deploy on push to `main`)
- **Analytics:** Vercel Analytics (built-in, zero config) — start collecting traffic history now, useful evidence when you apply for AdSense later

**Why no CMS/database:** keeps you at zero technical burden (you never log into an admin panel — you tell me what to publish, I commit it) while keeping the whole stack simple enough that nothing breaks silently. Upgradeable to a real CMS (Sanity/Contentlayer) later if you ever want to publish without me.

---

## 2. Site structure

```
/                     → homepage: latest posts, featured post, category nav
/posts/[slug]         → individual article page
/category/[category]  → filtered post list (Legal Rights, AI & Policy, etc.)
/about                → your bio/credentials (matters for AdSense trust signals)
/privacy-policy        → required for AdSense approval
/terms                 → required for AdSense approval
/contact               → simple form or mailto link
/sitemap.xml            → auto-generated
/robots.txt              → auto-generated
```

## 3. Post frontmatter schema (every post needs this)

```yaml
---
title: "Post title"
slug: "url-friendly-slug"
date: "2026-09-01"
category: "legal-rights" | "ai-policy" | "media-literacy"
description: "1-2 sentence summary for meta description + previews"
ogImage: "/images/posts/slug-name.png"
draft: false
---
```

## 4. AdSense readiness checklist (built into the site from day one)

- [ ] `ads.txt` file placed at **root domain** (addiscrown.et/ads.txt) — needs coordination with whoever manages the main legal-AI app's hosting, since the subdomain doesn't cover this
- [ ] Privacy Policy page with a cookie/ads disclosure clause (standard AdSense requirement)
- [ ] Cookie consent banner (required in many regions before ads can serve) — lightweight banner component, defaults to a simple accept/reject
- [ ] Ad slot placeholders built into the layout now (empty until approved) — one header slot, one in-article slot after the 2nd paragraph, one sidebar/footer slot. Pre-building these means flipping on real ads later is a one-line config change, not a redesign
- [ ] Fast, static-generated pages (Next.js SSG) — page experience directly affects both SEO and AdSense approval odds
- [ ] Minimum ~5-10 real published posts before applying — empty or thin sites are commonly rejected on first pass

## 5. Branding (needs your input before I build the visual layer)

Placeholder decisions I'll need from you before final styling:
- Primary color / accent color direction (or I propose a scheme rooted in "credible legal authority" — deep navy/charcoal + one confident accent)
- Typography feel: more editorial/serif (trust, authority) vs. clean sans-serif (modern, fast-reading)
- Logo/wordmark — reuse a variant of the Addis Crown mark, or a distinct blog identity?

## 6. Content pipeline (the permanent, standing publishing method)

This is the default path across **every phase below**, including after the admin UI exists in the advanced build — the admin panel is an *additional* option for you, not a replacement for this:

1. You tell me a topic (or I propose one from our niche list), or hand me source material — including local files, since I can read documents you upload directly into our chat and fold them into a post
2. I write the full post as a markdown file with correct frontmatter, embedding any PDFs/media/CTAs per the components available at that phase
3. I commit it to the repo and push
4. Vercel auto-deploys — live in under a minute, no action from you
5. Repeat — indefinitely, this never goes away

## 7. Brand inheritance

Once GitHub is connected, I'll read your **studio updates** repo's production branch to identify: logo files/marks, color tokens (hex values in use), and typography choices already live on the legal app. I'll carry the logo and core palette over for brand consistency, then design the blog's actual layout, spacing, and page structure fresh — built for long-form article reading and ad placement rather than app-UI patterns, since those are different design problems even under one brand.

## 8. Phased build roadmap

### Phase 1 — Launch-ready minimal (build this first, apply for AdSense once populated)
- Full site structure from Section 2, styled with inherited brand colors/logo
- YouTube embed component (for your channel's videos, embedded directly in posts)
- PDF embed/download component (files served as static assets — no size concerns at typical article-attachment sizes)
- External CTA/affiliate link component (styled button/card, tracks outbound clicks via Analytics)
- Simple comment system via **Giscus** (free, uses GitHub Discussions as the backend — zero database needed, ships in Phase 1 without complexity)
- Cookie consent + Privacy/Terms pages + ad slot placeholders + ads.txt
- Vercel Analytics live from day one, so you have real traffic history by the time you apply

*This phase is deliberately scoped to avoid anything that needs a database — everything above ships with just the repo + markdown + two free third-party embeds (YouTube, Giscus). Nothing here creates AdSense-approval ambiguity; simple, fast, content-rich sites approve fastest.*

### Phase 2 — Community & discovery (once traffic exists)
- Post rating widget
- Search/filter across posts and categories
- RSS feed
- Related-posts recommendations

### Phase 3 — Advanced: admin CMS, uploads, payments, analytics dashboard
- **Database added** (Vercel Postgres or Supabase) — this is the real dividing line between "simple site" and "platform," and it's the point where an admin UI becomes possible at all
- **Authenticated admin panel** (login-gated to you only) with a drag-and-drop uploader supporting mixed formats (video, PDF, image, doc) attached to a single post — this is the local-file-upload capability you asked for
- **Analytics dashboard** inside the admin panel — most-visited, best-rated, and trending posts, to guide what we cover next
- **Paid downloads/products**, via **Stripe** (not an AdSense feature — a separate, standard integration) if you want to sell templates, guides, or documents directly

## 9. Deployment steps (once GitHub is connected)

1. I read the studio updates repo for brand assets, then create the new blog repo with Phase 1 scaffolded
2. You import the repo into Vercel (few clicks, since you're already familiar with it)
3. You add the CNAME record for `blog.addiscrown.et` in your Ethio Telecom DNS portal, pointing at Vercel's provided target
4. I open a pull request on the legal app's repo adding the `ads.txt` line at the root domain — you review and merge it, keeping the live app untouched until you approve
5. We publish 5-10 posts before submitting the AdSense application
6. Phase 2 and 3 get scoped as separate build sessions once Phase 1 is live and generating real traffic data to design around
