import { NextRequest, NextResponse } from "next/server";
import { BloggerConfig, TokenSet, getValidTokens } from "@/lib/blogger/client";
import { createBloggerService, BloggerPage } from "@/lib/blogger/service";

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
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const service = await getService();
    const page = await service.getPage(pageId);
    return NextResponse.json({ page });
  } catch (err) {
    console.error("Blogger get page error:", err);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const service = await getService();
    const body = await request.json();
    const { title, content, published, status } = body;

    const page: Partial<BloggerPage> = {};
    if (title !== undefined) page.title = title;
    if (content !== undefined) page.content = content;
    if (published !== undefined) page.published = published;
    if (status !== undefined) page.status = status;

    const result = await service.updatePage(pageId, page);
    return NextResponse.json({ page: result });
  } catch (err) {
    console.error("Blogger update page error:", err);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const service = await getService();
    await service.deletePage(pageId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Blogger delete page error:", err);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}