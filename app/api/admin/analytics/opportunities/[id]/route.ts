import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { updateContentOpportunityStatus } from "@/lib/analytics";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.status !== "string") {
    return NextResponse.json({ error: "Status is required." }, { status: 400 });
  }

  const allowedStatuses = ["suggested", "planned", "in_progress", "completed"];
  if (!allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const opportunity = await updateContentOpportunityStatus(id, body.status as any);
    if (!opportunity) {
      return NextResponse.json({ error: "Content opportunity not found." }, { status: 404 });
    }
    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error("Failed to update content opportunity:", error);
    return NextResponse.json({ error: "The content opportunity could not be updated." }, { status: 500 });
  }
}
