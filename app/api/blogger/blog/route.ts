import { NextRequest, NextResponse } from "next/server";
import { BloggerConfig, TokenSet, getValidTokens } from "@/lib/blogger/client";
import { createBloggerService } from "@/lib/blogger/service";

function getConfig(): BloggerConfig {
  return {
    clientId: process.env.BLOGGER_CLIENT_ID!,
    clientSecret: process.env.BLOGGER_CLIENT_SECRET!,
    redirectUri: process.env.BLOGGER_REDIRECT_URI!,
    blogId: process.env.BLOGGER_BLOG_ID,
  };
}

function getStoredTokens(): TokenSet | null {
  const tokensJson = process.env.BLOGGER_TOKENS;
  if (!tokensJson) return null;
  try {
    return JSON.parse(tokensJson);
  } catch {
    return null;
  }
}

async function getService() {
  const config = getConfig();
  const storedTokens = getStoredTokens();

  if (!config.clientId || !config.clientSecret || !config.redirectUri) {
    throw new Error("Blogger configuration missing");
  }

  if (!storedTokens) {
    throw new Error("Not authenticated. Complete OAuth flow first.");
  }

  if (!config.blogId) {
    throw new Error("Blog ID not configured. Set BLOGGER_BLOG_ID.");
  }

  const validTokens = await getValidTokens(config, storedTokens);
  return createBloggerService(config, validTokens, config.blogId);
}

export async function GET(request: NextRequest) {
  try {
    const service = await getService();
    const searchParams = request.nextUrl.searchParams;
    const byUrl = searchParams.get("url");

    let blog;
    if (byUrl) {
      blog = await service.getBlogByUrl(byUrl);
    } else {
      blog = await service.getBlog();
    }

    return NextResponse.json({ blog });
  } catch (err) {
    console.error("Blogger get blog error:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog info" },
      { status: 500 }
    );
  }
}