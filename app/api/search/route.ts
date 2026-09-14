import { getAllPosts } from "@/lib/posts";
import { NextRequest, NextResponse } from "next/server";
import { getPopularPostSlugs } from "@/lib/engagement";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const sort = searchParams.get("sort") || "newest";
  
  if (query.trim().length < 2) {
    return NextResponse.json({ posts: [] });
  }
  
  const allPosts = getAllPosts();
  const filtered = allPosts.filter((post) => {
    const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || post.category === category;
    const matchesFrom = !from || post.date >= from;
    const matchesTo = !to || post.date <= to;
    return matchesQuery && matchesCategory && matchesFrom && matchesTo;
  });

  if (sort === "popular") {
    try {
      const popularity = await getPopularPostSlugs();
      filtered.sort((a, b) => (popularity.get(b.slug) ?? 0) - (popularity.get(a.slug) ?? 0));
    } catch {
      filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
  } else {
    filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  
  return NextResponse.json({ posts: filtered });
}