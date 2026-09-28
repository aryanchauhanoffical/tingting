"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { HeroLang } from "./heroLangs";
import { Flag } from "@/components/brand/Flag";
import { useAccent } from "@/lib/useAccent";

/** `<gvox-orb>` is a custom element registered by /gvox-orb.js, so it is cast to skip JSX typing. */
const OrbTag: React.ElementType = "gvox-orb" as unknown as React.ElementType;
type OrbEl = HTMLElement & { setLevel?: (v: number) => void };

/** Types the call out turn by turn, looping. Returns who holds the line and what they have said so far. */
function useCallScript(lang: HeroLang, still: boolean, paused = false) {
  const [state, setState] = useState({ idx: 0, typed: still ? lang.script[0].text : "" });

  useEffect(() => {
    if (still) {
      setState({ idx: 0, typed: lang.script[0].text });
      return;
    }
    setState({ idx: 0, typed: "" });
    if (paused) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let idx = 0;
    const runTurn = () => {
      const text = lang.script[idx].text;
      let n = 0;
      const tick = () => {
        n++;
        setState({ idx, typed: text.slice(0, n) });
        if (n < text.length) timers.push(setTimeout(tick, 24 + Math.random() * 28));
        else {
          idx = (idx + 1) % lang.script.length;
          timers.push(setTimeout(runTurn, 1300));
        }
      };
      tick();
    };
    timers.push(setTimeout(runTurn, 500));
    return () => timers.forEach(clearTimeout);
  }, [lang, still, paused]);

  const turn = lang.script[state.idx];
  return { who: turn.who, typed: state.typed, speaking: state.typed.length < turn.text.length };
}

type Props = {
  lang: HeroLang;
  /** a sticker is being held over the orb */
  hot?: boolean;
  /** intro state: the caption stays hidden and the call has not started */
  muted?: boolean;
};

/**
 * Hero showpiece: the Gvox WebGL orb, voiced by a looping call. It surges while
 * the agent speaks, pulses while it listens to the caller, and takes a punch of
 * level on every typed character. The call is captioned underneath in the picked
 * language. The orb wrapper is forwarded so the hero can use it as the drop
 * target for the greeting stickers.
 */
export const VoiceOrb = forwardRef<HTMLDivElement, Props>(function VoiceOrb({ lang, hot = false, muted = false }, orbWrapRef) {
  const accent = useAccent();
  const reduce = useReducedMotion() ?? false;
  const orbRef = useRef<OrbEl>(null);
  const { who, typed, speaking } = useCallScript(lang, reduce, muted);
  const agent = who === "agent";

  // the stand-in sphere bows out once the WebGL canvas exists (the orb is glass, it would show through)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let poll: ReturnType<typeof setInterval> | undefined;
    customElements.whenDefined("gvox-orb").then(() => {
      poll = setInterval(() => {
        const el = orbRef.current;
        if (el && (el.shadowRoot ?? el).querySelector("canvas")) {
          setReady(true);
          clearInterval(poll);
        }
      }, 120);
    });
    return () => clearInterval(poll);
  }, []);

  // each character lands as a syllable; the orb smooths it (fast attack, slow release)
  useEffect(() => {
    orbRef.current?.setLevel?.(speaking && !reduce ? 0.35 + Math.random() * 0.55 : 0);
  }, [typed, speaking, reduce]);

  return (
    <div className="mx-auto w-full max-w-[340px] lg:max-w-[var(--orb,370px)]">
      <Script src="/gvox-orb.js" strategy="afterInteractive" />

      <motion.div
        ref={orbWrapRef}
        animate={{ scale: hot ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative aspect-square w-full"
      >
        {/* stand-in sphere: holds the orb's place until three.js arrives */}
        <span
          aria-hidden
          className={`absolute inset-[7%] rounded-full border border-accent-2 bg-accent-3 shadow-[inset_0_-28px_48px_rgb(var(--accent-rgb)/0.16)] transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
        <OrbTag
          ref={orbRef}
          color={accent}
          speed={hot ? "2" : "1"}
          speaking={speaking && agent && !reduce ? "" : undefined}
          listening={speaking && !agent && !reduce ? "" : undefined}
          role="img"
          aria-label="Animated voice orb, reacting to the call"
          style={{ position: "absolute", inset: 0, display: "block" }}
        />
      </motion.div>

      {/* live caption: fixed height so the hero never shifts as lines wrap */}
      <div className={`mx-auto mt-1 max-w-[34ch] rounded-[12px] border border-line bg-surface px-4 py-3 shadow-soft transition-opacity delay-[1500ms] duration-[2200ms] ${muted ? "opacity-0" : "opacity-100"}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="tabular inline-flex items-center gap-1.5 text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${agent ? "bg-accent" : "bg-ink"} ${speaking ? "pulse-dot" : ""}`} />
            {agent ? "Agent" : "Caller"}
          </p>
          <div className="relative h-[1.4em] overflow-hidden font-display text-sm font-semibold leading-[1.4] text-accent-ink">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={lang.code}
                lang={lang.code}
                initial={reduce ? false : { y: "100%" }}
                animate={{ y: 0 }}
                exit={reduce ? undefined : { y: "-100%" }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <Flag code={lang.flag} />
                {lang.name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <p dir={lang.dir} lang={lang.code} className="mt-1.5 h-[3em] text-[0.95rem] leading-[1.5] text-ink">
          {typed}
          {speaking && <span aria-hidden className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-accent" />}
        </p>
      </div>
    </div>
  );
});
