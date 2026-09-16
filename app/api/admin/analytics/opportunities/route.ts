import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getContentOpportunities, createContentOpportunity, updateContentOpportunityStatus } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");

  try {
    const opportunities = await getContentOpportunities(status || undefined);
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error("Failed to load content opportunities:", error);
    return NextResponse.json({ error: "Content opportunities are unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.topicSuggestion !== "string") {
    return NextResponse.json({ error: "Topic suggestion is required." }, { status: 400 });
  }

  try {
    const opportunity = await createContentOpportunity({
      topicSuggestion: body.topicSuggestion.trim(),
      categoryId: body.categoryId,
      demandScore: body.demandScore,
      competitionScore: body.competitionScore,
      monetizationPotential: body.monetizationPotential,
      estimatedEffort: body.estimatedEffort,
      status: body.status
    });
    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    console.error("Failed to create content opportunity:", error);
    return NextResponse.json({ error: "The content opportunity could not be created." }, { status: 500 });
  }
}
