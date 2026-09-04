# Addis Crown Blog

Legal/rights/policy blog for `blog.addiscrown.et`, built with Next.js 15,
Tailwind CSS, and markdown-based content (no database — see `/docs` for why).

## Full project context

Read `/docs/PROJECT_HANDOFF_LOG.md` first — it has the current status,
every decision made so far, and next actions. `/docs/blog_addiscrown_build_spec.md`
has the full phased feature roadmap. Paste both into any AI assistant you're
continuing this project with, so nothing gets lost across sessions/platforms.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying

1. Push this repo to GitHub
2. Import it into Vercel (vercel.com/new)
3. Add a CNAME record for `blog.addiscrown.et` pointing at the target Vercel gives you
4. Add the `ads.txt` line to the ROOT domain's repo once AdSense is approved — see `ADS_TXT_FOR_ROOT_DOMAIN.txt` for why this can't live in this repo

## Publishing a new post

Add a new `.md` file to `content/posts/`, following the frontmatter format
in the existing sample posts. That's the entire publishing workflow —
no admin panel yet (that's Phase 3, see the build spec).

## Before applying for AdSense

- [ ] Publish 5-10 real posts
- [ ] Replace placeholder Privacy Policy / Terms content with reviewed copy
- [ ] Replace the About page bio with real credentials
- [ ] Confirm the root domain's `ads.txt` is live
- [ ] Set up Giscus (see `components/Comments.tsx` for the two IDs you need from giscus.app)

## Brand assets

Logo and color tokens in `tailwind.config.ts` are currently placeholders
(inherit-ready, not yet inherited) — pull real values from the legal app's
repo (`jaja44-hub`) once GitHub access is confirmed working, and update
`components/Header.tsx`'s wordmark accordingly.
