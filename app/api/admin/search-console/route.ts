import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getSearchConsoleData,
  getSearchConsoleDataById,
  createSearchConsoleData,
  updateSearchConsoleData,
  deleteSearchConsoleData,
} from "@/lib/search-console";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const postId = searchParams.get("post_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const summary = searchParams.get("summary");

  if (id) {
    const data = await getSearchConsoleDataById(id);
    if (!data) {
      return NextResponse.json({ error: "Search Console data not found" }, { status: 404 });
    }
    return NextResponse.json({ data });
  }

  if (summary === "true") {
    const { getSearchConsoleSummary } = await import("@/lib/search-console");
    const stats = await getSearchConsoleSummary(
      postId || undefined,
      startDate || undefined,
      endDate || undefined
    );
    return NextResponse.json({ summary: stats });
  }

  const data = await getSearchConsoleData(
    postId || undefined,
    startDate || undefined,
    endDate || undefined
  );
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.date !== "string") {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }

  try {
    const data = await createSearchConsoleData({
      post_id: body.post_id,
      date: body.date,
      impressions: body.impressions,
      clicks: body.clicks,
      ctr: body.ctr,
      avg_position: body.avg_position,
      queries: body.queries
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Search Console data record:", error);
    return NextResponse.json({ error: "The data record could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Data record ID is required." }, { status: 400 });
  }

  try {
    const data = await updateSearchConsoleData(body.id, {
      impressions: body.impressions,
      clicks: body.clicks,
      ctr: body.ctr,
      avg_position: body.avg_position,
      queries: body.queries
    });
    
    if (!data) {
      return NextResponse.json({ error: "Search Console data not found" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to update Search Console data:", error);
    return NextResponse.json({ error: "The data could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Data record ID is required." }, { status: 400 });
  }

  try {
    await deleteSearchConsoleData(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete Search Console data:", error);
    return NextResponse.json({ error: "The data could not be deleted." }, { status: 500 });
  }
}