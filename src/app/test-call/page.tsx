"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Phone, PhoneSlash, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { AmbientField } from "@/components/brand/AmbientField";
import { useAccent } from "@/lib/useAccent";

/** `<gvox-orb>` is a custom element registered by /gvox-orb.js — cast to any to skip JSX typing. */
const OrbTag: React.ElementType = "gvox-orb" as unknown as React.ElementType;

type OrbEl = HTMLElement & {
  setLevel?: (v: number) => void;
  detachAudio?: () => void;
};

type Status = "idle" | "dialing" | "connected" | "ended";
type Turn = { who: "agent" | "caller"; text: string };

const CALL: Turn[] = [
  { who: "agent", text: "Hi, this is the Tring Tring demo agent. How can I help today?" },
  { who: "caller", text: "I want to see how you handle a booking." },
  { who: "agent", text: "Happy to. What day works for your demo?" },
  { who: "caller", text: "Thursday afternoon, if you have it." },
  { who: "agent", text: "Thursday at 2:15 is open. Shall I lock it in?" },
  { who: "caller", text: "Yes, please." },
  { who: "agent", text: "Booked. You will get a text confirmation shortly." },
];

const STATUS_LABEL: Record<Status, string> = {
  idle: "Ready",
  dialing: "Dialing",
  connected: "Connected",
  ended: "Call ended",
};

export default function TestCallPage() {
  const accent = useAccent();
  const orbRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");
  const [turn, setTurn] = useState<Turn | null>(null);
  const [seconds, setSeconds] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const valid = phone.replace(/\D/g, "").length >= 10;
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const applyWho = (who: Turn["who"]) => {
    const orb = orbRef.current;
    if (!orb) return;
    if (who === "agent") {
      orb.setAttribute("speaking", "");
      orb.removeAttribute("listening");
    } else {
      orb.setAttribute("listening", "");
      orb.removeAttribute("speaking");
    }
  };

  const clearOrb = () => {
    const orb = orbRef.current as OrbEl | null;
    orb?.removeAttribute("speaking");
    orb?.removeAttribute("listening");
    orb?.setLevel?.(0);
    orb?.detachAudio?.();
  };

  const startCall = () => {
    if (!valid) return;
    setSeconds(0);
    setStatus("dialing");
    timers.current.push(setTimeout(() => setStatus("connected"), reduce ? 900 : 2000));
  };

  const endCall = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    clearOrb();
    setStatus("ended");
  };

  const reset = () => {
    clearOrb();
    setTurn(null);
    setSeconds(0);
    setStatus("idle");
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Drive the orb + transcript during a connected call.
  useEffect(() => {
    if (status !== "connected") return;
    let raf = 0;
    let idx = 0;
    let turnStart = performance.now();
    const TURN_MS = 2600;

    setTurn(CALL[0]);
    applyWho(CALL[0].who);

    const loop = (now: number) => {
      if (now - turnStart > TURN_MS) {
        idx += 1;
        if (idx >= CALL.length) {
          endCall();
          return;
        }
        turnStart = now;
        setTurn(CALL[idx]);
        applyWho(CALL[idx].who);
      }
      const orb = orbRef.current as OrbEl | null;
      if (orb?.setLevel && !reduce) {
        const p = (now - turnStart) / TURN_MS;
        const env = Math.sin(p * Math.PI); // rise + fall across the turn
        const churn = 0.5 + 0.5 * Math.sin(now * 0.02);
        orb.setLevel(Math.max(0, Math.min(1, 0.22 + env * churn * 0.72)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, reduce]);

  const busy = status === "dialing" || status === "connected";

  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-bg">
      <Script src="/gvox-orb.js" strategy="afterInteractive" />

      {/* soft glow behind the orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgb(var(--accent-rgb) / 0.18), transparent 70%)" }}
      />

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" aria-label="Tring Tring home">
          <Logo />
        </Link>
        <Link
          href="/"
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-pill border border-line bg-surface text-ink transition-colors hover:bg-ink/[0.04]"
        >
          <X size={18} />
        </Link>
      </header>

      {/* stage */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        {/* status pill */}
        <span className="mb-5 inline-flex items-center gap-2 rounded-pill border border-line bg-surface/80 px-3.5 py-1.5 text-sm text-muted backdrop-blur">
          <span
            className={`h-2 w-2 rounded-full ${busy ? "bg-accent pulse-dot" : status === "ended" ? "bg-faint" : "bg-emerald-500"}`}
          />
          {STATUS_LABEL[status]}
          {status === "connected" && <span className="tabular text-ink">· {mmss}</span>}
        </span>

        {/* the orb */}
        <OrbTag
          ref={orbRef}
          color={accent}
          speed={busy ? "1.5" : "1"}
          style={{
            width: "min(62vw, 360px)",
            height: "min(62vw, 360px)",
            display: "block",
          }}
        />

        {/* dynamic panel */}
        <div className="mt-6 w-full max-w-md">
          <AnimatePresence mode="wait">
            {(status === "idle" || status === "dialing") && (
              <motion.div
                key="idle"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="font-display text-title font-semibold text-ink">Talk to a Tring Tring agent</h1>
                <p className="mx-auto mt-3 max-w-sm text-muted">
                  Enter your number and the agent calls you back in seconds. No signup, one call, on us.
                </p>
                <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+1 (312) 847 1928"
                    value={phone}
                    disabled={status === "dialing"}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startCall()}
                    className="h-13 flex-1 rounded-pill border border-line bg-surface px-5 text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
                    style={{ height: "3.25rem" }}
                  />
                  <button
                    onClick={startCall}
                    disabled={!valid || status === "dialing"}
                    className="inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-6 font-medium text-white transition-colors duration-200 ease-signal enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ height: "3.25rem" }}
                  >
                    <Phone weight="fill" size={18} />
                    {status === "dialing" ? "Ringing…" : "Call me now"}
                  </button>
                </div>
              </motion.div>
            )}

            {status === "connected" && (
              <motion.div
                key="connected"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="min-h-[3.5rem]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={turn?.text}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-md text-lg leading-snug text-ink"
                    >
                      <span className="mr-2 text-xs uppercase tracking-widest text-accent-ink">
                        {turn?.who === "agent" ? "Agent" : "You"}
                      </span>
                      {turn?.text}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <button
                  onClick={endCall}
                  className="inline-flex items-center gap-2 rounded-pill bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-600"
                >
                  <PhoneSlash weight="fill" size={18} /> End call
                </button>
              </motion.div>
            )}

            {status === "ended" && (
              <motion.div
                key="ended"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-5"
              >
                <CheckCircle weight="fill" size={44} className="text-good" />
                <div>
                  <h1 className="font-display text-title font-semibold">That is Tring Tring.</h1>
                  <p className="mx-auto mt-2 max-w-sm text-muted">
                    The whole call was transcribed, scored, and logged. Ready to put it on your numbers?
                  </p>
                </div>
                <div className="flex items-center gap-6 rounded-[var(--radius-card)] border border-line bg-surface px-6 py-4">
                  <Stat label="Duration" value={mmss} />
                  <span className="h-8 w-px bg-line" />
                  <Stat label="QA score" value="98" tone="good" />
                  <span className="h-8 w-px bg-line" />
                  <Stat label="Flags" value="0" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={reset} className="rounded-pill bg-ink px-6 py-3 font-medium text-white transition-colors hover:bg-accent">
                    Call again
                  </button>
                  <Link href="/#test-call" className="rounded-pill border border-line bg-surface px-6 py-3 font-medium text-ink transition-colors hover:border-ink/30">
                    Book a demo
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {status !== "ended" && (
            <p className="mt-8 inline-flex items-center gap-1.5 text-xs text-faint">
              <ShieldCheck size={13} /> Encrypted, scored live, and never stored without consent.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" }) {
  return (
    <div className="text-center">
      <div className={`font-display text-2xl font-semibold ${tone === "good" ? "text-good" : "text-ink"}`}>{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
