"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

/**
 * The signature "signal line": a thin vertical connector that draws itself as
 * the section scrolls through the viewport, threading the page together (§0).
 * A tiny node travels along it. Static (fully drawn) under reduced motion.
 */
export function SignalPath({
  className,
  height = 240,
}: {
  className?: string;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const draw = useTransform(smooth, [0, 0.55], [0, 1]);
  const nodeY = useTransform(smooth, [0, 0.55], [6, height - 6]);
  const nodeOpacity = useTransform(smooth, [0, 0.06, 0.5, 0.58], [0, 1, 1, 0]);

  const w = 24;

  return (
    <div ref={ref} className={className} aria-hidden>
      <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="signal-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.12" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="0.88" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* faint rail */}
        <line x1={w / 2} y1="0" x2={w / 2} y2={height} stroke="#e7e7e2" strokeWidth="1.5" />
        {/* drawn signal */}
        <motion.line
          x1={w / 2}
          y1="0"
          x2={w / 2}
          y2={height}
          stroke="url(#signal-fade)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : draw }}
        />
        {!reduce && (
          <motion.circle cx={w / 2} r="4.5" fill="var(--color-accent)" style={{ cy: nodeY, opacity: nodeOpacity }}>
            <animate attributeName="r" values="4.5;6.5;4.5" dur="1.1s" repeatCount="indefinite" />
          </motion.circle>
        )}
      </svg>
    </div>
  );
}

/** Fixed top scroll-progress line, styled as a thin signal. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-accent"
    />
  );
}
