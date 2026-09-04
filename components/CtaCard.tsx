export default function CtaCard({
  heading,
  body,
  href,
  actionLabel
}: {
  heading: string;
  body: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <div className="my-8 rounded-lg border border-teal/30 bg-teal/5 p-6">
      <p className="font-display text-lg font-semibold text-ink mb-2">{heading}</p>
      <p className="text-stone mb-4 leading-relaxed">{body}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-tealDeep transition-colors"
      >
        {actionLabel}
      </a>
    </div>
  );
}
