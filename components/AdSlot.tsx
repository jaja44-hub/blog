// Placeholder ad slot. Wire real AdSense unit code in here once approved —
// keep the container present from launch so approval doesn't require a
// layout change, per the build spec's AdSense readiness checklist.
export default function AdSlot({ position }: { position: "header" | "in-article" | "footer" }) {
  return (
    <div
      className="my-6 flex h-24 items-center justify-center border border-dashed border-line text-xs text-stone"
      data-ad-position={position}
    >
      Ad slot — {position}
    </div>
  );
}
