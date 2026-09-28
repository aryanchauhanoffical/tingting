"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { INTEGRATIONS } from "@/lib/content";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * H8 — Integrations grid. Logo tiles with a hover-reveal caption. Real brand
 * marks via Simple Icons CDN (single-color, themes to ink).
 */
export function Integrations() {
  const reduce = useReducedMotion();
  return (
    <section className="page py-20 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <ScrollReveal>
          <h2 className="font-display max-w-xl text-display font-semibold">
            Plug your agent into the tools you already run.
          </h2>
        </ScrollReveal>
        <Link href="/integrations" className="group inline-flex items-center gap-2 text-sm font-medium text-accent-ink">
          Explore integrations
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {INTEGRATIONS.map((it, i) => (
          <motion.div
            key={it.slug}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-accent/40"
          >
            <div className="flex items-center gap-3">
              <LogoGlyph slug={it.slug} name={it.name} />
              <span className="font-medium text-ink">{it.name}</span>
            </div>
            {/* hover-reveal caption */}
            <div className="mt-3 max-h-0 overflow-hidden text-sm text-muted opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-16 group-hover:opacity-100">
              {it.desc}
            </div>
            <span className="tabular absolute right-4 top-4 text-[0.68rem] uppercase tracking-wider text-faint">
              {it.cat}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted">And 100 more, plus a REST API and webhooks.</p>
    </section>
  );
}

/** Simple Icons glyph with a monogram fallback when a brand mark is unavailable. */
function LogoGlyph({ slug, name }: { slug: string; name: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink text-[0.7rem] font-bold text-white">
        {name[0]}
      </span>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/0b0b0f`}
      alt={name}
      width={24}
      height={24}
      onError={() => setBroken(true)}
      className="h-6 w-6 shrink-0 opacity-80 grayscale transition group-hover:grayscale-0 group-hover:opacity-100"
      loading="lazy"
    />
  );
}
