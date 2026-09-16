import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type RegionalAnalytics = {
  id: string;
  country_code: string | null;
  region: string | null;
  post_id: string | null;
  view_count: number | null;
  engagement_rate: number | null;
  avg_read_time: number | null;
  created_at: string;
  updated_at: string;
};

export type ContentPerformance = {
  id: string;
  post_id: string | null;
  view_count: number | null;
  unique_visitors: number | null;
  avg_read_time: number | null;
  completion_rate: number | null;
  social_shares: number | null;
  saves_count: number | null;
  search_traffic: number | null;
  direct_traffic: number | null;
  referral_traffic: number | null;
  performance_score: number | null;
  trend_direction: string | null;
  calculated_at: string;
};

export type ContentOpportunity = {
  id: string;
  category_id: string | null;
  topic_suggestion: string | null;
  demand_score: number | null;
  competition_score: number | null;
  monetization_potential: number | null;
  regional_relevance: any;
  suggested_sources: any;
  estimated_effort: number | null;
  priority_score: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type TopicPerformance = {
  id: string;
  category_id: string | null;
  view_count: number | null;
  engagement_rate: number | null;
  search_volume: number | null;
  competition_score: number | null;
  opportunity_score: number | null;
  trending_score: number | null;
  updated_at: string;
};

export async function getRegionalAnalytics(postId?: string) {
  try {
    if (postId) {
      return (await sql`
        SELECT * FROM regional_analytics
        WHERE post_id = ${postId}::uuid
        ORDER BY view_count DESC
      `) as RegionalAnalytics[];
    }

    return (await sql`
      SELECT * FROM regional_analytics
      ORDER BY view_count DESC
      LIMIT 50
    `) as RegionalAnalytics[];
  } catch (error) {
    console.error("Error fetching regional analytics:", error);
    return [];
  }
}

export async function getContentPerformance(postId?: string) {
  try {
    if (postId) {
      return (await sql`
        SELECT * FROM content_performance
        WHERE post_id = ${postId}::uuid
        ORDER BY calculated_at DESC
      `) as ContentPerformance[];
    }

    return (await sql`
      SELECT * FROM content_performance
      ORDER BY performance_score DESC NULLS LAST
      LIMIT 50
    `) as ContentPerformance[];
  } catch (error) {
    console.error("Error fetching content performance:", error);
    return [];
  }
}

export async function getContentOpportunities(status?: string) {
  try {
    if (status) {
      return (await sql`
        SELECT * FROM content_opportunities
        WHERE status = ${status}
        ORDER BY priority_score DESC NULLS LAST
      `) as ContentOpportunity[];
    }

    return (await sql`
      SELECT * FROM content_opportunities
      ORDER BY priority_score DESC NULLS LAST
      LIMIT 50
    `) as ContentOpportunity[];
  } catch (error) {
    console.error("Error fetching content opportunities:", error);
    return [];
  }
}

export async function getTopicPerformance() {
  try {
    return (await sql`
      SELECT * FROM topic_performance
      ORDER BY opportunity_score DESC NULLS LAST
    `) as TopicPerformance[];
  } catch (error) {
    console.error("Error fetching topic performance:", error);
    return [];
  }
}

export async function createContentOpportunity(input: {
  topicSuggestion: string;
  categoryId?: string;
  demandScore?: number;
  competitionScore?: number;
  monetizationPotential?: number;
  estimatedEffort?: number;
  status?: string;
}) {
  try {
    const demand = input.demandScore ?? 0;
    const competition = input.competitionScore ?? 0;
    const monetization = input.monetizationPotential ?? 0;
    const effort = input.estimatedEffort ?? 1;
    
    const priorityScore = (demand * 0.4) + (monetization * 0.3) + ((10 - competition) * 0.2) + ((10 / effort) * 0.1);

    let opportunities;
    if (input.categoryId) {
      opportunities = (await sql`
        INSERT INTO content_opportunities (
          topic_suggestion,
          category_id,
          demand_score,
          competition_score,
          monetization_potential,
          estimated_effort,
          priority_score,
          status
        )
        VALUES (
          ${input.topicSuggestion},
          ${input.categoryId}::uuid,
          ${input.demandScore ?? null},
          ${input.competitionScore ?? null},
          ${input.monetizationPotential ?? null},
          ${input.estimatedEffort ?? null},
          ${priorityScore},
          ${input.status ?? 'suggested'}
        )
        RETURNING *
      `) as ContentOpportunity[];
    } else {
      opportunities = (await sql`
        INSERT INTO content_opportunities (
          topic_suggestion,
          category_id,
          demand_score,
          competition_score,
          monetization_potential,
          estimated_effort,
          priority_score,
          status
        )
        VALUES (
          ${input.topicSuggestion},
          null,
          ${input.demandScore ?? null},
          ${input.competitionScore ?? null},
          ${input.monetizationPotential ?? null},
          ${input.estimatedEffort ?? null},
          ${priorityScore},
          ${input.status ?? 'suggested'}
        )
        RETURNING *
      `) as ContentOpportunity[];
    }

    return opportunities[0];
  } catch (error) {
    console.error("Error creating content opportunity:", error);
    throw error;
  }
}

export async function updateContentOpportunityStatus(
  opportunityId: string,
  status: 'suggested' | 'planned' | 'in_progress' | 'completed'
) {
  try {
    const opportunities = (await sql`
      UPDATE content_opportunities
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${opportunityId}::uuid
      RETURNING *
    `) as ContentOpportunity[];

    return opportunities[0] ?? null;
  } catch (error) {
    console.error("Error updating content opportunity status:", error);
    throw error;
  }
}

export async function getAnalyticsSummary() {
  try {
    const regional = await sql`
      SELECT country_code, SUM(view_count) as total_views, AVG(engagement_rate) as avg_engagement
      FROM regional_analytics
      GROUP BY country_code
      ORDER BY total_views DESC
      LIMIT 10
    `;

    const content = await sql`
      SELECT COUNT(*) as total_posts, AVG(performance_score) as avg_performance
      FROM content_performance
    `;

    const opportunities = await sql`
      SELECT status, COUNT(*) as count
      FROM content_opportunities
      GROUP BY status
    `;

    return {
      regional_analytics: regional,
      content_performance: content[0] || { total_posts: 0, avg_performance: null },
      content_opportunities: opportunities
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return {
      regional_analytics: [],
      content_performance: { total_posts: 0, avg_performance: null },
      content_opportunities: []
    };
  }
}
