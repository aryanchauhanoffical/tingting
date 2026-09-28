import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand } from "@/components/page/Section";
import { USE_CASES } from "@/lib/pages";
import { INDUSTRIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Four ways teams put a voice agent to work, and what it looks like in six industries.",
};

/** The industry anchors the Solutions menu points at, in menu order. */
const INDUSTRY_IDS: Record<string, string> = {
  "Real estate": "real-estate",
  Healthcare: "healthcare",
  Fintech: "fintech",
  "E-commerce": "ecommerce",
  Travel: "travel",
  Education: "education",
};

export default function SolutionsPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Solutions"
        title="Four jobs worth handing to an agent first."
        lead="Every team starts somewhere different, but the first agent that pays for itself is almost always one of these. Pick the one that matches the calls you are losing."
        actions={
          <div className="flex flex-wrap gap-2">
            {USE_CASES.map((u) => (
              <Link
                key={u.id}
                href={`#${u.id}`}
                className="inline-flex h-10 items-center rounded-[10px] border border-line bg-surface px-4 text-[0.9rem] font-medium text-ink transition-colors duration-200 ease-signal hover:border-ink/40"
              >
                {u.label}
              </Link>
            ))}
          </div>
        }
      />

      {USE_CASES.map((u, i) => (
        <Section key={u.id} id={u.id} tone={i % 2 === 1 ? "wash" : "light"}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHead eyebrow={u.label} title={u.title} />
              <p className="mt-5 max-w-xl leading-relaxed text-muted">{u.body}</p>
              <div className="mt-8 inline-flex flex-col gap-1 border-l-0 border-t border-ink pt-4">
                <span className="text-[0.75rem] uppercase tracking-[0.12em] text-faint">{u.proof.k}</span>
                <span className="font-display text-lg font-semibold">{u.proof.v}</span>
              </div>
            </div>
            <ul className="flex flex-col justify-center gap-4">
              {u.points.map((p) => (
                <li key={p} className="flex items-start gap-3 border-b border-line pb-4 last:border-0">
                  <Check size={16} weight="bold" className="mt-1 shrink-0 text-accent-ink" />
                  <span className="leading-relaxed text-ink">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ))}

      <Section tone="ink">
        <SectionHead
          tone="ink"
          eyebrow="By industry"
          title="The same machine, six different conversations."
          lead="What changes between these is the script, the knowledge the agent reads from, and what counts as a good outcome. The plumbing underneath does not move."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind) => (
            <article key={ind.name} id={INDUSTRY_IDS[ind.name]} className="scroll-mt-32 bg-ink p-7">
              <h3 className="font-display text-xl font-semibold text-white">{ind.name}</h3>
              <p className="mt-2 text-[0.9rem] font-medium text-accent-soft">{ind.outcome}</p>
              <p className="mt-4 text-[0.92rem] leading-relaxed text-white/55">{ind.blurb}</p>
              <p className="tabular mt-6 border-t border-white/10 pt-4 text-[0.82rem] text-white/45">{ind.line}</p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Not sure which one to start with?"
        lead="Tell us the call you lose most often and we will build that agent on the demo, in front of you, and let you ring it."
        primary={{ label: "Book a demo", href: "/demo" }}
        secondary={{ label: "See the product", href: "/product" }}
      />
    </PageFrame>
  );
}
