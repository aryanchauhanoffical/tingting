"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowDownLeft, Check } from "@phosphor-icons/react";
import { CAPABILITY } from "@/lib/content";
import { CallFlow } from "./CallFlow";

type Mode = "outbound" | "inbound";
const EASE = [0.16, 1, 0.3, 1] as const;

export function InboundOutbound() {
  const [mode, setMode] = useState<Mode>("outbound");
  const reduce = useReducedMotion();
  const data = CAPABILITY[mode];
  const out = mode === "outbound";
  // copy slides in from the side the calls come from
  const dx = out ? -28 : 28;

  return (
    <section className="page py-20 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="font-display max-w-xl text-display font-semibold">
          One agent, both directions of the call.
        </h2>

        {/* segmented toggle */}
        <div role="tablist" aria-label="Call direction" className="relative inline-flex rounded-[16px] border border-line bg-surface p-1 shadow-soft">
          {(["outbound", "inbound"] as Mode[]).map((m) => {
            const on = mode === m;
            const Arrow = m === "outbound" ? ArrowUpRight : ArrowDownLeft;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={on}
                onClick={() => setMode(m)}
                className="relative z-10 inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-medium capitalize"
                style={{ color: on ? "#fff" : "var(--color-muted)" }}
              >
                {on && (
                  <motion.span
                    layoutId="io-pill"
                    className="absolute inset-0 -z-10 rounded-[12px] bg-ink shadow-[0_8px_24px_rgb(var(--accent-rgb)/0.28)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.span
                  animate={on && !reduce ? { rotate: [0, -12, 0], scale: [1, 1.25, 1] } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={on ? "text-accent-soft" : ""}
                >
                  <Arrow weight="bold" size={14} />
                </motion.span>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        {/* copy panel */}
        <div className="relative min-h-[18rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial="hide"
              animate="show"
              exit="gone"
              variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.05 } } }}
            >
              <motion.span
                variants={{
                  hide: { opacity: 0, scale: 0.8, x: dx },
                  show: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
                  gone: { opacity: 0, x: -dx, transition: { duration: 0.2 } },
                }}
                className="inline-flex items-center gap-2 rounded-[10px] bg-accent-2 px-3 py-1 text-sm font-medium text-accent-ink"
              >
                {out ? <ArrowUpRight weight="bold" size={15} /> : <ArrowDownLeft weight="bold" size={15} />}
                {data.title}
              </motion.span>

              {/* the lead lands word by word, out of a blur */}
              <p className="font-display mt-5 text-title font-semibold">
                {data.lead.split(" ").map((w, n) => (
                  <motion.span
                    key={n}
                    className="inline-block whitespace-pre"
                    variants={{
                      hide: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
                      show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
                      gone: { opacity: 0, y: "-0.3em", filter: "blur(8px)", transition: { duration: 0.2 } },
                    }}
                  >
                    {w}{" "}
                  </motion.span>
                ))}
              </p>

              <ul className="mt-7 flex flex-col gap-3">
                {data.points.map((p) => (
                  <motion.li
                    key={p}
                    variants={{
                      hide: { opacity: 0, x: dx },
                      show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
                      gone: { opacity: 0, x: -dx, transition: { duration: 0.18 } },
                    }}
                    className="group flex items-start gap-3 text-[1.02rem] text-ink/80"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] bg-accent text-accent-contrast transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                      <Check weight="bold" size={12} />
                    </span>
                    {p}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* visual panel: the switchboard, the agent flies across when the direction flips */}
        <div className="relative">
          <div aria-hidden className="switchboard-aura absolute -inset-6 rounded-[40px]" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-ink shadow-float ring-1 ring-white/5">
            <CallFlow mode={mode} />
          </div>
        </div>
      </div>
    </section>
  );
}
