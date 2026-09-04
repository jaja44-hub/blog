import { getAllSlugs, getPostBySlug, categoryLabel } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdSlot from "@/components/AdSlot";
import Comments from "@/components/Comments";
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

  return (
    <article className="mx-auto max-w-article px-6 py-12">
      <p className="text-xs text-ochre font-medium mb-3">
        {categoryLabel(post.category)}
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink leading-tight mb-3">
        {post.title}
      </h1>
      <time className="text-sm text-stone" dateTime={post.date}>
        {new Date(post.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })}
      </time>

      <div className="prose-article mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <AdSlot position="in-article" />
      <Comments />
    </article>
  );
}
