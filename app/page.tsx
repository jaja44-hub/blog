import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-12 border-b border-line pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
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
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/feed.xml"
            className="text-sm text-teal hover:text-tealDeep font-medium flex items-center gap-1"
            title="RSS Feed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v12a2 2 0 002 2h12M4 10a2 2 0 012-2h8M4 16a2 2 0 012-2h4" />
              <circle cx="6.5" cy="17.5" r="1.5" />
            </svg>
            RSS
          </Link>
        </div>
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
