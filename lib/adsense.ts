import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type AdSenseAdUnit = {
  id: string;
  ad_unit_id: string | null;
  ad_unit_name: string | null;
  ad_unit_type: string | null;
  placement: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type AdSensePerformance = {
  id: string;
  date: string | null;
  page_views: number | null;
  ad_impressions: number | null;
  ad_revenue: number | null;
  rpm: number | null;
  ctr: number | null;
  page_rpm: number | null;
  ad_unit_id: string | null;
  placement: string | null;
  created_at: string;
};

// Ad Unit Management
export async function getAdSenseAdUnits() {
  try {
    return (await sql`
      SELECT * FROM adsense_ad_units 
      ORDER BY created_at DESC 
      LIMIT 50
    `) as AdSenseAdUnit[];
  } catch (error) {
    console.error("Error fetching AdSense ad units:", error);
    return [];
  }
}

export async function getAdSenseAdUnitById(id: string) {
  try {
    const units = (await sql`
      SELECT * FROM adsense_ad_units WHERE id = ${id}::uuid
    `) as AdSenseAdUnit[];
    return units[0] ?? null;
  } catch (error) {
    console.error("Error fetching AdSense ad unit by ID:", error);
    return null;
  }
}

export async function createAdSenseAdUnit(input: {
  ad_unit_id?: string;
  ad_unit_name: string;
  ad_unit_type?: string;
  placement?: string;
  status?: string;
}) {
  try {
    const units = (await sql`
      INSERT INTO adsense_ad_units (
        ad_unit_id,
        ad_unit_name,
        ad_unit_type,
        placement,
        status
      )
      VALUES (
        ${input.ad_unit_id ?? null},
        ${input.ad_unit_name},
        ${input.ad_unit_type ?? null},
        ${input.placement ?? null},
        ${input.status ?? 'active'}
      )
      RETURNING *
    `) as AdSenseAdUnit[];

    return units[0];
  } catch (error) {
    console.error("Error creating AdSense ad unit:", error);
    throw error;
  }
}

export async function updateAdSenseAdUnit(id: string, input: {
  ad_unit_name?: string;
  ad_unit_type?: string;
  placement?: string;
  status?: string;
}) {
  try {
    const units = (await sql`
      UPDATE adsense_ad_units
      SET 
        ad_unit_name = COALESCE(${input.ad_unit_name ?? null}, ad_unit_name),
        ad_unit_type = COALESCE(${input.ad_unit_type ?? null}, ad_unit_type),
        placement = COALESCE(${input.placement ?? null}, placement),
        status = COALESCE(${input.status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `) as AdSenseAdUnit[];
    return units[0] ?? null;
  } catch (error) {
    console.error("Error updating AdSense ad unit:", error);
    throw error;
  }
}

export async function deleteAdSenseAdUnit(id: string) {
  try {
    await sql`
      DELETE FROM adsense_ad_units WHERE id = ${id}::uuid
    `;
    return true;
  } catch (error) {
    console.error("Error deleting AdSense ad unit:", error);
    throw error;
  }
}

// Performance Tracking
export async function getAdSensePerformance(adUnitId?: string, startDate?: string, endDate?: string) {
  try {
    let query = sql`SELECT * FROM adsense_performance`;
    const conditions = [];
    
    if (adUnitId) {
      conditions.push(sql`ad_unit_id = ${adUnitId}`);
    }
    if (startDate) {
      conditions.push(sql`date >= ${startDate}`);
    }
    if (endDate) {
      conditions.push(sql`date <= ${endDate}`);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} WHERE `;
      for (let i = 0; i < conditions.length; i++) {
        if (i > 0) {
          query = sql`${query} AND `;
        }
        query = sql`${query} ${conditions[i]}`;
      }
    }
    
    query = sql`${query} ORDER BY date DESC LIMIT 90`;
    
    return (await query) as AdSensePerformance[];
  } catch (error) {
    console.error("Error fetching AdSense performance:", error);
    return [];
  }
}

export async function createAdSensePerformance(input: {
  date: string;
  page_views?: number;
  ad_impressions?: number;
  ad_revenue?: number;
  rpm?: number;
  ctr?: number;
  page_rpm?: number;
  ad_unit_id?: string;
  placement?: string;
}) {
  try {
    const performance = (await sql`
      INSERT INTO adsense_performance (
        date,
        page_views,
        ad_impressions,
        ad_revenue,
        rpm,
        ctr,
        page_rpm,
        ad_unit_id,
        placement
      )
      VALUES (
        ${input.date},
        ${input.page_views ?? null},
        ${input.ad_impressions ?? null},
        ${input.ad_revenue ?? null},
        ${input.rpm ?? null},
        ${input.ctr ?? null},
        ${input.page_rpm ?? null},
        ${input.ad_unit_id ?? null},
        ${input.placement ?? null}
      )
      RETURNING *
    `) as AdSensePerformance[];
    return performance[0];
  } catch (error) {
    console.error("Error creating AdSense performance record:", error);
    throw error;
  }
}

export async function getAdSensePerformanceSummary(adUnitId?: string, startDate?: string, endDate?: string) {
  try {
    let whereClause = sql``;
    const conditions = [];
    
    if (adUnitId) {
      conditions.push(sql`ad_unit_id = ${adUnitId}`);
    }
    if (startDate) {
      conditions.push(sql`date >= ${startDate}`);
    }
    if (endDate) {
      conditions.push(sql`date <= ${endDate}`);
    }
    
    if (conditions.length > 0) {
      whereClause = sql`WHERE `;
      for (let i = 0; i < conditions.length; i++) {
        if (i > 0) {
          whereClause = sql`${whereClause} AND `;
        }
        whereClause = sql`${whereClause} ${conditions[i]}`;
      }
    }
    
    const summary = (await sql`
      SELECT 
        COUNT(*) as total_records,
        SUM(page_views) as total_page_views,
        SUM(ad_impressions) as total_ad_impressions,
        SUM(ad_revenue) as total_ad_revenue,
        AVG(rpm) as avg_rpm,
        AVG(ctr) as avg_ctr,
        AVG(page_rpm) as avg_page_rpm
      FROM adsense_performance
      ${whereClause}
    `) as any[];
    return summary[0] || { 
      total_records: 0, 
      total_page_views: 0, 
      total_ad_impressions: 0, 
      total_ad_revenue: 0, 
      avg_rpm: null, 
      avg_ctr: null, 
      avg_page_rpm: null 
    };
  } catch (error) {
    console.error("Error fetching AdSense performance summary:", error);
    return { 
      total_records: 0, 
      total_page_views: 0, 
      total_ad_impressions: 0, 
      total_ad_revenue: 0, 
      avg_rpm: null, 
      avg_ctr: null, 
      avg_page_rpm: null 
    };
  }
}

// Placeholder for AdSense API integration
// These functions will be implemented when real credentials are available
export async function syncAdSensePerformance() {
  // Placeholder: Sync performance data from AdSense API
  console.log("AdSense API sync: Placeholder - credentials not yet configured");
  return { synced: 0, message: "Credentials not configured" };
}

export async function syncAdSenseAdUnits() {
  // Placeholder: Sync ad units from AdSense API
  console.log("AdSense API ad units sync: Placeholder - credentials not yet configured");
  return { synced: 0, message: "Credentials not configured" };
}