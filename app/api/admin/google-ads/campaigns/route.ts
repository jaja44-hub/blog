import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getGoogleAdsCampaigns,
  getGoogleAdsCampaignById,
  createGoogleAdsCampaign,
  updateGoogleAdsCampaign,
  deleteGoogleAdsCampaign,
} from "@/lib/google-ads";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const campaign = await getGoogleAdsCampaignById(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json({ campaign });
  }

  const campaigns = await getGoogleAdsCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.campaign_name !== "string") {
    return NextResponse.json({ error: "Campaign name is required." }, { status: 400 });
  }

  try {
    const campaign = await createGoogleAdsCampaign({
      campaign_name: body.campaign_name.trim(),
      campaign_id: body.campaign_id,
      campaign_type: body.campaign_type,
      status: body.status,
      budget_daily: body.budget_daily,
      budget_total: body.budget_total,
      start_date: body.start_date,
      end_date: body.end_date,
      target_locations: body.target_locations,
      target_keywords: body.target_keywords,
      target_audience: body.target_audience,
      created_by: body.created_by
    });
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Google Ads campaign:", error);
    return NextResponse.json({ error: "The campaign could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
  }

  try {
    const campaign = await updateGoogleAdsCampaign(body.id, {
      campaign_name: body.campaign_name,
      status: body.status,
      budget_daily: body.budget_daily,
      budget_total: body.budget_total,
      start_date: body.start_date,
      end_date: body.end_date,
      target_locations: body.target_locations,
      target_keywords: body.target_keywords,
      target_audience: body.target_audience
    });
    
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    
    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Failed to update Google Ads campaign:", error);
    return NextResponse.json({ error: "The campaign could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
  }

  try {
    await deleteGoogleAdsCampaign(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete Google Ads campaign:", error);
    return NextResponse.json({ error: "The campaign could not be deleted." }, { status: 500 });
  }
}