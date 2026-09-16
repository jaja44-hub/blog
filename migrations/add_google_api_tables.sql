-- Google API Integration Tables Migration
-- This migration adds 17 new tables for Google API integration and enhanced analytics

-- Google API credentials management
CREATE TABLE IF NOT EXISTS google_api_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_type VARCHAR(50) NOT NULL, -- google_ads, adsense, search_console
  client_id VARCHAR(500),
  client_secret_encrypted TEXT,
  refresh_token_encrypted TEXT,
  developer_token VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  last_verified_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Google Ads campaign data
CREATE TABLE IF NOT EXISTS google_ads_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name VARCHAR(200),
  campaign_id VARCHAR(100), -- Google Ads campaign ID
  campaign_type VARCHAR(50), -- search, display, video, shopping
  status VARCHAR(50), -- active, paused, completed
  budget_daily DECIMAL,
  budget_total DECIMAL,
  start_date DATE,
  end_date DATE,
  target_locations JSONB, -- geographic targeting
  target_keywords JSONB,
  target_audience JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Google Ads performance data
CREATE TABLE IF NOT EXISTS google_ads_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES google_ads_campaigns(id),
  date DATE,
  impressions INTEGER,
  clicks INTEGER,
  cost DECIMAL,
  conversions INTEGER,
  conversion_value DECIMAL,
  ctr DECIMAL, -- click-through rate
  cpc DECIMAL, -- cost per click
  roas DECIMAL, -- return on ad spend
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad creative data
CREATE TABLE IF NOT EXISTS ad_creative (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES google_ads_campaigns(id),
  creative_type VARCHAR(50), -- text, image, video
  headline VARCHAR(100),
  description VARCHAR(200),
  landing_page_url VARCHAR(500),
  performance_score DECIMAL,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AdSense performance data
CREATE TABLE IF NOT EXISTS adsense_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE,
  page_views INTEGER,
  ad_impressions INTEGER,
  ad_revenue DECIMAL,
  rpm DECIMAL, -- revenue per thousand impressions
  ctr DECIMAL,
  page_rpm DECIMAL,
  ad_unit_id VARCHAR(100),
  placement VARCHAR(50), -- header, sidebar, content, footer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AdSense ad units
CREATE TABLE IF NOT EXISTS adsense_ad_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_unit_id VARCHAR(100),
  ad_unit_name VARCHAR(200),
  ad_unit_type VARCHAR(50), -- display, in-article, matched content
  placement VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search Console data
CREATE TABLE IF NOT EXISTS search_console_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  date DATE,
  impressions INTEGER,
  clicks INTEGER,
  ctr DECIMAL,
  avg_position DECIMAL,
  queries JSONB,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regional analytics
CREATE TABLE IF NOT EXISTS regional_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2),
  region VARCHAR(50),
  post_id UUID REFERENCES posts(id),
  view_count INTEGER,
  engagement_rate DECIMAL,
  avg_read_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topic regional performance
CREATE TABLE IF NOT EXISTS topic_regional_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  country_code VARCHAR(2),
  region VARCHAR(50),
  view_count INTEGER,
  engagement_rate DECIMAL,
  trend_score DECIMAL,
  opportunity_score DECIMAL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content performance analytics
CREATE TABLE IF NOT EXISTS content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  view_count INTEGER,
  unique_visitors INTEGER,
  avg_read_time INTEGER,
  completion_rate DECIMAL,
  social_shares INTEGER,
  saves_count INTEGER,
  search_traffic INTEGER,
  direct_traffic INTEGER,
  referral_traffic INTEGER,
  performance_score DECIMAL,
  trend_direction VARCHAR(10),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topic performance analytics
CREATE TABLE IF NOT EXISTS topic_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  view_count INTEGER,
  engagement_rate DECIMAL,
  search_volume INTEGER,
  competition_score DECIMAL,
  opportunity_score DECIMAL,
  trending_score DECIMAL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge sources library
CREATE TABLE IF NOT EXISTS knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500),
  url VARCHAR(1000) UNIQUE,
  source_type VARCHAR(50), -- legal, government, academic, news, industry
  credibility_score DECIMAL, -- 0-100
  last_verified_at TIMESTAMP,
  link_health VARCHAR(20), -- active, broken, redirected
  publisher VARCHAR(200),
  jurisdiction VARCHAR(100),
  content_type VARCHAR(50), -- article, report, legislation, case law
  access_date DATE,
  tags JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Source usage tracking
CREATE TABLE IF NOT EXISTS source_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES knowledge_sources(id),
  post_id UUID REFERENCES posts(id),
  context TEXT, -- how the source was used
  claim_verified BOOLEAN,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media usage tracking
CREATE TABLE IF NOT EXISTS media_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES media_assets(id),
  post_id UUID REFERENCES posts(id),
  usage_context TEXT,
  placement VARCHAR(50), -- hero, inline, thumbnail, social
  performance_score DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media tags for smart tagging
CREATE TABLE IF NOT EXISTS media_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES media_assets(id),
  tag VARCHAR(100),
  relevance_score DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content opportunities for planning
CREATE TABLE IF NOT EXISTS content_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  topic_suggestion VARCHAR(500),
  demand_score DECIMAL,
  competition_score DECIMAL,
  monetization_potential DECIMAL,
  regional_relevance JSONB,
  suggested_sources JSONB,
  estimated_effort INTEGER,
  priority_score DECIMAL,
  status VARCHAR(50) DEFAULT 'suggested', -- suggested, planned, in_progress, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Editorial calendar
CREATE TABLE IF NOT EXISTS editorial_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  scheduled_date DATE,
  content_type VARCHAR(50),
  target_audience JSONB,
  promotion_channels JSONB,
  expected_performance JSONB,
  campaign_id UUID REFERENCES google_ads_campaigns(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing editorial posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS editorial_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  body_markdown TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, in_review, scheduled, published, archived
  series_id UUID REFERENCES series(id),
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing research briefs table if it doesn't exist
CREATE TABLE IF NOT EXISTS research_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  question TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'idea', -- idea, researching, ready, used, archived
  priority INTEGER DEFAULT 3,
  target_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing post revisions table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  body_snapshot TEXT NOT NULL,
  title_snapshot VARCHAR(500),
  editor_id UUID REFERENCES users(id),
  change_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing scheduled publications table if it doesn't exist
CREATE TABLE IF NOT EXISTS scheduled_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Africa/Addis_Ababa',
  status VARCHAR(50) DEFAULT 'pending', -- pending, executed, failed
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_at TIMESTAMP WITH TIME ZONE
);
