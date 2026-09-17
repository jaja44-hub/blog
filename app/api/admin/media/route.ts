import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getMediaAssets,
  getMediaAssetById,
  createMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
} from "@/lib/media";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const asset = await getMediaAssetById(id);
    if (!asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }
    return NextResponse.json({ asset });
  }

  const assets = await getMediaAssets();
  return NextResponse.json({ assets });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.storage_key !== "string") {
    return NextResponse.json({ error: "Storage key is required." }, { status: 400 });
  }

  try {
    const asset = await createMediaAsset({
      storage_key: body.storage_key.trim(),
      original_filename: body.original_filename,
      mime_type: body.mime_type,
      file_size: body.file_size,
      width: body.width,
      height: body.height,
      alt_text: body.alt_text,
      caption: body.caption,
      credit: body.credit,
      license: body.license,
      upload_user_id: body.upload_user_id
    });
    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("Failed to create media asset:", error);
    return NextResponse.json({ error: "The media asset could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Asset ID is required." }, { status: 400 });
  }

  try {
    const asset = await updateMediaAsset(body.id, {
      alt_text: body.alt_text,
      caption: body.caption,
      credit: body.credit,
      license: body.license
    });
    
    if (!asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }
    
    return NextResponse.json({ asset });
  } catch (error) {
    console.error("Failed to update media asset:", error);
    return NextResponse.json({ error: "The media asset could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Asset ID is required." }, { status: 400 });
  }

  try {
    await deleteMediaAsset(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media asset:", error);
    return NextResponse.json({ error: "The media asset could not be deleted." }, { status: 500 });
  }
}