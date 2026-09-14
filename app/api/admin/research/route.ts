import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { createResearchBrief, listResearchBriefs } from "@/lib/editorial";

export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ briefs: await listResearchBriefs() });
  } catch (error) {
    console.error("Failed to list research briefs:", error);
    return NextResponse.json({ error: "Research storage is unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.question !== "string") {
    return NextResponse.json({ error: "Title and research question are required." }, { status: 400 });
  }
  const priority = Number(body.priority ?? 3);
  if (!Number.isInteger(priority) || priority < 1 || priority > 5) {
    return NextResponse.json({ error: "Priority must be an integer from 1 to 5." }, { status: 400 });
  }
  try {
    const brief = await createResearchBrief({
      title: body.title.trim(),
      question: body.question.trim(),
      priority,
      targetDate: typeof body.targetDate === "string" ? body.targetDate : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined
    });
    return NextResponse.json({ brief }, { status: 201 });
  } catch (error) {
    console.error("Failed to create research brief:", error);
    return NextResponse.json({ error: "The research brief could not be saved." }, { status: 500 });
  }
}