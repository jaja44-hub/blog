import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getContentPerformance,
  createContentPerformance,
  getContentPerformanceSummary,
} from "@/lib/content-scoring";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");
  const summary = searchParams.get("summary");

  if (summary === "true") {
    const stats = await getContentPerformanceSummary(postId || undefined);
    return NextResponse.json({ summary: stats });
  }

  const performance = await getContentPerformance(postId || undefined);
  return NextResponse.json({ performance });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body) {
    return NextResponse.json({ error: "Performance data is required." }, { status: 400 });
  }

  try {
    const performance = await createContentPerformance({
      post_id: body.post_id,
      view_count: body.view_count,
      unique_visitors: body.unique_visitors,
      avg_read_time: body.avg_read_time,
      completion_rate: body.completion_rate,
      social_shares: body.social_shares,
      saves_count: body.saves_count,
      search_traffic: body.search_traffic,
      direct_traffic: body.direct_traffic,
      referral_traffic: body.referral_traffic
    });
    return NextResponse.json({ performance }, { status: 201 });
  } catch (error) {
    console.error("Failed to create content performance:", error);
    return NextResponse.json({ error: "The content performance could not be created." }, { status: 500 });
  }
}
