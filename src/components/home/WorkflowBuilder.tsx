"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight, ChartBar, Check, Lightning, Play, Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const FEATURES = [
  { icon: Sparkle, title: "No-code canvas", sub: "Design complex call flows visually." },
  { icon: UploadSimple, title: "Pre-built nodes", sub: "Greetings, logic, tools, handoff and more." },
  { icon: Lightning, title: "Test in real time", sub: "Try, iterate, and go live in minutes." },
  { icon: ChartBar, title: "Built for scale", sub: "Production-ready for high call volumes." },
];

/**
 * H7 — Visual agent builder. Copy on the left, the console render on the right in a
 * framed panel that tilts a few degrees toward the pointer.
 */
export function WorkflowBuilder() {
  return (
    <section className="page py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14">
        <ScrollReveal>
          <h2 className="font-display text-[clamp(2.25rem,3.9vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
            Build the agent by dragging, not coding.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Greeting, conditions, tool calls, and human handoff snap together on a canvas. Change the flow and it is
            live on the next call.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-accent-2 text-accent-ink">
                  <f.icon size={20} weight="bold" />
                </span>
                <div>
                  <p className="font-medium text-ink">{f.title}</p>
                  <p className="text-[0.95rem] text-muted">{f.sub}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/demo" size="lg" className="group">
              Start building
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <Button href="#demo" size="lg" variant="outline">
              <Play size={16} weight="fill" />
              Watch demo
            </Button>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {["No credit card required", "Set up in minutes", "Works with your tools"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check size={14} weight="bold" className="text-accent-ink" />
                {t}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ConsoleShot />
      </div>
    </section>
  );
}

function ConsoleShot() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // the render already carries its own perspective; the pointer only drifts it a few px
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 24 });
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), { stiffness: 90, damping: 24 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="relative lg:-my-10 lg:-mr-[3vw]">
      <motion.img
        src="/generated/builder-console.webp"
        width={1960}
        height={1890}
        alt="Tring Tring console: a node canvas with Start call, Greeting, a returning-caller condition, Look up order, Human handoff and End call nodes connected in a flow, with cues for drag and connect, test in real time and publish instantly"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={reduce ? undefined : { x, y }}
        className="console-shot themed-shot block h-auto w-full"
        loading="lazy"
      />
    </div>
  );
}
