import Link from "next/link";

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="text-center py-3 md:py-4 lg:py-6">
        <div className="mb-2 md:mb-3">
          <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto text-ochre/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
          Saved Articles
        </h1>
        <p className="text-stone mb-2 md:mb-3 lg:mb-4 max-w-xl mx-auto text-sm md:text-base">
          Save articles to read later. This feature requires reader account authentication.
        </p>
        <div className="bg-parchmentDeep rounded-lg p-2 md:p-3 lg:p-4 max-w-md mx-auto mb-2 md:mb-3 lg:mb-4">
          <p className="text-xs md:text-sm text-stone mb-1 md:mb-2 lg:mb-3">
            <strong>Coming in the reader account phase:</strong>
          </p>
          <ul className="text-xs md:text-sm text-stone space-y-0.5 md:space-y-1 lg:space-y-2 text-left">
            <li>• Save articles for later reading</li>
            <li>• Organize saved content by topic</li>
            <li>• Access your reading list across devices</li>
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