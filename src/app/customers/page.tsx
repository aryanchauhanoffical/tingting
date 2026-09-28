import type { Metadata } from "next";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand, StatStrip } from "@/components/page/Section";
import { TESTIMONIALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Customers",
  description: "How teams put Tring Tring on their phone lines, and what changed afterwards.",
};

/** Illustrative accounts, consistent with the names used across the site (mock). */
const CASES = [
  {
    company: "Kettleworks",
    sector: "B2B software",
    metric: "+38%",
    metricLabel: "booked demos",
    problem:
      "Inbound demo requests arrived around the clock from three continents, and a lead that waited until the next working morning converted at less than half the rate of one called back inside five minutes.",
    solution:
      "An outbound agent now calls every new form fill within ninety seconds, qualifies against their scoring rules, and books straight into the rep's calendar. Anything ambiguous is warm-transferred to whoever is on shift.",
    outcome: "Evening and weekend enquiries stopped going cold. The sales team kept the same headcount.",
  },
  {
    company: "Northbeam Health",
    sector: "Clinics, 14 sites",
    metric: "-52%",
    metricLabel: "average wait time",
    problem:
      "Two front-desk staff per site were answering appointment calls between patients, which meant long holds at exactly the busiest hours and a steady stream of abandoned calls.",
    solution:
      "An inbound agent answers on the first ring, confirms, reschedules and cancels, and speaks the four languages the clinics actually serve. Anything clinical goes straight to a nurse with the transcript attached.",
    outcome: "Front desk went back to the people in front of them. No-shows fell alongside the wait times.",
  },
  {
    company: "Lumen Collections",
    sector: "Financial services",
    metric: "3.4x",
    metricLabel: "more calls handled",
    problem:
      "Every conversation had to be compliant, and compliance was checked by sampling one call in fifty, weeks after the fact.",
    solution:
      "Agents run the regulated script with guardrails, verify identity, and take payment on the line. Every call is scored against the same rubric the QA team used, in real time, before anyone reviews it.",
    outcome: "Coverage went from a 2 percent sample to every call, and the review queue is now exceptions only.",
  },
];

const NUMBERS = [
  { value: "21", label: "languages live across accounts" },
  { value: "<400ms", label: "median response on the voice path" },
  { value: "98%", label: "automated QA pass rate" },
  { value: "24/7", label: "coverage with no shift pattern" },
];

export default function CustomersPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Customers"
        title="The call that used to go to voicemail."
        lead="Three teams, three very different phone problems. The pattern underneath is the same one every time: the conversation was already worth having, it just arrived at an hour nobody was there to take it."
      />

      <Section className="!pt-0">
        <StatStrip items={NUMBERS} />
      </Section>

      <Section tone="wash">
        <SectionHead eyebrow="Case studies" title="What actually changed." />
        <div className="mt-12 flex flex-col gap-4">
          {CASES.map((c) => (
            <article
              key={c.company}
              className="grid gap-8 rounded-[var(--radius-lg)] border border-line bg-surface p-7 shadow-soft lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-10"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold">{c.company}</h3>
                <p className="mt-1.5 text-[0.88rem] text-muted">{c.sector}</p>
                <div className="mt-8 border-t border-line pt-6">
                  <div className="font-display tabular text-4xl font-semibold text-accent-ink">{c.metric}</div>
                  <div className="mt-1.5 text-[0.88rem] text-muted">{c.metricLabel}</div>
                </div>
              </div>
              <dl className="grid gap-5">
                {[
                  { k: "The problem", v: c.problem },
                  { k: "What they run", v: c.solution },
                  { k: "Where it landed", v: c.outcome },
                ].map((row) => (
                  <div key={row.k}>
                    <dt className="text-[0.75rem] uppercase tracking-[0.12em] text-faint">{row.k}</dt>
                    <dd className="mt-2 leading-relaxed text-muted">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="In their words" title="Said on the record." />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-soft">
              <blockquote className="font-display text-lg leading-snug text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-8 border-t border-line pt-5">
                <div className="font-medium text-ink">{t.name}</div>
                <div className="mt-0.5 text-[0.88rem] text-muted">
                  {t.role}, {t.company}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-[0.82rem] text-faint">
          Accounts on this page are illustrative while our first reference customers finish their approvals.
        </p>
      </Section>

      <CtaBand
        title="See it on your own numbers."
        lead="A pilot takes a week: one agent, one call flow, your real traffic, and a QA report at the end of it."
        primary={{ label: "Book a demo", href: "/demo" }}
        secondary={{ label: "Make a test call", href: "/test-call" }}
      />
    </PageFrame>
  );
}
