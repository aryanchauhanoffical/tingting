import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, NumberedRows, CtaBand, StatStrip, ArrowLink } from "@/components/page/Section";
import { Button } from "@/components/ui/Button";
import { PRODUCT_PILLARS } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Agents, voices, numbers, campaigns, live QA and the API. Everything that turns a phone line into something that answers.",
};

const NUMBERS = [
  { value: "<400ms", label: "median response on the voice path" },
  { value: "6", label: "voices across six locales" },
  { value: "7", label: "node types in the flow builder" },
  { value: "15min", label: "hard cap on every call, every plan" },
];

export default function ProductPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Product"
        title="A phone system with something behind it that listens."
        lead="Carriers, speech, reasoning, tools, scoring and the paper trail. You configure an agent and point a number at it; everything underneath is our problem."
        actions={
          <>
            <Button href="/test-call" size="lg">
              Make a test call
            </Button>
            <Button href="/demo" variant="outline" size="lg">
              Book a demo
            </Button>
          </>
        }
      />

      <Section className="!pt-0">
        <StatStrip items={NUMBERS} />

        {/* jump list: six pillars, one hairline row each */}
        <nav aria-label="On this page" className="mt-14 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_PILLARS.map((p, i) => (
            <Link
              key={p.id}
              href={`#${p.id}`}
              className="group flex items-baseline gap-4 border-t border-line py-4 transition-colors hover:border-ink"
            >
              <span className="tabular text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-lg font-semibold transition-colors group-hover:text-accent-ink">
                {p.eyebrow}
              </span>
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-[0.95rem] text-muted">
          The voice itself, and the six locales behind it, have a page of their own.{" "}
          <ArrowLink href="/voices">Voices and languages</ArrowLink>
        </p>
      </Section>

      {PRODUCT_PILLARS.map((p, i) => (
        <Section key={p.id} id={p.id} tone={i % 2 === 1 ? "wash" : "light"}>
          <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
          <NumberedRows items={p.rows} />
        </Section>
      ))}

      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHead
            tone="ink"
            eyebrow="Who can see what"
            title="Two roles, five switches, one log."
          />
          <div className="max-w-xl">
            <p className="leading-relaxed text-white/65">
              Admins run the workspace. Everyone else gets exactly what you switch on, so a coordinator
              can read transcripts without being able to play audio or touch a live agent.
            </p>
            <ul className="mt-8 border-t border-white/10">
              {[
                ["Listen to recordings", "Play audio. Every play is written to the access log with a name."],
                ["Read transcripts", "Open the transcript and summary of any call."],
                ["Edit agents", "Change and publish flows. Publishing creates a new immutable version."],
                ["Manage numbers", "Assign, reassign, release and request lines."],
                ["Plan and usage", "See minutes, limits, and talk to sales."],
              ].map(([k, v]) => (
                <li key={k} className="grid gap-1 border-b border-white/10 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <span className="font-medium text-white">{k}</span>
                  <span className="text-[0.92rem] leading-relaxed text-white/55">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.92rem] leading-relaxed text-white/45">
              Nobody on our side can open your calls by default. Supporting you takes a time-boxed grant to
              one named person, it shows in your members list while it is live, and everything they open
              lands in your log.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="It is easier to hear than to read."
        lead="Put your number in and an agent rings you back in about ten seconds. Then look at the transcript it wrote about the two of you."
      />
    </PageFrame>
  );
}
