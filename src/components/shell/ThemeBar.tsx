"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eyedropper, ArrowCounterClockwise } from "@phosphor-icons/react";
import {
  PALETTES,
  DEFAULT_ACCENT,
  applyTheme,
  savedAccent,
  deriveTheme,
} from "@/lib/theme";

/**
 * Accent preview bar. A client-facing tool, not part of the site design: it sits in
 * its own strip above the navigation so nothing on the page has to make room for it,
 * and it is styled as tooling rather than as chrome.
 *
 * Picking a swatch rewrites the accent tokens on <html>, which is where every colour
 * on the site now comes from, so the whole page changes at once: buttons, links,
 * chips, the equalizer canvases, the WebGL orb, the glows, and a hue shift on the two
 * product renders that have the old colour baked into their pixels.
 */
export function ThemeBar() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [custom, setCustom] = useState(DEFAULT_ACCENT);
  const listRef = useRef<HTMLDivElement>(null);

  // pick up whatever the pre-paint script restored
  useEffect(() => {
    const saved = savedAccent();
    if (saved) {
      setAccent(saved);
      setCustom(saved);
    }
  }, []);

  const pick = useCallback((hex: string) => {
    setAccent(hex);
    setCustom(hex);
    applyTheme(hex);
  }, []);

  const matched = PALETTES.find((p) => p.hex === accent);

  /** Left and right arrows move between swatches, the way a radio group should. */
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const last = PALETTES.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : last;
    pick(PALETTES[next].hex);
    const btns = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-swatch]");
    btns?.[next]?.focus();
  };

  return (
    <div className="theme-bar">
      <div className="page flex h-11 items-center gap-3">
        <span className="hidden shrink-0 text-[0.72rem] font-medium tracking-[0.08em] text-white/45 uppercase sm:inline">
          Accent preview
        </span>

        <div
          ref={listRef}
          role="radiogroup"
          aria-label="Site accent colour"
          className="flex min-w-0 items-center gap-1.5 overflow-x-auto"
        >
          {PALETTES.map((p, i) => {
            const on = p.hex === accent;
            return (
              <button
                key={p.id}
                data-swatch
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={p.name}
                title={`${p.name} ${p.hex}`}
                tabIndex={on || (!matched && i === 0) ? 0 : -1}
                onClick={() => pick(p.hex)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="theme-dot"
                style={{ background: p.hex }}
              >
                {on && <Check size={12} weight="bold" style={{ color: deriveTheme(p.hex).accentContrast }} />}
              </button>
            );
          })}
        </div>

        <span aria-hidden className="h-4 w-px shrink-0 bg-white/15" />

        {/* any colour at all, for a client who arrives with a brand hex */}
        <label
          className="theme-custom"
          title="Pick any colour"
          style={!matched ? { boxShadow: `0 0 0 2px ${accent}` } : undefined}
        >
          <Eyedropper size={13} weight="bold" />
          <span className="hidden md:inline">Custom</span>
          <input
            type="color"
            value={custom}
            aria-label="Pick a custom accent colour"
            onChange={(e) => pick(e.target.value)}
          />
        </label>

        <HexInput accent={accent} onCommit={pick} />

        <span className="tabular ml-auto hidden shrink-0 text-[0.7rem] text-white/40 lg:inline">
          {matched ? matched.name : "Custom"} {accent.toUpperCase()}
        </span>

        <button
          type="button"
          onClick={() => pick(DEFAULT_ACCENT)}
          disabled={accent === DEFAULT_ACCENT}
          className="theme-reset"
          title="Back to the brand red"
        >
          <ArrowCounterClockwise size={13} weight="bold" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Type a hex straight in, for a client who already has a brand colour rather than an
 * eye for the swatch wheel. Free typing while focused; committing (Enter or blur)
 * either applies a valid 3 or 6 digit hex or snaps back to the live accent, so the
 * field can never leave the page pointed at a colour that was never applied.
 */
function HexInput({ accent, onCommit }: { accent: string; onCommit: (hex: string) => void }) {
  const bare = (hex: string) => hex.replace("#", "").toUpperCase();
  const [draft, setDraft] = useState(bare(accent));
  const editing = useRef(false);

  useEffect(() => {
    if (!editing.current) setDraft(bare(accent));
  }, [accent]);

  const commit = () => {
    editing.current = false;
    const full = draft.length === 3 ? draft.split("").map((c) => c + c).join("") : draft;
    if (/^[0-9A-F]{6}$/.test(full)) onCommit(`#${full.toLowerCase()}`);
    else setDraft(bare(accent));
  };

  return (
    <label className="theme-hex" title="Type a hex colour code">
      <span aria-hidden>#</span>
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={6}
        placeholder="E90000"
        value={draft}
        aria-label="Type a hex colour code"
        onFocus={() => {
          editing.current = true;
        }}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9a-fA-F]/g, "").toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(bare(accent));
            e.currentTarget.blur();
          }
        }}
        onBlur={commit}
      />
    </label>
  );
}
