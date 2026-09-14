import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { createEditorialDraft, listEditorialPosts } from "@/lib/editorial";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await listEditorialPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to list editorial drafts:", error);
    return NextResponse.json({ error: "Editorial storage is unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.slug !== "string" || typeof body.category !== "string") {
    return NextResponse.json({ error: "Title, slug, and category are required." }, { status: 400 });
  }

  try {
    const post = await createEditorialDraft({
      title: body.title.trim(),
      slug: body.slug.trim(),
      category: body.category.trim(),
      description: typeof body.description === "string" ? body.description.trim() : "",
      bodyMarkdown: typeof body.bodyMarkdown === "string" ? body.bodyMarkdown : ""
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create editorial draft:", error);
    return NextResponse.json({ error: "The draft could not be saved." }, { status: 500 });
  }
}