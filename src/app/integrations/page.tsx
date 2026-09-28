import type { Metadata } from "next";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand, Card } from "@/components/page/Section";
import { IntegrationBrowser } from "@/components/page/IntegrationBrowser";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Native connectors, tools the agent can call mid-conversation, and a REST API with webhooks.",
};

/** The connectors that exist in the product today. */
const NATIVE = [
  { name: "Zoho CRM", kind: "CRM", desc: "Push call outcomes and callbacks straight onto the lead." },
  { name: "HubSpot", kind: "CRM", desc: "Sync contacts and log every call on the timeline." },
  { name: "WhatsApp Business", kind: "Messaging", desc: "Send a location card or a confirmation after the call." },
  { name: "Google Sheets", kind: "Sheets", desc: "Read a list from a sheet, write the results back to it." },
  { name: "Google Calendar", kind: "Calendar", desc: "Book a callback into a real calendar, on the call." },
  { name: "Zapier", kind: "Automation", desc: "Reach the six thousand apps we have not built yet." },
];

const TOOLS = [
  { t: "HTTP request", d: "Any method, your headers, your timeout. The agent says it is checking and carries on gracefully if your endpoint is slow." },
  { t: "MCP server", d: "Point at a server, refresh its function list, and choose which functions the agent may call." },
  { t: "Transfer to a human", d: "Hands the live call over with the transcript so far attached." },
  { t: "WhatsApp message", d: "Sends a card to the caller while they are still on the line." },
  { t: "End call", d: "Closes politely. Built in, nothing to configure." },
];

const EVENTS = [
  ["call.started", "A call connected"],
  ["call.completed", "A call ended, with duration and outcome"],
  ["call.summary", "The written summary is ready"],
  ["call.transferred", "The agent handed over to a person"],
  ["campaign.completed", "Every contact in a campaign has been worked"],
  ["number.assigned", "A number was attached to an agent"],
];

const SCOPES = [
  ["calls:read", "List calls, summaries and outcomes"],
  ["recordings:read", "Download recordings, where the plan allows it"],
  ["campaigns:write", "Create, start and pause campaigns"],
  ["numbers:read", "List numbers and their assignments"],
];

export default function IntegrationsPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Integrations"
        title="The call is only useful if it lands somewhere."
        lead="Outcomes, callbacks and everything the agent collected go into the systems your team already opens each morning. What we have not built, the API and webhooks will reach."
      />

      <Section className="!pt-0">
        <SectionHead eyebrow="Connected directly" title="Six that need no code." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NATIVE.map((n) => (
            <Card key={n.name}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{n.name}</h3>
                <span className="tabular text-[0.66rem] uppercase tracking-wider text-faint">{n.kind}</span>
              </div>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{n.desc}</p>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-[0.88rem] text-muted">
          Connecting one starts the sync from that moment. Nothing is backfilled, so your history stays as it was.
        </p>
      </Section>

      <Section tone="wash">
        <SectionHead
          eyebrow="Tools"
          title="What the agent can reach for mid-sentence."
          lead="A tool is something the agent decides to use while it is talking, based on a description you write for it."
        />
        <ol className="mt-12 border-t border-line">
          {TOOLS.map((t, i) => (
            <li key={t.t} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[4rem_1fr_1.4fr] sm:items-baseline sm:gap-8">
              <span className="tabular text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-semibold">{t.t}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{t.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="api" tone="ink">
        <SectionHead
          tone="ink"
          eyebrow="API and webhooks"
          title="REST, JSON, bearer auth."
          lead="Scoped keys, shown once and revocable instantly. Sixty requests a minute per key. Webhooks are signed with your secret and retried with backoff for 24 hours."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-[0.78rem] uppercase tracking-[0.12em] text-accent-soft">Events</h3>
            <ul className="mt-5 border-t border-white/10">
              {EVENTS.map(([e, d]) => (
                <li key={e} className="grid gap-1 border-b border-white/10 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <code className="tabular text-[0.85rem] text-white">{e}</code>
                  <span className="text-[0.9rem] text-white/55">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[0.78rem] uppercase tracking-[0.12em] text-accent-soft">Key scopes</h3>
            <ul className="mt-5 border-t border-white/10">
              {SCOPES.map(([s, d]) => (
                <li key={s} className="grid gap-1 border-b border-white/10 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <code className="tabular text-[0.85rem] text-white">{s}</code>
                  <span className="text-[0.9rem] text-white/55">{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.9rem] leading-relaxed text-white/45">
              The builder also has a trigger node, so an agent flow can be started by a POST from your own
              system rather than by a phone call.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Directory"
          title="Everything else, over Zapier or the API."
          lead="These are the tools teams ask for most. Each is reachable today through an HTTP tool, a webhook, or Zapier, and the popular ones become native connectors over time."
        />
        <div className="mt-12">
          <IntegrationBrowser />
        </div>
      </Section>

      <CtaBand
        title="Tell us what it has to talk to."
        lead="Bring the stack you already run. We will show you on the demo exactly where a finished call ends up inside it."
        primary={{ label: "Book a demo", href: "/demo" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </PageFrame>
  );
}
