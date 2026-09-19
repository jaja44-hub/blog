import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { retireRecommendation } from "@/lib/recommendations";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.reason !== "string" || !body.reason.trim()) {
    return NextResponse.json({ error: "A retirement reason is required." }, { status: 400 });
  }

  try {
    const recommendation = await retireRecommendation(id, body.reason);
    if (!recommendation) {
      return NextResponse.json({ error: "Active recommendation not found." }, { status: 404 });
    }
    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error("Failed to retire recommendation:", error);
    return NextResponse.json({ error: "The recommendation could not be retired." }, { status: 500 });
  }
}
