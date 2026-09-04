import { getAllPosts } from "@/lib/posts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  
  if (query.trim().length < 2) {
    return NextResponse.json({ posts: [] });
  }
  
  const allPosts = getAllPosts();
  const filtered = allPosts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.description.toLowerCase().includes(query.toLowerCase()) ||
    post.category.toLowerCase().includes(query.toLowerCase())
  );
  
  return NextResponse.json({ posts: filtered });
}