import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getMediaUsageByPost,
  createMediaUsage,
  getMediaUsageSummary,
} from "@/lib/media";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");
  const summary = searchParams.get("summary");

  if (summary === "true") {
    const stats = await getMediaUsageSummary();
    return NextResponse.json({ summary: stats });
  }

  if (postId) {
    const usage = await getMediaUsageByPost(postId);
    return NextResponse.json({ usage });
  }

  return NextResponse.json({ error: "Post ID or summary parameter required" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.media_id !== "string" || typeof body.post_id !== "string") {
    return NextResponse.json({ error: "Media ID and Post ID are required." }, { status: 400 });
  }

  try {
    const usage = await createMediaUsage({
      media_id: body.media_id,
      post_id: body.post_id,
      usage_context: body.usage_context,
      placement: body.placement,
      performance_score: body.performance_score
    });
    return NextResponse.json({ usage }, { status: 201 });
  } catch (error) {
    console.error("Failed to create media usage:", error);
    return NextResponse.json({ error: "The media usage could not be created." }, { status: 500 });
  }
}