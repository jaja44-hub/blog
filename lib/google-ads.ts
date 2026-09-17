import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type GoogleAdsCampaign = {
  id: string;
  campaign_name: string | null;
  campaign_id: string | null;
  campaign_type: string | null;
  status: string | null;
  budget_daily: number | null;
  budget_total: number | null;
  start_date: string | null;
  end_date: string | null;
  target_locations: any;
  target_keywords: any;
  target_audience: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GoogleAdsPerformance = {
  id: string;
  campaign_id: string | null;
  date: string | null;
  impressions: number | null;
  clicks: number | null;
  cost: number | null;
  conversions: number | null;
  conversion_value: number | null;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  created_at: string;
};

export type AdCreative = {
  id: string;
  campaign_id: string | null;
  creative_type: string | null;
  headline: string | null;
  description: string | null;
  landing_page_url: string | null;
  performance_score: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type GoogleApiCredential = {
  id: string;
  api_type: string;
  client_id: string | null;
  client_secret_encrypted: string | null;
  refresh_token_encrypted: string | null;
  developer_token: string | null;
  status: string | null;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

// Campaign Management
export async function getGoogleAdsCampaigns() {
  try {
    return (await sql`
      SELECT * FROM google_ads_campaigns 
      ORDER BY created_at DESC 
      LIMIT 50
    `) as GoogleAdsCampaign[];
  } catch (error) {
    console.error("Error fetching Google Ads campaigns:", error);
    return [];
  }
}

export async function getGoogleAdsCampaignById(id: string) {
  try {
    const campaigns = (await sql`
      SELECT * FROM google_ads_campaigns WHERE id = ${id}::uuid
    `) as GoogleAdsCampaign[];
    return campaigns[0] ?? null;
  } catch (error) {
    console.error("Error fetching Google Ads campaign by ID:", error);
    return null;
  }
}

export async function createGoogleAdsCampaign(input: {
  campaign_name: string;
  campaign_id?: string;
  campaign_type?: string;
  status?: string;
  budget_daily?: number;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
  target_locations?: any;
  target_keywords?: any;
  target_audience?: any;
  created_by?: string;
}) {
  try {
    const campaigns = (await sql`
      INSERT INTO google_ads_campaigns (
        campaign_name,
        campaign_id,
        campaign_type,
        status,
        budget_daily,
        budget_total,
        start_date,
        end_date,
        target_locations,
        target_keywords,
        target_audience,
        created_by
      )
      VALUES (
        ${input.campaign_name},
        ${input.campaign_id ?? null},
        ${input.campaign_type ?? null},
        ${input.status ?? 'paused'},
        ${input.budget_daily ?? null},
        ${input.budget_total ?? null},
        ${input.start_date ?? null},
        ${input.end_date ?? null},
        ${input.target_locations ?? null},
        ${input.target_keywords ?? null},
        ${input.target_audience ?? null},
        ${input.created_by ?? null}
      )
      RETURNING *
    `) as GoogleAdsCampaign[];

    return campaigns[0];
  } catch (error) {
    console.error("Error creating Google Ads campaign:", error);
    throw error;
  }
}

export async function updateGoogleAdsCampaign(id: string, input: {
  campaign_name?: string;
  status?: string;
  budget_daily?: number;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
  target_locations?: any;
  target_keywords?: any;
  target_audience?: any;
}) {
  try {
    const campaigns = (await sql`
      UPDATE google_ads_campaigns
      SET 
        campaign_name = COALESCE(${input.campaign_name ?? null}, campaign_name),
        status = COALESCE(${input.status ?? null}, status),
        budget_daily = COALESCE(${input.budget_daily ?? null}, budget_daily),
        budget_total = COALESCE(${input.budget_total ?? null}, budget_total),
        start_date = COALESCE(${input.start_date ?? null}, start_date),
        end_date = COALESCE(${input.end_date ?? null}, end_date),
        target_locations = COALESCE(${input.target_locations ?? null}, target_locations),
        target_keywords = COALESCE(${input.target_keywords ?? null}, target_keywords),
        target_audience = COALESCE(${input.target_audience ?? null}, target_audience),
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `) as GoogleAdsCampaign[];
    return campaigns[0] ?? null;
  } catch (error) {
    console.error("Error updating Google Ads campaign:", error);
    throw error;
  }
}

export async function deleteGoogleAdsCampaign(id: string) {
  try {
    await sql`
      DELETE FROM google_ads_campaigns WHERE id = ${id}::uuid
    `;
    return true;
  } catch (error) {
    console.error("Error deleting Google Ads campaign:", error);
    throw error;
  }
}

// Performance Tracking
export async function getGoogleAdsPerformance(campaignId?: string) {
  try {
    if (campaignId) {
      return (await sql`
        SELECT * FROM google_ads_performance 
        WHERE campaign_id = ${campaignId}::uuid
        ORDER BY date DESC
        LIMIT 90
      `) as GoogleAdsPerformance[];
    }
    return (await sql`
      SELECT * FROM google_ads_performance 
      ORDER BY date DESC
      LIMIT 90
    `) as GoogleAdsPerformance[];
  } catch (error) {
    console.error("Error fetching Google Ads performance:", error);
    return [];
  }
}

export async function createGoogleAdsPerformance(input: {
  campaign_id: string;
  date: string;
  impressions?: number;
  clicks?: number;
  cost?: number;
  conversions?: number;
  conversion_value?: number;
  ctr?: number;
  cpc?: number;
  roas?: number;
}) {
  try {
    const performance = (await sql`
      INSERT INTO google_ads_performance (
        campaign_id,
        date,
        impressions,
        clicks,
        cost,
        conversions,
        conversion_value,
        ctr,
        cpc,
        roas
      )
      VALUES (
        ${input.campaign_id}::uuid,
        ${input.date},
        ${input.impressions ?? null},
        ${input.clicks ?? null},
        ${input.cost ?? null},
        ${input.conversions ?? null},
        ${input.conversion_value ?? null},
        ${input.ctr ?? null},
        ${input.cpc ?? null},
        ${input.roas ?? null}
      )
      RETURNING *
    `) as GoogleAdsPerformance[];
    return performance[0];
  } catch (error) {
    console.error("Error creating Google Ads performance record:", error);
    throw error;
  }
}

export async function getGoogleAdsPerformanceSummary(campaignId?: string) {
  try {
    const whereClause = campaignId 
      ? sql`WHERE campaign_id = ${campaignId}::uuid`
      : sql``;
    
    const summary = (await sql`
      SELECT 
        COUNT(*) as total_records,
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(cost) as total_cost,
        SUM(conversions) as total_conversions,
        SUM(conversion_value) as total_conversion_value,
        AVG(ctr) as avg_ctr,
        AVG(cpc) as avg_cpc,
        AVG(roas) as avg_roas
      FROM google_ads_performance
      ${whereClause}
    `) as any[];
    return summary[0] || { 
      total_records: 0, 
      total_impressions: 0, 
      total_clicks: 0, 
      total_cost: 0, 
      total_conversions: 0, 
      total_conversion_value: 0, 
      avg_ctr: null, 
      avg_cpc: null, 
      avg_roas: null 
    };
  } catch (error) {
    console.error("Error fetching Google Ads performance summary:", error);
    return { 
      total_records: 0, 
      total_impressions: 0, 
      total_clicks: 0, 
      total_cost: 0, 
      total_conversions: 0, 
      total_conversion_value: 0, 
      avg_ctr: null, 
      avg_cpc: null, 
      avg_roas: null 
    };
  }
}

// Ad Creative Management
export async function getAdCreatives(campaignId?: string) {
  try {
    if (campaignId) {
      return (await sql`
        SELECT * FROM ad_creative 
        WHERE campaign_id = ${campaignId}::uuid
        ORDER BY created_at DESC
      `) as AdCreative[];
    }
    return (await sql`
      SELECT * FROM ad_creative 
      ORDER BY created_at DESC
      LIMIT 50
    `) as AdCreative[];
  } catch (error) {
    console.error("Error fetching ad creatives:", error);
    return [];
  }
}

export async function createAdCreative(input: {
  campaign_id: string;
  creative_type: string;
  headline: string;
  description?: string;
  landing_page_url?: string;
  performance_score?: number;
  status?: string;
}) {
  try {
    const creatives = (await sql`
      INSERT INTO ad_creative (
        campaign_id,
        creative_type,
        headline,
        description,
        landing_page_url,
        performance_score,
        status
      )
      VALUES (
        ${input.campaign_id}::uuid,
        ${input.creative_type},
        ${input.headline},
        ${input.description ?? null},
        ${input.landing_page_url ?? null},
        ${input.performance_score ?? null},
        ${input.status ?? 'active'}
      )
      RETURNING *
    `) as AdCreative[];
    return creatives[0];
  } catch (error) {
    console.error("Error creating ad creative:", error);
    throw error;
  }
}

export async function updateAdCreative(id: string, input: {
  headline?: string;
  description?: string;
  landing_page_url?: string;
  performance_score?: number;
  status?: string;
}) {
  try {
    const creatives = (await sql`
      UPDATE ad_creative
      SET 
        headline = COALESCE(${input.headline ?? null}, headline),
        description = COALESCE(${input.description ?? null}, description),
        landing_page_url = COALESCE(${input.landing_page_url ?? null}, landing_page_url),
        performance_score = COALESCE(${input.performance_score ?? null}, performance_score),
        status = COALESCE(${input.status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `) as AdCreative[];
    return creatives[0] ?? null;
  } catch (error) {
    console.error("Error updating ad creative:", error);
    throw error;
  }
}

export async function deleteAdCreative(id: string) {
  try {
    await sql`
      DELETE FROM ad_creative WHERE id = ${id}::uuid
    `;
    return true;
  } catch (error) {
    console.error("Error deleting ad creative:", error);
    throw error;
  }
}

// Google API Credentials Management (Placeholder)
export async function getGoogleApiCredentials(apiType?: string) {
  try {
    if (apiType) {
      const credentials = (await sql`
        SELECT * FROM google_api_credentials 
        WHERE api_type = ${apiType}
        LIMIT 1
      `) as GoogleApiCredential[];
      return credentials[0] ?? null;
    }
    return (await sql`
      SELECT * FROM google_api_credentials 
      ORDER BY created_at DESC
    `) as GoogleApiCredential[];
  } catch (error) {
    console.error("Error fetching Google API credentials:", error);
    return null;
  }
}

export async function createGoogleApiCredential(input: {
  api_type: string;
  client_id?: string;
  client_secret_encrypted?: string;
  refresh_token_encrypted?: string;
  developer_token?: string;
}) {
  try {
    const credentials = (await sql`
      INSERT INTO google_api_credentials (
        api_type,
        client_id,
        client_secret_encrypted,
        refresh_token_encrypted,
        developer_token
      )
      VALUES (
        ${input.api_type},
        ${input.client_id ?? null},
        ${input.client_secret_encrypted ?? null},
        ${input.refresh_token_encrypted ?? null},
        ${input.developer_token ?? null}
      )
      RETURNING *
    `) as GoogleApiCredential[];
    return credentials[0];
  } catch (error) {
    console.error("Error creating Google API credential:", error);
    throw error;
  }
}

// Placeholder for Google Ads API integration
// These functions will be implemented when real credentials are available
export async function syncGoogleAdsCampaigns() {
  // Placeholder: Sync campaigns from Google Ads API
  console.log("Google Ads API sync: Placeholder - credentials not yet configured");
  return { synced: 0, message: "Credentials not configured" };
}

export async function syncGoogleAdsPerformance(campaignId: string) {
  // Placeholder: Sync performance data from Google Ads API
  console.log("Google Ads API performance sync: Placeholder - credentials not yet configured");
  return { synced: 0, message: "Credentials not configured" };
}