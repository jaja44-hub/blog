import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getPostRevisions } from "@/lib/editorial";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const revisionHistory = await getPostRevisions(id);
  return NextResponse.json({ revisions: revisionHistory });
}
