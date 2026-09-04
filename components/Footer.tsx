import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-stone flex flex-col gap-4 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Addis Crown. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/privacy-policy" className="hover:text-teal">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-teal">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-teal">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
