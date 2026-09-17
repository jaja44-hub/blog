import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getGoogleApiCredentials,
  createGoogleApiCredential,
} from "@/lib/google-ads";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const apiType = searchParams.get("api_type");

  const credentials = await getGoogleApiCredentials(apiType || undefined);
  return NextResponse.json({ credentials });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  
  if (!body || typeof body.api_type !== "string") {
    return NextResponse.json({ error: "API type is required." }, { status: 400 });
  }

  try {
    const credential = await createGoogleApiCredential({
      api_type: body.api_type,
      client_id: body.client_id,
      client_secret_encrypted: body.client_secret_encrypted,
      refresh_token_encrypted: body.refresh_token_encrypted,
      developer_token: body.developer_token
    });
    return NextResponse.json({ credential }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Google API credential:", error);
    return NextResponse.json({ error: "The credential could not be created." }, { status: 500 });
  }
}