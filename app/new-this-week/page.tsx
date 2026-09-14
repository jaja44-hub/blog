import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function NewThisWeekPage() {
  const allPosts = getAllPosts();

  // Filter posts from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentPosts = allPosts.filter(post => {
    const postDate = new Date(post.date);
    return postDate >= oneWeekAgo;
  });

  return (
    <div className="mx-auto max-w-7xl px-3 md:px-5 py-2 md:py-3 lg:py-4">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[8px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-0.5 md:mb-1">
          Recent Publications
        </p>
        <h1 className="font-display text-[18px] md:text-[24px] lg:text-[28px] xl:text-[36px] font-bold text-ink leading-[1.1] md:leading-tight lg:leading-tight">
          New This Week
        </h1>
        <p className="text-stone mt-1 md:mt-1.5 max-w-2xl text-sm md:text-base">
          Articles published in the past 7 days. Stay current with the latest analysis and insights.
        </p>
      </div>

      <div className="max-w-article space-y-2 md:space-y-3 lg:space-y-4">
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <div className="text-center py-3 md:py-4 lg:py-6">
            <p className="text-stone mb-2 md:mb-3 text-sm md:text-base">No articles published in the past 7 days.</p>
            <p className="text-sm text-stone mb-3">Check out our latest articles instead:</p>
            <Link
              href="/latest"
              className="inline-block px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 text-teal border border-teal rounded-full hover:bg-teal/10 transition-colors text-xs md:text-sm lg:text-base"
            >
              View Latest Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}