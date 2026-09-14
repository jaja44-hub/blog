import { NextRequest, NextResponse } from "next/server";
import { BloggerConfig, TokenSet, getValidTokens } from "@/lib/blogger/client";
import { createBloggerService, BloggerPost } from "@/lib/blogger/service";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const service = await getService();
    const searchParams = request.nextUrl.searchParams;
    const view = (searchParams.get("view") as "ADMIN" | "AUTHOR" | "READER") || "ADMIN";
    
    const post = await service.getPost(postId, view);
    return NextResponse.json({ post });
  } catch (err) {
    console.error("Blogger get post error:", err);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const service = await getService();
    const body = await request.json();
    const { title, content, labels, published } = body;

    const post: Partial<BloggerPost> = {};
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (labels !== undefined) post.labels = labels;
    if (published !== undefined) post.published = published;

    const result = await service.updatePost(postId, post);
    return NextResponse.json({ post: result });
  } catch (err) {
    console.error("Blogger update post error:", err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const service = await getService();
    await service.deletePost(postId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Blogger delete post error:", err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}