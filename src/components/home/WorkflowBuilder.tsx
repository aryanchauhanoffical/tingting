"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight, ChartBar, Check, CloudArrowUp, HandGrabbing, Lightning, Play, Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/* spot: where on the render the feature lives, as % of the image box (left, top, width, height) */
const FEATURES = [
  { icon: Sparkle, title: "No-code canvas", sub: "Design complex call flows visually.", spot: [41.5, 53.2, 20, 8.2] },
  { icon: UploadSimple, title: "Pre-built nodes", sub: "Greetings, logic, tools, handoff and more.", spot: [7.2, 34.6, 19.5, 50.5] },
  { icon: Lightning, title: "Test in real time", sub: "Try, iterate, and go live in minutes.", spot: [47.2, 26.8, 7, 4.4] },
  { icon: ChartBar, title: "Built for scale", sub: "Production-ready for high call volumes.", spot: [75.8, 23, 14.4, 6.2] },
];
const CYCLE = 3200;

/**
 * H7 — Visual agent builder. Copy on the left, the console render on the right, cut to
 * the panel's own hard edge. The feature list walks itself and lights the matching part of the
 * render; the render tilts toward the pointer with a glare that follows it.
 */
export function WorkflowBuilder() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // walk the feature list on its own; hovering one holds it
  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % FEATURES.length), CYCLE);
    return () => clearTimeout(id);
  }, [active, paused, reduce]);

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

          <ul className="mt-8 flex flex-col gap-1" onMouseLeave={() => setPaused(false)}>
            {FEATURES.map((f, i) => {
              const on = i === active;
              return (
                <li key={f.title}>
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group relative flex w-full items-start gap-4 rounded-[16px] px-3 py-2.5 text-left"
                  >
                    {on && (
                      <motion.span
                        layoutId="feature-bg"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-[16px] bg-ink/[0.04]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] transition-[background-color,color,transform] duration-300 ${
                        on ? "scale-105 bg-ink text-white shadow-lift" : "bg-ink/[0.05] text-ink group-hover:-rotate-6"
                      }`}
                    >
                      <f.icon size={20} weight={on ? "fill" : "bold"} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">{f.title}</span>
                      <span className="block text-[0.95rem] text-muted">{f.sub}</span>
                      {/* timer bar for the auto-advance */}
                      <span aria-hidden className="mt-2 block h-[2px] overflow-hidden rounded-full bg-ink/10">
                        {on && !reduce && (
                          <motion.span
                            key={`${i}-${paused}`}
                            className="block h-full origin-left bg-ink"
                            initial={{ scaleX: paused ? 1 : 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: paused ? 0 : CYCLE / 1000, ease: "linear" }}
                          />
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
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

        <ConsoleShot active={active} />
      </div>
    </section>
  );
}

/* hand-off cues around the console, as real chips rather than the ones baked into the render */
const CUES = [
  { icon: HandGrabbing, text: "Drag & connect", pos: "left-[16%] top-[6%]" },
  { icon: Play, text: "Test in real time", pos: "right-[4%] top-[1%]" },
  { icon: CloudArrowUp, text: "Publish instantly", pos: "bottom-[4%] right-[8%]" },
];

/* the console panel's outline inside the render, so everything around it (the white
   backdrop, the baked-in glow and cues) is cut away with a hard edge */
const PANEL = "polygon(0% 24.2%, 94.2% 14.1%, 97.2% 84.9%, 0% 86.3%)";

function ConsoleShot({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 90, damping: 20 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["15%", "85%"]);
  const glare = useMotionTemplate`radial-gradient(35% 35% at ${glareX} ${glareY}, rgb(255 255 255 / 0.14), transparent 70%)`;
  const [l, t, w, h] = FEATURES[active].spot;

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
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="relative [perspective:1400px] lg:-my-10 lg:-mr-[3vw]">
      <motion.div style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        {/* the panel wipes open from its left edge */}
        <motion.div
          initial={reduce ? false : { clipPath: "polygon(0% 24.2%, 0% 24.2%, 0% 86.3%, 0% 86.3%)" }}
          whileInView={{ clipPath: PANEL }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{ clipPath: PANEL }}
          className="builder-panel relative"
        >
          <img
            src="/generated/builder-console.webp"
            width={1960}
            height={1890}
            alt="Tring Tring console: a node canvas with Start call, Greeting, a returning-caller condition, Look up order, Human handoff and End call nodes connected in a flow"
            className="builder-shot block h-auto w-full"
            loading="lazy"
          />
          {!reduce && (
            <>
              <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0" />
              <div aria-hidden className="builder-scan pointer-events-none absolute inset-0" />
            </>
          )}
          {/* the feature on the left, lit on the render */}
          <motion.span
            aria-hidden
            className="hotspot pointer-events-none absolute rounded-[10px]"
            initial={false}
            animate={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
          />
        </motion.div>

        {CUES.map((c, i) => (
          <motion.span
            key={c.text}
            aria-hidden
            className={`absolute hidden items-center gap-2 rounded-[10px] bg-ink px-3.5 py-2 text-sm font-medium text-white shadow-lift sm:inline-flex ${c.pos}`}
            style={{ transform: "translateZ(40px)" }}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="inline-flex items-center gap-2"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              <c.icon size={15} weight="bold" />
              {c.text}
            </motion.span>
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
