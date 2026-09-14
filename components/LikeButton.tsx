"use client";

import { useEffect, useState } from "react";

export default function LikeButton({ slug }: { slug: string }) {
  const key = `addis_liked_${slug}`;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(key) === "true");
  }, [key]);

  function toggleLike() {
    const next = !liked;
    localStorage.setItem(key, String(next));
    setLiked(next);
    void fetch("/api/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug: slug, eventType: next ? "like_added" : "like_removed" })
    });
  }

  return (
    <button type="button" onClick={toggleLike} aria-pressed={liked} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-stone hover:border-teal hover:text-teal">
      <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
      {liked ? "Liked" : "Like"}
    </button>
  );
}