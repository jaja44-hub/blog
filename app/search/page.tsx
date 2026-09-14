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
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<PostMeta[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    setSort(params.get("sort") || "newest");
    setCategory(params.get("category") || "");
    setFrom(params.get("from") || "");
    setTo(params.get("to") || "");
  }, []);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sort !== "newest") params.set("sort", sort);
    if (category) params.set("category", category);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const newUrl = params.toString() ? `/search?${params.toString()}` : "/search";
    window.history.replaceState({}, "", newUrl);
  }, [query, sort, category, from, to]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsSearching(true);
      const params = new URLSearchParams({ q: query, sort });
      if (category) params.set("category", category);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      fetch(`/api/search?${params.toString()}`)
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
  }, [query, sort, category, from, to]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // URL is already updated by the useEffect
  };

  return (
    <div className="mx-auto max-w-article px-3 md:px-5 py-2 md:py-3 lg:py-4">
      <h1 className="font-display text-[18px] md:text-[24px] lg:text-[28px] xl:text-[36px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
        Search
      </h1>

      <form onSubmit={handleSearch} className="mb-3 md:mb-4 lg:mb-6">
        <label htmlFor="search-input" className="sr-only">Search posts</label>
        <input
          id="search-input"
          type="search"
          placeholder="Search posts... (minimum 2 characters)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 md:px-4 py-2 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm md:text-base"
          autoFocus
        />
      </form>

      <div className="mb-3 md:mb-4 lg:mb-6 grid gap-2 md:gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-[10px] md:text-xs lg:text-sm text-stone">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="mt-1 block w-full rounded-md border border-line bg-parchment px-2 md:px-3 py-1.5 md:py-2 text-ink text-xs md:text-sm"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </label>
        <label className="text-[10px] md:text-xs lg:text-sm text-stone">
          Category
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="legal-rights"
            className="mt-1 block w-full rounded-md border border-line bg-parchment px-2 md:px-3 py-1.5 md:py-2 text-ink text-xs md:text-sm"
          />
        </label>
        <label className="text-[10px] md:text-xs lg:text-sm text-stone">
          From
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-1 block w-full rounded-md border border-line bg-parchment px-2 md:px-3 py-1.5 md:py-2 text-ink text-xs md:text-sm"
          />
        </label>
        <label className="text-[10px] md:text-xs lg:text-sm text-stone">
          To
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="mt-1 block w-full rounded-md border border-line bg-parchment px-2 md:px-3 py-1.5 md:py-2 text-ink text-xs md:text-sm"
          />
        </label>
      </div>

      {/* Active filters summary */}
      {(query || category || from || to) && (
        <div className="mb-2 md:mb-3 lg:mb-4 p-2 md:p-3 bg-parchmentDeep rounded-lg">
          <p className="text-xs text-stone mb-1.5">
            <strong>Active filters:</strong>
          </p>
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {query && (
              <span className="px-2 py-1 bg-ink text-parchment text-[9px] md:text-xs rounded">
                Query: "{query}"
              </span>
            )}
            {category && (
              <span className="px-2 py-1 bg-ink text-parchment text-[9px] md:text-xs rounded">
                Category: {category}
              </span>
            )}
            {from && (
              <span className="px-2 py-1 bg-ink text-parchment text-[9px] md:text-xs rounded">
                From: {from}
              </span>
            )}
            {to && (
              <span className="px-2 py-1 bg-ink text-parchment text-[9px] md:text-xs rounded">
                To: {to}
              </span>
            )}
          </div>
        </div>
      )}

      {isSearching && <p className="text-stone text-sm md:text-base">Searching...</p>}

      {query.trim().length >= 2 && !isSearching && (
        <>
          <p className="text-xs md:text-sm text-stone mb-2 md:mb-2.5 lg:mb-3">
            {results.length} {results.length === 1 ? "result" : "results"} found
          </p>
          {results.length === 0 ? (
            <div className="text-center py-4 md:py-6 lg:py-8">
              <p className="text-stone mb-2 md:mb-2.5 lg:mb-3 text-sm md:text-base">No posts found for "{query}"</p>
              <p className="text-xs md:text-sm text-stone">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3 lg:space-y-4">
              {results.map((post) => (
                <article key={post.slug} className="border-b border-line pb-2 md:pb-3 lg:pb-4 last:border-0 last:pb-0">
                  <p className="text-[9px] md:text-xs text-ochre font-medium mb-1 md:mb-1.5">
                    {categoryLabel(post.category)}
                  </p>
                  <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-1.5 leading-snug">
                    <Link href={`/posts/${post.slug}`} className="hover:text-teal transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-stone leading-relaxed mb-1.5 md:mb-2 text-sm md:text-base">{post.description}</p>
                  <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-[9px] md:text-xs text-stone">
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
        <p className="text-stone text-xs md:text-sm">Type at least 2 characters to search</p>
      )}

      {query.trim().length === 0 && (
        <div className="text-center py-4 md:py-6 lg:py-8">
          <p className="text-stone mb-2 md:mb-2.5 lg:mb-3 text-sm md:text-base">Enter a search term to find posts</p>
          <p className="text-xs md:text-sm text-stone">Search for topics like "labour", "real estate", "contracts", or "technology"</p>
        </div>
      )}
    </div>
  );
}