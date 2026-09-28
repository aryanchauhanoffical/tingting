import type { Metadata } from "next";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, NumberedRows, Card, CtaBand, ArrowLink } from "@/components/page/Section";
import { COMPLIANCE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Security and compliance",
  description: "How Tring Tring protects call data, and the controls you get over consent, retention and access.",
};

const CONTROLS = [
  {
    title: "Encryption everywhere",
    body: "TLS 1.3 in transit, AES-256 at rest, and SRTP on the media path. Keys are managed per region and rotated on a schedule.",
  },
  {
    title: "Access that expires",
    body: "Role based access inside your workspace, hardware keys and just-in-time elevation for our staff, and an audit log that records who opened which call.",
  },
  {
    title: "Retention you set",
    body: "Choose a window from 7 days to 7 years per workspace. Deleting a call removes the audio, the transcript and the derived scores together.",
  },
  {
    title: "Consent on the record",
    body: "Per-campaign disclosure, recording and consent switches, with the setting that was in force stamped onto every call for later review.",
  },
  {
    title: "Data residency",
    body: "Pin a workspace to a region and call data stays there, including transcripts and model context. Cross-border transfers run on Standard Contractual Clauses.",
  },
  {
    title: "Your data is not training data",
    body: "We do not train general purpose models on your audio or transcripts. Tuning that improves your agents happens inside your workspace and stays there.",
  },
];

const DOCS = [
  {
    t: "Data processing agreement",
    d: "Our standard DPA, with Standard Contractual Clauses and the UK addendum. Available today.",
    href: "/contact",
  },
  {
    t: "Subprocessor list",
    d: "Every vendor that can touch call data, and notice before we add one. Available today.",
    href: "/contact",
  },
  {
    t: "Security questionnaire",
    d: "Send us yours. We answer in your format rather than pointing you at a portal.",
    href: "/contact",
  },
  {
    t: "SOC 2 Type II",
    d: "In progress. We are in the observation window and will share the report and our current control set when it closes. Ask and we will tell you exactly where it stands.",
    href: "/contact",
  },
];

export default function SecurityPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Security"
        title="Calls are the most sensitive data you own."
        lead="People say things out loud on the phone they would never type into a form: card numbers, medical detail, a reason they are behind on a payment. Everything below exists because of that."
        actions={
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {COMPLIANCE.map((c) => (
              <span key={c} className="tabular text-[0.8rem] text-muted">
                {c}
              </span>
            ))}
          </div>
        }
      />

      <Section className="!pt-0">
        <NumberedRows items={CONTROLS} />
      </Section>

      <Section tone="wash">
        <SectionHead
          eyebrow="Documentation"
          title="The paperwork your reviewer will ask for."
          lead="Ask for any of these and we will tell you plainly what exists today and what is still in progress. Questionnaires come back inside three working days."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {DOCS.map((d) => (
            <Card key={d.t}>
              <h3 className="font-display text-lg font-semibold">{d.t}</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{d.d}</p>
              <div className="mt-5">
                <ArrowLink href={d.href}>Request it</ArrowLink>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHead eyebrow="Disclosure" title="Found something? Tell us first." />
          <div className="max-w-xl space-y-5 leading-relaxed text-muted">
            <p>
              Send it to security@tringtring.ai. We acknowledge inside one working day, give you a
              severity assessment inside three, and keep you updated until it is closed.
            </p>
            <p>
              Test against your own workspace only. Do not touch other tenants, do not run load or
              denial-of-service tests, and do not access call recordings that are not yours. Stay inside
              those lines and we will not pursue you, and we will credit you if you want the credit.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Send us the questionnaire."
        lead="Most reviews stall on a missing document. Ask for the set up front and we will have your security team unblocked this week."
        primary={{ label: "Contact security", href: "/contact" }}
        secondary={{ label: "Read the privacy policy", href: "/privacy" }}
      />
    </PageFrame>
  );
}
