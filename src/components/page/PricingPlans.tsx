import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/pages";

/**
 * The plans. The headline number is included minutes rather than a price, because
 * minutes are what the product actually meters and what differs between the tiers.
 * A figure appears here the day we can quote one honestly.
 */
export function PricingPlans() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {PLANS.map((p) => (
        <article
          key={p.name}
          className={cn(
            "flex flex-col rounded-[var(--radius-lg)] border p-7",
            p.featured ? "border-ink bg-ink text-white shadow-float" : "border-line bg-surface shadow-soft",
          )}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-semibold">{p.name}</h3>
            {p.featured && (
              <span className="tabular text-[0.64rem] uppercase tracking-[0.14em] text-accent-soft">Most chosen</span>
            )}
          </div>
          <p className={cn("mt-2 min-h-[2.8rem] text-[0.88rem] leading-relaxed", p.featured ? "text-white/60" : "text-muted")}>
            {p.tagline}
          </p>

          <div className={cn("mt-7 border-t pt-6", p.featured ? "border-white/10" : "border-line")}>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display tabular text-4xl font-semibold">{p.minutes}</span>
              <span className={cn("text-sm", p.featured ? "text-white/50" : "text-faint")}>minutes a month</span>
            </div>
            <p className={cn("mt-3 text-[0.9rem] font-medium", p.featured ? "text-white/80" : "text-ink")}>{p.price}</p>
            <p className={cn("mt-0.5 text-[0.8rem]", p.featured ? "text-white/45" : "text-faint")}>{p.priceNote}</p>
          </div>

          <Link
            href={p.href}
            className={cn(
              "mt-7 inline-flex h-11 items-center justify-center rounded-[12px] px-5 text-[0.92rem] font-medium transition-all duration-200 ease-signal hover:-translate-y-0.5",
              p.featured
                ? "bg-accent text-accent-contrast"
                : "border border-line bg-surface text-ink hover:border-ink/30 hover:shadow-lift",
            )}
          >
            {p.cta}
          </Link>

          <ul className={cn("mt-8 flex flex-col gap-3 border-t pt-7", p.featured ? "border-white/10" : "border-line")}>
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[0.88rem] leading-snug">
                <Check
                  size={14}
                  weight="bold"
                  className={cn("mt-1 shrink-0", p.featured ? "text-accent-soft" : "text-accent-ink")}
                />
                <span className={p.featured ? "text-white/75" : "text-muted"}>{f}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
