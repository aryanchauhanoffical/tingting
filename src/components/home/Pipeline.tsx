"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Microphone, Brain, Database, SpeakerHigh, ShieldCheck, CheckCircle } from "@phosphor-icons/react";
import { PIPELINE } from "@/lib/content";

const ICONS: Record<string, React.ElementType> = {
  microphone: Microphone,
  brain: Brain,
  database: Database,
  speaker: SpeakerHigh,
  shield: ShieldCheck,
  check: CheckCircle,
};

/**
 * H4 — "How it works". The signature scroll section: a call travels through the
 * system stage by stage. Vertical scroll drives a horizontal pan (pinned) with a
 * signal node running along a drawing connector. Reduced motion -> vertical list.
 */
export function Pipeline() {
  const reduce = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.0005 });
  const x = useTransform(progress, [0, 1], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - track.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (reduce) {
    return (
      <section id="how" className="page py-20">
        <PipelineHeader />
        <ol className="mt-10 grid gap-4">
          {PIPELINE.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.key} className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                <span className="tabular text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-2 text-accent-ink">
                  <Icon size={20} weight="duotone" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm text-muted">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    );
  }

  return (
    <section id="how" ref={outerRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="page">
          <PipelineHeader />
        </div>

        {/* horizontal track */}
        <div ref={trackRef} className="mt-10 overflow-hidden">
          <motion.div style={{ x }} className="flex w-max items-stretch gap-5 px-[max(1.25rem,calc((100vw-1400px)/2+1.25rem))]">
            {/* connector under cards */}
            {PIPELINE.map((s, i) => (
              <StageCard key={s.key} stage={s} index={i} total={PIPELINE.length} progress={progress} />
            ))}
          </motion.div>
        </div>

        <div className="page mt-8">
          <ProgressRail progress={progress} count={PIPELINE.length} />
        </div>
      </div>
    </section>
  );
}

function PipelineHeader() {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">How it works</p>
      <h2 className="font-display mt-3 text-display font-semibold">
        Watch one call travel through the machine.
      </h2>
      <p className="mt-4 max-w-lg text-lg text-muted">
        From the first hello to a booked outcome, every stage happens in the time it takes to breathe.
      </p>
    </div>
  );
}

function StageCard({
  stage,
  index,
  total,
  progress,
}: {
  stage: (typeof PIPELINE)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const Icon = ICONS[stage.icon];
  const [active, setActive] = useState(index === 0);
  const center = (index + 0.5) / total;

  useMotionValueEvent(progress, "change", (p) => {
    const on = Math.abs(p - center) < 0.5 / total + 0.06;
    setActive(on);
  });

  return (
    <div className="relative w-[80vw] shrink-0 sm:w-[420px]">
      {/* connector segment */}
      {index < total - 1 && (
        <div aria-hidden className="absolute left-1/2 top-[52px] z-0 h-[2px] w-full">
          <div className="h-full w-full bg-line" />
          <motion.div
            className="absolute inset-0 origin-left bg-accent"
            style={{ scaleX: active ? 1 : 0 }}
            animate={{ scaleX: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
        </div>
      )}

      <motion.div
        data-active={active || undefined}
        animate={{
          y: active ? -4 : 0,
          boxShadow: active ? "0 20px 50px rgba(43,43,90,0.14)" : "0 1px 2px rgba(11,11,15,0.04)",
        }}
        transition={{ duration: 0.4 }}
        className="stage-card relative z-10 h-full rounded-[var(--radius-lg)] border bg-surface p-7"
      >
        <div className="flex items-center justify-between">
          {/* colour is left to CSS: Motion cannot tween a value that is itself a var() */}
          <span className="stage-icon grid h-14 w-14 place-items-center rounded-2xl">
            <Icon size={26} weight="duotone" />
          </span>
          <span className="tabular text-sm text-faint">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <h3 className="font-display mt-6 text-2xl font-semibold">{stage.title}</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{stage.body}</p>
      </motion.div>
    </div>
  );
}

function ProgressRail({ progress, count }: { progress: MotionValue<number>; count: number }) {
  const width = useTransform(progress, [0, 1], ["8%", "100%"]);
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line">
        <motion.div style={{ width }} className="absolute inset-y-0 left-0 rounded-full bg-accent" />
      </div>
      <span className="tabular text-xs text-faint">{count} stages</span>
    </div>
  );
}
