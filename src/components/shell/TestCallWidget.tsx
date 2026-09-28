"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Phone, PhoneCall, CheckCircle } from "@phosphor-icons/react";
import { Waveform } from "@/components/brand/Waveform";
import { cn } from "@/lib/utils";

type Status = "idle" | "dialing" | "connected" | "done";

/**
 * Mocked live test-call widget. Real flow, fake telephony:
 * idle -> dialing (ringing ripple) -> connected (waveform) -> done (checkmark).
 * Used in H12 and /demo. Honors reduced motion (skips the theatrics, keeps states).
 */
export function TestCallWidget({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");
  const reduce = useReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const valid = phone.replace(/\D/g, "").length >= 10;

  const start = () => {
    if (!valid || status === "dialing" || status === "connected") return;
    setStatus("dialing");
    const d = reduce ? 1 : 2;
    timers.current.push(setTimeout(() => setStatus("connected"), d * 900));
    timers.current.push(setTimeout(() => setStatus("done"), d * 4200));
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setStatus("idle");
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-float sm:p-8",
        className,
      )}
    >
      {/* ringing ripple */}
      <AnimatePresence>
        {status === "dialing" && !reduce && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            {[0, 0.6, 1.2].map((delay) => (
              <span
                key={delay}
                className="absolute h-40 w-40 rounded-full border border-accent/40"
                style={{ animation: `ripple 1.8s ${delay}s ease-out infinite` }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence mode="wait">
          {(status === "idle" || status === "dialing") && (
            <motion.div
              key="input"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <label htmlFor="tc-phone" className="mb-2 block text-sm font-medium text-muted">
                Your phone number
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="tc-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 (312) 847 1928"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && start()}
                  disabled={status === "dialing"}
                  className="h-13 flex-1 rounded-pill border border-line bg-bg px-5 text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
                  style={{ height: "3.25rem" }}
                />
                <button
                  onClick={start}
                  disabled={!valid || status === "dialing"}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-pill bg-ink px-6 font-medium text-white transition-colors duration-200 ease-signal enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ height: "3.25rem" }}
                >
                  {status === "dialing" ? (
                    <>
                      <PhoneCall weight="fill" className="animate-pulse" size={18} /> Ringing
                    </>
                  ) : (
                    <>
                      <Phone weight="fill" size={18} /> Call me now
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-faint">
                A Tring Tring agent calls you in seconds. No signup, one call, on us.
              </p>
            </motion.div>
          )}

          {status === "connected" && (
            <motion.div
              key="connected"
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 py-2 text-center"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-accent-ink">
                <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
                Connected
              </span>
              <Waveform height={72} bars={40} active className="max-w-md" />
              <p className="text-sm text-muted">Say hello. The agent is listening.</p>
            </motion.div>
          )}

          {status === "done" && (
            <motion.div
              key="done"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 py-4 text-center"
            >
              <CheckCircle weight="fill" size={40} className="text-accent" />
              <p className="font-display text-xl font-semibold">That is Tring Tring.</p>
              <p className="max-w-sm text-sm text-muted">
                Every second of that call was transcribed, scored, and logged. Ready to put it on your numbers?
              </p>
              <button onClick={reset} className="mt-1 text-sm font-medium text-accent-ink underline-offset-4 hover:underline">
                Try another call
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
