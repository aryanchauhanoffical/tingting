"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react";

/**
 * Questions on hairlines, one open at a time. The marker rotates rather than swapping
 * glyphs, so the control reads as the same object throughout.
 */
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="border-t border-line">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-lg font-semibold text-ink">{it.q}</span>
                <Plus
                  size={18}
                  weight="bold"
                  className={`shrink-0 text-faint transition-transform duration-300 ease-signal ${on ? "rotate-45 text-accent-ink" : ""}`}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 text-[0.98rem] leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
