export default function SubscribeCard() {
  return (
    <section className="border border-teal/20 bg-teal/5 p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Stay informed</p>
      <h2 className="mb-2 font-display text-xl font-semibold text-ink">New explainers, when they matter.</h2>
      <p className="mb-4 text-sm leading-relaxed text-stone">Subscribe by email for new law, rights, and policy explainers.</p>
      <a href="mailto:hello@addiscrown.et?subject=Addis%20Crown%20subscription" className="inline-flex min-h-11 items-center rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-tealDeep">
        Request updates
      </a>
    </section>
  );
}