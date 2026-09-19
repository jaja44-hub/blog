import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getKnowledgeSourceById, deleteKnowledgeSource } from "@/lib/knowledge-sources";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const source = await getKnowledgeSourceById(id);
    if (!source) {
      return NextResponse.json({ error: "Knowledge source not found." }, { status: 404 });
    }
    return NextResponse.json({ source });
  } catch (error) {
    console.error("Failed to load knowledge source:", error);
    return NextResponse.json({ error: "Knowledge source is unavailable." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteKnowledgeSource(id);
    if (!deleted) {
      return NextResponse.json({ error: "Knowledge source not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete knowledge source:", error);
    if ((error as { code?: string })?.code === "23503") {
      return NextResponse.json(
        { error: "This knowledge source is still used by an article and cannot be deleted." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "The knowledge source could not be deleted." }, { status: 500 });
  }
}
