# Addis Crown Blog

Legal/rights/policy blog for `blog.addiscrown.et`, built with Next.js 15,
Tailwind CSS, Markdown content, and a Neon-backed platform foundation.

The public reading experience remains fast and content-first. The platform is
being expanded with database-backed editorial workflow, research planning,
audience insight, advertiser records, scheduling, and recommendation features.

## Full project context

Read `/docs/PROJECT_HANDOFF_LOG.md` first — it has the current status,
every decision made so far, and next actions. `/docs/blog_addiscrown_build_spec.md`
has the full phased feature roadmap. Paste both into any AI assistant you're
continuing this project with, so nothing gets lost across sessions/platforms.

## Runtime contract

- Next.js is pinned to `15.5.25`, the version used by the current verified
	Vercel deployment. Do not upgrade it casually during feature work.
- Neon/Postgres is the source of truth for operational platform data. Markdown
	remains supported for the existing public posts while the editorial system
	is built out.
- `DATABASE_URL` is required for database-backed features such as ratings and
	will become the connection used by the admin and intelligence modules.
- `ADMIN_ACCESS_TOKEN` is required for the first protected admin workflow. Set
	it as an encrypted Vercel environment variable before using `/admin`; this
	token gate is an interim foundation for the later role-based identity layer.

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
in the existing sample posts. This remains a supported publishing path while
the database-backed admin workflow is developed.

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
