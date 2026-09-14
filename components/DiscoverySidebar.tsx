import Link from "next/link";
import SubscribeCard from "@/components/SubscribeCard";
import { CATEGORIES, categoryLabel } from "@/lib/categories";

export default function DiscoverySidebar() {
  return (
    <aside className="space-y-4 md:space-y-6 hidden lg:block" aria-label="Discovery navigation">
      <section>
        <p className="mb-2 md:mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Discover</p>
        <nav className="space-y-0.5 md:space-y-1 text-xs md:text-sm" aria-label="Discovery links">
          <Link href="/" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Latest stories</Link>
          <Link href="/category/legal-rights" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Legal Rights</Link>
          <Link href="/category/contracts-consumer-safety" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Contracts & Consumer Safety</Link>
          <Link href="/category/business-enterprise" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Business & Enterprise</Link>
          <Link href="/category/markets-investment" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Markets & Investment</Link>
          <Link href="/category/real-estate-housing" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Real Estate & Housing</Link>
          <Link href="/category/economics-finance" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Economics & Finance</Link>
          <Link href="/category/migration-borders" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Migration & Borders</Link>
          <Link href="/category/technology-ai" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Technology & AI</Link>
          <Link href="/category/media-information" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Media & Information</Link>
          <Link href="/category/public-policy-institutions" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Public Policy & Institutions</Link>
          <Link href="/category/ethiopia-east-africa" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Ethiopia & East Africa</Link>
          <Link href="/category/comparative-law" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Comparative Law</Link>
          <Link href="/search?sort=popular" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">Popular reading</Link>
          <Link href="/search?sort=newest" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">New this week</Link>
          <Link href="/feed.xml" className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal">RSS feed</Link>
        </nav>
      </section>
      <section>
        <p className="mb-2 md:mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Categories</p>
        <nav className="space-y-0.5 md:space-y-1 text-xs md:text-sm" aria-label="Category links">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${category}`}
              className="block border-b border-line py-1.5 md:py-2 text-stone hover:text-teal"
            >
              {categoryLabel(category)}
            </Link>
          ))}
        </nav>
      </section>
      <SubscribeCard />
    </aside>
  );
}