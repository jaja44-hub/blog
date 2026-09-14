export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-article px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="mb-2 md:mb-3 lg:mb-4">
        <p className="text-[10px] md:text-xs lg:text-sm text-ochre font-semibold uppercase tracking-widest mb-1 md:mb-1.5">
          About
        </p>
        <h1 className="font-display text-[20px] md:text-[28px] lg:text-[32px] xl:text-[40px] font-semibold text-ink mb-2 md:mb-3 lg:mb-4">
          About Addis Crown
        </h1>
      </div>

      <div className="space-y-2 md:space-y-3 lg:space-y-4 text-stone text-sm md:text-base">
        <p>
          Addis Crown covers Ethiopian law, rights, and the policy questions
          shaping how institutions and emerging technology affect ordinary
          people — written in plain language, grounded in primary sources and
          source-aware reporting.
        </p>
        <p>
          The publication grows from a legal career and professional practice,
          with an interest in the practical questions people face when rules,
          institutions, markets, and technology meet. Its aim is not to make
          complex subjects sound simple for their own sake, but to make them
          useful for careful decisions.
        </p>
        <p>
          Coverage includes law and rights, contracts and consumer safety,
          business and enterprise, markets and investment, real estate,
          economics and finance, migration and borders, technology and AI,
          media and information, public policy, global affairs, and Ethiopia
          and East Africa.
        </p>
        <p>
          Addis Crown is written from the perspective of a practicing advocate
          and consultant across Ethiopia&apos;s federal courts, combined with a
          continuing curiosity about how legal and policy changes affect
          builders, families, professionals, institutions, and communities.
        </p>
      </div>
    </div>
  );
}
