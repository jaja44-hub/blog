import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-3 md:mt-4 lg:mt-6 bg-ink text-parchment">
      <div className="mx-auto grid max-w-5xl gap-2 md:gap-3 lg:gap-5 px-3 md:px-5 py-3 md:py-4 lg:py-6 text-xs md:text-sm sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-[15px] md:text-[18px] lg:text-xl xl:text-2xl font-semibold">Addis Crown</p>
          <p className="mt-0.5 md:mt-1 lg:mt-1.5 max-w-sm text-parchment/70 text-[9px] md:text-xs lg:text-sm">Practical context for law, rights, markets, technology, and policy.</p>
        </div>
        <div>
          <p className="mb-1 md:mb-1.5 lg:mb-2 text-[9px] md:text-xs font-semibold uppercase tracking-widest text-ochre">Explore</p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/search" className="hover:text-white">Search the publication</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/feed.xml" className="hover:text-white">Subscribe via RSS</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/latest" className="hover:text-white">Latest stories</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/about" className="hover:text-white">About Addis Crown</Link></p>
        </div>
        <div>
          <p className="mb-1 md:mb-1.5 lg:mb-2 text-[9px] md:text-xs font-semibold uppercase tracking-widest text-ochre">Trust & Support</p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/corrections" className="hover:text-white">Corrections</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/accessibility" className="hover:text-white">Accessibility</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/terms" className="hover:text-white">Terms</Link></p>
          <p className="text-parchment/70 text-[9px] md:text-xs lg:text-sm"><Link href="/contact" className="hover:text-white">Contact</Link></p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-5xl px-3 md:px-5 py-1.5 md:py-2 lg:py-2.5 text-[9px] md:text-xs text-parchment/55">© {new Date().getFullYear()} Addis Crown. All rights reserved.</div>
      </div>
    </footer>
  );
}
