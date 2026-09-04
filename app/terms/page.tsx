export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-article px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">
        Terms of Use
      </h1>
      <div className="prose-article text-stone">
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
