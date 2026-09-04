export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-article px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">
        Privacy Policy
      </h1>
      <div className="prose-article text-stone">
        <p>
          {/* Placeholder policy — replace with a reviewed policy before
              applying for AdSense. Must disclose cookie/ad-tech use,
              third-party vendors (Google AdSense, Google Analytics), and
              how visitors can opt out where required by their region. */}
          This site uses cookies and similar technologies, including
          those from Google, to serve ads and measure site performance.
          Third-party vendors, including Google, use cookies to serve ads
          based on a visitor's prior visits to this or other websites.
        </p>
        <p>
          Visitors in regions covered by GDPR or similar regulation may
          opt out of personalized advertising via Google's Ads Settings,
          or via the cookie consent banner presented on first visit.
        </p>
        <p>
          For questions about this policy, contact hello@addiscrown.et.
        </p>
      </div>
    </div>
  );
}
