import Link from "next/link";

const NAV = [
  { href: "/category/legal-rights", label: "Legal Rights" },
  { href: "/category/ai-policy", label: "AI & Policy" },
  { href: "/category/media-literacy", label: "Media Literacy" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" }
];

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          Addis Crown
          {/* Swap this wordmark for the inherited logo asset once brand
              files are pulled from the legal app's repository. */}
        </Link>
        <nav className="hidden gap-6 text-sm text-stone md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-teal transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
