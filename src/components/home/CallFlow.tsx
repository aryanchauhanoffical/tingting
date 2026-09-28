"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { PhoneIncoming, PhoneOutgoing, Waveform as WaveIcon } from "@phosphor-icons/react";

type Mode = "outbound" | "inbound";

const LABELS: Record<Mode, string[]> = {
  outbound: ["Lead qualified", "Callback set", "Voicemail left", "Demo booked", "Reminder sent", "Survey done"],
  inbound: ["Order status", "Reschedule", "Billing question", "Opening hours", "Returns", "New booking"],
};

// geometry in a 100 x 75 box (the panel is 4:3, so percent maps 1:1)
const AGENT = { x: 20, y: 37.5 };
const CONTACT_X = 66;
const YS = [9, 20.4, 31.8, 43.2, 54.6, 66];

/**
 * Animated call map for the inbound / outbound toggle. One agent node, six
 * contacts, and a pulse on every line: pulses leave the agent when dialing out
 * and arrive at it when answering. The lit contact steps down the list.
 */
export function CallFlow({ mode }: { mode: Mode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [active, setActive] = useState(0);
  const out = mode === "outbound";
  const Icon = out ? PhoneOutgoing : PhoneIncoming;

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % YS.length), 1100);
    return () => clearInterval(id);
  }, [reduce, inView]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={out ? "Outbound: one agent calling out to many contacts" : "Inbound: many callers reaching one agent"}
      className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-[size:22px_22px]"
    >
      <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        {YS.map((y, i) => {
          const d = `M${AGENT.x} ${AGENT.y} C ${AGENT.x + 24} ${AGENT.y}, ${CONTACT_X - 24} ${y}, ${CONTACT_X} ${y}`;
          return (
            <g key={i}>
              <path d={d} stroke="var(--color-line)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              {!reduce && inView && (
                <motion.path
                  key={mode}
                  d={d}
                  pathLength={1}
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="0.16 1"
                  initial={{ strokeDashoffset: out ? 0.16 : -1 }}
                  animate={{ strokeDashoffset: out ? -1 : 0.16 }}
                  transition={{ duration: 1.7, ease: "linear", repeat: Infinity, delay: i * 0.28, repeatDelay: 0.5 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* agent */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${AGENT.x}%`, top: `${(AGENT.y / 75) * 100}%` }}
      >
        <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-ink text-white shadow-lift sm:h-20 sm:w-20">
          {!reduce && inView && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-2xl border-2 border-accent"
              style={{ animation: "ripple 2.2s var(--ease-signal) infinite" }}
            />
          )}
          <WaveIcon weight="bold" className="h-7 w-7 sm:h-8 sm:w-8" />
        </span>
        <p className="tabular absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.14em] text-muted">
          {out ? "Agent dialing" : "Agent answering"}
        </p>
      </div>

      {/* contacts */}
      {YS.map((y, i) => {
        const on = i === active;
        return (
          <div
            key={i}
            className="absolute flex -translate-y-1/2 items-center gap-3"
            style={{ left: `${CONTACT_X}%`, top: `${(y / 75) * 100}%` }}
          >
            <span
              className={`-ml-4 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border transition-[background,color,border-color,transform] duration-300 sm:-ml-[18px] sm:h-9 sm:w-9 ${
                on ? "scale-110 border-accent bg-accent text-accent-contrast" : "border-line bg-surface text-muted"
              }`}
            >
              <Icon weight="bold" size={15} />
            </span>
            <span
              className={`hidden whitespace-nowrap text-sm transition-colors duration-300 sm:block ${
                on ? "font-medium text-ink" : "text-faint"
              }`}
            >
              {LABELS[mode][i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
