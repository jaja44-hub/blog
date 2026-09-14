import { getAllSlugs, getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PostRating from "@/components/PostRating";
import Link from "next/link";
import type { Metadata } from "next";
import { generateStructuredData } from "@/lib/structured-data";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import LikeButton from "@/components/LikeButton";
import QuickFeedback from "@/components/QuickFeedback";
import ReadingTools from "@/components/ReadingTools";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.ogImage ? [post.ogImage] : []
    }
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }
  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const structuredData = generateStructuredData(post);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Full-bleed Navy Header */}
      <header className="bg-ink border-b border-line">
        <div className="mx-auto max-w-7xl px-3 md:px-5 py-2 md:py-3 lg:py-4">
          {/* Breadcrumb */}
          <nav className="mb-0.5 md:mb-1 lg:mb-2 text-[8px] md:text-xs lg:text-sm text-parchment/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-parchment/40">/</span>
            <Link href={`/category/${post.category}`} className="hover:text-white transition-colors">{categoryLabel(post.category)}</Link>
            <span className="mx-2 text-parchment/40">/</span>
            <span className="text-parchment">{post.title}</span>
          </nav>

          <div className="max-w-4xl">
            <p className="mb-0.5 md:mb-1 text-[8px] md:text-xs lg:text-sm font-semibold uppercase tracking-widest text-ochre">{categoryLabel(post.category)}</p>
            <h1 className="max-w-3xl font-display text-[24px] md:text-[32px] lg:text-[40px] xl:text-[48px] font-semibold leading-[1.05] md:leading-tight lg:leading-tight text-parchment">{post.title}</h1>
            <p className="mt-0.5 md:mt-1 lg:mt-2 text-parchment/90 text-[12px] md:text-sm lg:text-base leading-[1.3] md:leading-relaxed lg:leading-relaxed max-w-2xl">{post.description}</p>
            <div className="mt-1 md:mt-2 lg:mt-3 flex flex-wrap items-center gap-1.5 md:gap-2 lg:gap-3 text-[9px] md:text-xs lg:text-sm text-parchment/80">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
              {post.readingTime && <span className="text-ochre font-medium">{post.readingTime} min read</span>}
            </div>

            {/* Reading Tools */}
            <div className="mt-1.5 md:mt-2 lg:mt-3 flex flex-wrap gap-1 md:gap-1.5 lg:gap-2">
              <LikeButton slug={post.slug} />
              <FavoriteButton slug={post.slug} />
              <ReadingTools title={post.title} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 md:px-5 py-1.5 md:py-2 lg:py-3">
        <div className="max-w-article mx-auto">
          <div className="prose-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mx-auto mt-1.5 md:mt-2 lg:mt-3 max-w-article rounded-sm bg-parchmentDeep px-2 md:px-3 lg:px-4 py-1.5 md:py-2 lg:py-3 border-l-4 border-ochre">
          <p className="text-[9px] md:text-xs lg:text-sm text-stone">
            <strong className="text-ink">Disclaimer:</strong> This article provides general information and does not constitute legal advice. Readers should verify specific requirements with relevant authorities.
          </p>
        </div>

        <section className="mx-auto mt-1.5 md:mt-2 lg:mt-3 max-w-article rounded-sm bg-ochre/15 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 lg:py-3 shadow-sm sm:px-5" aria-labelledby="engagement-heading">
          <div className="mb-1.5 md:mb-2 lg:mb-3">
            <p className="text-[9px] md:text-xs lg:text-sm font-semibold uppercase tracking-widest text-tealDeep">Your response</p>
            <h2 id="engagement-heading" className="font-display text-[14px] md:text-lg lg:text-xl font-semibold text-ink">What did this article give you?</h2>
          </div>
          <div className="flex flex-wrap items-center gap-1 md:gap-1.5 lg:gap-2">
            <PostRating postSlug={slug} />
          </div>
          <QuickFeedback slug={post.slug} />
        </section>

        {/* Trust and Feedback */}
        <section className="mx-auto mt-1.5 md:mt-2 lg:mt-3 max-w-article border-t border-line pt-1.5 md:pt-2 lg:pt-3">
          <h2 className="font-display text-[14px] md:text-lg lg:text-xl font-semibold text-ink mb-1.5 md:mb-2 lg:mb-3">Feedback & Corrections</h2>
          <p className="text-stone mb-1.5 md:mb-2 lg:mb-3 text-sm md:text-base">
            Found an error or have additional context? Help us improve this article.
          </p>
          <div className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2">
            <Link
              href="/corrections"
              className="inline-block px-2 md:px-3 lg:px-4 py-1 md:py-1.5 text-teal border border-teal rounded hover:bg-teal/10 transition-colors text-xs md:text-sm lg:text-base"
            >
              Report a factual issue
            </Link>
            <Link
              href="/contact"
              className="inline-block px-2 md:px-3 lg:px-4 py-1 md:py-1.5 text-ink border border-line rounded hover:border-teal hover:text-teal transition-colors text-xs md:text-sm lg:text-base"
            >
              General contact
            </Link>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-2 md:mt-3 lg:mt-4 border-t border-line pt-1.5 md:pt-2 lg:pt-3">
            <h2 className="font-display text-[14px] md:text-lg lg:text-xl font-semibold text-ink mb-1.5 md:mb-2 lg:mb-3">Related posts</h2>
            <div className="grid gap-1.5 md:gap-2 lg:gap-3 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="border border-line rounded-lg p-1.5 md:p-2 lg:p-3 hover:border-teal transition-colors">
                  <p className="text-[9px] md:text-xs text-ochre font-medium mb-0.5 md:mb-1">
                    {categoryLabel(relatedPost.category)}
                  </p>
                  <h3 className="font-display text-[13px] md:text-lg lg:text-xl font-semibold text-ink mb-0.5 md:mb-1 leading-snug">
                    <Link href={`/posts/${relatedPost.slug}`} className="hover:text-teal transition-colors">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-stone text-sm leading-relaxed mb-1 md:mb-1.5 line-clamp-3">
                    {relatedPost.description}
                  </p>
                  <time className="text-[9px] md:text-xs text-stone" dateTime={relatedPost.date}>
                    {new Date(relatedPost.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </time>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Next Action */}
        <section className="mt-2 md:mt-3 lg:mt-4 border-t border-line pt-1.5 md:pt-2 lg:pt-3 text-center">
          <h2 className="font-display text-[14px] md:text-lg lg:text-xl font-semibold text-ink mb-1.5 md:mb-2 lg:mb-3">Continue reading</h2>
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 lg:gap-3">
            <Link
              href="/latest"
              className="px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 text-ink border border-line rounded-full hover:border-teal hover:text-teal transition-colors text-xs md:text-sm lg:text-base"
            >
              Latest stories
            </Link>
            <Link
              href={`/category/${post.category}`}
              className="px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 text-ink border border-line rounded-full hover:border-teal hover:text-teal transition-colors text-xs md:text-sm lg:text-base"
            >
              More in {categoryLabel(post.category)}
            </Link>
          </div>
        </section>
      </main>
    </article>
  );
}