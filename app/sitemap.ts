import { getAllSlugs, getAllCategories } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://blog.addiscrown.et";
  const posts = getAllSlugs().map((slug) => ({
    url: `${base}/posts/${slug}`,
    lastModified: new Date()
  }));
  const categories = getAllCategories().map((category) => ({
    url: `${base}/category/${category}`,
    lastModified: new Date()
  }));
  return [{ url: base, lastModified: new Date() }, ...posts, ...categories];
}
