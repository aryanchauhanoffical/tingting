import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { RevealGroup, RevealItem } from "@/components/motion/ScrollReveal";
import { GradientOrb } from "@/components/motion/GradientOrb";
import { STATS } from "@/lib/content";

export function StatBand() {
  return (
    <section className="page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-ink px-6 py-12 text-white sm:px-12">
        <GradientOrb className="right-[-6%] top-[-30%] h-[420px] w-[420px]" intensity={0.5} />
        <GradientOrb className="left-[10%] bottom-[-60%] h-[360px] w-[360px]" intensity={0.22} />

        <RevealGroup className="relative grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label}>
              <div className="flex flex-col gap-3">
                <StatViz kind={s.kind} />
                <div className="font-display text-[2.75rem] font-semibold leading-none tracking-tight">
                  <AnimatedCounter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p className="text-sm leading-snug text-white/60">{s.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/** Tiny bespoke micro-visualisation per stat. */
function StatViz({ kind }: { kind: "latency" | "globe" | "throughput" | "qa" }) {
  const stroke = "var(--color-accent)";
  if (kind === "latency") {
    return (
      <svg viewBox="0 0 60 24" className="h-6 w-16" fill="none" aria-hidden>
        <path d="M0 12 H20 l4 -9 4 18 4 -14 3 5 H60" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "globe") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.4" />
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke={stroke} strokeWidth="1.4" />
        <line x1="3" y1="12" x2="21" y2="12" stroke={stroke} strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "throughput") {
    return (
      <svg viewBox="0 0 60 24" className="h-6 w-16" fill="none" aria-hidden>
        {[4, 12, 20, 28, 36, 44, 52].map((x, i) => (
          <rect key={x} x={x} y={12 - (i % 3) * 3 - 3} width="3" height={(i % 3) * 6 + 8} rx="1.5" fill={stroke} opacity={0.4 + (i % 3) * 0.2} />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2.4" />
      <path d="M12 3 a9 9 0 0 1 8.5 12" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
