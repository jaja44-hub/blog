import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { createRecommendation, listRecommendations } from "@/lib/recommendations";
import { isBoundedString, isPlainRecord } from "@/lib/request-security";

export const dynamic = "force-dynamic";

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
  if (!isPlainRecord(body) || !isBoundedString(body.recommendationType, 100) || !isBoundedString(body.title, 500) || !isBoundedString(body.rationale, 10_000)) {
    return NextResponse.json({ error: "Recommendation type, title, and rationale are required." }, { status: 400 });
  }
  if (!isPlainRecord(body.provenance) || !isPlainRecord(body.sourceSnapshot) || !isPlainRecord(body.sourceTimestamps)) {
    return NextResponse.json({ error: "Provenance, sourceSnapshot, and sourceTimestamps objects are required." }, { status: 400 });
  }
  if (JSON.stringify(body.provenance).length > 50_000 || JSON.stringify(body.sourceSnapshot).length > 50_000 || JSON.stringify(body.sourceTimestamps).length > 50_000) {
    return NextResponse.json({ error: "Recommendation provenance is too large." }, { status: 413 });
  }
  const score = body.score === undefined || body.score === null ? body.score as number | null | undefined : typeof body.score === "number" ? body.score : Number.NaN;
  const confidence = body.confidence === undefined || body.confidence === null ? body.confidence as number | null | undefined : typeof body.confidence === "number" ? body.confidence : Number.NaN;
  const generatedAt = body.generatedAt === undefined ? undefined : typeof body.generatedAt === "string" ? body.generatedAt : null;
  if ((typeof score === "number" && !Number.isFinite(score)) ||
      (typeof confidence === "number" && !Number.isFinite(confidence)) ||
      (generatedAt !== undefined && (generatedAt === null || !isBoundedString(generatedAt, 100)))) {
    return NextResponse.json({ error: "Score, confidence, and generatedAt must use valid bounded values." }, { status: 400 });
  }

  try {
    const result = await createRecommendation({
      recommendationType: body.recommendationType,
      title: body.title,
      rationale: body.rationale,
      score,
      confidence,
      provenance: body.provenance,
      sourceSnapshot: body.sourceSnapshot,
      sourceTimestamps: body.sourceTimestamps as Record<string, string | null>,
      generatedAt: generatedAt ?? undefined,
    });
    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    console.error("Failed to create recommendation:", error);
    const message = error instanceof Error ? error.message : "The recommendation could not be created.";
    const status = message.includes("must be between") || message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? message : "The recommendation could not be created." }, { status });
  }
}
