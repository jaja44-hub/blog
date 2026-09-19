import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { query } from "@/lib/db";
import { buildIntelligenceOverview } from "@/lib/intelligence";

export const dynamic = "force-dynamic";

type AggregateRow = {
  opportunity_count?: string | number;
  opportunity_priority?: string | number | null;
  performance_count?: string | number;
  average_performance_score?: string | number | null;
  search_impressions?: string | number;
  search_clicks?: string | number;
  search_ctr?: string | number | null;
  ad_spend?: string | number;
  ad_revenue?: string | number;
};

function numberValue(value: string | number | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nullableNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await Promise.all([
      query<AggregateRow>(`
        SELECT
          (SELECT COUNT(*) FROM content_opportunities) AS opportunity_count,
          (SELECT AVG(priority_score) FROM content_opportunities) AS opportunity_priority,
          (SELECT COUNT(*) FROM content_performance) AS performance_count,
          (SELECT AVG(performance_score) FROM content_performance) AS average_performance_score,
          (SELECT COALESCE(SUM(impressions), 0) FROM search_console_data) AS search_impressions,
          (SELECT COALESCE(SUM(clicks), 0) FROM search_console_data) AS search_clicks,
          (SELECT AVG(ctr) FROM search_console_data) AS search_ctr,
          (SELECT COALESCE(SUM(cost), 0) FROM google_ads_performance) AS ad_spend,
          (SELECT COALESCE(SUM(ad_revenue), 0) FROM adsense_performance) AS ad_revenue
      `),
    ]);

    const aggregate = rows[0] ?? {};
    const overview = buildIntelligenceOverview({
      opportunityCount: numberValue(aggregate.opportunity_count),
      opportunityPriority: nullableNumber(aggregate.opportunity_priority),
      performanceCount: numberValue(aggregate.performance_count),
      averagePerformanceScore: nullableNumber(aggregate.average_performance_score),
      searchImpressions: numberValue(aggregate.search_impressions),
      searchClicks: numberValue(aggregate.search_clicks),
      searchCtr: nullableNumber(aggregate.search_ctr),
      adSpend: numberValue(aggregate.ad_spend),
      adRevenue: numberValue(aggregate.ad_revenue),
    });

    return NextResponse.json({
      ...overview,
      generatedAt: new Date().toISOString(),
      window: "all-time aggregate",
    });
  } catch (error) {
    console.error("Failed to load intelligence overview:", error);
    return NextResponse.json(
      { error: "Intelligence data is temporarily unavailable." },
      { status: 503 }
    );
  }
}
