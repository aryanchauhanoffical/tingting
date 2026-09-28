"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIALS } from "@/lib/content";

/**
 * H10 — Testimonials. The active quote "types itself" like a transcript, the
 * metric sits alongside. Auto-advances; pauses under reduced motion.
 */
export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  const active = TESTIMONIALS[idx];

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="page py-20 sm:py-28">
      <div className="grid gap-10 rounded-[var(--radius-lg)] border border-line bg-surface p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-[1.75rem]">
                {reduce ? active.quote : <Typed text={active.quote} key={active.quote} />}
              </p>
              <footer className="mt-6 text-sm text-muted">
                <span className="font-medium text-ink">{active.name}</span>, {active.role} at {active.company}
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? 28 : 10,
                  background: i === idx ? "var(--color-accent)" : "var(--color-line)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="font-display text-6xl font-semibold text-accent">{active.metric}</div>
              <p className="mt-2 text-muted">{active.metricLabel}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Typed({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="ml-0.5 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-accent" />}
    </>
  );
}
