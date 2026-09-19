# Sprint 11 Production Schema Comparison

**Project:** Addis Crown Blog Platform  
**Branch inspected:** Neon `production` (`br-orange-rain-awpyfg18`)  
**Database:** `neondb`  
**Inspection date:** 2026-09-19  
**Repository baseline:** `4d80850`

## Conclusion

The Neon production branch contains every relation required by the deployed Sprint 5–9 admin routes. The required tables are in the `public` schema, use UUID primary keys, and expose the columns expected by the current application libraries. The Sprint 11 production failure was therefore not caused by absent tables on this verified Neon branch.

The decisive comparison found that Vercel production `DATABASE_URL` pointed to a different Neon endpoint than the inspected production branch. The Vercel value used host `ep-odd-wind-aw3v2avr-pooler...`, while the verified production branch uses `ep-tiny-wildflower-awxqjl1i-pooler...`. The Vercel production variable was corrected to the verified production branch connection without recording the credential in this repository.

## Required relation inventory

All 18 relations named in the Sprint 11 remediation prompt were present:

| Relation | Present | Primary key | Relevant foreign keys |
|---|---:|---|---|
| `media_assets` | Yes | `id` UUID | `upload_user_id → users.id` |
| `knowledge_sources` | Yes | `id` UUID | None |
| `source_usage` | Yes | `id` UUID | `source_id → knowledge_sources.id`, `post_id → posts.id` |
| `media_usage` | Yes | `id` UUID | `media_id → media_assets.id`, `post_id → posts.id` |
| `media_tags` | Yes | `id` UUID | `media_id → media_assets.id` |
| `google_api_credentials` | Yes | `id` UUID | None |
| `google_ads_campaigns` | Yes | `id` UUID | `created_by → users.id` |
| `google_ads_performance` | Yes | `id` UUID | `campaign_id → google_ads_campaigns.id` |
| `ad_creative` | Yes | `id` UUID | `campaign_id → google_ads_campaigns.id` |
| `adsense_performance` | Yes | `id` UUID | None |
| `adsense_ad_units` | Yes | `id` UUID | None |
| `search_console_data` | Yes | `id` UUID | `post_id → posts.id` |
| `regional_analytics` | Yes | `id` UUID | `post_id → posts.id` |
| `topic_regional_performance` | Yes | `id` UUID | `category_id → categories.id` |
| `content_performance` | Yes | `id` UUID | `post_id → posts.id` |
| `topic_performance` | Yes | `id` UUID | `category_id → categories.id` |
| `content_opportunities` | Yes | `id` UUID | `category_id → categories.id` |
| `editorial_calendar` | Yes | `id` UUID | `post_id → posts.id`, `campaign_id → google_ads_campaigns.id` |

The production branch also contains the compatibility tables used by the deployed code, including `posts`, `editorial_posts`, `users`, `categories`, `series`, `research_briefs`, `post_revisions`, and `scheduled_publications`.

## Compatibility observations

The inspected target tables have the expected UUID identifier types, JSONB fields, timestamp defaults, and foreign-key relationships. `knowledge_sources.url` has a unique constraint. `media_assets.storage_key` is non-null. `content_opportunities.category_id` is nullable, which permits the controlled probe payload used by the route. `search_console_data.post_id` is nullable, which permits a site-level controlled probe.

No production migration was required or applied. Creating duplicate tables would have been unsafe and unnecessary because the verified branch already contained the complete relation inventory. No production rows were altered except for the explicitly approved deletion of the uniquely named knowledge-source probe record that lacked an API DELETE handler.

## Platform alignment evidence

After the Vercel variable correction, deployment `dpl_59TQ86NoaA71Y6FM2EFS5SVRadD5` reached `READY`, was built from commit `4d80850177bdb454fc95d7dccc500d512093b98b`, and received the `blog.addiscrown.et` production alias. Fresh runtime-log inspection for the deployment returned no error entries during the verification window.

## Limitations

The original Vercel logs remain historical evidence of the earlier misaligned database target. Vercel Hobby runtime-log retention does not provide a seven-day historical window, so the before-state is represented by the committed Sprint 11 evidence and the fresh pre-correction logs captured during this task. The knowledge-sources route still lacks a DELETE handler; the successful probe was removed directly through the approved, uniquely scoped Neon cleanup statement.

Sprint 12 and Sprint 13 implementation work was not performed. Google API production credentials, campaigns, legal-app integration, and `www.addiscrown.et` were not modified.

## Verification source

The evidence was produced from Neon schema inspection, Vercel project/deployment metadata, Vercel runtime logs, and the committed authenticated and reader smoke scripts. No credentials or connection strings are included in this artifact.
