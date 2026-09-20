import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'database-schema.sql',
  'db/editorial-foundation.sql',
  'migrations/add_google_api_tables.sql',
  'migrations/add_recommendation_governance.sql',
];
const live = new Set([
  'ad_creative','admin_user_roles','admin_users','adsense_ad_units','adsense_performance','audit_events','author_profiles','categories',
  'contact_tickets','content_opportunities','content_performance','content_recommendations','content_series','corrections',
  'editorial_calendar','editorial_posts','engagement_events','feature_flags','google_ads_campaigns','google_ads_performance',
  'google_api_credentials','knowledge_sources','media_assets','media_tags','media_usage','post_revisions',
  'post_ratings','posts','reactions','reading_history','regional_analytics','research_briefs','research_sources','roles','saves','scheduled_publications',
  'search_console_data','series','series_items','sessions','source_usage','sources','subscriptions',
  'topic_performance','topic_regional_performance','users'
]);
const declared = new Map();
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of text.matchAll(/CREATE TABLE(?: IF NOT EXISTS)?\s+([A-Za-z_][A-Za-z0-9_]*)/gi)) {
    declared.set(match[1].toLowerCase(), file);
  }
}
const missing = [...declared.keys()].filter((name) => !live.has(name)).sort();
const extra = [...live].filter((name) => !declared.has(name)).sort();
console.log(JSON.stringify({declared:[...declared.keys()].sort(), missing, extra, declaredCount:declared.size, liveCount:live.size}, null, 2));
if (missing.length) process.exitCode = 2;
