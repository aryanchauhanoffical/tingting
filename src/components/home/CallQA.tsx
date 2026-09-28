"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ShieldCheck, Warning, Waveform, TrendUp } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* Three calls the grader just finished: pick one and the scores re-draw */
const CALLS = [
  { name: "Reschedule", scores: [96, 92, 88, 94], flags: "0 hallucinations, 0 interruptions", pass: true },
  { name: "Refund", scores: [93, 88, 91, 90], flags: "0 hallucinations, 1 interruption", pass: true },
  { name: "Complaint", scores: [90, 79, 86, 72], flags: "1 adherence miss, sent for review", pass: false },
];
const METRICS = ["Relevance", "Adherence", "Latency", "Sentiment"];

/**
 * H6 — Call QA & analytics. A dark slab inset from the page edges: headline and a
 * small grader you can poke, then the console render standing up on a spotlight.
 */
export function CallQA() {
  return (
    <section className="relative px-2 sm:px-4">
      <div className="qa-slab relative overflow-hidden rounded-[32px] pb-16 pt-24 text-white sm:rounded-[48px] sm:pb-24 sm:pt-32">
        <div className="page">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_minmax(0,0.8fr)] lg:items-end lg:gap-16">
            <ScrollReveal className="max-w-3xl">
              <p className="eyebrow on-ink">
                Call QA &amp; analytics
              </p>
              <h2 className="font-display mt-3 text-display font-semibold">Every call is graded before you ever hear it.</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <Grader />
            </ScrollReveal>
          </div>

          <div className="relative mx-auto mt-14 w-full max-w-[1120px] sm:mt-20">
            <ConsoleShot />
            <Signals />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pick a call, watch it get scored. */
function Grader() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const call = CALLS[i];

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-white/50">Scored just now</span>
        <div className="flex gap-1 rounded-[12px] bg-white/[0.05] p-1" role="tablist" aria-label="Pick a call">
          {CALLS.map((c, n) => (
            <button
              key={c.name}
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`rounded-[9px] px-3 py-1.5 text-[0.82rem] font-medium transition-colors ${
                n === i ? "bg-white text-ink" : "text-white/60 hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-3.5">
        {METRICS.map((m, n) => {
          const v = call.scores[n];
          return (
            <li key={m} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm">
              <span className="text-white/60">{m}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className={`block h-full rounded-full ${v < 80 ? "bg-amber-400" : "bg-support"}`}
                  initial={false}
                  animate={{ width: `${v}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: n * 0.06 }}
                />
              </span>
              <span className="tabular text-right text-white">{v}</span>
            </li>
          );
        })}
      </ul>

      <div
        className={`mt-5 flex items-center gap-2 rounded-[14px] px-3.5 py-2.5 text-xs transition-colors duration-500 ${
          call.pass ? "bg-support/15 text-support" : "bg-amber-400/10 text-amber-100/90"
        }`}
      >
        {call.pass ? <ShieldCheck weight="fill" size={15} /> : <Warning weight="fill" size={15} />}
        <span>
          {call.pass ? "Passed" : "Needs review"} · {call.flags}
        </span>
      </div>
    </div>
  );
}

/**
 * The render on a spotlight. It starts tipped back on its pedestal and stands up as it
 * scrolls into view; a slow light sweep crosses the glass once it is there.
 */
function ConsoleShot() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const rotateX = useTransform(p, [0, 1], [28, 0]);
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const y = useTransform(p, [0, 1], [60, 0]);
  const glow = useTransform(p, [0.3, 1], [0, 1]);

  return (
    <div ref={ref} className="relative [perspective:1600px]">
      <motion.div aria-hidden style={reduce ? undefined : { opacity: glow }} className="qa-spot absolute inset-x-[5%] bottom-[-8%] top-[20%]" />
      <motion.div
        style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}
        className="relative"
      >
        <img
          src="/generated/qa-console.webp"
          width={2000}
          height={1128}
          alt="Tring Tring event console for Mehta Sangeet Night: calls made, calls received, RSVP yes and live now up top, event activity over the evening, the RSVP, reminder, directions, feedback and helpline campaigns, and call outcomes, with a live customer call and transcript on either side"
          className="qa-shot themed-shot relative block h-auto w-full"
          loading="lazy"
        />
        {!reduce && <div aria-hidden className="qa-sweep qa-shot pointer-events-none absolute inset-0" />}
      </motion.div>
      <motion.div aria-hidden style={reduce ? undefined : { opacity: glow }} className="qa-floor absolute inset-x-[12%] bottom-[3%] h-px" />
    </div>
  );
}

/**
 * Small live readouts pinned around the console, on the dark half. Each one glows in
 * the accent or in green, and the latency one keeps ticking. Wide screens only, the
 * console is the point on a phone.
 */
function Signals() {
  const reduce = useReducedMotion();
  const [ms, setMs] = useState(380);
  const [calls, setCalls] = useState(3);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setMs((v) => Math.max(320, Math.min(440, v + Math.round((Math.random() - 0.5) * 40)))), 1800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <Signal tone="support" className="left-[-3%] top-[-4%]" float={0} onClick={() => setCalls((c) => (c % 5) + 1)}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-support opacity-70 pulse-dot" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-support" />
        </span>
        Live · <span className="tabular">{calls}</span> {calls === 1 ? "call" : "calls"} on this event
      </Signal>

      <Signal tone="accent" className="right-[-2%] top-[-3%]" float={1}>
        <Waveform size={15} weight="bold" />
        Latency <span className="tabular">{ms}</span> ms
      </Signal>

      <Signal tone="support" className="left-[-4%] top-[30%]" float={2}>
        <TrendUp size={15} weight="bold" />
        Sentiment <span className="tabular">94</span>
      </Signal>

      <Signal tone="support" className="right-[-3%] top-[26%]" float={3}>
        <ShieldCheck size={15} weight="fill" />
        <span className="tabular">0</span> hallucinations today
      </Signal>
    </div>
  );
}

function Signal({
  tone,
  className,
  float,
  onClick,
  children,
}: {
  tone: "accent" | "support";
  className: string;
  float: number;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      animate={reduce ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 4.2 + float * 0.5, repeat: Infinity, ease: "easeInOut", delay: float * 0.4 }}
      whileHover={{ scale: 1.04 }}
      className={`signal signal-${tone} pointer-events-auto absolute inline-flex items-center gap-2 ${className}`}
    >
      {children}
    </motion.button>
  );
}
