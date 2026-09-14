import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getEditorialPostBySlug, scheduleEditorialPost, updateEditorialPost, updateEditorialPostStatus } from "@/lib/editorial";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "A draft slug is required." }, { status: 400 });

  const post = await getEditorialPostBySlug(slug);
  if (!post || post.id !== id) return NextResponse.json({ error: "Draft not found." }, { status: 404 });

  const markdown = `---\ntitle: ${JSON.stringify(post.title)}\nslug: ${JSON.stringify(post.slug)}\ncategory: ${JSON.stringify(post.category)}\ndescription: ${JSON.stringify(post.description)}\n---\n\n${post.body_markdown}\n`;
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${post.slug}.md"`
    }
  });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A JSON body is required." }, { status: 400 });
  }

  try {
    if (typeof body.status === "string") {
      const allowedStatuses = ["draft", "in_review", "scheduled", "published", "archived"];
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid editorial status." }, { status: 400 });
      }
      const post = await updateEditorialPostStatus(id, body.status);
      return post
        ? NextResponse.json({ post })
        : NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    if (typeof body.scheduledFor === "string") {
      const scheduledFor = new Date(body.scheduledFor);
      if (Number.isNaN(scheduledFor.getTime()) || scheduledFor.getTime() <= Date.now()) {
        return NextResponse.json({ error: "Scheduled publication must be a valid future time." }, { status: 400 });
      }
      const post = await scheduleEditorialPost(id, scheduledFor.toISOString(), typeof body.timezone === "string" ? body.timezone : undefined);
      return post
        ? NextResponse.json({ post })
        : NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    const fields = ["title", "slug", "description", "category", "bodyMarkdown"];
    if (fields.some((field) => typeof body[field] !== "string")) {
      return NextResponse.json({ error: "All editorial fields are required." }, { status: 400 });
    }

    const post = await updateEditorialPost(id, {
      title: body.title.trim(),
      slug: body.slug.trim(),
      description: body.description.trim(),
      category: body.category.trim(),
      bodyMarkdown: body.bodyMarkdown,
    });
    return post
      ? NextResponse.json({ post })
      : NextResponse.json({ error: "Draft not found." }, { status: 404 });
  } catch (error) {
    console.error("Failed to update editorial draft:", error);
    return NextResponse.json({ error: "The draft could not be updated." }, { status: 500 });
  }
}