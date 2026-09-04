import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="border-b border-line py-8 first:pt-0">
      <p className="text-xs text-ochre font-medium mb-2">
        {categoryLabel(post.category)}
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink mb-2 leading-snug">
        <Link href={`/posts/${post.slug}`} className="hover:text-teal transition-colors">
          {post.title}
        </Link>
      </h2>
      <p className="text-stone leading-relaxed mb-3">{post.description}</p>
      <div className="flex items-center gap-4 text-xs text-stone">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </time>
        {post.readingTime && (
          <span className="text-ochre">{post.readingTime} min read</span>
        )}
      </div>
    </article>
  );
}
