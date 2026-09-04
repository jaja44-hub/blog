"use client";

import { useState, useEffect } from "react";

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

export default function PostRating({ postSlug }: { postSlug: string }) {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("user_id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("user_id", id);
      }
      return id;
    }
    return "";
  });

  const fetchRating = async () => {
    try {
      const response = await fetch(`/api/ratings/${postSlug}`, {
        headers: {
          "x-user-id": userId
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRatingData(data);
      }
    } catch (error) {
      console.error("Failed to fetch rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    try {
      const response = await fetch(`/api/ratings/${postSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({ rating })
      });
      if (response.ok) {
        const data = await response.json();
        setRatingData(data);
      }
    } catch (error) {
      console.error("Failed to set rating:", error);
    }
  };

  useEffect(() => {
    fetchRating();
  }, [postSlug]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-stone">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-2xl text-line">★</span>
          ))}
        </div>
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  const displayRating = hoverRating || ratingData.userRating || Math.round(ratingData.averageRating);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-ink">
          {ratingData.averageRating.toFixed(1)}
        </span>
        <div className="flex gap-1" 
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="text-2xl transition-colors hover:scale-110"
              style={{
                color: star <= displayRating ? "#C08A2E" : "#E4DFD3"
              }}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <span className="text-sm text-stone">
        {ratingData.totalRatings} {ratingData.totalRatings === 1 ? "rating" : "ratings"}
        {ratingData.userRating && " · Your rating: " + ratingData.userRating}
      </span>
    </div>
  );
}