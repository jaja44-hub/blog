"use client";

import { useState } from "react";

interface ReadingToolsProps {
  title: string;
}

export default function ReadingTools({ title }: ReadingToolsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy URL to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      <button
        onClick={handleShare}
        className="px-2 py-1 text-[11px] md:text-xs lg:text-sm text-parchment border border-parchment/40 rounded hover:bg-parchment/20 transition-colors"
        aria-label="Share article"
      >
        Share
      </button>
      <button
        onClick={handleCopyLink}
        className="px-2 py-1 text-[11px] md:text-xs lg:text-sm text-parchment border border-parchment/40 rounded hover:bg-parchment/20 transition-colors"
        aria-label="Copy link"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        onClick={handlePrint}
        className="px-2 py-1 text-[11px] md:text-xs lg:text-sm text-parchment border border-parchment/40 rounded hover:bg-parchment/20 transition-colors"
        aria-label="Print article"
      >
        Print
      </button>
    </div>
  );
}