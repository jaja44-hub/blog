import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client, refreshAccessToken, BloggerConfig, TokenSet } from "@/lib/blogger/client";
import { createBloggerService } from "@/lib/blogger/service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/blogger?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/blogger?error=missing_code", request.url)
    );
  }

  const config: BloggerConfig = {
    clientId: process.env.BLOGGER_CLIENT_ID!,
    clientSecret: process.env.BLOGGER_CLIENT_SECRET!,
    redirectUri: process.env.BLOGGER_REDIRECT_URI!,
  };

  try {
    const oauth2Client = getOAuth2Client(config);
    const { tokens } = await oauth2Client.getToken(code);

    const tokenSet: TokenSet = {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expiry_date: tokens.expiry_date!,
      token_type: tokens.token_type!,
      scope: tokens.scope!,
    };

    // Get the user's blogs to find the blog ID
    const service = createBloggerService(config, tokenSet, "");
    const userBlogs = await service.getUserBlogs();

    // Return tokens and blog list for the user to select
    return NextResponse.json({
      success: true,
      tokens: tokenSet,
      blogs: userBlogs.items || [],
      message: "Authorization successful. Select a blog to configure.",
    });
  } catch (err) {
    console.error("Blogger OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/admin/blogger?error=token_exchange_failed", request.url)
    );
  }
}