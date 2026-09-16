import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getSourceUsageByPost, createSourceUsage } from "@/lib/knowledge-sources";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = request.nextUrl.searchParams.get("post_id");

  try {
    if (postId) {
      const usage = await getSourceUsageByPost(postId);
      return NextResponse.json({ usage });
    }
    return NextResponse.json({ error: "post_id parameter is required." }, { status: 400 });
  } catch (error) {
    console.error("Failed to load source usage:", error);
    return NextResponse.json({ error: "Source usage data is unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.post_id !== "string") {
    return NextResponse.json({ error: "post_id is required." }, { status: 400 });
  }

  try {
    const usage = await createSourceUsage({
      source_id: id,
      post_id: body.post_id,
      context: body.context,
      claim_verified: body.claim_verified,
      verification_notes: body.verification_notes
    });
    return NextResponse.json({ usage }, { status: 201 });
  } catch (error) {
    console.error("Failed to create source usage:", error);
    return NextResponse.json({ error: "The source usage could not be created." }, { status: 500 });
  }
}
