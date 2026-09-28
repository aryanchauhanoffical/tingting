"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowDownLeft, Check } from "@phosphor-icons/react";
import { CAPABILITY } from "@/lib/content";
import { CallFlow } from "./CallFlow";

type Mode = "outbound" | "inbound";

export function InboundOutbound() {
  const [mode, setMode] = useState<Mode>("outbound");
  const reduce = useReducedMotion();
  const data = CAPABILITY[mode];

  return (
    <section className="page py-20 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="font-display max-w-xl text-display font-semibold">
          One agent, both directions of the call.
        </h2>

        {/* segmented toggle */}
        <div className="relative inline-flex rounded-pill border border-line bg-surface p-1 shadow-soft">
          {(["outbound", "inbound"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative z-10 rounded-pill px-5 py-2 text-sm font-medium capitalize transition-colors"
              style={{ color: mode === m ? "#fff" : "var(--color-muted)" }}
            >
              {mode === m && (
                <motion.span
                  layoutId="io-pill"
                  className="absolute inset-0 -z-10 rounded-pill bg-ink"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
        {/* copy panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="inline-flex items-center gap-2 rounded-pill bg-accent-2 px-3 py-1 text-sm font-medium text-accent-ink">
              {mode === "outbound" ? <ArrowUpRight weight="bold" size={15} /> : <ArrowDownLeft weight="bold" size={15} />}
              {data.title}
            </span>
            <p className="font-display mt-5 text-title font-semibold">{data.lead}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {data.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[1.02rem] text-ink/80">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Check weight="bold" size={12} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* visual panel: live call map, pulses reverse direction with the toggle */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-soft">
          <CallFlow mode={mode} />
        </div>
      </div>
    </section>
  );
}
