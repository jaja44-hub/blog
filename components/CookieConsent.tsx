"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-parchmentDeep px-6 py-4 md:px-12"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-stone">
          We use cookies to improve your experience and analyze site traffic. By clicking
          "Accept", you consent to our use of cookies. See our{" "}
          <Link href="/privacy-policy" className="text-teal underline hover:text-tealDeep">
            Privacy Policy
          </Link>
          {" for details."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm font-medium text-stone border border-line rounded-md hover:bg-parchment transition-colors"
          >
            Reject
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium text-white bg-teal rounded-md hover:bg-tealDeep transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}