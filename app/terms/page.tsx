export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[10px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-1 md:mb-1.5">
          Terms
        </p>
        <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
          Terms of Use
        </h1>
      </div>
      <div className="prose-article text-stone text-sm md:text-base">
        <p>
          {/* Placeholder — replace with reviewed terms. Content here is
              informational and does not constitute legal advice. */}
          Content published on Addis Crown is for general informational
          purposes only and does not constitute legal advice. Consult a
          qualified professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
}
