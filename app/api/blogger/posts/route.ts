import { NextRequest, NextResponse } from "next/server";
import { BloggerConfig, TokenSet, getValidTokens } from "@/lib/blogger/client";
import { createBloggerService, BloggerPost, ListPostsOptions } from "@/lib/blogger/service";

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

export async function GET(request: NextRequest) {
  const config = getConfig();
  const storedTokens = getStoredTokens();

  if (!config.clientId || !config.clientSecret || !config.redirectUri) {
    return NextResponse.json(
      { error: "Blogger configuration missing" },
      { status: 500 }
    );
  }

  if (!storedTokens) {
    return NextResponse.json(
      { error: "Not authenticated. Complete OAuth flow first." },
      { status: 401 }
    );
  }

  if (!config.blogId) {
    return NextResponse.json(
      { error: "Blog ID not configured. Set BLOGGER_BLOG_ID." },
      { status: 400 }
    );
  }

  try {
    const validTokens = await getValidTokens(config, storedTokens);
    const service = createBloggerService(config, validTokens, config.blogId);

    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const options: ListPostsOptions = {
      maxResults: parseInt(searchParams.get("maxResults") || "20"),
      pageToken: searchParams.get("pageToken") || undefined,
      status: statusParam ? [statusParam] : ["LIVE"],
      labels: searchParams.get("labels") || undefined,
      fetchBodies: searchParams.get("fetchBodies") !== "false",
      view: (searchParams.get("view") as ListPostsOptions["view"]) || "ADMIN",
    };

    const result = await service.listPosts(options);
    return NextResponse.json({ posts: result.items || [], nextPageToken: result.nextPageToken });
  } catch (err) {
    console.error("Blogger list posts error:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const config = getConfig();
  const storedTokens = getStoredTokens();

  if (!config.clientId || !config.clientSecret || !config.redirectUri) {
    return NextResponse.json(
      { error: "Blogger configuration missing" },
      { status: 500 }
    );
  }

  if (!storedTokens) {
    return NextResponse.json(
      { error: "Not authenticated. Complete OAuth flow first." },
      { status: 401 }
    );
  }

  if (!config.blogId) {
    return NextResponse.json(
      { error: "Blog ID not configured. Set BLOGGER_BLOG_ID." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, labels, isDraft = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const validTokens = await getValidTokens(config, storedTokens);
    const service = createBloggerService(config, validTokens, config.blogId);

    const post: BloggerPost = {
      title,
      content,
      labels: labels || [],
    };

    const result = await service.createPost(post, isDraft);
    return NextResponse.json({ post: result });
  } catch (err) {
    console.error("Blogger create post error:", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}