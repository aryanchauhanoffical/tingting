"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { VoiceField } from "@/components/brand/VoiceField";
import { VoiceOrb } from "./VoiceOrb";
import { Flag } from "@/components/brand/Flag";
import { HERO_LANGS, type HeroLang } from "./heroLangs";

const LINES = ["Your calls,", "handled."];

/**
 * Greetings orbit the orb: three down each side, none underneath where the caption sits.
 * Angle in degrees (0 = right of the orb, negative = above), plus a resting tilt.
 */
const ORBIT = [
  { deg: -140, rotate: -7 },
  { deg: -40, rotate: 5 },
  { deg: 180, rotate: 3 },
  { deg: 0, rotate: -5 },
  { deg: 145, rotate: 6 },
  { deg: 35, rotate: -3 },
];
/** px the stickers sit outside the orb's edge */
const ORBIT_GAP = 92;

/** Spot on the orbit as CSS, measured from the orb's center. Scales with --orb. */
const orbitSpot = (deg: number) => {
  const cos = Math.cos((deg * Math.PI) / 180);
  const sin = Math.sin((deg * Math.PI) / 180);
  const at = (k: number) => `var(--orb) * ${(k * 0.5).toFixed(4)} + ${(k * ORBIT_GAP).toFixed(1)}px`;
  return {
    "--ox": `calc(50% + ${at(cos)})`,
    "--oy": `calc(var(--orb) * 0.5 + ${at(sin)})`,
  } as React.CSSProperties;
};

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // headline word cycles on its own until a sticker is picked; the pick then owns both
  const [wordIdx, setWordIdx] = useState(-1); // -1 = "every language"
  const [picked, setPicked] = useState<number | null>(null);
  const [canDrag, setCanDrag] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || picked !== null) return;
    const id = setInterval(() => setWordIdx((i) => (i + 1) % HERO_LANGS.length), 2400);
    return () => clearInterval(id);
  }, [reduce, picked]);

  // dragging is a desktop toy: on touch it would fight the page scroll
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px) and (pointer: fine)");
    const sync = () => setCanDrag(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // intro: only the orb is live until the first click, then everything else arrives
  const [intro, setIntro] = useState(true);
  // the greetings wait for the orb to reach its column before they are thrown out; the rest arrives on the click
  const [arrived, setArrived] = useState(false);
  const revealed = !intro && arrived;
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageShift, setStageShift] = useState(0); // px to center the orb in the viewport during the intro
  const [orbPx, setOrbPx] = useState(0); // the orb's rendered size, so stickers know where its center is
  const [measured, setMeasured] = useState(false); // the stage stays invisible until it has been centered

  useEffect(() => {
    if (reduce) {
      setIntro(false);
      return;
    }
    const end = () => setIntro(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") end();
    };
    window.addEventListener("pointerdown", end, { once: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", end);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduce]);

  useEffect(() => {
    if (intro) return;
    // onAnimationComplete on the stage ends the trip; this is the safety net if it never fires
    const id = setTimeout(() => setArrived(true), 3400);
    return () => clearTimeout(id);
  }, [intro]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-intro", intro);
    return () => document.documentElement.removeAttribute("data-intro");
  }, [intro]);

  useLayoutEffect(() => {
    const measure = () => {
      const st = stageRef.current?.getBoundingClientRect();
      const orb = ringRef.current?.getBoundingClientRect();
      if (st) setStageShift(canDrag ? window.innerWidth / 2 - (st.left + st.width / 2) : 0);
      if (orb) setOrbPx(orb.width);
      setMeasured(true);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [canDrag]);

  const shown = picked ?? wordIdx;
  const word = shown === -1 ? "every language" : HERO_LANGS[shown].name;
  const cardLang = HERO_LANGS[picked ?? 0];

  // the orb is a drop target: hold a sticker over it and let go to pick that language
  const [hot, setHot] = useState(false);
  const overRing = (x: number, y: number) => {
    const r = ringRef.current?.getBoundingClientRect();
    return !!r && Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) < r.width / 2;
  };

  return (
    <section ref={ref} className="relative isolate min-h-[100dvh] overflow-hidden pt-28">
      {/* editorial column rules */}
      <div aria-hidden className="page pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <div className="h-full w-full bg-[linear-gradient(to_right,var(--color-line-soft)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%] border-r border-line-soft" />
      </div>

      {/* equalizer floor: swells under the pointer, a click rings through it */}
      {/* equalizer floor: swells under the pointer, a click rings through it, breathes toward the orb. Arrives after the intro. */}
      <div
        className={`absolute inset-x-0 bottom-0 -z-10 h-[48%] transition-opacity duration-[3500ms] ${intro ? "opacity-0" : "opacity-100"}`}
      >
        <VoiceField className="h-full w-full" edge="bottom" focusRef={ringRef} hostRef={ref} />
      </div>

      <div className="page grid gap-12 pb-20 lg:min-h-[calc(100dvh-11rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-6 lg:pb-16">
        {/* left: headline on three rows, copy, actions */}
        <motion.div
          initial={false}
          animate={{ opacity: intro ? 0 : 1, y: intro ? 24 : 0 }}
          transition={{ duration: 3, ease: [0.22, 0.61, 0.36, 1], delay: intro ? 0 : 0.6 }}
          className={`relative z-10 lg:self-center ${intro ? "pointer-events-none" : ""}`}
          aria-hidden={intro}
        >
          <h1 className="font-display text-mega font-semibold text-ink">
            <span className="sr-only">Your calls, handled. In every language.</span>
            {LINES.map((line, li) => (
              <span key={line} aria-hidden className="block">
                {line.split(" ").map((w, i) => (
                  <span key={w}>
                    <span className="rise inline-block" style={{ animationDelay: `${0.08 + (li * 2 + i) * 0.07}s` }}>
                      {w}
                    </span>{" "}
                  </span>
                ))}
              </span>
            ))}
            <span aria-hidden className="rise mt-[0.06em] block" style={{ animationDelay: "0.32s" }}>
              In{" "}
              <span className="relative inline-flex h-[1.12em] -rotate-[1.5deg] items-center overflow-hidden rounded-[0.1em] bg-accent px-[0.16em] align-bottom text-white">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={word}
                    initial={reduce ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    exit={reduce ? undefined : { y: "-105%" }}
                    transition={{
                      duration: 0.45,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="inline-block whitespace-nowrap text-[0.88em] leading-none"
                  >
                    {word}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-accent">.</span>
            </span>
          </h1>

          <p className="rise mt-8 max-w-md text-lg leading-relaxed text-muted" style={{ animationDelay: "0.5s" }}>
            Inbound and outbound, in 20+ languages. Sub-400ms responses, human-quality voice, and automated QA on every
            call.
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.6s" }}>
            <Button href="/test-call" size="lg">
              Make a test call
            </Button>
            <Button href="#how" size="lg" variant="ghost" className="group">
              See it work
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
          <p
            className="rise tabular mt-8 text-[0.72rem] uppercase tracking-[0.14em] text-faint"
            style={{ animationDelay: "0.7s" }}
          >
            {canDrag ? "Drop a greeting on the orb, or just click one" : "Pick a greeting to switch the call"}
          </p>
        </motion.div>

        {/* stage: the orb voices the call, greetings orbit it. Pick one and the call switches language. */}
        <motion.div
          ref={stageRef}
          initial={false}
          animate={{ x: intro ? stageShift : 0 }}
          transition={intro ? { duration: 0 } : { duration: 3.2, ease: [0.22, 0.61, 0.36, 1] }}
          onAnimationComplete={() => {
            if (!intro) setArrived(true);
          }}
          className="relative z-20 lg:mx-auto lg:mt-[calc(50dvh-7rem-var(--orb)/2)] lg:w-full lg:max-w-[720px]"
          style={
            {
              "--orb": "min(560px, 40vw, calc(100dvh - 26rem))",
              visibility: intro && !measured ? "hidden" : "visible",
            } as React.CSSProperties
          }
        >
          {/* .orbit is a plain row by default and a ring around the orb on wide pointer screens: pure CSS, so it is right before hydration */}
          <div className="orbit">
            {HERO_LANGS.map((l, i) => (
              <Sticker
                key={l.code}
                lang={l}
                active={picked === i}
                orbit={ORBIT[i]}
                draggable={canDrag}
                bounds={ref}
                still={!!reduce}
                onPick={() => setPicked(i)}
                overRing={overRing}
                onHot={setHot}
                index={i}
                intro={!revealed}
                orbPx={orbPx}
              />
            ))}
          </div>

          <VoiceOrb ref={ringRef} lang={cardLang} hot={hot} muted={intro} />

          {/* the one thing on screen during the intro besides the orb */}
          <AnimatePresence>
            {intro && (
              <motion.p
                key="prompt"
                initial={false}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.5 } }}
                className="tabular pointer-events-none absolute inset-x-0 top-[calc(var(--orb)+2.5rem)] text-center text-[0.72rem] uppercase tracking-[0.18em] text-muted"
              >
                <span className="pulse-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                Click anywhere to begin
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

type StickerProps = {
  lang: HeroLang;
  active: boolean;
  /** spot on the ring around the orb (CSS only applies it on wide pointer screens) */
  orbit: (typeof ORBIT)[number];
  /** drag and tilt are for wide pointer screens only */
  draggable: boolean;
  bounds: React.RefObject<HTMLElement | null>;
  still: boolean;
  onPick: () => void;
  overRing: (x: number, y: number) => boolean;
  onHot: (hot: boolean) => void;
  index: number;
  /** while true the sticker sits hidden at the orb's center; on false it flies out to its spot */
  intro: boolean;
  orbPx: number;
};

function Sticker({
  lang,
  active,
  orbit,
  draggable,
  bounds,
  still,
  onPick,
  overRing,
  onHot,
  index,
  intro,
  orbPx,
}: StickerProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);
  const center = (el: Element) => {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2] as const;
  };

  // vector from the sticker's spot back to the orb's center, so it can start inside the orb
  const dist = orbPx / 2 + ORBIT_GAP;
  const back = draggable
    ? { x: -Math.cos((orbit.deg * Math.PI) / 180) * dist, y: -Math.sin((orbit.deg * Math.PI) / 180) * dist }
    : { x: 0, y: 0 };

  return (
    <div className="orbit-spot" style={orbitSpot(orbit.deg)}>
      <motion.div
        initial={false}
        animate={intro ? { x: back.x, y: back.y, scale: 0.2, opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: 1 }}
        transition={
          intro
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 90,
                damping: 13,
                mass: 1,
                delay: 0.05 + index * 0.07,
                opacity: { duration: 0.35, delay: 0.05 + index * 0.07 },
              }
        }
        className={intro ? "pointer-events-none" : ""}
      >
        <motion.div
          animate={still || !draggable ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4.5 + index * 0.4, ease: "easeInOut", repeat: Infinity, delay: index * 0.5 }}
        >
          <motion.button
            type="button"
            lang={lang.code}
            aria-pressed={active}
            aria-label={`${lang.hello}: hear the call in ${lang.name}`}
            drag={draggable && !still}
            dragConstraints={bounds}
            dragElastic={0.18}
            dragTransition={{
              bounceStiffness: 260,
              bounceDamping: 18,
              power: 0.25,
            }}
            onDragStart={() => (dragged.current = true)}
            onDrag={(e) => onHot(overRing(...center(e.target as Element)))}
            onDragEnd={(e) => {
              onHot(false);
              if (!overRing(...center(e.target as Element))) return;
              onPick();
              // dropped on the orb: it takes the language and sends the sticker home
              animate(x, 0, { type: "spring", stiffness: 220, damping: 22 });
              animate(y, 0, { type: "spring", stiffness: 220, damping: 22 });
            }}
            onClick={() => {
              if (dragged.current) {
                dragged.current = false;
                return;
              }
              onPick();
            }}
            initial={false}
            animate={{ rotate: draggable ? orbit.rotate : 0 }}
            whileHover={still ? undefined : { rotate: 0, scale: 1.04 }}
            whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing", zIndex: 5 }}
            whileTap={{ scale: 0.97 }}
            style={{ x, y }}
            className={`sticker h-12 gap-2.5 px-4 font-display text-lg font-semibold ${active ? "sticker-on" : ""} ${
              draggable ? "cursor-grab" : ""
            }`}
          >
            <Flag code={lang.flag} className={active ? "ring-white/40" : ""} />
            {lang.hello}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
