"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/categories";

interface PostMeta {
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  readingTime?: number;
}

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostMeta[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.posts || []);
          setIsSearching(false);
        })
        .catch(() => {
          setResults([]);
          setIsSearching(false);
        });
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="mx-auto max-w-article px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        Search
      </h1>
      
      <div className="mb-8">
        <label htmlFor="search-input" className="sr-only">Search posts</label>
        <input
          id="search-input"
          type="search"
          placeholder="Search posts... (minimum 2 characters)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          autoFocus
        />
      </div>

      {isSearching && <p className="text-stone">Searching...</p>}

      {query.trim().length >= 2 && !isSearching && (
        <>
          {results.length === 0 ? (
            <p className="text-stone">No posts found for "{query}"</p>
          ) : (
            <div className="space-y-6">
              {results.map((post) => (
                <article key={post.slug} className="border-b border-line pb-6 last:border-0 last:pb-0">
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
              ))}
            </div>
          )}
        </>
      )}

      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="text-stone text-sm">Type at least 2 characters to search</p>
      )}

      {query.trim().length === 0 && (
        <p className="text-stone">Enter a search term to find posts</p>
      )}
    </div>
  );
}