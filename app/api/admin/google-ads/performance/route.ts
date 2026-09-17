import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getGoogleAdsPerformance,
  getGoogleAdsPerformanceSummary,
  createGoogleAdsPerformance,
} from "@/lib/google-ads";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign_id");
  const summary = searchParams.get("summary");

  if (summary === "true") {
    const stats = await getGoogleAdsPerformanceSummary(campaignId || undefined);
    return NextResponse.json({ summary: stats });
  }

  const performance = await getGoogleAdsPerformance(campaignId || undefined);
  return NextResponse.json({ performance });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.campaign_id !== "string" || typeof body.date !== "string") {
    return NextResponse.json({ error: "Campaign ID and date are required." }, { status: 400 });
  }

  try {
    const performance = await createGoogleAdsPerformance({
      campaign_id: body.campaign_id,
      date: body.date,
      impressions: body.impressions,
      clicks: body.clicks,
      cost: body.cost,
      conversions: body.conversions,
      conversion_value: body.conversion_value,
      ctr: body.ctr,
      cpc: body.cpc,
      roas: body.roas
    });
    return NextResponse.json({ performance }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Google Ads performance record:", error);
    return NextResponse.json({ error: "The performance record could not be created." }, { status: 500 });
  }
}