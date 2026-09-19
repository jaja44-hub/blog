import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { createRecommendation, listRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = new URL(request.url).searchParams.get("status");
  if (status && status !== "active" && status !== "retired") {
    return NextResponse.json({ error: "Status must be active or retired." }, { status: 400 });
  }

  try {
    const recommendations = await listRecommendations(status as "active" | "retired" | undefined);
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Failed to list recommendations:", error);
    return NextResponse.json({ error: "Recommendations are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.recommendationType !== "string" || typeof body.title !== "string" || typeof body.rationale !== "string") {
    return NextResponse.json({ error: "Recommendation type, title, and rationale are required." }, { status: 400 });
  }
  if (!isRecord(body.provenance) || !isRecord(body.sourceSnapshot) || !isRecord(body.sourceTimestamps)) {
    return NextResponse.json({ error: "Provenance, sourceSnapshot, and sourceTimestamps objects are required." }, { status: 400 });
  }

  try {
    const result = await createRecommendation({
      recommendationType: body.recommendationType,
      title: body.title,
      rationale: body.rationale,
      score: body.score,
      confidence: body.confidence,
      provenance: body.provenance,
      sourceSnapshot: body.sourceSnapshot,
      sourceTimestamps: body.sourceTimestamps as Record<string, string | null>,
      generatedAt: body.generatedAt,
    });
    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    console.error("Failed to create recommendation:", error);
    const message = error instanceof Error ? error.message : "The recommendation could not be created.";
    const status = message.includes("must be between") || message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? message : "The recommendation could not be created." }, { status });
  }
}
