"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, PhoneIncoming, PhoneOutgoing } from "@phosphor-icons/react";

type Mode = "outbound" | "inbound";

const CONTACTS: Record<Mode, { who: string; label: string }[]> = {
  outbound: [
    { who: "AK", label: "Lead qualified" },
    { who: "RM", label: "Callback set" },
    { who: "SJ", label: "Voicemail left" },
    { who: "PN", label: "Demo booked" },
    { who: "DV", label: "Reminder sent" },
    { who: "LT", label: "Survey done" },
  ],
  inbound: [
    { who: "MR", label: "Order status" },
    { who: "KS", label: "Reschedule" },
    { who: "AB", label: "Billing question" },
    { who: "NH", label: "Opening hours" },
    { who: "EC", label: "Returns" },
    { who: "TG", label: "New booking" },
  ],
};

// geometry in a 100 x 75 box (the stage is 4:3, so x maps to % of width 1:1)
const YS = [12, 22.2, 32.4, 42.6, 52.8, 63];
const AGENT_Y = 37.5;
const SPRING = { type: "spring", stiffness: 70, damping: 16, mass: 0.9 } as const;

/** Where everything sits for a direction. Outbound: agent left, contacts right. Inbound: mirrored. */
function layout(mode: Mode, compact: boolean, iconPct: number) {
  const cardW = compact ? iconPct : 33;
  if (mode === "outbound") {
    const cardX = compact ? 100 - iconPct - 7 : 61;
    return { agentX: compact ? 24 : 21, cardX, cardW, wireX: cardX };
  }
  const cardX = compact ? 7 : 5;
  return { agentX: compact ? 76 : 79, cardX, cardW, wireX: cardX + cardW };
}

const wire = (ax: number, cx: number, y: number) => {
  const pull = (cx - ax) * 0.55;
  return `M${ax} ${AGENT_Y} C ${ax + pull} ${AGENT_Y}, ${cx - pull} ${y}, ${cx} ${y}`;
};

/**
 * The inbound / outbound switchboard. One agent, six lines. Signal comets leave the
 * agent when it dials out and pour into it when it answers; flipping the toggle flies
 * the agent across the stage and every wire re-routes behind it. The live line steps
 * down the list, the ones before it settle into a done state.
 */
export function CallFlow({ mode }: { mode: Mode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [active, setActive] = useState(0);
  const [secs, setSecs] = useState(0);
  const [width, setWidth] = useState(640);
  const out = mode === "outbound";
  const Icon = out ? PhoneOutgoing : PhoneIncoming;
  const live = !reduce && inView;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // the live line walks down the list, and restarts from the top when the direction flips
  useEffect(() => {
    setActive(0);
    setSecs(0);
  }, [mode]);
  useEffect(() => {
    if (!live) return;
    const step = setInterval(() => {
      setActive((a) => (a + 1) % YS.length);
      setSecs(0);
    }, 1900);
    const tick = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => {
      clearInterval(step);
      clearInterval(tick);
    };
  }, [live, mode]);

  const compact = width < 560;
  const iconPct = (30 / width) * 100;
  const g = layout(mode, compact, iconPct);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={out ? "Outbound: one agent calling out to many contacts" : "Inbound: many callers reaching one agent"}
      className="switchboard absolute inset-0 overflow-hidden"
    >
      {/* dotted floor, lit where the agent stands */}
      <motion.div
        aria-hidden
        className="absolute inset-0 switchboard-grid"
        initial={false}
        animate={{ "--gx": `${g.agentX}%` } as Record<string, string>}
        transition={SPRING}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 h-[140%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full switchboard-halo"
        initial={false}
        animate={{ left: `${g.agentX}%` }}
        transition={SPRING}
      />

      {/* the direction, written huge and faint behind everything, drifting the way the calls go */}
      <AnimatePresence initial={false}>
        <motion.p
          key={mode}
          aria-hidden
          className="switchboard-word font-display pointer-events-none absolute bottom-[-0.18em] left-0 whitespace-nowrap"
          initial={reduce ? false : { x: out ? "-30%" : "30%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={reduce ? undefined : { x: out ? "30%" : "-30%", opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {out ? "Outbound" : "Inbound"}
        </motion.p>
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3.5 sm:px-5 sm:pt-4">
        <span className="tabular inline-flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.16em] text-white/55">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent pulse-dot" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Live · 6 lines
        </span>
        <span className="tabular hidden text-[0.64rem] uppercase tracking-[0.16em] text-white/35 sm:inline">
          {out ? "Agent → contacts" : "Callers → agent"}
        </span>
      </div>

      <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <defs>
          <filter id="sb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        {YS.map((y, i) => {
          const d = wire(g.agentX, g.wireX, y);
          const on = i === active;
          return (
            <g key={i}>
              <motion.path
                initial={false}
                animate={{ d, opacity: on ? 0.55 : 0.16 }}
                transition={{ d: SPRING, opacity: { duration: 0.4 } }}
                stroke={on ? "var(--color-accent)" : "#ffffff"}
                strokeWidth={on ? 1.6 : 1}
                vectorEffect="non-scaling-stroke"
              />
              {live && (
                <>
                  {/* soft tail */}
                  <motion.path
                    initial={{ d }}
                    animate={{ d, strokeDashoffset: out ? [0.3, -1] : [-1, 0.3] }}
                    transition={{ d: SPRING, strokeDashoffset: { duration: 1.6, ease: "easeIn", repeat: Infinity, delay: i * 0.22, repeatDelay: 0.35 } }}
                    pathLength={1}
                    stroke="var(--color-accent)"
                    strokeWidth={0.8}
                    strokeLinecap="round"
                    strokeDasharray="0.3 1"
                    opacity={0.6}
                    filter="url(#sb-glow)"
                  />
                  {/* bright head */}
                  <motion.path
                    initial={{ d }}
                    animate={{ d, strokeDashoffset: out ? [0.04, -1.26] : [-1, 0.3] }}
                    transition={{ d: SPRING, strokeDashoffset: { duration: 1.6, ease: "easeIn", repeat: Infinity, delay: i * 0.22, repeatDelay: 0.35 } }}
                    pathLength={1}
                    stroke="#fff"
                    strokeWidth={0.4}
                    strokeLinecap="round"
                    strokeDasharray="0.04 1.3"
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* agent */}
      <motion.div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${(AGENT_Y / 75) * 100}%` }}
        initial={false}
        animate={{ left: `${g.agentX}%` }}
        transition={SPRING}
      >
        {/* shockwave on every flip */}
        {!reduce && (
          <motion.span
            key={mode}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent"
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 7, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {/* ripples go out when dialing, fold in when answering */}
        {live &&
          [0, 1, 2].map((n) => (
            <span
              key={`${mode}-${n}`}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full border border-accent"
              style={{ animation: `${out ? "ripple-out" : "ripple-in"} 2.4s ${n * 0.8}s var(--ease-signal) infinite` }}
            />
          ))}

        <span className="agent-orb relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full sm:h-24 sm:w-24">
          <svg viewBox="0 0 100 100" className="absolute inset-[-14%] h-[128%] w-[128%]" aria-hidden>
            <circle cx="50" cy="50" r="47" stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="2 5" fill="none" className={live ? "spin-slow" : ""} />
            <circle cx="50" cy="50" r="42" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="20 8 2 8" fill="none" className={live ? "spin-slow-rev" : ""} />
          </svg>
          <span className="flex h-7 items-center gap-[3px] sm:h-8" aria-hidden>
            {[0.5, 0.9, 0.65, 1, 0.55].map((h, n) => (
              <span
                key={n}
                className="eq-bar block w-[3px] rounded-full bg-white"
                style={{ height: `${h * 100}%`, animationDelay: `${n * 0.13}s`, animationPlayState: live ? "running" : "paused" }}
              />
            ))}
          </span>
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={mode}
            className="tabular absolute left-1/2 top-full mt-5 -translate-x-1/2 whitespace-nowrap text-[0.64rem] uppercase tracking-[0.18em] text-white/60"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            {out ? "Agent dialing" : "Agent answering"}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* contacts */}
      {YS.map((y, i) => {
        const on = i === active;
        const done = i < active;
        const c = CONTACTS[mode][i];
        return (
          <motion.div
            key={i}
            className="absolute z-10 -translate-y-1/2"
            style={{ top: `${(y / 75) * 100}%`, width: `${g.cardW}%` }}
            initial={false}
            animate={{ left: `${g.cardX}%` }}
            transition={{ ...SPRING, delay: reduce ? 0 : (out ? i : YS.length - 1 - i) * 0.035 }}
          >
            <div
              className={
                compact
                  ? "relative flex justify-center"
                  : `contact-card relative flex items-center gap-2.5 rounded-[12px] border p-1.5 pr-3 ${on ? "contact-on" : ""}`
              }
            >
              <span
                className={`relative grid shrink-0 place-items-center rounded-[9px] ${compact ? "h-7 w-7" : "h-8 w-8"} text-[0.68rem] font-semibold transition-colors duration-300 ${
                  on ? "bg-accent text-accent-contrast" : done ? "bg-white/[0.08] text-white/70" : "bg-white/[0.05] text-white/40"
                }`}
              >
                {on ? <Icon weight="bold" size={14} /> : done ? <Check weight="bold" size={13} /> : c.who}
                {on && !reduce && (
                  <span aria-hidden className="absolute inset-0 rounded-[9px] border border-accent" style={{ animation: "ring-ping 1.4s var(--ease-signal) infinite" }} />
                )}
              </span>
              {!compact && (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={`${mode}-${i}`}
                    className="min-w-0 flex-1"
                    initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.05 }}
                  >
                    <span className={`block truncate text-[0.82rem] leading-tight transition-colors duration-300 ${on ? "font-medium text-white" : done ? "text-white/70" : "text-white/40"}`}>
                      {c.label}
                    </span>
                    <span className="tabular mt-0.5 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.12em]">
                      {on ? (
                        <>
                          <span className="flex h-2.5 items-end gap-[2px]" aria-hidden>
                            {[0.6, 1, 0.4, 0.8].map((h, n) => (
                              <span key={n} className="eq-bar block w-[2px] rounded-full bg-accent-soft" style={{ height: `${h * 100}%`, animationDelay: `${n * 0.1}s` }} />
                            ))}
                          </span>
                          <span className="text-accent-soft">00:{String(secs + 3).padStart(2, "0")}</span>
                        </>
                      ) : (
                        <span className="text-white/30">{done ? "Done" : out ? "Queued" : "Ringing"}</span>
                      )}
                    </span>
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
