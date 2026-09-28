"use client";

import Link from "next/link";
import { ShieldCheck, LockKey, ArrowRight } from "@phosphor-icons/react";
import { RevealGroup, RevealItem } from "@/components/motion/ScrollReveal";
import { COMPLIANCE } from "@/lib/content";

/**
 * H11 — Trust & compliance band. Badge row + one security line. Deliberately
 * quiet: no charts, no motion theatre, just enterprise reassurance.
 */
export function Compliance() {
  return (
    <section className="page pb-8 pt-4">
      <div className="rounded-[var(--radius-lg)] border border-line bg-surface px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 text-accent-ink">
              <LockKey weight="fill" size={18} />
              <span className="text-sm font-medium">Enterprise-grade from the first call</span>
            </span>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink/80">
              Calls are encrypted in transit and at rest, with configurable data residency and full audit logs.
            </p>
            <Link href="#" className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-ink">
              Read our security posture
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {COMPLIANCE.map((c) => (
              <RevealItem key={c}>
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-bg px-3 py-4 text-center">
                  <ShieldCheck weight="duotone" size={24} className="text-accent" />
                  <span className="tabular text-[0.72rem] leading-tight text-ink/70">{c}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
