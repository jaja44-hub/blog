import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { categoryLabel } from "@/lib/posts";

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
      <time className="text-xs text-stone" dateTime={post.date}>
        {new Date(post.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })}
      </time>
    </article>
  );
}
