import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { hasAdminSession } from "@/lib/admin-auth";
import { createEditorialDraft } from "@/lib/editorial";

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.markdown !== "string") {
    return NextResponse.json({ error: "Markdown content is required." }, { status: 400 });
  }

  try {
    const parsed = matter(body.markdown);
    const requiredFields = ["title", "slug", "category"];
    if (requiredFields.some((field) => typeof parsed.data[field] !== "string" || !parsed.data[field].trim())) {
      return NextResponse.json({ error: "Frontmatter must include title, slug, and category." }, { status: 400 });
    }

    const post = await createEditorialDraft({
      title: parsed.data.title.trim(),
      slug: parsed.data.slug.trim(),
      category: parsed.data.category.trim(),
      description: typeof parsed.data.description === "string" ? parsed.data.description.trim() : "",
      bodyMarkdown: parsed.content.trim()
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Failed to import Markdown draft:", error);
    return NextResponse.json({ error: "The Markdown draft could not be imported." }, { status: 500 });
  }
}