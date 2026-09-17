import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getMediaAssetById, suggestSmartTags } from "@/lib/media";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("media_id");

  if (!mediaId) {
    return NextResponse.json({ error: "Media ID is required." }, { status: 400 });
  }

  try {
    const asset = await getMediaAssetById(mediaId);
    if (!asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    const suggestedTags = suggestSmartTags(asset);
    return NextResponse.json({ suggested_tags: suggestedTags });
  } catch (error) {
    console.error("Failed to generate smart tags:", error);
    return NextResponse.json({ error: "Could not generate smart tags." }, { status: 500 });
  }
}