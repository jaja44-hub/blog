import { NextRequest, NextResponse } from "next/server";
import { recordEngagementEvent } from "@/lib/engagement";

const eventTypes = new Set(["favorite_added", "favorite_removed", "like_added", "like_removed", "feedback_submitted", "post_viewed"]);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.postSlug !== "string" || !eventTypes.has(body.eventType)) {
    return NextResponse.json({ error: "A valid post and event type are required." }, { status: 400 });
  }

  try {
    await recordEngagementEvent({
      eventType: body.eventType,
      postSlug: body.postSlug,
      visitorId: request.cookies.get("rating_user_id")?.value
    });
    return NextResponse.json({ recorded: true });
  } catch (error) {
    console.error("Failed to record engagement:", error);
    return NextResponse.json({ error: "Engagement tracking is unavailable." }, { status: 503 });
  }
}