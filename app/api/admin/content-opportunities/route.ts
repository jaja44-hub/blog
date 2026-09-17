import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getContentOpportunities,
  getContentOpportunityById,
  createContentOpportunity,
  updateContentOpportunity,
  deleteContentOpportunity,
} from "@/lib/content-scoring";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const opportunity = await getContentOpportunityById(id);
    if (!opportunity) {
      return NextResponse.json({ error: "Content opportunity not found" }, { status: 404 });
    }
    return NextResponse.json({ opportunity });
  }

  const opportunities = await getContentOpportunities();
  return NextResponse.json({ opportunities });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.topic_suggestion !== "string") {
    return NextResponse.json({ error: "Topic suggestion is required." }, { status: 400 });
  }

  try {
    const opportunity = await createContentOpportunity({
      category_id: body.category_id,
      topic_suggestion: body.topic_suggestion.trim(),
      demand_score: body.demand_score,
      competition_score: body.competition_score,
      monetization_potential: body.monetization_potential,
      regional_relevance: body.regional_relevance,
      suggested_sources: body.suggested_sources,
      estimated_effort: body.estimated_effort
    });
    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    console.error("Failed to create content opportunity:", error);
    return NextResponse.json({ error: "The content opportunity could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Opportunity ID is required." }, { status: 400 });
  }

  try {
    const opportunity = await updateContentOpportunity(body.id, {
      demand_score: body.demand_score,
      competition_score: body.competition_score,
      monetization_potential: body.monetization_potential,
      estimated_effort: body.estimated_effort,
      status: body.status
    });
    
    if (!opportunity) {
      return NextResponse.json({ error: "Content opportunity not found" }, { status: 404 });
    }
    
    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error("Failed to update content opportunity:", error);
    return NextResponse.json({ error: "The content opportunity could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Opportunity ID is required." }, { status: 400 });
  }

  try {
    await deleteContentOpportunity(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete content opportunity:", error);
    return NextResponse.json({ error: "The content opportunity could not be deleted." }, { status: 500 });
  }
}
