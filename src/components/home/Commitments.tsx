"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  ChartBar,
  ChartLineUp,
  Globe,
  LockKey,
  Microphone,
  DotsNine,
  Phone,
  ShieldCheck,
  SpeakerHigh,
  User,
  Waveform,
  ListChecks,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { COMMITMENTS } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO = 7000;

type Chip = { icon: React.ElementType; top: string; sub: string; pos: string };

/* The readouts that float around each visual, tied to it by the orbit line */
const CHIPS: Chip[][] = [
  [
    { icon: ChartBar, top: "Answered", sub: "< 400ms", pos: "right-[14%] top-[10%]" },
    { icon: ShieldCheck, top: "Logged", sub: "100%", pos: "right-[13%] bottom-[20%]" },
    { icon: ChartLineUp, top: "Scored", sub: "In real time", pos: "left-[3%] bottom-[18%]" },
  ],
  [
    { icon: LockKey, top: "Encrypted", sub: "In transit, at rest", pos: "right-[14%] top-[10%]" },
    { icon: Globe, top: "Residency", sub: "Your region", pos: "left-[3%] bottom-[18%]" },
    { icon: ListChecks, top: "Audit log", sub: "Every call", pos: "right-[13%] bottom-[20%]" },
  ],
  [
    { icon: Waveform, top: "Six voices", sub: "Warm, not robotic", pos: "right-[14%] top-[10%]" },
    { icon: Globe, top: "Locales", sub: "Indian and US", pos: "left-[3%] bottom-[18%]" },
    { icon: SpeakerHigh, top: "Pacing", sub: "Tuned to talk", pos: "right-[13%] bottom-[20%]" },
  ],
];

/** "Every call, on time" -> ["Every call,", "on time"]; no comma splits before the last two words */
function splitHeadline(h: string): [string, string] {
  const c = h.indexOf(",");
  if (c > -1) return [h.slice(0, c + 1), h.slice(c + 1).trim()];
  const w = h.split(" ");
  return [w.slice(0, -2).join(" "), w.slice(-2).join(" ")];
}

/**
 * H11b — What the product holds itself to, one claim per slide. A glowing red stage
 * with a coded visual (a live call on a phone, a vault, a voice orb) and a white card
 * overlapping it. Slides advance on their own; arrows, dots and swipes step through.
 */
export function Commitments() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [hold, setHold] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const item = COMMITMENTS[i];
  const [lead, tail] = splitHeadline(item.headline);

  const go = (n: number, d = n > i ? 1 : -1) => {
    setDir(d);
    setI((n + COMMITMENTS.length) % COMMITMENTS.length);
  };

  useEffect(() => {
    if (reduce || hold || !inView) return;
    const id = setTimeout(() => go(i + 1, 1), AUTO);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, hold, inView, reduce]);

  return (
    <section ref={ref} className="commit-bg relative overflow-hidden py-20 text-white sm:py-28">
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

        <div
          className="relative mx-auto mt-14 max-w-6xl sm:mt-16 lg:px-16"
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
        >
          <motion.div
            className="grid items-center sm:grid-cols-[1.05fr_1fr]"
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(i + 1, 1);
              else if (info.offset.x > 60) go(i - 1, -1);
            }}
          >
            {/* stage */}
            <div className="commit-stage relative aspect-[4/3.4] w-full overflow-hidden rounded-[32px] sm:aspect-auto sm:h-[30rem]">
              <div aria-hidden className="commit-dots absolute inset-0" />
              <div aria-hidden className="commit-floor absolute inset-x-0 bottom-0 h-1/3" />
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={i}
                  custom={dir}
                  className="absolute inset-0 [perspective:1200px]"
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 80, rotateY: d * -25, scale: 0.9 }),
                    show: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
                    leave: (d: number) => ({ opacity: 0, x: d * -80, rotateY: d * 25, scale: 0.9 }),
                  }}
                  initial={reduce ? false : "enter"}
                  animate="show"
                  exit={reduce ? undefined : "leave"}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Orbit live={!reduce && inView} />
                  <div className="absolute inset-0 grid place-items-center">
                    {i === 0 && <CallPhone live={!reduce && inView} />}
                    {i === 1 && <Vault live={!reduce && inView} />}
                    {i === 2 && <VoiceOrb live={!reduce && inView} />}
                  </div>
                  {CHIPS[i].map((c, n) => (
                    <motion.div
                      key={c.top}
                      className={`commit-chip absolute hidden items-center gap-3 rounded-[14px] px-3.5 py-2.5 sm:flex ${c.pos}`}
                      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.35 + n * 0.12, ease: EASE }}
                    >
                      <motion.span
                        className="flex items-center gap-3"
                        animate={reduce ? undefined : { y: [0, -6, 0] }}
                        transition={{ duration: 3.6 + n * 0.7, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-accent/25 text-white">
                          <c.icon size={18} weight="fill" />
                        </span>
                        <span className="leading-tight">
                          <span className="block text-[0.82rem] text-white/70">{c.top}</span>
                          <span className="block text-[0.95rem] font-semibold text-white">{c.sub}</span>
                        </span>
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* card */}
            <div className="relative z-10 -mt-12 mx-4 rounded-[28px] bg-white px-7 py-9 text-ink shadow-[0_40px_80px_rgba(0,0,0,0.5)] sm:mx-0 sm:mt-0 sm:-ml-16 sm:px-11 sm:py-12">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={i}
                  initial="hide"
                  animate="show"
                  exit="gone"
                  variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.07 } } }}
                >
                  {[
                    <p key="e" className="eyebrow">Commitment to {item.eyebrow.toLowerCase()}</p>,
                    <h3 key="h" className="commit-head mt-3 text-[clamp(2rem,3.6vw,3.25rem)] leading-[0.98]">
                      <span className="block">{lead}</span>
                      <span className="block text-accent">{tail}</span>
                    </h3>,
                    <p key="b" className="mt-5 text-[1.02rem] leading-relaxed text-muted">{item.body}</p>,
                    <Link
                      key="l"
                      href="/security"
                      className="group mt-7 inline-flex h-12 items-center gap-2 rounded-[14px] bg-accent px-6 text-[0.98rem] font-medium text-accent-contrast shadow-accent transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      Learn more
                      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>,
                  ].map((el, n) => (
                    <motion.div
                      key={n}
                      variants={{
                        hide: { opacity: 0, y: 18, filter: "blur(8px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
                        gone: { opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.2 } },
                      }}
                    >
                      {el}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* arrows */}
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Previous commitment" : "Next commitment"}
              onClick={() => go(i + d, d)}
              className={`commit-arrow absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full text-white lg:flex ${
                d < 0 ? "left-0" : "right-0"
              }`}
            >
              {d < 0 ? <CaretLeft size={20} weight="bold" /> : <CaretRight size={20} weight="bold" />}
            </button>
          ))}
        </div>

        {/* dots, the live one fills while the slide is up */}
        <div className="mt-10 flex justify-center gap-2 sm:mt-12">
          {COMMITMENTS.map((c, n) => (
            <button
              key={c.eyebrow}
              type="button"
              aria-label={`Show commitment to ${c.eyebrow.toLowerCase()}`}
              aria-current={n === i}
              onClick={() => go(n)}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${n === i ? "w-12 bg-white/25" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
            >
              {n === i && (
                <motion.span
                  key={`${i}-${hold}`}
                  className="absolute inset-0 origin-left rounded-full bg-white"
                  initial={{ scaleX: reduce || hold ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce || hold ? 0 : AUTO / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The tilted ring the readouts hang off, with a spark running round it. */
function Orbit({ live }: { live: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
      <g transform="rotate(-12 200 150)">
        <ellipse cx="200" cy="150" rx="150" ry="62" stroke="var(--color-accent)" strokeOpacity="0.7" strokeWidth="1.5" />
        <ellipse cx="200" cy="150" rx="150" ry="62" stroke="var(--color-accent)" strokeOpacity="0.35" strokeWidth="6" filter="blur(4px)" />
        {live && (
          <circle r="4.5" fill="#fff">
            <animateMotion dur="5s" repeatCount="indefinite" path="M50 150 A150 62 0 1 1 350 150 A150 62 0 1 1 50 150" />
          </circle>
        )}
        {[
          [320, 106],
          [300, 196],
          [84, 188],
        ].map(([x, y], n) => (
          <circle key={n} cx={x} cy={y} r="6" fill="var(--color-accent)" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
        ))}
      </g>
    </svg>
  );
}

function Bars({ live, n = 28, className = "" }: { live: boolean; n?: number; className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-[3px] ${className}`}>
      {Array.from({ length: n }, (_, k) => {
        const env = 0.2 + 0.8 * Math.abs(Math.sin(k * 0.55) * Math.cos(k * 0.17));
        return (
          <span
            key={k}
            className="eq-bar block w-[2.5px] rounded-full"
            style={{
              height: `${Math.round(env * 100)}%`,
              background: k % 3 ? "var(--color-accent)" : "#fff",
              animationDelay: `${-((k * 0.13) % 1.25).toFixed(2)}s`,
              animationPlayState: live ? "running" : "paused",
            }}
          />
        );
      })}
    </div>
  );
}

/** A phone mid-call: caller, ticking timer, live waveform, controls. */
function CallPhone({ live }: { live: boolean }) {
  const [s, setS] = useState(12);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div className="commit-phone relative h-[78%] max-h-[23rem] aspect-[9/18] rotate-[-10deg] rounded-[34px] p-[7px]">
      <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[28px] bg-[radial-gradient(120%_70%_at_50%_0%,#3a0a0a,#0a0406_70%)] px-3 pt-8">
        <span aria-hidden className="absolute top-2 h-4 w-16 rounded-full bg-black" />
        <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent text-white shadow-accent">
          {live && <span aria-hidden className="absolute inset-0 rounded-full border border-accent" style={{ animation: "ring-ping 1.8s var(--ease-signal) infinite" }} />}
          <User size={30} weight="fill" />
        </span>
        <p className="tabular mt-3 text-sm text-white/85">
          {String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}
        </p>
        <Bars live={live} className="mt-4 h-10 w-full" n={26} />
        <div className="mt-auto mb-4 flex w-full flex-col items-center gap-4">
          <div className="flex gap-3 text-white/80">
            {[Microphone, DotsNine, SpeakerHigh].map((I, k) => (
              <span key={k} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <I size={16} weight="fill" />
              </span>
            ))}
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-white">
            <Phone size={20} weight="fill" className="rotate-[135deg]" />
          </span>
        </div>
      </div>
    </div>
  );
}

/** A lock in a shield, with rings of dashes turning round it. */
function Vault({ live }: { live: boolean }) {
  return (
    <div className="relative grid h-56 w-56 place-items-center sm:h-64 sm:w-64">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-accent)" strokeOpacity="0.5" strokeDasharray="3 7" className={live ? "spin-slow" : ""} />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#fff" strokeOpacity="0.2" strokeDasharray="40 10 4 10" className={live ? "spin-slow-rev" : ""} />
      </svg>
      <span className="commit-core grid h-32 w-32 place-items-center rounded-[36px] text-white sm:h-36 sm:w-36">
        <LockKey size={64} weight="fill" />
      </span>
    </div>
  );
}

/** A glowing voice orb with six voice dots circling it. */
function VoiceOrb({ live }: { live: boolean }) {
  return (
    <div className="relative grid h-56 w-56 place-items-center sm:h-64 sm:w-64">
      <div className={`absolute inset-0 ${live ? "spin-slow" : ""}`} aria-hidden>
        {Array.from({ length: 6 }, (_, k) => (
          <span
            key={k}
            className="absolute left-1/2 top-1/2 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/60 text-[0.62rem] font-semibold text-white/80"
            style={{ transform: `translate(-50%,-50%) rotate(${k * 60}deg) translateY(-7rem) rotate(${-k * 60}deg)` }}
          >
            <User size={14} weight="fill" />
          </span>
        ))}
      </div>
      <span className="commit-core grid h-32 w-32 place-items-center rounded-full sm:h-36 sm:w-36">
        <Bars live={live} className="h-12 w-20" n={9} />
      </span>
    </div>
  );
}
