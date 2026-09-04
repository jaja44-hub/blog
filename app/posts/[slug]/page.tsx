import { getAllSlugs, getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdSlot from "@/components/AdSlot";
import Comments from "@/components/Comments";
import PostRating from "@/components/PostRating";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
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
  const post = getPostBySlug(slug);
  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-article px-6 py-12">
      <p className="text-xs text-ochre font-medium mb-3">
        {categoryLabel(post.category)}
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink leading-tight mb-3">
        {post.title}
      </h1>
      <div className="flex items-center gap-4 text-sm text-stone mb-6">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </time>
        {post.readingTime && (
          <span className="text-ochre font-medium">{post.readingTime} min read</span>
        )}
      </div>

      <div className="prose-article mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <PostRating postSlug={slug} />

      <AdSlot position="in-article" />
      <Comments />

      {relatedPosts.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">
            Related posts
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.slug} className="border border-line rounded-lg p-5 hover:border-teal transition-colors">
                <p className="text-xs text-ochre font-medium mb-2">
                  {categoryLabel(relatedPost.category)}
                </p>
                <h3 className="font-display text-lg font-semibold text-ink mb-2 leading-snug">
                  <Link href={`/posts/${relatedPost.slug}`} className="hover:text-teal transition-colors">
                    {relatedPost.title}
                  </Link>
                </h3>
                <p className="text-stone text-sm leading-relaxed mb-3 line-clamp-3">
                  {relatedPost.description}
                </p>
                <time className="text-xs text-stone" dateTime={relatedPost.date}>
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
    </article>
  );
}
