"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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
 * H6 — Call QA & analytics. Headline and a small grader you can poke on the dark
 * field, then the console render straddling the edge: its top half on the dark
 * section with a glowing frame, its bottom half over the light page that follows.
 */
export function CallQA() {
  return (
    <section className="relative overflow-x-clip">
      <div className="relative bg-ink pt-24 text-white sm:pt-32">
        {/* flow-root keeps the console's negative margin from collapsing through to the section */}
        <div className="page flow-root">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_minmax(0,0.8fr)] lg:items-end lg:gap-16">
            <ScrollReveal className="max-w-3xl">
              <p className="eyebrow text-accent-soft">
                Call QA &amp; analytics
              </p>
              <h2 className="font-display mt-3 text-display font-semibold">Every call is graded before you ever hear it.</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <Grader />
            </ScrollReveal>
          </div>

          {/* pulls the dark field up to its own middle: half of its 2000x1128 height, from its width */}
          <div className="relative mx-auto mt-8 w-full max-w-[1120px] mb-[calc(min(1120px,100%)*-0.282)] sm:mt-10">
            <ConsoleShot />
            <Signals />
          </div>
        </div>
      </div>

      {/* room on the light page for the half of the console that hangs below the dark field */}
      <div className="page">
        <div aria-hidden className="mx-auto w-full max-w-[1120px] aspect-[2000/564]" />
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

/** The render, inside a frame that glows on its lower half. */
function ConsoleShot() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1, ease: EASE }}
      className="console-glow relative rounded-[24px]"
    >
      <div aria-hidden className="glow-layer" />
      <img
        src="/generated/qa-console.webp"
        width={2000}
        height={1128}
        alt="Tring Tring event console for Mehta Sangeet Night: calls made, calls received, RSVP yes and live now up top, event activity over the evening, the RSVP, reminder, directions, feedback and helpline campaigns, and call outcomes, with a live customer call and transcript on either side"
        className="themed-shot relative block h-auto w-full rounded-[24px]"
        loading="lazy"
      />
    </motion.div>
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
