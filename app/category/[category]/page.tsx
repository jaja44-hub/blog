import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getAllCategories().includes(category)) {
    notFound();
  }
  const posts = getPostsByCategory(category);

  return (
    <div className="mx-auto max-w-article px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        {categoryLabel(category)}
      </h1>
      {posts.length === 0 ? (
        <p className="text-stone">No posts in this category yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.slug} post={post} />)
      )}
    </div>
  );
}
