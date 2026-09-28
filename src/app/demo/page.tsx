import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section } from "@/components/page/Section";
import { ContactForm } from "@/components/page/ContactForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Thirty minutes, your own call flow, running live on a real number.",
};

const AGENDA = [
  {
    t: "Minutes 0 to 5",
    b: "You tell us the call you lose most often. The one that arrives at the wrong hour or in the wrong language.",
  },
  {
    t: "Minutes 5 to 20",
    b: "We build that agent in front of you: prompt, voice, knowledge, calendar, escalation rule. No slides.",
  },
  {
    t: "Minutes 20 to 30",
    b: "You call it from your own phone, then we open the transcript, the QA score and the webhook payload together.",
  },
];

export default function DemoPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Book a demo"
        title="Thirty minutes. Your call flow, live on a real number."
        lead="We do not run a slide deck. We build the agent you actually need during the call, you ring it yourself, and you leave with a working number and the transcript of the conversation you just had with it."
      />

      <Section className="!pt-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-xl font-semibold">What the half hour looks like</h2>
            <ol className="mt-6 border-t border-line">
              {AGENDA.map((a, i) => (
                <li key={a.t} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[3rem_1fr] sm:gap-6">
                  <span className="tabular text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-medium text-ink">{a.t}</p>
                    <p className="mt-1.5 text-[0.93rem] leading-relaxed text-muted">{a.b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-6">
              <p className="font-medium text-ink">Not ready to put it in a calendar?</p>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
                The test call needs no meeting and no signup. An agent rings your phone in about ten
                seconds and you can hang up on it whenever you like.
              </p>
              <Link href="/test-call" className="mt-4 inline-block font-medium text-accent-ink">
                Make a test call instead
              </Link>
            </div>
          </div>

          <ContactForm
            intents={[
              "Inbound support and reception",
              "Outbound sales and qualification",
              "Reminders and no-show reduction",
              "Collections and verification",
              "Something else",
            ]}
            submitLabel="Request a time"
          />
        </div>
      </Section>
    </PageFrame>
  );
}
