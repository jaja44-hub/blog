import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  ogImage?: string;
  draft?: boolean;
};

export type Post = PostMeta & { content: string };

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { ...(data as PostMeta), content };
}

export function getAllPosts(): Post[] {
  return getAllSlugs()
    .map(getPostBySlug)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((p) => p.category)));
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    "legal-rights": "Legal Rights",
    "ai-policy": "AI & Policy",
    "media-literacy": "Media Literacy"
  };
  return map[category] ?? category;
}
