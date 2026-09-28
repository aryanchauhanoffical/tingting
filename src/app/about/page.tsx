import type { Metadata } from "next";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, NumberedRows, CtaBand, FactList } from "@/components/page/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: "Why we build voice agents, how we work, and who is behind Tring Tring.",
};

const PRINCIPLES = [
  {
    title: "Latency is a feature, not a metric",
    body: "A pause long enough to notice is a pause long enough to lose the caller. We budget milliseconds the way other teams budget money, and we publish the number.",
  },
  {
    title: "Every call is evidence",
    body: "Nothing ships on a demo call. Transcripts, scores and outcomes go into the same view your team uses, so a claim about quality can always be checked against a real call.",
  },
  {
    title: "The agent says who it is",
    body: "Our agents disclose that they are automated when the law asks and when the moment asks. Trust is the whole product; nobody buys a machine that lies about being one.",
  },
  {
    title: "A human is always one sentence away",
    body: "The best automated call is the one that knows when to stop. Escalation is a first-class path, not an error state, and it carries the full context with it.",
  },
];

const FACTS = [
  { k: "Founded", v: "2024" },
  { k: "Part of", v: "GlobalVox" },
  { k: "Team", v: "Distributed, 4 countries" },
  { k: "Languages live", v: "21" },
  { k: "Focus", v: "Voice only" },
];

export default function AboutPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="About"
        title={
          <>
            We are building the phone line
            <br className="hidden sm:block" /> that answers.
          </>
        }
        lead="Tring Tring started from a plain observation: most businesses still lose their best conversations to a hold queue, a voicemail, or an hour that happens to be outside office hours. So we built an agent that picks up."
        actions={
          <>
            <Button href="/careers" size="lg">
              See open roles
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Talk to us
            </Button>
          </>
        }
        aside={<FactList items={FACTS} />}
      />

      <Section tone="wash">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHead eyebrow="The story" title="It began with a missed call." />
          <div className="max-w-xl space-y-5 text-[1.02rem] leading-relaxed text-muted">
            <p>
              Our founding team spent years building telephony for enterprises, watching the same pattern
              repeat in every deployment. The call volume was never the problem. The problem was that a
              conversation worth thousands arrived at 9pm on a Sunday and met a recorded message.
            </p>
            <p>
              Language models changed what was possible in that moment, but a model on its own is not a
              phone system. It needs carriers, endpointing, barge-in, retries, consent, scoring, and a way
              to hand a live human the thread mid sentence. That plumbing is what we actually build.
            </p>
            <p>
              Today Tring Tring runs inbound and outbound calls for teams in real estate, healthcare,
              finance and logistics, in 21 languages, with every call transcribed, scored and auditable.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="How we work"
          title="Four things we refuse to negotiate."
          lead="These decide what we build next, and more often, what we do not."
        />
        <NumberedRows items={PRINCIPLES} />
      </Section>

      <CtaBand
        title="Come and see whether it works."
        lead="The fastest way to understand what we do is to let an agent call you. It takes about ninety seconds."
      />
    </PageFrame>
  );
}
