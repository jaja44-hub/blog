export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-article px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">
        About Addis Crown
      </h1>
      <p className="text-stone leading-relaxed mb-4">
        Addis Crown covers Ethiopian law, rights, and the policy questions
        shaping how institutions and emerging technology affect ordinary
        people — written in plain language, grounded in primary sources.
      </p>
      <p className="text-stone leading-relaxed">
        {/* Replace with real bio/credentials — author trust signals matter
            for both reader confidence and AdSense review. */}
        Written by a practicing advocate and consultant across Ethiopia's
        federal courts.
      </p>
    </div>
  );
}
