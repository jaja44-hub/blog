import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { categoryLabel } from "@/lib/categories";
import FavoriteButton from "@/components/FavoriteButton";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="border-b border-line py-2 md:py-3 lg:py-5 first:pt-0">
      <p className="text-[9px] md:text-xs text-ochre font-medium mb-0.5 md:mb-1">
        {categoryLabel(post.category)}
      </p>
      <h2 className="font-display text-[17px] md:text-xl lg:text-2xl font-semibold text-ink mb-0.5 md:mb-1 lg:mb-1.5 leading-[1.2] md:leading-[1.25] lg:leading-snug">
        <Link href={`/posts/${post.slug}`} className="hover:text-teal transition-colors">
          {post.title}
        </Link>
      </h2>
      <p className="text-stone leading-[1.3] md:leading-relaxed lg:leading-relaxed mb-1 md:mb-1.5 lg:mb-2 text-[13px] md:text-sm lg:text-base line-clamp-2">{post.description}</p>
      <Link href={`/posts/${post.slug}`} className="inline-flex text-[11px] md:text-sm font-semibold text-teal hover:text-tealDeep">Read more <span aria-hidden="true" className="ml-1">→</span></Link>
      <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-[10px] md:text-xs text-stone mt-1 md:mt-1.5 lg:mt-2">
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
      <div className="mt-1 md:mt-1.5 lg:mt-3">
        <FavoriteButton slug={post.slug} />
      </div>
    </article>
  );
}
