"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Lightning, LockKey, Waveform } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { COMMITMENTS } from "@/lib/content";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const ICONS: Record<string, React.ElementType> = {
  lightning: Lightning,
  lockkey: LockKey,
  waveform: Waveform,
};

/** Panel/button fill per slide. Red is the through-line: it opens the set and its
 * glyph colour never changes, the other two only ever cover one slide each. */
const FILL: Record<string, string> = {
  red: "var(--color-accent)",
  navy: "var(--color-navy)",
  terracotta: "var(--color-terracotta)",
};

/**
 * H11b — What the product holds itself to, one claim per slide. A coloured icon
 * panel and a white card that swap together; arrows and dots step through them.
 */
export function Commitments() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const item = COMMITMENTS[i];
  const fill = FILL[item.color];
  const Icon = ICONS[item.icon];

  const go = (n: number) => setI((n + COMMITMENTS.length) % COMMITMENTS.length);

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
            Built to earn the trust a phone call needs. This is what we hold the product to, on every call, not
            just the ones you happen to review.
          </p>
          <Button href="/security" variant="outline" size="lg" className="mt-6 border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5">
            Learn more
          </Button>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
          <div className="grid items-center gap-0 sm:grid-cols-[1fr_1.15fr]">
            {/* icon panel */}
            <div
              className="relative aspect-[4/3] w-full max-w-md justify-self-center overflow-hidden rounded-[28px] sm:aspect-auto sm:h-[26rem] sm:max-w-none sm:justify-self-end"
              style={{ backgroundColor: fill }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.color}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 grid place-items-center"
                >
                  <Icon size={96} weight="duotone" className="text-white/90" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* card */}
            <div className="relative z-10 -mt-10 w-full max-w-lg justify-self-center rounded-[28px] bg-white px-7 py-9 shadow-float sm:-ml-14 sm:mt-0 sm:justify-self-start sm:px-10 sm:py-11">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.headline}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="eyebrow" style={{ color: fill }}>
                    Commitment to
                  </p>
                  <h3 className="font-display mt-2 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold uppercase leading-[1.08] tracking-[-0.01em]" style={{ color: fill }}>
                    {item.headline}
                  </h3>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">{item.body}</p>
                  <Link
                    href="/security"
                    style={{ backgroundColor: fill }}
                    className="group mt-6 inline-flex h-11 items-center gap-2 rounded-pill px-5 text-[0.95rem] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Learn more
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* arrows */}
          <button
            type="button"
            aria-label="Previous commitment"
            onClick={() => go(i - 1)}
            className="absolute top-1/2 left-0 hidden h-11 w-11 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/40 hover:text-white lg:flex"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Next commitment"
            onClick={() => go(i + 1)}
            className="absolute top-1/2 right-0 hidden h-11 w-11 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/40 hover:text-white lg:flex"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>

        {/* dots */}
        <div className="mt-10 flex justify-center gap-2 sm:mt-12">
          {COMMITMENTS.map((c, n) => (
            <button
              key={c.color}
              type="button"
              aria-label={`Show commitment to ${c.eyebrow.toLowerCase()}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all duration-300 ${n === i ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
