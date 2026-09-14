"use client";

import Link from "next/link";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="border-b border-line bg-parchment sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 md:px-5 py-1 md:py-2 lg:py-3 h-10 md:h-12 lg:h-14">
        <Link
          href="/"
          className="font-display text-[15px] md:text-[17px] lg:text-lg xl:text-xl font-semibold tracking-tight text-ink"
        >
          Addis Crown
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-sm text-stone" aria-label="Primary navigation">
          <Link href="/latest" className="hover:text-teal transition-colors font-medium">Latest</Link>
          <Link href="/new-this-week" className="hover:text-teal transition-colors">New This Week</Link>
          <Link href="/popular" className="hover:text-teal transition-colors">Popular</Link>
          <Link href="/contact" className="hover:text-teal transition-colors">Contact</Link>
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
          <input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 py-2 rounded-full border-2 border-line bg-parchment text-ink placeholder:text-stone/60 focus:outline-none focus:border-teal w-64 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal hover:text-tealDeep transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-1.5 rounded-md border border-line text-ink hover:bg-parchmentDeep transition-colors"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav id="mobile-navigation" className="border-t border-line lg:hidden bg-parchment" aria-label="Mobile navigation">
          <div className="px-4 py-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border-2 border-line bg-parchment text-ink placeholder:text-stone/60 focus:outline-none focus:border-teal transition-colors text-sm"
              />
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-0.5">
              <Link
                href="/latest"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm font-medium text-ink hover:bg-parchmentDeep rounded transition-colors"
              >
                Latest
              </Link>
              <Link
                href="/new-this-week"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-stone hover:bg-parchmentDeep rounded transition-colors"
              >
                New This Week
              </Link>
              <Link
                href="/popular"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-stone hover:bg-parchmentDeep rounded transition-colors"
              >
                Popular
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-stone hover:bg-parchmentDeep rounded transition-colors"
              >
                Contact
              </Link>

              <div className="border-t border-line my-2"></div>

              <p className="px-3 py-1.5 text-[10px] font-semibold text-ochre uppercase tracking-wider">
                Support
              </p>
              <Link
                href="/corrections"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-stone hover:bg-parchmentDeep rounded transition-colors"
              >
                Corrections
              </Link>
              <Link
                href="/accessibility"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-stone hover:bg-parchmentDeep rounded transition-colors"
              >
                Accessibility
              </Link>

              <div className="border-t border-line my-2"></div>

              <p className="px-3 py-1.5 text-[10px] font-semibold text-ochre uppercase tracking-wider">
                Topics
              </p>
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-stone hover:bg-parchmentDeep rounded transition-colors"
                >
                  {categoryLabel(category)}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
