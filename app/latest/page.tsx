import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function LatestPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-3 md:px-5 py-2 md:py-3 lg:py-4">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[8px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-0.5 md:mb-1">
          Latest Stories
        </p>
        <h1 className="font-display text-[18px] md:text-[24px] lg:text-[28px] xl:text-[36px] font-bold text-ink leading-[1.1] md:leading-tight lg:leading-tight">
          Latest Articles
        </h1>
        <p className="text-stone mt-1 md:mt-1.5 max-w-2xl text-sm md:text-base">
          The most recent analysis and insights from Addis Crown.
        </p>
      </div>

      <div className="max-w-article space-y-2 md:space-y-3 lg:space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <div className="text-center py-3 md:py-4 lg:py-6">
            <p className="text-stone text-sm md:text-base">No articles published yet.</p>
            <Link
              href="/"
              className="inline-block mt-2 md:mt-3 text-teal hover:text-tealDeep transition-colors"
            >
              Return to homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}