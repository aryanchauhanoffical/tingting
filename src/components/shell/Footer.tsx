"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { COMPLIANCE } from "@/lib/content";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Agents and flows", href: "/product#agents" },
      { label: "Voices and languages", href: "/voices" },
      { label: "Numbers", href: "/product#numbers" },
      { label: "Calls and QA", href: "/product#qa" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Outbound", href: "/solutions#outbound" },
      { label: "Inbound", href: "/solutions#inbound" },
      { label: "Reminders", href: "/solutions#reminders" },
      { label: "Collections", href: "/solutions#collections" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/resources" },
      { label: "Changelog", href: "/resources#changelog" },
      { label: "API and webhooks", href: "/integrations#api" },
      { label: "Pricing", href: "/pricing" },
      { label: "Make a test call", href: "/test-call" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "/customers" },
      { label: "Security", href: "/security" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Trademark", href: "/trademark" },
];

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const sweep = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-bg">
      <div className="page py-16">
        {/* top: brand + newsletter */}
        <div className="grid gap-10 md:grid-cols-2">
          <div className="max-w-sm">
            <Logo className="h-14" />
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
              Voice agents that answer, act, and close the loop. Built for teams that live on the phone.
            </p>
          </div>
          <div className="md:justify-self-end">
            <p className="text-sm font-medium text-ink">Made for voice. Get the monthly signal.</p>
            <form className="mt-3 flex max-w-sm items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email"
                className="h-12 flex-1 rounded-pill border border-line bg-surface px-5 text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="group grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-ink text-white transition-colors hover:bg-accent"
              >
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>

        {/* link columns */}
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[0.9rem] text-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* compliance + legal */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {COMPLIANCE.map((c) => (
              <span key={c} className="tabular text-xs text-faint">
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL.map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-faint transition-colors hover:text-ink">
                {l.label}
              </Link>
            ))}
            <p className="text-xs text-faint">Copyright 2026 Tring Tring. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* giant kinetic wordmark with waveform sweep */}
      <div className="relative select-none overflow-hidden" aria-hidden>
        <motion.div style={{ x: reduce ? 0 : sweep }} className="relative">
          <span className="block whitespace-nowrap px-4 text-center font-display font-semibold leading-none tracking-[-0.05em] text-ink/[0.06]" style={{ fontSize: "clamp(2.5rem, 12vw, 11rem)" }}>
            Tring Tring
          </span>
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/3"
              style={{
                x: useTransform(scrollYProgress, [0, 1], ["-40%", "340%"]),
                background: "linear-gradient(90deg, transparent, rgb(var(--accent-rgb) / 0.14), transparent)",
              }}
            />
          )}
        </motion.div>
      </div>
    </footer>
  );
}
