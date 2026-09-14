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
    const postId = searchParams.get("postId");
    const maxResults = parseInt(searchParams.get("maxResults") || "20");
    const pageToken = searchParams.get("pageToken") || undefined;

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const result = await service.listComments(postId, maxResults, pageToken);
    return NextResponse.json({ comments: result.items || [], nextPageToken: result.nextPageToken });
  } catch (err) {
    console.error("Blogger list comments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}