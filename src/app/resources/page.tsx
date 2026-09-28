import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand, Card, ArrowLink } from "@/components/page/Section";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides, documentation, the changelog and the brochure for Tring Tring.",
};

const SHELVES = [
  {
    title: "Start here",
    items: [
      { t: "Quickstart: your first agent in 20 minutes", d: "Prompt, voice, number, first live call.", href: "/product" },
      { t: "Choosing between inbound and outbound", d: "Which one earns its keep first, and why.", href: "/solutions" },
      { t: "What a good voice prompt looks like", d: "Six patterns that survive contact with real callers.", href: "/product#agents" },
    ],
  },
  {
    title: "Operating it",
    items: [
      { t: "Scoring calls without a QA team", d: "Build a rubric the grader can actually apply.", href: "/product#qa" },
      { t: "Consent, disclosure and calling hours", d: "The settings to get right before your first campaign.", href: "/security" },
      { t: "Escalation that does not annoy people", d: "When to hand over, and what to hand over with it.", href: "/solutions#inbound" },
    ],
  },
  {
    title: "Reference",
    items: [
      { t: "API and webhooks", d: "Place calls, read transcripts, subscribe to outcomes.", href: "/integrations#api" },
      { t: "Voice and language coverage", d: "Every voice, every locale, and what each is good at.", href: "/voices" },
      { t: "Security and compliance", d: "Controls, documents and the disclosure process.", href: "/security" },
    ],
  },
];

const CHANGELOG = [
  { date: "18 Sep 2026", title: "Live QA grading on every call", body: "Rubric scoring now runs during the call rather than after it, so a failing call can be escalated while it is still open." },
  { date: "02 Sep 2026", title: "Five more languages", body: "Polish, Turkish, Vietnamese, Tagalog and Ukrainian joined the voice set, with matching transcription." },
  { date: "21 Aug 2026", title: "Campaign consent controls", body: "Disclosure, recording and consent are now per campaign, and the setting in force is stamped on each call." },
];

export default function ResourcesPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Resources"
        title="Everything we know about putting an agent on a phone line."
        lead="Written by the team that runs the calls. Short pieces, mostly about the unglamorous parts: endpointing, consent, escalation, and what to do when the caller starts shouting."
        actions={
          <Link
            href="/contact"
            className="group inline-flex h-12 items-center gap-2 rounded-[12px] border border-line bg-surface px-6 font-medium text-ink shadow-soft transition-all duration-200 ease-signal hover:-translate-y-0.5 hover:border-ink/30"
          >
            Request the brochure (PDF)
            <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <Section className="!pt-0">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {SHELVES.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-lg font-semibold">{s.title}</h2>
              <ul className="mt-5 border-t border-line">
                {s.items.map((it) => (
                  <li key={it.t} className="border-b border-line">
                    <Link href={it.href} className="group block py-5">
                      <span className="block font-medium leading-snug text-ink transition-colors group-hover:text-accent-ink">
                        {it.t}
                      </span>
                      <span className="mt-1.5 block text-[0.88rem] leading-relaxed text-muted">{it.d}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="wash">
        <SectionHead eyebrow="Changelog" title="What shipped recently." lead="We publish every change that touches a live call." />
        <ol className="mt-12 border-t border-line">
          {CHANGELOG.map((c) => (
            <li key={c.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[8rem_1fr_1.3fr] sm:items-baseline sm:gap-8">
              <span className="tabular text-sm text-faint">{c.date}</span>
              <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              <p className="text-[0.93rem] leading-relaxed text-muted">{c.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="font-display text-lg font-semibold">Status</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              Live uptime for call handling, transcription and the API, with incident history.
            </p>
            <div className="mt-5">
              <ArrowLink href="/contact">Open the status page</ArrowLink>
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-semibold">Brochure</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              A six page PDF for the people in the room who will not sit through a demo.
            </p>
            <div className="mt-5">
              <ArrowLink href="/contact">Request a copy</ArrowLink>
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-semibold">Brand kit</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              Logo files, colour values and the rules for using them in your own materials.
            </p>
            <div className="mt-5">
              <ArrowLink href="/trademark">Read the guidelines</ArrowLink>
            </div>
          </Card>
        </div>
      </Section>

      <CtaBand
        title="Skip the reading."
        lead="One test call explains more than any of the pages above. It takes about ninety seconds and needs no account."
      />
    </PageFrame>
  );
}
