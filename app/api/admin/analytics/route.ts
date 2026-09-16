import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAnalyticsSummary } from "@/lib/analytics";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Failed to load analytics summary:", error);
    return NextResponse.json({ error: "Analytics data is unavailable." }, { status: 503 });
  }
}
