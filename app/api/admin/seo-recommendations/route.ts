import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSEORecommendations } from "@/lib/content-scoring";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");

  try {
    const recommendations = await getSEORecommendations(postId || undefined);
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Failed to generate SEO recommendations:", error);
    return NextResponse.json({ error: "SEO recommendations could not be generated." }, { status: 500 });
  }
}
