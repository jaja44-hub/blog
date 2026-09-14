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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const service = await getService();
    const body = await request.json();
    const { action, postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "approve":
        result = await service.approveComment(postId, commentId);
        break;
      case "delete":
        await service.deleteComment(postId, commentId);
        result = { success: true };
        break;
      case "spam":
        result = await service.markCommentAsSpam(postId, commentId);
        break;
      case "removeContent":
        result = await service.removeCommentContent(postId, commentId);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: approve, delete, spam, removeContent" },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Blogger comment action error:", err);
    return NextResponse.json(
      { error: "Failed to perform comment action" },
      { status: 500 }
    );
  }
}