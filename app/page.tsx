import { getAllPosts, getAllCategories } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import DiscoverySidebar from "@/components/DiscoverySidebar";

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const [featured, ...rest] = posts;

  return (
    <div className="bg-parchment min-h-screen overflow-x-hidden">
      <main>
        <section className="bg-ink border-b border-line">
          <div className="mx-auto max-w-7xl px-3 md:px-5 py-2 md:py-3 lg:py-4">
            <div className="max-w-4xl">
              <p className="text-[8px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-0.5 md:mb-1">
                Source-aware blogging for real decisions
              </p>
              <h1 className="font-display text-[24px] md:text-[32px] lg:text-[40px] xl:text-[48px] font-bold italic text-parchment leading-[1.05] md:leading-[1.08] lg:leading-[1.05] mb-1 md:mb-1.5 lg:mb-2">
                Understand the forces shaping decisions, rights, and opportunity.
              </h1>
              <p className="text-parchment/90 text-[12px] md:text-sm lg:text-base leading-[1.3] md:leading-relaxed lg:leading-relaxed mb-2 md:mb-2.5 lg:mb-3 max-w-2xl">
                Addis Crown explains the rules and decisions that shape everyday life,
                using clear language, useful context, and source-aware reporting.
              </p>
              <div className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2">
                <Link
                  href="/latest"
                  className="text-ochre font-medium hover:text-white inline-block py-1 md:py-1.5 lg:py-2 px-2 md:px-3 lg:px-4 rounded-full border border-ochre/30 hover:border-ochre hover:bg-ochre/20 transition-colors text-[11px] md:text-sm lg:text-base"
                >
                  Explore Latest Stories
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-3 md:px-5 py-2 md:py-3 lg:py-4">
          <div className="mb-2 md:mb-3 lg:mb-4">
            <p className="text-[8px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-0.5 md:mb-1">
              Latest Stories
            </p>
            <h2 className="font-display text-[18px] md:text-[24px] lg:text-[28px] xl:text-[36px] font-bold text-ink leading-[1.1] md:leading-tight lg:leading-tight">
              All Analysis & Insights
            </h2>
          </div>
          <nav className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2 mb-2 md:mb-3 lg:mb-4 overflow-x-auto pb-1 md:pb-0 max-h-8" aria-label="Category filters">
            <Link
              href="/"
              className="px-2 py-1 text-[8px] md:text-xs lg:text-sm font-medium text-teal bg-teal/10 rounded-full hover:bg-teal/20 transition-colors whitespace-nowrap"
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category}`}
                className="px-2 py-1 text-[8px] md:text-xs lg:text-sm font-medium text-stone border border-line rounded-full hover:border-teal hover:text-teal transition-colors whitespace-nowrap"
              >
                {categoryLabel(category)}
              </Link>
            ))}
          </nav>
        </section>

        <section className="mx-auto max-w-7xl px-3 md:px-5 pb-3 md:pb-4 lg:pb-6">
          <div className="grid gap-2 md:gap-3 lg:gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="max-w-article">
              {rest.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
            <DiscoverySidebar />
          </div>
        </section>
      </main>
    </div>
  );
}
