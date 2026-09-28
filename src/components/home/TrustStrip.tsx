import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * Trust logo strip — lives directly UNDER the hero (not inside it).
 * Invented customers rendered as consistent monogram + wordmark marks
 * (placeholder; swap for real customer SVG logos later).
 */
const CUSTOMERS = [
  { name: "Kettleworks", mono: "K" },
  { name: "Northbeam", mono: "N" },
  { name: "Lumen", mono: "L" },
  { name: "Aperture", mono: "A" },
  { name: "Cascade", mono: "C" },
  { name: "Vantage", mono: "V" },
];

export function TrustStrip() {
  return (
    <section className="page pb-8 pt-2">
      <ScrollReveal>
        <p className="text-center text-sm text-faint">Trusted by revenue and support teams at</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 grayscale">
          {CUSTOMERS.map((c) => (
            <span key={c.name} className="inline-flex items-center gap-2 text-ink/70">
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface font-display text-sm font-bold">
                {c.mono}
              </span>
              <span className="font-display text-lg font-medium tracking-tight">{c.name}</span>
            </span>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
