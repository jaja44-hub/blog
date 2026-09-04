export default function PdfDownload({
  href,
  label,
  sizeLabel
}: {
  href: string;
  label: string;
  sizeLabel?: string;
}) {
  return (
    <a
      href={href}
      download
      className="my-6 flex items-center justify-between rounded-lg border border-line bg-parchmentDeep px-5 py-4 no-underline hover:border-teal transition-colors"
    >
      <span className="font-medium text-ink">{label}</span>
      <span className="text-sm text-stone">{sizeLabel ?? "PDF"}</span>
    </a>
  );
}
