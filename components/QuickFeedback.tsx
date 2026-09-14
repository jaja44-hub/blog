"use client";

import { useState } from "react";

const FEEDBACK = ["Useful", "Thought-provoking", "Needs more detail"];

export default function QuickFeedback({ slug }: { slug: string }) {
  const [selected, setSelected] = useState("");

  async function choose(feedback: string) {
    setSelected(feedback);
    await fetch("/api/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug: slug, eventType: "feedback_submitted", feedback })
    }).catch(() => undefined);
  }

  return (
    <div className="mt-5 border-t border-ink/10 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink/60">Quick reaction</p>
      <div className="flex flex-wrap gap-2">
        {FEEDBACK.map((feedback) => (
          <button key={feedback} type="button" onClick={() => choose(feedback)} aria-pressed={selected === feedback} className={`min-h-10 rounded-full border px-3 py-2 text-xs transition-colors ${selected === feedback ? "border-ink bg-ink text-white" : "border-ink/20 text-ink hover:border-ink"}`}>
            {feedback}
          </button>
        ))}
      </div>
    </div>
  );
}