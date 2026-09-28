import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section } from "@/components/page/Section";
import { ContactForm } from "@/components/page/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to sales, support, press or the legal team at Tring Tring.",
};

const ROUTES = [
  { label: "Sales", detail: "Pricing, pilots, and anything with a contract attached.", email: "sales@tringtring.ai" },
  { label: "Support", detail: "Something is wrong with a live agent or a number.", email: "support@tringtring.ai" },
  { label: "Press", detail: "Interviews, briefings, and the brand kit.", email: "press@tringtring.ai" },
  { label: "Security", detail: "Report a vulnerability. We answer these first.", email: "security@tringtring.ai" },
];

export default function ContactPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Contact"
        title="Start a conversation, or just make us take the call."
        lead="Write to the right inbox below and a person answers inside one working day. If you would rather hear the product than read about it, put your number into the test call and an agent rings you back in seconds."
      />

      <Section className="!pt-0">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-xl font-semibold">Where to send it</h2>
            <ul className="mt-6 border-t border-line">
              {ROUTES.map((r) => (
                <li key={r.label} className="border-b border-line py-5">
                  <a href={`mailto:${r.email}`} className="group block">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium text-ink">{r.label}</span>
                      <span className="text-[0.85rem] text-accent-ink transition-opacity group-hover:opacity-70">
                        {r.email}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{r.detail}</p>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-6">
              <p className="text-[0.85rem] font-medium text-ink">Rather talk than type?</p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                Our own agent answers the main line, in English, Spanish, Hindi and eleven more. It will
                book the meeting for you.
              </p>
              <Link href="/test-call" className="mt-4 inline-block font-medium text-accent-ink">
                Make it call you
              </Link>
            </div>
          </div>

          <ContactForm
            intents={["Pricing and plans", "A pilot for my team", "Technical question", "Partnership", "Press", "Something else"]}
            submitLabel="Send to the team"
          />
        </div>
      </Section>
    </PageFrame>
  );
}
