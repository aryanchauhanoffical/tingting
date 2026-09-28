import type { Metadata } from "next";
import { Fragment } from "react";
import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand } from "@/components/page/Section";
import { PricingPlans } from "@/components/page/PricingPlans";
import { Faq } from "@/components/page/Faq";
import { PLAN_MATRIX, PRICING_FAQ } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Four plans, metered in minutes. Included minutes, line limits and what each tier unlocks.",
};

export default function PricingPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Pricing"
        title="Priced in minutes, because that is what a call costs."
        lead="Pick the plan by the volume you actually run. Minutes are metered in thirty second steps on connected calls, they reset on the first, and nothing upgrades itself behind your back."
      />

      <Section className="!pt-0">
        <PricingPlans />
        <p className="mt-8 text-center text-[0.88rem] text-muted">
          Phone numbers are billed separately at a fixed monthly rate per line, shown before you request one.
        </p>
      </Section>

      <Section tone="wash">
        <SectionHead eyebrow="Compare" title="Everything, side by side." />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[38%] pb-4 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-faint">Feature</th>
                {PLAN_MATRIX.columns.map((c) => (
                  <th key={c} className="pb-4 font-display text-[0.95rem] font-semibold text-ink">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_MATRIX.groups.map((g) => (
                <Fragment key={g.title}>
                  <tr>
                    <td
                      colSpan={5}
                      className="border-t border-ink/15 pb-3 pt-7 text-[0.75rem] uppercase tracking-[0.14em] text-accent-ink"
                    >
                      {g.title}
                    </td>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th scope="row" className="py-3.5 pr-6 text-[0.92rem] font-normal text-muted">
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td key={i} className="py-3.5 pr-4">
                          {typeof v === "boolean" ? (
                            v ? (
                              <Check size={16} weight="bold" className="text-accent-ink" aria-label="Included" />
                            ) : (
                              <Minus size={16} className="text-faint" aria-label="Not included" />
                            )
                          ) : (
                            <span className="tabular text-[0.92rem] font-medium text-ink">{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead
            eyebrow="Questions"
            title="The things people ask before they sign."
            lead="If yours is not here, the fastest answer is a two line email to sales."
          />
          <Faq items={PRICING_FAQ} />
        </div>
      </Section>

      <CtaBand
        title="Tell us your call volume, get a number back today."
        lead="Roughly how many calls a week, in which languages, inbound or outbound. That is enough for us to quote you properly."
        primary={{ label: "Get a quote", href: "/contact" }}
        secondary={{ label: "Start the trial", href: "/demo" }}
      />
    </PageFrame>
  );
}
