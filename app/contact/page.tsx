import Link from "next/link";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[10px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-1 md:mb-1.5">
          Contact
        </p>
        <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
          Get in Touch
        </h1>
        <p className="text-stone max-w-2xl text-sm md:text-base">
          Questions, corrections, or story tips — reach out directly.
        </p>
      </div>

      <div className="space-y-2 md:space-y-3 lg:space-y-4">
        <div className="bg-parchmentDeep rounded-lg p-2 md:p-3 lg:p-4">
          <h2 className="font-display text-[16px] md:text-lg lg:text-xl font-semibold text-ink mb-1 md:mb-2">
            Email
          </h2>
          <a
            href="mailto:hello@addiscrown.et"
            className="text-teal font-medium hover:text-tealDeep text-sm md:text-base"
          >
            hello@addiscrown.et
          </a>
        </div>

        <div className="bg-parchmentDeep rounded-lg p-2 md:p-3 lg:p-4">
          <h2 className="font-display text-[16px] md:text-lg lg:text-xl font-semibold text-ink mb-1 md:mb-2">
            Submission Types
          </h2>
          <ul className="space-y-0.5 md:space-y-1 text-stone text-sm md:text-base">
            <li>• Story tips and article suggestions</li>
            <li>• Factual corrections</li>
            <li>• Questions about our content</li>
            <li>• Partnership inquiries</li>
          </ul>
        </div>

        <div className="bg-parchmentDeep rounded-lg p-2 md:p-3 lg:p-4">
          <h2 className="font-display text-[16px] md:text-lg lg:text-xl font-semibold text-ink mb-1 md:mb-2">
            Response Time
          </h2>
          <p className="text-stone text-sm md:text-base">
            We aim to respond to all inquiries within 2-3 business days.
          </p>
        </div>
      </div>

      <div className="mt-3 md:mt-4 lg:mt-6">
        <Link
          href="/corrections"
          className="inline-block px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-ink border border-line rounded-full hover:border-teal hover:text-teal transition-colors text-xs md:text-sm lg:text-base"
        >
          Submit a Correction
        </Link>
      </div>
    </div>
  );
}
