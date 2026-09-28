"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import {
  Buildings,
  Heartbeat,
  Bank,
  ShoppingBag,
  Airplane,
  GraduationCap,
  ArrowRight,
  ForkKnife,
  Truck,
  ShieldCheck,
  Car,
  Scales,
  CellSignalFull,
  Cloud,
  Lightning,
  UsersThree,
} from "@phosphor-icons/react";
import Link from "next/link";
import { INDUSTRIES, MORE_INDUSTRIES } from "@/lib/content";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { IndustryScene } from "./IndustryScene";

const ICONS: Record<string, React.ElementType> = {
  buildings: Buildings,
  heartbeat: Heartbeat,
  bank: Bank,
  shoppingbag: ShoppingBag,
  airplane: Airplane,
  graduationcap: GraduationCap,
  forkknife: ForkKnife,
  truck: Truck,
  shieldcheck: ShieldCheck,
  car: Car,
  scales: Scales,
  cellsignal: CellSignalFull,
  cloud: Cloud,
  lightning: Lightning,
  usersthree: UsersThree,
};

type Industry = (typeof INDUSTRIES)[number];

/**
 * H9 — Industries as case studies. Two staggered columns of tall cards, each one
 * a close-up of a real call in that industry. The columns drift at different
 * speeds while scrolling; the intro copy leads the left column and the right
 * column starts lower, so the section reads as one editorial spread.
 */
export function Industries() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const rightY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [160, -160]);

  // four case studies; the rest of the room is the pile of smaller calls below
  const shown = INDUSTRIES.slice(0, 4);
  const left = shown.filter((_, i) => i % 2 === 1);
  const right = shown.filter((_, i) => i % 2 === 0);

  return (
    <section ref={ref} className="page overflow-x-clip py-20 sm:py-28">
      {/* On small screens both columns collapse into one grid and the cards keep their
          original order via `order`; on lg each column is a real stack with its own parallax. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-12">
        <motion.div style={{ y: leftY }} className="contents lg:flex lg:flex-col lg:gap-14">
          <ScrollReveal className="order-first lg:pt-4 lg:pb-14 lg:pr-10">
            <h2 className="font-display text-display max-w-xl font-semibold">Tuned for the way your industry calls.</h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted">
              A viewing, a refund, a rebooked flight. Every industry has its own calls, and the agent learns yours:
              the vocabulary, the systems behind the desk, and what a good outcome sounds like. Below, one real call
              from each.
            </p>
            <Link
              href="/industries"
              className="group mt-6 inline-flex items-center gap-2 text-lg font-medium text-accent-ink"
            >
              See how it handles yours
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
          {left.map((ind, i) => (
            <CaseCard key={ind.name} ind={ind} seed={i * 2 + 2} order={i * 2 + 2} />
          ))}
        </motion.div>

        <motion.div style={{ y: rightY }} className="contents lg:flex lg:flex-col lg:gap-14 lg:pt-28">
          {right.map((ind, i) => (
            <CaseCard key={ind.name} ind={ind} seed={i * 2 + 1} order={i * 2 + 1} />
          ))}
          <MoreCluster />
        </motion.div>
      </div>
    </section>
  );
}

function CaseCard({ ind, seed, order }: { ind: Industry; seed: number; order: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[ind.icon];

  return (
    <motion.article
      ref={ref}
      style={{ "--o": order } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group overflow-hidden rounded-[32px] bg-surface shadow-soft transition-shadow duration-500 order-(--o) hover:shadow-lift lg:order-none"
    >
      <IndustryScene ind={ind} seed={seed} inView={inView} hovered={hovered} />

      <div className="px-6 pt-8 pb-8 sm:px-8 sm:pt-9 sm:pb-9">
        <p className="inline-flex items-center gap-2.5 text-[0.95rem] font-medium text-muted">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-accent-2 text-accent-ink">
            <Icon size={17} weight="bold" />
          </span>
          {ind.name}
        </p>
        <h3 className="font-display mt-5 text-[clamp(1.5rem,2.1vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-ink">
          {ind.outcome}
        </h3>
        <p className="mt-4 max-w-lg text-[1.05rem] leading-[1.65] text-muted">{ind.blurb}</p>
      </div>
    </motion.article>
  );
}

/* The fan: where each small card sits (percent of the cluster), its tilt, its
   stacking, its parallax depth, and the direction it drifts when the fan is hovered. */
const FAN = [
  { x: 0, y: 0, r: -5, z: 1, d: 20, dx: -12, dy: -10 },
  { x: 30, y: 8, r: 3, z: 2, d: 44, dx: 0, dy: -14 },
  { x: 56, y: 0, r: 6, z: 1, d: 60, dx: 12, dy: -10 },
  { x: 10, y: 22, r: 2, z: 3, d: 32, dx: -10, dy: -2 },
  { x: 46, y: 25, r: -4, z: 4, d: 68, dx: 12, dy: 0 },
  { x: 0, y: 44, r: -3, z: 2, d: 28, dx: -14, dy: 8 },
  { x: 28, y: 49, r: 5, z: 5, d: 52, dx: 0, dy: 12 },
  { x: 54, y: 44, r: -2, z: 3, d: 40, dx: 14, dy: 8 },
  { x: 14, y: 66, r: -4, z: 6, d: 76, dx: -4, dy: 16 },
  { x: 50, y: 69, r: 3, z: 4, d: 36, dx: 12, dy: 16 },
  { x: 30, y: 86, r: 2, z: 5, d: 58, dx: 0, dy: 18 },
];

/**
 * The room left under the right column: the other industries, fanned out like a
 * pile of call notes. Each card parallaxes at its own depth while scrolling and the
 * pile spreads apart on hover. On small screens it is a plain wrap of chips.
 */
function MoreCluster() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div className="order-last pt-2 lg:pt-6">
      <div ref={ref} className="group/fan relative flex flex-wrap gap-3 lg:block lg:aspect-[4/2.9]">
        {MORE_INDUSTRIES.map((m, i) => (
          <MiniCard key={m.name} m={m} fan={FAN[i]} progress={scrollYProgress} still={!!reduce} />
        ))}
      </div>
      <div className="mt-8 flex justify-center lg:mt-12">
        <Link
          href="/industries"
          className="group inline-flex items-center gap-2 text-lg font-medium text-accent-ink"
        >
          Every industry we speak
          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function MiniCard({
  m,
  fan,
  progress,
  still,
}: {
  m: (typeof MORE_INDUSTRIES)[number];
  fan: (typeof FAN)[number];
  progress: MotionValue<number>;
  still: boolean;
}) {
  const y = useTransform(progress, [0, 1], still ? [0, 0] : [fan.d, -fan.d]);
  const Icon = ICONS[m.icon];

  return (
    <div
      style={
        {
          zIndex: fan.z,
          "--fx": `${fan.x}%`,
          "--fy": `${fan.y}%`,
          "--fr": `${fan.r}deg`,
          "--dx": `${fan.dx}px`,
          "--dy": `${fan.dy}px`,
        } as React.CSSProperties
      }
      className="lg:absolute lg:top-(--fy) lg:left-(--fx) lg:w-[44%] lg:rotate-(--fr) lg:transition-[translate,rotate] lg:duration-700 lg:ease-[var(--ease-signal)] lg:group-hover/fan:translate-x-(--dx) lg:group-hover/fan:translate-y-(--dy)"
    >
      <motion.div
        style={{ y }}
        className="flex items-center gap-2.5 rounded-[16px] border border-line bg-surface py-2.5 pr-4 pl-3 shadow-lift lg:rounded-[18px] lg:py-3 lg:pr-4 lg:pl-3"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-accent-2 text-accent-ink">
          <Icon size={18} weight="bold" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-[0.8rem] font-medium text-muted">{m.name}</p>
          <p className="hidden truncate text-[0.88rem] font-medium text-ink lg:block">{m.line}</p>
        </div>
      </motion.div>
    </div>
  );
}
