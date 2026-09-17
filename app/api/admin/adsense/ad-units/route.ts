import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getAdSenseAdUnits,
  getAdSenseAdUnitById,
  createAdSenseAdUnit,
  updateAdSenseAdUnit,
  deleteAdSenseAdUnit,
} from "@/lib/adsense";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const unit = await getAdSenseAdUnitById(id);
    if (!unit) {
      return NextResponse.json({ error: "Ad unit not found" }, { status: 404 });
    }
    return NextResponse.json({ unit });
  }

  const units = await getAdSenseAdUnits();
  return NextResponse.json({ units });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.ad_unit_name !== "string") {
    return NextResponse.json({ error: "Ad unit name is required." }, { status: 400 });
  }

  try {
    const unit = await createAdSenseAdUnit({
      ad_unit_id: body.ad_unit_id,
      ad_unit_name: body.ad_unit_name.trim(),
      ad_unit_type: body.ad_unit_type,
      placement: body.placement,
      status: body.status
    });
    return NextResponse.json({ unit }, { status: 201 });
  } catch (error) {
    console.error("Failed to create AdSense ad unit:", error);
    return NextResponse.json({ error: "The ad unit could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Ad unit ID is required." }, { status: 400 });
  }

  try {
    const unit = await updateAdSenseAdUnit(body.id, {
      ad_unit_name: body.ad_unit_name,
      ad_unit_type: body.ad_unit_type,
      placement: body.placement,
      status: body.status
    });
    
    if (!unit) {
      return NextResponse.json({ error: "Ad unit not found" }, { status: 404 });
    }
    
    return NextResponse.json({ unit });
  } catch (error) {
    console.error("Failed to update AdSense ad unit:", error);
    return NextResponse.json({ error: "The ad unit could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Ad unit ID is required." }, { status: 400 });
  }

  try {
    await deleteAdSenseAdUnit(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete AdSense ad unit:", error);
    return NextResponse.json({ error: "The ad unit could not be deleted." }, { status: 500 });
  }
}