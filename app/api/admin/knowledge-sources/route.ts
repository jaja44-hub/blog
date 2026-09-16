import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getKnowledgeSources, createKnowledgeSource } from "@/lib/knowledge-sources";

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sources = await getKnowledgeSources();
    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Failed to load knowledge sources:", error);
    return NextResponse.json({ error: "Knowledge sources are unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.url !== "string") {
    return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
  }

  try {
    const source = await createKnowledgeSource({
      title: body.title.trim(),
      url: body.url.trim(),
      source_type: body.source_type,
      publisher: body.publisher,
      jurisdiction: body.jurisdiction,
      content_type: body.content_type,
      tags: body.tags
    });
    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    console.error("Failed to create knowledge source:", error);
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ error: "A source with this URL already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "The knowledge source could not be created." }, { status: 500 });
  }
}
