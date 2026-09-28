import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand } from "@/components/page/Section";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at Tring Tring, and how the team works.",
};

const ROLES = [
  { title: "Senior speech infrastructure engineer", team: "Voice", place: "Remote, Europe or India", type: "Full time" },
  { title: "Applied AI engineer, dialogue", team: "Agents", place: "Remote", type: "Full time" },
  { title: "Product designer", team: "Product", place: "Remote, Europe", type: "Full time" },
  { title: "Telephony operations lead", team: "Carrier", place: "Chicago or remote US", type: "Full time" },
  { title: "Solutions engineer", team: "Go to market", place: "Remote, US East", type: "Full time" },
  { title: "Founding account executive", team: "Go to market", place: "Chicago", type: "Full time" },
];

const HOW = [
  { k: "Remote first", v: "Four countries, two overlap hours, written by default." },
  { k: "Small teams", v: "Three people and an owner. No committee ships a feature." },
  { k: "On the phone", v: "Everyone, including design and sales, listens to real calls weekly." },
  { k: "Equity", v: "Every full time role carries it. We will show you the maths." },
];

export default function CareersPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Careers"
        title="Work on the hardest 400 milliseconds in software."
        lead="A voice agent has to hear, think, look something up, and answer before a human notices the gap. If that constraint sounds fun rather than exhausting, we should talk."
      />

      <Section className="!pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((h) => (
            <div key={h.k} className="border-t border-ink pt-5">
              <p className="font-display text-lg font-semibold">{h.k}</p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{h.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="wash">
        <SectionHead
          eyebrow="Open roles"
          title="Six seats, all of them load bearing."
          lead="We hire slowly and then hand over a lot. Every listing below is a real opening with a real budget."
        />
        <ul className="mt-12 border-t border-line">
          {ROLES.map((r) => (
            <li key={r.title} className="border-b border-line">
              <a
                href="mailto:careers@tringtring.ai"
                className="group grid gap-2 py-6 sm:grid-cols-[1.4fr_0.6fr_0.8fr_auto] sm:items-center sm:gap-6"
              >
                <span className="font-display text-lg font-semibold text-ink">{r.title}</span>
                <span className="text-[0.88rem] text-muted">{r.team}</span>
                <span className="text-[0.88rem] text-muted">{r.place}</span>
                <span className="inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-accent-ink">
                  Apply
                  <ArrowUpRight
                    size={14}
                    weight="bold"
                    className="transition-transform duration-200 ease-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[0.92rem] text-muted">
          Nothing fits but you are certain you belong here? Write to careers@tringtring.ai and tell us what
          you would build first.
        </p>
      </Section>

      <CtaBand
        title="Hear what you would be working on."
        lead="Put your number in and an agent calls you back. That call is the product, and it is the interview topic."
        primary={{ label: "Make a test call", href: "/test-call" }}
        secondary={{ label: "Read about the team", href: "/about" }}
      />
    </PageFrame>
  );
}
