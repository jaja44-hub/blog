import { getAllSlugs, getPostBySlug, categoryLabel } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdSlot from "@/components/AdSlot";
import Comments from "@/components/Comments";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
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

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

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
