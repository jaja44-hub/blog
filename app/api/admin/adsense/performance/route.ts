import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getAdSensePerformance,
  getAdSensePerformanceSummary,
  createAdSensePerformance,
} from "@/lib/adsense";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const adUnitId = searchParams.get("ad_unit_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const summary = searchParams.get("summary");

  if (summary === "true") {
    const stats = await getAdSensePerformanceSummary(
      adUnitId || undefined,
      startDate || undefined,
      endDate || undefined
    );
    return NextResponse.json({ summary: stats });
  }

  const performance = await getAdSensePerformance(
    adUnitId || undefined,
    startDate || undefined,
    endDate || undefined
  );
  return NextResponse.json({ performance });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.date !== "string") {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }

  try {
    const performance = await createAdSensePerformance({
      date: body.date,
      page_views: body.page_views,
      ad_impressions: body.ad_impressions,
      ad_revenue: body.ad_revenue,
      rpm: body.rpm,
      ctr: body.ctr,
      page_rpm: body.page_rpm,
      ad_unit_id: body.ad_unit_id,
      placement: body.placement
    });
    return NextResponse.json({ performance }, { status: 201 });
  } catch (error) {
    console.error("Failed to create AdSense performance record:", error);
    return NextResponse.json({ error: "The performance record could not be created." }, { status: 500 });
  }
}