import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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
  status: string | null;
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

// Content Opportunity Scoring
export async function getContentOpportunities() {
  try {
    return (await sql`
      SELECT co.*, c.name as category_name
      FROM content_opportunities co
      LEFT JOIN categories c ON co.category_id = c.id
      ORDER BY co.priority_score DESC NULLS LAST, co.created_at DESC
      LIMIT 50
    `) as ContentOpportunity[];
  } catch (error) {
    console.error("Error fetching content opportunities:", error);
    return [];
  }
}

export async function getContentOpportunityById(id: string) {
  try {
    const opportunities = (await sql`
      SELECT co.*, c.name as category_name
      FROM content_opportunities co
      LEFT JOIN categories c ON co.category_id = c.id
      WHERE co.id = ${id}
    `) as ContentOpportunity[];
    return opportunities[0] ?? null;
  } catch (error) {
    console.error("Error fetching content opportunity by ID:", error);
    return null;
  }
}

export async function createContentOpportunity(input: {
  category_id?: string;
  topic_suggestion: string;
  demand_score?: number;
  competition_score?: number;
  monetization_potential?: number;
  regional_relevance?: any;
  suggested_sources?: any;
  estimated_effort?: number;
}) {
  try {
    const priorityScore = calculatePriorityScore(input);
    
    const opportunities = (await sql`
      INSERT INTO content_opportunities (
        category_id,
        topic_suggestion,
        demand_score,
        competition_score,
        monetization_potential,
        regional_relevance,
        suggested_sources,
        estimated_effort,
        priority_score,
        status
      )
      VALUES (
        ${input.category_id ?? null},
        ${input.topic_suggestion},
        ${input.demand_score ?? null},
        ${input.competition_score ?? null},
        ${input.monetization_potential ?? null},
        ${input.regional_relevance ?? null},
        ${input.suggested_sources ?? null},
        ${input.estimated_effort ?? null},
        ${priorityScore},
        'suggested'
      )
      RETURNING *
    `) as ContentOpportunity[];

    return opportunities[0];
  } catch (error) {
    console.error("Error creating content opportunity:", error);
    throw error;
  }
}

export async function updateContentOpportunity(id: string, input: {
  demand_score?: number;
  competition_score?: number;
  monetization_potential?: number;
  estimated_effort?: number;
  status?: string;
}) {
  try {
    // First, get current opportunity to preserve existing values
    const current = await getContentOpportunityById(id);
    if (!current) return null;
    
    // Calculate new priority score with updated values
    const priorityScore = calculatePriorityScore({
      demand_score: input.demand_score ?? current.demand_score ?? undefined,
      competition_score: input.competition_score ?? current.competition_score ?? undefined,
      monetization_potential: input.monetization_potential ?? current.monetization_potential ?? undefined,
      estimated_effort: input.estimated_effort ?? current.estimated_effort ?? undefined
    });
    
    const opportunities = (await sql`
      UPDATE content_opportunities
      SET 
        demand_score = COALESCE(${input.demand_score ?? null}, demand_score),
        competition_score = COALESCE(${input.competition_score ?? null}, competition_score),
        monetization_potential = COALESCE(${input.monetization_potential ?? null}, monetization_potential),
        estimated_effort = COALESCE(${input.estimated_effort ?? null}, estimated_effort),
        status = COALESCE(${input.status ?? null}, status),
        priority_score = ${priorityScore},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `) as ContentOpportunity[];
    return opportunities[0] ?? null;
  } catch (error) {
    console.error("Error updating content opportunity:", error);
    throw error;
  }
}

export async function deleteContentOpportunity(id: string) {
  try {
    await sql`
      DELETE FROM content_opportunities WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting content opportunity:", error);
    throw error;
  }
}

// Content Performance Analysis
export async function getContentPerformance(postId?: string) {
  try {
    if (postId) {
      return (await sql`
        SELECT * FROM content_performance 
        WHERE post_id = ${postId}
        ORDER BY calculated_at DESC
        LIMIT 90
      `) as ContentPerformance[];
    }
    return (await sql`
      SELECT * FROM content_performance 
      ORDER BY calculated_at DESC
      LIMIT 90
    `) as ContentPerformance[];
  } catch (error) {
    console.error("Error fetching content performance:", error);
    return [];
  }
}

export async function createContentPerformance(input: {
  post_id?: string;
  view_count?: number;
  unique_visitors?: number;
  avg_read_time?: number;
  completion_rate?: number;
  social_shares?: number;
  saves_count?: number;
  search_traffic?: number;
  direct_traffic?: number;
  referral_traffic?: number;
}) {
  try {
    const performanceScore = calculatePerformanceScore(input);
    const trendDirection = calculateTrendDirection(input);
    
    const performance = (await sql`
      INSERT INTO content_performance (
        post_id,
        view_count,
        unique_visitors,
        avg_read_time,
        completion_rate,
        social_shares,
        saves_count,
        search_traffic,
        direct_traffic,
        referral_traffic,
        performance_score,
        trend_direction
      )
      VALUES (
        ${input.post_id ?? null},
        ${input.view_count ?? null},
        ${input.unique_visitors ?? null},
        ${input.avg_read_time ?? null},
        ${input.completion_rate ?? null},
        ${input.social_shares ?? null},
        ${input.saves_count ?? null},
        ${input.search_traffic ?? null},
        ${input.direct_traffic ?? null},
        ${input.referral_traffic ?? null},
        ${performanceScore},
        ${trendDirection}
      )
      RETURNING *
    `) as ContentPerformance[];
    return performance[0];
  } catch (error) {
    console.error("Error creating content performance:", error);
    throw error;
  }
}

export async function getContentPerformanceSummary(postId?: string) {
  try {
    const whereClause = postId 
      ? sql`WHERE post_id = ${postId}`
      : sql``;
    
    const summary = (await sql`
      SELECT 
        COUNT(*) as total_records,
        AVG(view_count) as avg_views,
        AVG(unique_visitors) as avg_unique_visitors,
        AVG(avg_read_time) as avg_read_time,
        AVG(completion_rate) as avg_completion_rate,
        SUM(social_shares) as total_social_shares,
        SUM(saves_count) as total_saves,
        AVG(performance_score) as avg_performance_score
      FROM content_performance
      ${whereClause}
    `) as any[];
    return summary[0] || { 
      total_records: 0, 
      avg_views: null, 
      avg_unique_visitors: null, 
      avg_read_time: null, 
      avg_completion_rate: null, 
      total_social_shares: 0, 
      total_saves: 0, 
      avg_performance_score: null 
    };
  } catch (error) {
    console.error("Error fetching content performance summary:", error);
    return { 
      total_records: 0, 
      avg_views: null, 
      avg_unique_visitors: null, 
      avg_read_time: null, 
      avg_completion_rate: null, 
      total_social_shares: 0, 
      total_saves: 0, 
      avg_performance_score: null 
    };
  }
}

// Scoring Algorithms
function calculatePriorityScore(input: {
  demand_score?: number;
  competition_score?: number;
  monetization_potential?: number;
  estimated_effort?: number;
}): number {
  let score = 0;
  
  // Demand contribution (0-100)
  if (input.demand_score) {
    score += input.demand_score * 0.4;
  }
  
  // Competition contribution (inverse - lower competition is better)
  if (input.competition_score) {
    score += (100 - input.competition_score) * 0.3;
  }
  
  // Monetization potential contribution (0-100)
  if (input.monetization_potential) {
    score += input.monetization_potential * 0.2;
  }
  
  // Effort contribution (inverse - lower effort is better)
  if (input.estimated_effort) {
    const effortScore = Math.max(0, 100 - input.estimated_effort);
    score += effortScore * 0.1;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculatePerformanceScore(input: {
  view_count?: number;
  unique_visitors?: number;
  avg_read_time?: number;
  completion_rate?: number;
  social_shares?: number;
  saves_count?: number;
}): number {
  let score = 0;
  let factors = 0;
  
  // Engagement factors
  if (input.avg_read_time && input.avg_read_time > 0) {
    const readScore = Math.min(input.avg_read_time / 5 * 100, 100); // 5 min = 100%
    score += readScore * 0.25;
    factors++;
  }
  
  if (input.completion_rate) {
    score += input.completion_rate * 0.25;
    factors++;
  }
  
  if (input.social_shares && input.social_shares > 0) {
    const shareScore = Math.min(input.social_shares / 10 * 100, 100); // 10 shares = 100%
    score += shareScore * 0.25;
    factors++;
  }
  
  if (input.saves_count && input.saves_count > 0) {
    const saveScore = Math.min(input.saves_count / 5 * 100, 100); // 5 saves = 100%
    score += saveScore * 0.25;
    factors++;
  }
  
  return factors > 0 ? score / factors : 0;
}

function calculateTrendDirection(input: {
  view_count?: number;
  search_traffic?: number;
}): string {
  if (!input.view_count) return 'stable';
  
  // Simple trend calculation based on view count
  if (input.view_count > 1000) return 'up';
  if (input.view_count > 500) return 'stable';
  return 'down';
}

// SEO Intelligence with Search Console integration
export async function getSEORecommendations(postId?: string) {
  try {
    // Import Search Console functions to get actual data
    const { getSearchConsoleData, getTopQueries } = await import("@/lib/search-console");
    
    // Get Search Console data for the post or overall
    const searchData = await getSearchConsoleData(postId);
    const topQueries = await getTopQueries(postId, 10);
    
    const recommendations = [];
    
    // Analyze search performance data
    if (searchData.length > 0) {
      const avgCtr = searchData.reduce((sum, d) => sum + (d.ctr || 0), 0) / searchData.length;
      const avgPosition = searchData.reduce((sum, d) => sum + (d.avg_position || 0), 0) / searchData.length;
      
      // CTR-based recommendations
      if (avgCtr < 0.02) {
        recommendations.push({
          type: 'title_meta',
          priority: 'high',
          suggestion: 'Improve title tags and meta descriptions to increase click-through rate',
          impact: 'Average CTR is below 2%',
          data: { current_ctr: avgCtr.toFixed(3) }
        });
      }
      
      // Position-based recommendations
      if (avgPosition > 10) {
        recommendations.push({
          type: 'content_depth',
          priority: 'medium',
          suggestion: 'Enhance content depth and relevance to improve search rankings',
          impact: `Average position is ${avgPosition.toFixed(1)}, above page 1`,
          data: { current_position: avgPosition.toFixed(1) }
        });
      }
      
      // Query-based recommendations
      if (topQueries.length > 0) {
        const highPotentialQueries = topQueries.filter(q => q.count > 5).slice(0, 3);
        if (highPotentialQueries.length > 0) {
          recommendations.push({
            type: 'keyword',
            priority: 'high',
            suggestion: `Target high-performing queries: ${highPotentialQueries.map(q => q.query).join(', ')}`,
            impact: 'These queries show strong search performance',
            data: { queries: highPotentialQueries.map(q => ({ query: q.query, count: q.count })) }
          });
        }
      }
    }
    
    // Add generic recommendations if no specific data available
    if (recommendations.length === 0) {
      recommendations.push(
        {
          type: 'keyword',
          priority: 'high',
          suggestion: 'Focus on long-tail keywords with lower competition',
          impact: 'improves search visibility'
        },
        {
          type: 'content',
          priority: 'medium',
          suggestion: 'Increase content depth for better engagement',
          impact: 'improves read time and completion rate'
        },
        {
          type: 'technical',
          priority: 'low',
          suggestion: 'Optimize meta descriptions for higher CTR',
          impact: 'improves search click-through rate'
        }
      );
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating SEO recommendations:", error);
    // Fallback to generic recommendations on error
    return [
      {
        type: 'keyword',
        priority: 'high',
        suggestion: 'Focus on long-tail keywords with lower competition',
        impact: 'improves search visibility'
      },
      {
        type: 'content',
        priority: 'medium',
        suggestion: 'Increase content depth for better engagement',
        impact: 'improves read time and completion rate'
      }
    ];
  }
}

// Topic Analysis (placeholder for trend analysis)
export async function analyzeTopicTrends(categoryId?: string) {
  try {
    // Placeholder: Analyze content performance by topic/category
    // For now, return basic statistics
    
    const whereClause = categoryId 
      ? sql`WHERE category_id = ${categoryId}`
      : sql``;
    
    const trends = (await sql`
      SELECT 
        COUNT(*) as opportunity_count,
        AVG(demand_score) as avg_demand,
        AVG(competition_score) as avg_competition,
        AVG(monetization_potential) as avg_monetization
      FROM content_opportunities
      ${whereClause}
    `) as any[];
    
    return trends[0] || { 
      opportunity_count: 0, 
      avg_demand: null, 
      avg_competition: null, 
      avg_monetization: null 
    };
  } catch (error) {
    console.error("Error analyzing topic trends:", error);
    return { 
      opportunity_count: 0, 
      avg_demand: null, 
      avg_competition: null, 
      avg_monetization: null 
    };
  }
}
