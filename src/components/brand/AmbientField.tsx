"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useAccent } from "@/lib/useAccent";
import { hexToRgb, DEFAULT_ACCENT } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** "listening" pulses ripples faster/brighter (e.g. when a call connects). */
  intensity?: "idle" | "listening";
};

const FALLBACK = hexToRgb(DEFAULT_ACCENT) as unknown as readonly [number, number, number];
const BG = "255,255,255"; // #FFFFFF

/**
 * Ambient background field for light pages: drifting accent-coloured waveform filaments,
 * floating signal particles, and slow "call-connecting" ripples from center.
 * Canvas 2D, zero-dep, GPU-light. A soft center fade keeps foreground text crisp.
 * Renders one static frame under prefers-reduced-motion.
 */
export function AmbientField({ className, intensity = "idle" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;
  // kept in a ref so an accent change repaints without tearing down the field
  const accentRef = useRef<readonly [number, number, number]>(FALLBACK);
  accentRef.current = hexToRgb(useAccent()) as [number, number, number];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // damped pointer parallax
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ptr.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ptr.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // filaments (breathing waveform lines)
    const LINES = 16;
    const filaments = Array.from({ length: LINES }, (_, i) => ({
      base: (i + 0.5) / LINES,
      amp: 0.04 + Math.random() * 0.07,
      freq: 1.2 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.25,
      drift: 0.5 + Math.random() * 1.5,
      alpha: 0.05 + Math.random() * 0.07,
    }));

    // floating particles
    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -0.00008 - Math.random() * 0.00016,
      a: 0.08 + Math.random() * 0.18,
    }));

    // ripples
    let ripples: { t: number }[] = [];
    let lastRipple = 0;

    const drawFrame = (t: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      ptr.x += (ptr.tx - ptr.x) * 0.04;
      ptr.y += (ptr.ty - ptr.y) * 0.04;
      const listening = intensityRef.current === "listening";
      const cx = w / 2;
      const cy = h / 2;
      const px = ptr.x * 14;
      const py = ptr.y * 14;

      // --- filaments ---
      ctx.lineWidth = 1;
      for (const f of filaments) {
        const phase = f.phase + (animate ? t * 0.001 * f.speed * (listening ? 1.6 : 1) : 0);
        const yBase = f.base * h + Math.sin(t * 0.0002 * f.drift) * 24 + py;
        ctx.beginPath();
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const xn = s / steps;
          const x = xn * (w + 80) - 40 + px;
          const y =
            yBase +
            Math.sin(xn * Math.PI * 2 * f.freq + phase) * (f.amp * h) +
            Math.sin(xn * Math.PI * 2 * f.freq * 0.5 + phase * 1.3) * (f.amp * h * 0.4);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${accentRef.current[0]},${accentRef.current[1]},${accentRef.current[2]},${f.alpha})`;
        ctx.stroke();
      }

      // --- particles ---
      for (const p of particles) {
        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -0.02) p.y = 1.02;
          if (p.x < -0.02) p.x = 1.02;
          if (p.x > 1.02) p.x = -0.02;
        }
        const x = p.x * w + px;
        const y = p.y * h + py;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRef.current[0]},${accentRef.current[1]},${accentRef.current[2]},${p.a})`;
        ctx.fill();
      }

      // --- ripples (call connecting) ---
      if (animate) {
        const interval = listening ? 1500 : 3200;
        if (t - lastRipple > interval) {
          ripples.push({ t });
          lastRipple = t;
        }
        const maxR = Math.min(w, h) * 0.55;
        ripples = ripples.filter((r) => t - r.t < 5200);
        for (const r of ripples) {
          const age = (t - r.t) / 5200;
          const radius = age * maxR;
          const alpha = (1 - age) * (listening ? 0.22 : 0.14);
          ctx.beginPath();
          ctx.arc(cx + px, cy + py, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${accentRef.current[0]},${accentRef.current[1]},${accentRef.current[2]},${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // --- soft center fade: keeps foreground text/orb readable ---
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
      g.addColorStop(0, `rgba(${BG},0.92)`);
      g.addColorStop(0.45, `rgba(${BG},0.45)`);
      g.addColorStop(1, `rgba(${BG},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    let raf = 0;
    if (reduce) {
      drawFrame(0, false);
    } else {
      const loop = (t: number) => {
        drawFrame(t, true);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    // pause when tab hidden
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) raf = requestAnimationFrame(function l(t) {
        drawFrame(t, true);
        raf = requestAnimationFrame(l);
      });
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
