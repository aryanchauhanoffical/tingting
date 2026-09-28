"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Phone, ShieldCheck } from "@phosphor-icons/react";
import { Waveform } from "@/components/brand/Waveform";
import { HERO_LANGS, type HeroLang, type Turn } from "./heroLangs";

/**
 * Hero showpiece: a premium "call-in-glass" card with a live transcript that
 * types itself, a breathing waveform, and turn indicators. Real component, not
 * a static screenshot. Replays the call in whichever language is passed in.
 * Reduced motion shows the full transcript at rest.
 */
export function LiveCallCard({ lang = HERO_LANGS[0] }: { lang?: HeroLang }) {
  const reduce = useReducedMotion();
  const SCRIPT = lang.script;
  const [visible, setVisible] = useState<Turn[]>(reduce ? SCRIPT : []);
  const [typing, setTyping] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVisible(SCRIPT);
      return;
    }
    setVisible([]);
    setTyping("");
    let idx = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const runTurn = () => {
      const turn = SCRIPT[idx % SCRIPT.length];
      let char = 0;
      const typeChar = () => {
        setTyping(turn.text.slice(0, char));
        char++;
        if (char <= turn.text.length) {
          timers.push(setTimeout(typeChar, 22 + Math.random() * 30));
        } else {
          setVisible((v) => [...v.slice(-3), turn]);
          setTyping("");
          idx++;
          timers.push(setTimeout(runTurn, 900));
        }
      };
      typeChar();
    };
    timers.push(setTimeout(runTurn, 600));
    return () => timers.forEach(clearTimeout);
  }, [reduce, SCRIPT]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const activeWho: Turn["who"] = typing ? (visible.at(-1)?.who === "agent" ? "caller" : "agent") : "agent";

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* breathing spectrogram behind */}
      <div aria-hidden className="absolute inset-x-4 -bottom-6 -top-6 -z-10 rounded-[32px] opacity-60 blur-2xl" style={{ background: "radial-gradient(60% 50% at 50% 40%, rgb(var(--accent-rgb) / 0.22), transparent 70%)" }} />

      <div className="overflow-hidden rounded-[28px] border border-line bg-surface/90 shadow-float backdrop-blur-sm">
        {/* header */}
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-accent">
              <Phone weight="fill" size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-ink">Live call</p>
              <p className="tabular text-xs text-muted">Tring Tring agent · {lang.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
            <span className="tabular text-xs text-muted">{mmss}</span>
          </div>
        </div>

        {/* transcript — fixed height + bottom-anchored so the card never resizes */}
        <div dir={lang.dir} className="flex h-[228px] flex-col justify-end gap-2.5 overflow-hidden px-5 py-5">
          {visible.map((t, i) => (
            <Bubble key={`${lang.code}-${i}`} turn={t} />
          ))}
          {typing && <Bubble turn={{ who: activeWho, text: typing }} live />}
        </div>

        {/* waveform footer */}
        <div className="border-t border-line-soft bg-bg/60 px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="tabular text-[0.7rem] uppercase tracking-widest text-faint">Signal</span>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] text-accent-ink">
              <ShieldCheck weight="fill" size={13} /> QA 98
            </span>
          </div>
          <Waveform height={44} bars={44} active />
        </div>
      </div>
    </div>
  );
}

function Bubble({ turn, live }: { turn: Turn; live?: boolean }) {
  const isAgent = turn.who === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[0.86rem] leading-snug ${
          isAgent ? "bg-ink text-white" : "bg-accent-2 text-ink"
        }`}
      >
        {turn.text}
        {live && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-current" />}
      </div>
    </motion.div>
  );
}
