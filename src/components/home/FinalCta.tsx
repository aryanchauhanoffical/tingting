"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { TestCallWidget } from "@/components/shell/TestCallWidget";
import { GradientOrb } from "@/components/motion/GradientOrb";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * H12 — Final CTA band + live test-call. The signature close.
 */
export function FinalCta() {
  return (
    <section id="test-call" className="page py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-ink px-6 py-16 text-white sm:px-12">
        <GradientOrb className="left-1/2 top-[-40%] h-[520px] w-[520px] -translate-x-1/2" intensity={0.4} />

        {/* ambient ripple slot — drop a video loop here later (see VIDEO PROMPT H12) */}
        {/* <video className="absolute inset-0 h-full w-full object-cover opacity-20" autoPlay muted loop playsInline poster="/video/ripple-poster.jpg"><source src="/video/ripple.webm" type="video/webm" /></video> */}

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <ScrollReveal>
            <h2 className="font-display text-display font-semibold">Hear it for yourself.</h2>
            <p className="mt-4 max-w-md text-lg text-white/60">
              Type your number and a Tring Tring agent calls you in seconds. No signup, no deck, just the product on the line.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {["Live in under 5 seconds", "Speaks your language", "Scored the moment it ends"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-white/80">
                  <CheckCircle weight="fill" size={18} className="text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/demo" variant="outline" className="border-white/20 bg-white/5 text-white hover:border-white/40">
                Book a full demo instead
              </Button>
            </div>
          </ScrollReveal>

          <TestCallWidget />
        </div>
      </div>
    </section>
  );
}
