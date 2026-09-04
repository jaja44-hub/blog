export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-article px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">
        Get in touch
      </h1>
      <p className="text-stone leading-relaxed mb-4">
        Questions, corrections, or story tips — reach out directly.
      </p>
      <a
        href="mailto:hello@addiscrown.et"
        className="text-teal font-medium hover:text-tealDeep"
      >
        hello@addiscrown.et
      </a>
    </div>
  );
}
