"use client";

import { useState } from "react";
import Link from "next/link";

export default function CorrectionsPage() {
  const [formData, setFormData] = useState({
    articleUrl: "",
    issueDescription: "",
    evidenceSource: "",
    contactEmail: "",
    contactName: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send data to an API
    console.log("Correction submitted:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
        <div className="text-center py-3 md:py-4 lg:py-6">
          <div className="mb-2 md:mb-3">
            <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
            Thank You
          </h1>
          <p className="text-stone mb-2 md:mb-3 lg:mb-4 max-w-xl mx-auto text-sm md:text-base">
            Your correction report has been submitted. Our editorial team will review it and update the article if appropriate.
          </p>
          <div className="bg-parchmentDeep rounded-lg p-2 md:p-3 lg:p-4 max-w-md mx-auto mb-2 md:mb-3 lg:mb-4">
            <p className="text-xs md:text-sm text-stone mb-1 md:mb-2 lg:mb-3">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-xs md:text-sm text-stone space-y-0.5 md:space-y-1 lg:space-y-2 text-left">
              <li>• Editorial team reviews your submission</li>
              <li>• Sources are verified when provided</li>
              <li>• Articles are updated with corrections</li>
              <li>• You may be contacted for clarification</li>
            </ul>
          </div>
          <Link
            href="/"
            className="inline-block px-2 md:px-3 lg:px-4 py-1.5 md:py-2 lg:py-2.5 text-ink border border-line rounded-full hover:border-teal hover:text-teal transition-colors text-xs md:text-sm lg:text-base"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[10px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-1 md:mb-1.5 lg:mb-2">
          Feedback & Corrections
        </p>
        <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
          Report a Factual Issue
        </h1>
        <p className="text-stone max-w-2xl text-sm md:text-base">
          Help us maintain accuracy and trust. If you find an error in our articles, please let us know with specific details and supporting evidence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3 lg:space-y-4">
        <div>
          <label htmlFor="articleUrl" className="block text-xs md:text-sm font-medium text-ink mb-1 md:mb-1.5 lg:mb-2">
            Article URL *
          </label>
          <input
            id="articleUrl"
            type="url"
            required
            value={formData.articleUrl}
            onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
            placeholder="https://blog.addiscrown.et/posts/example-article"
            className="w-full px-3 md:px-4 py-2 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm md:text-base"
          />
        </div>

        <div>
          <label htmlFor="issueDescription" className="block text-xs md:text-sm font-medium text-ink mb-1 md:mb-1.5 lg:mb-2">
            Issue Description *
          </label>
          <textarea
            id="issueDescription"
            required
            value={formData.issueDescription}
            onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
            placeholder="Describe the factual error or issue you found..."
            rows={4}
            className="w-full px-3 md:px-4 py-2 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm md:text-base"
          />
        </div>

        <div>
          <label htmlFor="evidenceSource" className="block text-xs md:text-sm font-medium text-ink mb-1 md:mb-1.5 lg:mb-2">
            Evidence or Source
          </label>
          <textarea
            id="evidenceSource"
            value={formData.evidenceSource}
            onChange={(e) => setFormData({ ...formData, evidenceSource: e.target.value })}
            placeholder="Provide links to sources, documents, or other evidence that supports your correction..."
            rows={3}
            className="w-full px-3 md:px-4 py-2 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm md:text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
          <div>
            <label htmlFor="contactName" className="block text-xs md:text-sm font-medium text-ink mb-1 md:mb-1.5 lg:mb-2">
              Your Name (Optional)
            </label>
            <input
              id="contactName"
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="Your name"
              className="w-full px-3 md:px-4 py-2 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm md:text-base"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-xs md:text-sm font-medium text-ink mb-1 md:mb-1.5 lg:mb-2">
              Your Email (Optional)
            </label>
            <input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-3 md:px-4 py-2 border border-line rounded-lg text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm md:text-base"
            />
          </div>
        </div>

        <div className="bg-parchmentDeep rounded-lg p-2 md:p-3">
          <p className="text-xs md:text-sm text-stone">
            <strong>Note:</strong> By submitting this form, you agree that our editorial team may review and use your submission to improve our content. We may contact you for clarification if needed.
          </p>
        </div>

        <div className="flex gap-1.5 md:gap-2 lg:gap-3">
          <button
            type="submit"
            className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-ochre font-medium border border-teal/20 rounded hover:bg-teal/10 transition-colors text-xs md:text-sm lg:text-base"
          >
            Submit Correction
          </button>
          <Link
            href="/contact"
            className="px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-ink border border-line rounded hover:border-teal hover:text-teal transition-colors text-xs md:text-sm lg:text-base"
          >
            General Contact Instead
          </Link>
        </div>
      </form>
    </div>
  );
}