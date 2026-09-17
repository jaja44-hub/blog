import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getAdCreatives,
  createAdCreative,
  updateAdCreative,
  deleteAdCreative,
} from "@/lib/google-ads";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign_id");

  const creatives = await getAdCreatives(campaignId || undefined);
  return NextResponse.json({ creatives });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.campaign_id !== "string" || typeof body.creative_type !== "string" || typeof body.headline !== "string") {
    return NextResponse.json({ error: "Campaign ID, creative type, and headline are required." }, { status: 400 });
  }

  try {
    const creative = await createAdCreative({
      campaign_id: body.campaign_id,
      creative_type: body.creative_type,
      headline: body.headline,
      description: body.description,
      landing_page_url: body.landing_page_url,
      performance_score: body.performance_score,
      status: body.status
    });
    return NextResponse.json({ creative }, { status: 201 });
  } catch (error) {
    console.error("Failed to create ad creative:", error);
    return NextResponse.json({ error: "The ad creative could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Creative ID is required." }, { status: 400 });
  }

  try {
    const creative = await updateAdCreative(body.id, {
      headline: body.headline,
      description: body.description,
      landing_page_url: body.landing_page_url,
      performance_score: body.performance_score,
      status: body.status
    });
    
    if (!creative) {
      return NextResponse.json({ error: "Ad creative not found" }, { status: 404 });
    }
    
    return NextResponse.json({ creative });
  } catch (error) {
    console.error("Failed to update ad creative:", error);
    return NextResponse.json({ error: "The ad creative could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Creative ID is required." }, { status: 400 });
  }

  try {
    await deleteAdCreative(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ad creative:", error);
    return NextResponse.json({ error: "The ad creative could not be deleted." }, { status: 500 });
  }
}