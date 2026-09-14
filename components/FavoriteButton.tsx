"use client";

import { useEffect, useState } from "react";

export default function FavoriteButton({ slug }: { slug: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("addis_favorites") ?? "[]") as string[];
    setIsFavorite(favorites.includes(slug));
  }, [slug]);

  function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem("addis_favorites") ?? "[]") as string[];
    const next = favorites.includes(slug)
      ? favorites.filter((favorite) => favorite !== slug)
      : [...favorites, slug];
    localStorage.setItem("addis_favorites", JSON.stringify(next));
    setIsFavorite(next.includes(slug));
    void fetch("/api/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postSlug: slug,
        eventType: next.includes(slug) ? "favorite_added" : "favorite_removed"
      })
    });
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-pressed={isFavorite}
      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-stone transition-colors hover:border-teal hover:text-teal"
    >
      <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
      {isFavorite ? "Saved" : "Save"}
    </button>
  );
}