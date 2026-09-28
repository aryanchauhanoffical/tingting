"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  bars?: number;
  color?: string;
  /** 0 = idle (flat-ish), 1 = fully active speech */
  active?: boolean;
  height?: number;
};

/**
 * Canvas voice waveform — organic reactive bars. The site's core "sound made
 * visible" primitive. Draws on a canvas (no per-bar DOM), collapses to a static
 * bar row under reduced motion.
 */
export function Waveform({ className, bars = 48, color = "var(--color-accent)", active = true, height = 64 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // phase offsets per bar for organic motion
    const phases = Array.from({ length: bars }, (_, i) => (i / bars) * Math.PI * 4 + Math.random());

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const gap = w / bars;
      const barW = Math.max(2, gap * 0.42);
      const mid = h / 2;
      const amp = activeRef.current ? 1 : 0.28;

      for (let i = 0; i < bars; i++) {
        // envelope: taller in the middle, gentle at edges
        const env = 0.35 + 0.65 * Math.sin((i / (bars - 1)) * Math.PI);
        const wobble =
          Math.sin(t * 0.05 + phases[i]) * 0.5 +
          Math.sin(t * 0.11 + phases[i] * 1.7) * 0.35 +
          Math.sin(t * 0.023 + phases[i] * 0.6) * 0.15;
        const norm = (wobble + 1) / 2; // 0..1
        const barH = Math.max(barW, norm * env * amp * (h * 0.82));
        const x = i * gap + (gap - barW) / 2;
        const y = mid - barH / 2;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.35 + norm * 0.65;
        const r = barW / 2;
        // rounded bar
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + barW, y, x + barW, y + barH, r);
        ctx.arcTo(x + barW, y + barH, x, y + barH, r);
        ctx.arcTo(x, y + barH, x, y, r);
        ctx.arcTo(x, y, x + barW, y, r);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 1;
      raf = requestAnimationFrame(draw);
    };

    if (reduce) {
      // static single frame
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const gap = w / bars;
      const barW = Math.max(2, gap * 0.42);
      const mid = h / 2;
      for (let i = 0; i < bars; i++) {
        const env = 0.35 + 0.65 * Math.sin((i / (bars - 1)) * Math.PI);
        const barH = Math.max(barW, env * 0.5 * (h * 0.7));
        const x = i * gap + (gap - barW) / 2;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, mid - barH / 2, barW, barH);
      }
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [bars, color, reduce]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full", className)}
      style={{ height }}
      aria-hidden
    />
  );
}
