"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Phone } from "@phosphor-icons/react";
import type { INDUSTRIES } from "@/lib/content";

type Industry = (typeof INDUSTRIES)[number];

const BARS = 34;

/**
 * The visual of an industry card: a call console shot at close range, tilted a
 * few degrees and cropped by the frame, the way product shots sit in a case
 * study. One caller turn, one agent turn, then the line the agent closes with is
 * typed out (in view, and again on hover) over a small equalizer.
 */
export function IndustryScene({ ind, seed, inView, hovered }: { ind: Industry; seed: number; inView: boolean; hovered: boolean }) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? ind.line : "");
  const done = typed.length >= ind.line.length;

  useEffect(() => {
    if (reduce) {
      setTyped(ind.line);
      return;
    }
    if (!inView) return;
    let n = 0;
    setTyped("");
    const id = setInterval(() => {
      n++;
      setTyped(ind.line.slice(0, n));
      if (n >= ind.line.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
    // hover replays the line
  }, [inView, hovered, ind.line, reduce]);

  const initials = ind.caller
    .split(" ")
    .map((s) => s[0])
    .join("")
    .replace(".", "");

  return (
    <div className="relative aspect-[4/3.4] overflow-hidden bg-[#050507]">
      {/* plain black field: a faint dot grid and a slow beam of white light crossing it */}
      <div aria-hidden className="scene-grid absolute inset-0" />
      {!reduce && <div aria-hidden className="scene-beam absolute inset-0" />}

      <div
        className={`absolute top-[14%] left-[9%] w-[128%] origin-top-left transition-transform duration-[900ms] ease-[var(--ease-signal)] ${
          hovered && !reduce ? "-translate-x-[1%] -translate-y-[2%] rotate-[-3.5deg]" : "rotate-[-4deg]"
        }`}
      >
        <div className="rounded-[24px] bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-9">
          {/* console header */}
          <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-base sm:h-14 sm:w-14 sm:text-lg font-semibold text-white">
                {initials}
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-ink sm:text-xl">{ind.caller}</p>
                <p className="text-sm text-muted sm:text-base">Incoming · {ind.name}</p>
              </div>
            </div>
            <span className="tabular inline-flex items-center gap-2 text-base text-muted">
              <span aria-hidden className="h-2 w-2 rounded-full bg-accent pulse-dot" />
              00:{String(30 + seed * 7).padStart(2, "0")}
            </span>
          </div>

          {/* transcript */}
          <ul className="mt-5 flex flex-col gap-3 sm:mt-7 sm:gap-4">
            {ind.turns.map((t, i) => (
              <li key={i} className={`flex ${t.who === "agent" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[78%] rounded-[20px] px-4 py-3 text-base leading-snug sm:px-6 sm:py-4 sm:text-[1.2rem] ${
                    t.who === "agent" ? "rounded-br-[6px] bg-ink text-white" : "rounded-bl-[6px] bg-ink/[0.05] text-ink"
                  }`}
                >
                  {t.text}
                </p>
              </li>
            ))}
          </ul>

          {/* the agent's voice while it closes the call */}
          <div aria-hidden className="mt-5 flex h-7 items-center gap-[3px] sm:mt-7 sm:h-8 sm:gap-[4px]">
            {Array.from({ length: BARS }, (_, i) => {
              // deterministic per-industry envelope so each console has its own shape
              const env = 0.25 + 0.75 * Math.abs(Math.sin(i * (0.3 + seed * 0.05) + seed * 1.3));
              return (
                <span
                  key={i}
                  suppressHydrationWarning
                  className={`eq-bar w-[4px] origin-center rounded-full transition-colors duration-300 ${
                    hovered ? "bg-ink" : "bg-ink/25"
                  }`}
                  style={{
                    height: `${Math.round(env * 100)}%`,
                    animationDuration: `${hovered ? 0.7 : 1.25}s`,
                    animationDelay: `${(-((i * 0.137 + seed * 0.31) % 1.25)).toFixed(3)}s`,
                    animationPlayState: inView && !reduce ? "running" : "paused",
                  }}
                />
              );
            })}
          </div>

          {/* the outcome, typed */}
          <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4">
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                done ? "bg-good text-white" : "bg-ink text-white"
              }`}
            >
              {done ? <Check size={22} weight="bold" /> : <Phone size={22} weight="fill" />}
            </span>
            <p className="min-h-[1.5em] text-base font-medium text-ink sm:text-[1.2rem]">
              {typed}
              {!done && <span aria-hidden className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current" />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
