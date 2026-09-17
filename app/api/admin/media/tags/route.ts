import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getMediaTags,
  createMediaTag,
  deleteMediaTag,
} from "@/lib/media";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("media_id");

  if (!mediaId) {
    return NextResponse.json({ error: "Media ID is required." }, { status: 400 });
  }

  const tags = await getMediaTags(mediaId);
  return NextResponse.json({ tags });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.media_id !== "string" || typeof body.tag !== "string") {
    return NextResponse.json({ error: "Media ID and tag are required." }, { status: 400 });
  }

  try {
    const tag = await createMediaTag({
      media_id: body.media_id,
      tag: body.tag.trim(),
      relevance_score: body.relevance_score
    });
    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Failed to create media tag:", error);
    return NextResponse.json({ error: "The media tag could not be created." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Tag ID is required." }, { status: 400 });
  }

  try {
    await deleteMediaTag(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media tag:", error);
    return NextResponse.json({ error: "The media tag could not be deleted." }, { status: 500 });
  }
}