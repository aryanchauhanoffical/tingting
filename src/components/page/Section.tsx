import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/* ============================================================
   Page primitives.
   Everything here is a server component on purpose: the entrance
   animation is the CSS `.rise` keyframe, so the copy is on screen
   even if hydration never happens.
   ============================================================ */

/** The masthead of a sub-page: eyebrow, one display line, a lead, and optional actions. */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="page pb-16 pt-10 sm:pb-20 sm:pt-16">
      <div className={cn("grid gap-10", aside && "lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16")}>
        <div className="max-w-3xl">
          <p className="eyebrow rise">{eyebrow}</p>
          <h1 className="font-display rise mt-4 text-display font-semibold" style={{ animationDelay: "60ms" }}>
            {title}
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: "120ms" }}>
            {lead}
          </p>
          {actions && (
            <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "180ms" }}>
              {actions}
            </div>
          )}
        </div>
        {aside && (
          <div className="rise" style={{ animationDelay: "240ms" }}>
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}

/** A short list of facts, hairline separated. Sits in a page hero or beside a section. */
export function FactList({ items }: { items: readonly { k: string; v: string }[] }) {
  return (
    <dl className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft">
      {items.map((it, i) => (
        <div
          key={it.k}
          className={cn("flex items-baseline justify-between gap-6 py-3", i > 0 && "border-t border-line-soft")}
        >
          <dt className="text-[0.9rem] text-muted">{it.k}</dt>
          <dd className="tabular text-right text-[0.9rem] font-medium text-ink">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Section({
  id,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: "light" | "ink" | "wash";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        tone === "ink" && "bg-ink text-white",
        tone === "wash" && "bg-accent-3",
        id && "scroll-mt-32",
        className,
      )}
    >
      <div className="page">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  tone?: "light" | "ink";
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className={cn("eyebrow", tone === "ink" && "on-ink")}>{eyebrow}</p>
      )}
      <h2 className={cn("font-display text-title font-semibold", eyebrow && "mt-3")}>{title}</h2>
      {lead && (
        <p className={cn("mt-4 text-lg leading-relaxed", tone === "ink" ? "text-white/65" : "text-muted")}>{lead}</p>
      )}
    </div>
  );
}

/**
 * Numbered rows. The workhorse layout for "here is what it does": an index, a title and
 * a line of body, separated by hairlines rather than boxed into cards.
 */
export function NumberedRows({
  items,
  tone = "light",
}: {
  items: readonly { title: string; body: string }[];
  tone?: "light" | "ink";
}) {
  return (
    <ol className="mt-12 border-t border-line">
      {items.map((it, i) => (
        <li
          key={it.title}
          className={cn(
            "grid gap-2 border-b py-6 sm:grid-cols-[4rem_1fr_1.4fr] sm:items-baseline sm:gap-8 sm:py-7",
            tone === "ink" ? "border-white/10" : "border-line",
          )}
        >
          <span className={cn("tabular text-sm", tone === "ink" ? "text-white/35" : "text-faint")}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-lg font-semibold sm:text-xl">{it.title}</h3>
          <p className={cn("text-[0.95rem] leading-relaxed", tone === "ink" ? "text-white/60" : "text-muted")}>
            {it.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** A plain bordered card. Kept boxy and hairline-thin, never a coloured left edge. */
export function Card({
  className,
  children,
  tone = "light",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "light" | "ink";
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border p-6 transition-shadow duration-300 ease-signal",
        tone === "ink" ? "border-white/10 bg-white/[0.03]" : "border-line bg-surface shadow-soft hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Four numbers on a hairline rule. */
export function StatStrip({ items }: { items: readonly { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="bg-surface px-5 py-7">
          <div className="font-display tabular text-2xl font-semibold text-ink sm:text-3xl">{s.value}</div>
          <div className="mt-2 text-[0.85rem] leading-snug text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Closing band. One primary action, one quiet one, on the ink field. */
export function CtaBand({
  title,
  lead,
  primary = { label: "Make a test call", href: "/test-call" },
  secondary = { label: "Book a demo", href: "/demo" },
}: {
  title: string;
  lead: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="page pb-24 pt-8">
      <div className="rounded-[var(--radius-lg)] bg-ink px-8 py-14 text-white sm:px-14 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-title font-semibold">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/65">{lead}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={primary.href}
              className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-accent px-6 font-medium text-accent-contrast transition-transform duration-200 ease-signal hover:-translate-y-0.5"
            >
              {primary.label}
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-white/20 px-6 font-medium text-white transition-colors duration-200 ease-signal hover:border-white/50"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Text link with a travelling arrow. */
export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-accent-ink"
    >
      {children}
      <ArrowUpRight
        size={15}
        weight="bold"
        className="transition-transform duration-200 ease-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
