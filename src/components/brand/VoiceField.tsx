"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useAccent } from "@/lib/useAccent";
import { DEFAULT_ACCENT } from "@/lib/theme";

type Edge = "bottom" | "top" | "left" | "right";

type Props = {
  className?: string;
  /** bar pitch in px (bar + gap) */
  pitch?: number;
  /** which edge of the canvas the bars grow from */
  edge?: Edge;
  /** an element the field breathes toward: bars nearest its center swell softly */
  focusRef?: React.RefObject<HTMLElement | null>;
  /** where pointer swells and click rings are picked up; defaults to the parent element */
  hostRef?: React.RefObject<HTMLElement | null>;
  /** bar colour: ink on the light page, light on dark sections */
  tone?: "ink" | "light";
};

const FALLBACK_ACCENT = DEFAULT_ACCENT;
const INK = "rgba(11,11,15,0.14)";
const LIGHT = "rgba(255,255,255,0.16)";

/**
 * Pointer-reactive equalizer strip. A row of bars anchored to one edge of its
 * canvas: idles as a slow travelling wave, swells under the pointer, breathes
 * toward a focus element, and a click sends a ring outward through the bars like
 * a phone ringing. Canvas 2D, listens on window so it can sit behind content
 * with pointer-events off. Pauses when offscreen, renders one static frame
 * under prefers-reduced-motion.
 */
export function VoiceField({ className, pitch = 13, edge = "bottom", focusRef, hostRef, tone = "ink" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  // the accent is read once per theme change rather than per frame
  const accent = useAccent();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const horizontal = edge === "bottom" || edge === "top";
    let w = 0;
    let h = 0;
    let along = 0; // canvas size along the bar row
    let depth = 0; // canvas size in the bars' growth direction
    let count = 0;
    let levels = new Float32Array(0); // eased length per bar, 0..1
    let raf = 0;
    let running = false;
    let t = 0;

    // pointer position along the row; strength eases in and out so bars never snap
    const pointer = { p: -9999, target: 0, strength: 0 };
    const rings: { p: number; born: number }[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      along = horizontal ? w : h;
      depth = horizontal ? h : w;
      count = Math.ceil(along / pitch);
      levels = new Float32Array(count);
      if (reduce) frame(0);
    };

    const idle = (i: number) =>
      0.2 + 0.09 * Math.sin(i * 0.21 + t * 0.018) + 0.07 * Math.sin(i * 0.063 - t * 0.011);

    // the focus element's center, projected onto this row
    const focusPos = () => {
      const f = focusRef?.current?.getBoundingClientRect();
      if (!f) return null;
      const r = canvas.getBoundingClientRect();
      return horizontal ? f.left + f.width / 2 - r.left : f.top + f.height / 2 - r.top;
    };

    const bar = (p: number, len: number, barW: number) => {
      const a = Math.round(p - barW / 2);
      if (edge === "bottom") ctx.fillRect(a, depth - len, barW, len);
      else if (edge === "top") ctx.fillRect(a, 0, barW, len);
      else if (edge === "left") ctx.fillRect(0, a, len, barW);
      else ctx.fillRect(depth - len, a, len, barW);
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.strength += (pointer.target - pointer.strength) * 0.08;
      while (rings.length && now - rings[0].born > 2200) rings.shift();
      const focus = focusPos();
      const breath = 0.16 + 0.1 * Math.sin(t * 0.035);

      const barW = Math.max(2, Math.round(pitch * 0.3));
      for (let i = 0; i < count; i++) {
        const p = i * pitch + pitch / 2;
        const dp = (p - pointer.p) / 150;
        let boost = Math.exp(-dp * dp) * pointer.strength * 0.45;

        if (focus !== null) {
          const df = (p - focus) / 260;
          boost += Math.exp(-df * df) * breath;
        }
        for (const r of rings) {
          const age = now - r.born;
          const front = age * 0.75;
          const d = (Math.abs(p - r.p) - front) / 46;
          boost += Math.exp(-d * d) * (1 - age / 2200) * 0.5;
        }
        boost = Math.min(boost, 0.75);

        const target = idle(i) + boost;
        levels[i] += (target - levels[i]) * (reduce ? 1 : 0.16);

        const len = Math.max(3, levels[i] * depth);
        ctx.globalAlpha = 1;
        ctx.fillStyle = tone === "light" ? LIGHT : INK;
        bar(p, len, barW);
        if (boost > 0.01) {
          ctx.globalAlpha = Math.min(1, boost * 1.8);
          ctx.fillStyle = accent || FALLBACK_ACCENT;
          bar(p, len, barW);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      t += 1;
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const locate = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      // react across the whole host, not just the strip the canvas occupies
      const host = hostRef?.current?.getBoundingClientRect() ?? canvas.parentElement?.getBoundingClientRect() ?? r;
      const inside =
        e.clientY >= host.top && e.clientY <= host.bottom && e.clientX >= host.left && e.clientX <= host.right;
      return { p: horizontal ? e.clientX - r.left : e.clientY - r.top, inside };
    };
    const onMove = (e: PointerEvent) => {
      const l = locate(e);
      pointer.p = l.p;
      pointer.target = l.inside ? 1 : 0;
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    const onDown = (e: PointerEvent) => {
      const l = locate(e);
      if (l.inside && rings.length < 4) rings.push({ p: l.p, born: performance.now() });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [pitch, reduce, edge, focusRef, hostRef, tone, accent]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none block", className)} />;
}
