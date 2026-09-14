import { NextRequest, NextResponse } from "next/server";
import { generateAuthUrl, BloggerConfig } from "@/lib/blogger/client";

export async function GET(request: NextRequest) {
  const config: BloggerConfig = {
    clientId: process.env.BLOGGER_CLIENT_ID!,
    clientSecret: process.env.BLOGGER_CLIENT_SECRET!,
    redirectUri: process.env.BLOGGER_REDIRECT_URI!,
  };

  if (!config.clientId || !config.clientSecret || !config.redirectUri) {
    return NextResponse.json(
      { error: "Blogger OAuth configuration missing" },
      { status: 500 }
    );
  }

  const authUrl = generateAuthUrl(config);
  
  return NextResponse.json({ authUrl });
}