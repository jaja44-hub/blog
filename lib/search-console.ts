import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type SearchConsoleData = {
  id: string;
  post_id: string | null;
  date: string | null;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  avg_position: number | null;
  queries: any;
  synced_at: string;
};

// Search Console Data Management
export async function getSearchConsoleData(postId?: string, startDate?: string, endDate?: string) {
  try {
    let query = sql`SELECT * FROM search_console_data`;
    const conditions = [];
    
    if (postId) {
      conditions.push(sql`post_id = ${postId}::uuid`);
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
    
    return (await query) as SearchConsoleData[];
  } catch (error) {
    console.error("Error fetching Search Console data:", error);
    return [];
  }
}

export async function getSearchConsoleDataById(id: string) {
  try {
    const data = (await sql`
      SELECT * FROM search_console_data WHERE id = ${id}::uuid
    `) as SearchConsoleData[];
    return data[0] ?? null;
  } catch (error) {
    console.error("Error fetching Search Console data by ID:", error);
    return null;
  }
}

export async function createSearchConsoleData(input: {
  post_id?: string;
  date: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  avg_position?: number;
  queries?: any;
}) {
  try {
    const data = (await sql`
      INSERT INTO search_console_data (
        post_id,
        date,
        impressions,
        clicks,
        ctr,
        avg_position,
        queries
      )
      VALUES (
        ${input.post_id ?? null}::uuid,
        ${input.date},
        ${input.impressions ?? null},
        ${input.clicks ?? null},
        ${input.ctr ?? null},
        ${input.avg_position ?? null},
        ${input.queries ?? null}
      )
      RETURNING *
    `) as SearchConsoleData[];
    return data[0];
  } catch (error) {
    console.error("Error creating Search Console data record:", error);
    throw error;
  }
}

export async function updateSearchConsoleData(id: string, input: {
  impressions?: number;
  clicks?: number;
  ctr?: number;
  avg_position?: number;
  queries?: any;
}) {
  try {
    const data = (await sql`
      UPDATE search_console_data
      SET 
        impressions = COALESCE(${input.impressions ?? null}, impressions),
        clicks = COALESCE(${input.clicks ?? null}, clicks),
        ctr = COALESCE(${input.ctr ?? null}, ctr),
        avg_position = COALESCE(${input.avg_position ?? null}, avg_position),
        queries = COALESCE(${input.queries ?? null}, queries),
        synced_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `) as SearchConsoleData[];
    return data[0] ?? null;
  } catch (error) {
    console.error("Error updating Search Console data:", error);
    throw error;
  }
}

export async function deleteSearchConsoleData(id: string) {
  try {
    await sql`
      DELETE FROM search_console_data WHERE id = ${id}::uuid
    `;
    return true;
  } catch (error) {
    console.error("Error deleting Search Console data:", error);
    throw error;
  }
}

export async function getSearchConsoleSummary(postId?: string, startDate?: string, endDate?: string) {
  try {
    let whereClause = sql``;
    const conditions = [];
    
    if (postId) {
      conditions.push(sql`post_id = ${postId}::uuid`);
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
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        AVG(ctr) as avg_ctr,
        AVG(avg_position) as avg_position
      FROM search_console_data
      ${whereClause}
    `) as any[];
    return summary[0] || { 
      total_records: 0, 
      total_impressions: 0, 
      total_clicks: 0, 
      avg_ctr: null, 
      avg_position: null 
    };
  } catch (error) {
    console.error("Error fetching Search Console summary:", error);
    return { 
      total_records: 0, 
      total_impressions: 0, 
      total_clicks: 0, 
      avg_ctr: null, 
      avg_position: null 
    };
  }
}

export async function getTopQueries(postId?: string, limit: number = 10) {
  try {
    // Since queries are stored as JSONB, we'll need to aggregate them
    // For now, return the most recent data with queries
    let query = sql`
      SELECT date, queries
      FROM search_console_data
      WHERE queries IS NOT NULL
    `;
    
    if (postId) {
      query = sql`${query} AND post_id = ${postId}::uuid`;
    }
    
    query = sql`${query} ORDER BY date DESC LIMIT ${limit}`;
    
    const results = (await query) as any[];
    
    // Aggregate queries from JSONB
    const queryCounts: Record<string, number> = {};
    results.forEach(row => {
      if (row.queries && typeof row.queries === 'object') {
        Object.entries(row.queries).forEach(([query, count]) => {
          queryCounts[query] = (queryCounts[query] || 0) + (typeof count === 'number' ? count : 1);
        });
      }
    });
    
    return Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching top queries:", error);
    return [];
  }
}

// Placeholder for Search Console API integration
// These functions will be implemented when real credentials are available
export async function syncSearchConsoleData(postId?: string) {
  // Placeholder: Sync data from Search Console API
  console.log("Search Console API sync: Placeholder - credentials not yet configured");
  return { synced: 0, message: "Credentials not configured" };
}

export async function syncSearchConsoleQueries(postId?: string) {
  // Placeholder: Sync query data from Search Console API
  console.log("Search Console API queries sync: Placeholder - credentials not yet configured");
  return { synced: 0, message: "Credentials not configured" };
}