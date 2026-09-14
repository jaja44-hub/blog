import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[10px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-1 md:mb-1.5">
          Accessibility
        </p>
        <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
          Accessibility Statement
        </h1>
        <p className="text-stone max-w-2xl text-sm md:text-base">
          Addis Crown is committed to making our content accessible to all readers, including those with disabilities.
        </p>
      </div>

      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        <section>
          <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-2 lg:mb-3">
            Accessibility Goals
          </h2>
          <ul className="space-y-0.5 md:space-y-1 lg:space-y-2 text-stone text-sm md:text-base">
            <li>• Provide content that is perceivable, operable, understandable, and robust</li>
            <li>• Ensure compatibility with assistive technologies like screen readers</li>
            <li>• Maintain sufficient color contrast for text and interactive elements</li>
            <li>• Support keyboard navigation throughout the site</li>
            <li>• Provide alternative text for images and visual content</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-2 lg:mb-3">
            Current Implementation
          </h2>
          <ul className="space-y-0.5 md:space-y-1 lg:space-y-2 text-stone text-sm md:text-base">
            <li>• Semantic HTML structure for proper content hierarchy</li>
            <li>• Alt text for images and decorative elements</li>
            <li>• Keyboard navigation support for all interactive elements</li>
            <li>• Focus indicators for keyboard users</li>
            <li>• Responsive design that works across devices</li>
            <li>• Color contrast ratios meeting WCAG AA standards</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-2 lg:mb-3">
            Known Limitations
          </h2>
          <ul className="space-y-0.5 md:space-y-1 lg:space-y-2 text-stone text-sm md:text-base">
            <li>• Some third-party integrations may have limited accessibility</li>
            <li>• Complex tables and data visualizations are being improved</li>
            <li>• Video content may not always include captions</li>
            <li>• PDF documents may not be fully accessible</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-2 lg:mb-3">
            Technical Standards
          </h2>
          <p className="text-stone mb-1 md:mb-2 lg:mb-3 text-sm md:text-base">
            We aim to comply with the following accessibility standards:
          </p>
          <ul className="space-y-0.5 md:space-y-1 lg:space-y-2 text-stone text-sm md:text-base">
            <li>• WCAG 2.1 Level AA (Web Content Accessibility Guidelines)</li>
            <li>• Section 508 of the Rehabilitation Act</li>
            <li>• EN 301 549 (European accessibility requirements)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-2 lg:mb-3">
            Feedback and Assistance
          </h2>
          <p className="text-stone mb-1 md:mb-2 lg:mb-3 text-sm md:text-base">
            If you encounter accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <div className="bg-parchmentDeep rounded-lg p-2 md:p-3 lg:p-4">
            <ul className="space-y-0.5 md:space-y-1 lg:space-y-2 text-stone text-sm md:text-base">
              <li>• <Link href="/contact" className="text-teal hover:text-tealDeep">Contact Form</Link></li>
              <li>• Email: accessibility@addiscrown.et</li>
              <li>• Please specify the page and nature of the accessibility issue</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-[16px] md:text-xl lg:text-2xl font-semibold text-ink mb-1 md:mb-2 lg:mb-3">
            Ongoing Commitment
          </h2>
          <p className="text-stone text-sm md:text-base">
            We continuously review and improve our accessibility features. This statement will be updated as we make enhancements to our digital platforms.
          </p>
        </section>
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8 pt-3 md:pt-4 lg:pt-6 border-t border-line">
        <p className="text-xs md:text-sm text-stone">
          Last updated: September 2026
        </p>
      </div>
    </div>
  );
}