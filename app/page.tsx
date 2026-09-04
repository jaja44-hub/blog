import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-12 border-b border-line pb-10">
        <p className="text-sm text-ochre font-medium mb-3">Latest</p>
        {featured ? (
          <>
            <h1 className="font-display text-4xl font-semibold text-ink leading-tight mb-3 max-w-3xl">
              {featured.title}
            </h1>
            <p className="text-stone text-lg leading-relaxed max-w-2xl mb-4">
              {featured.description}
            </p>
            <a
              href={`/posts/${featured.slug}`}
              className="text-teal font-medium hover:text-tealDeep"
            >
              Read the full piece
            </a>
          </>
        ) : (
          <p className="text-stone">No posts published yet.</p>
        )}
      </section>

      <AdSlot position="header" />

      <div className="grid gap-0 md:grid-cols-1 max-w-article">
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
