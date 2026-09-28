/**
 * Placeholder content for the Tring Tring site.
 * All numbers/names are illustrative mock data — swap for real data later.
 * (Marked mock per the design-taste "fake-precise numbers" rule.)
 */

export const BRAND = {
  name: "Tring Tring",
  tagline: "Voice agents that close the loop.",
};

export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
  { label: "Resources", href: "/resources" },
];

export const SOLUTIONS_MENU = {
  useCase: {
    title: "By use case",
    items: [
      { label: "Outbound sales", desc: "Qualify and follow up at scale", href: "/solutions#outbound" },
      { label: "Inbound support", desc: "Answer, triage, resolve 24/7", href: "/solutions#inbound" },
      { label: "Reminders & follow-ups", desc: "Cut no-shows automatically", href: "/solutions#reminders" },
      { label: "Collections", desc: "Recover balances, politely", href: "/solutions#collections" },
    ],
  },
  industry: {
    title: "By industry",
    items: [
      { label: "Real estate", desc: "Book viewings while leads are warm", href: "/solutions#real-estate" },
      { label: "Healthcare", desc: "Scheduling and intake, HIPAA-ready", href: "/solutions#healthcare" },
      { label: "Fintech", desc: "Verification and collections", href: "/solutions#fintech" },
      { label: "E-commerce", desc: "Order status and win-back", href: "/solutions#ecommerce" },
    ],
  },
};

/* H3 — Proof metrics (mock) */
export const STATS = [
  { value: 380, prefix: "<", suffix: "ms", label: "median voice response latency", kind: "latency" as const },
  { value: 21, prefix: "", suffix: "+", label: "languages spoken natively", kind: "globe" as const },
  { value: 124, prefix: "", suffix: "K/hr", label: "concurrent calls at peak", kind: "throughput" as const },
  { value: 98, prefix: "", suffix: "%", label: "automated call-QA pass rate", kind: "qa" as const },
];

/* H4 — Pipeline stages */
export const PIPELINE = [
  { key: "listen", title: "Speech to text", body: "Streaming transcription with endpointing, so the agent hears a caller finish before it thinks.", icon: "microphone" },
  { key: "understand", title: "Intent + reasoning", body: "The LLM brain reads intent, recalls context, and picks the next best action.", icon: "brain" },
  { key: "lookup", title: "Tools + CRM", body: "It looks up the account, checks the calendar, and pulls the order in real time.", icon: "database" },
  { key: "speak", title: "Text to speech", body: "A human-quality voice responds in under 400ms, in the caller's own language.", icon: "speaker" },
  { key: "score", title: "Live QA scoring", body: "Every turn is scored for relevance, adherence, and sentiment as it happens.", icon: "shield" },
  { key: "outcome", title: "Outcome", body: "Booked, resolved, or escalated to a human with the full transcript attached.", icon: "check" },
];

/* H5 — Inbound / Outbound */
export const CAPABILITY = {
  outbound: {
    title: "Outbound",
    lead: "Reach every lead the minute they are worth reaching.",
    points: [
      "Qualify inbound leads in seconds, not days",
      "Follow up until you get an answer, never pushy",
      "Reminders and surveys that actually get picked up",
    ],
  },
  inbound: {
    title: "Inbound",
    lead: "Answer on the first ring, at any hour, in any language.",
    points: [
      "Triage and route with full context attached",
      "Book, reschedule, and confirm without a human",
      "Hand off to a person the moment it matters",
    ],
  },
};

/* H8 — Integrations (Simple Icons slugs) */
export const INTEGRATIONS = [
  { name: "HubSpot", slug: "hubspot", cat: "CRM", desc: "Sync contacts and log every call" },
  { name: "Salesforce", slug: "salesforce", cat: "CRM", desc: "Update records the moment a call ends" },
  { name: "Calendly", slug: "calendly", cat: "Calendar", desc: "Book straight into open slots" },
  { name: "Google Calendar", slug: "googlecalendar", cat: "Calendar", desc: "Check availability in real time" },
  { name: "WhatsApp", slug: "whatsapp", cat: "Comms", desc: "Follow up over chat after a call" },
  { name: "Twilio", slug: "twilio", cat: "Comms", desc: "Bring your own numbers, globally" },
  { name: "Shopify", slug: "shopify", cat: "Commerce", desc: "Pull order status while you talk" },
  { name: "Notion", slug: "notion", cat: "Data", desc: "Turn call notes into docs" },
  { name: "Airtable", slug: "airtable", cat: "Data", desc: "Route outcomes into your base" },
  { name: "Slack", slug: "slack", cat: "Comms", desc: "Ping the team on hot calls" },
  { name: "Zendesk", slug: "zendesk", cat: "Support", desc: "Open tickets with transcripts" },
  { name: "Stripe", slug: "stripe", cat: "Commerce", desc: "Take payment on the line" },
];

/* H9 — Industries. Each card shows one real call: caller + agent turns in a tilted
   call console, and `line` is what the agent closes that call with (typed out). */
export const INDUSTRIES = [
  {
    name: "Real estate",
    outcome: "Book more viewings before leads cool off",
    blurb:
      "Every enquiry gets answered the minute it lands, qualified against your listings, and booked straight into the agent's calendar.",
    icon: "buildings",
    caller: "Maya R.",
    turns: [
      { who: "caller", text: "Is the Elm Street flat still available this weekend?" },
      { who: "agent", text: "It is. I can hold Saturday at 11:00 for you." },
    ],
    line: "Viewing booked, Saturday 11:00",
  },
  {
    name: "Healthcare",
    outcome: "Cut no-shows with gentle confirmations",
    blurb:
      "Confirms, reschedules and reminds in the caller's language, so the front desk stops chasing and the waiting room fills.",
    icon: "heartbeat",
    caller: "Daniel K.",
    turns: [
      { who: "caller", text: "Is my Tuesday appointment still on?" },
      { who: "agent", text: "Yes, Dr. Osei at 9:30. Shall I send a reminder the night before?" },
    ],
    line: "Appointment confirmed for Tuesday",
  },
  {
    name: "Fintech",
    outcome: "Verify and collect without the wait",
    blurb: "Verifies identity, explains balances and collects on the line, with every step logged for compliance.",
    icon: "bank",
    caller: "Sofia M.",
    turns: [
      { who: "caller", text: "I want to set up a payment plan on my account." },
      { who: "agent", text: "Let's verify you first. What are the last four digits of your card?" },
    ],
    line: "Identity verified, payment plan set",
  },
  {
    name: "E-commerce",
    outcome: "Answer order questions in seconds",
    blurb: "Order status, returns and exchanges handled in seconds, at any hour, without a ticket ever being opened.",
    icon: "shoppingbag",
    caller: "Jonas W.",
    turns: [
      { who: "caller", text: "Where's my order? It was due yesterday." },
      { who: "agent", text: "Order 4471 is with the courier and lands Thursday. Want a text when it's out for delivery?" },
    ],
    line: "Order 4471 arrives Thursday",
  },
  {
    name: "Travel",
    outcome: "Rebook and support across time zones",
    blurb: "Rebooks, refunds and reassures across time zones, so a cancelled flight is a two-minute call, not a two-hour hold.",
    icon: "airplane",
    caller: "Aisha B.",
    turns: [
      { who: "caller", text: "My flight to Lisbon got cancelled, what now?" },
      { who: "agent", text: "I can put you on the 18:40 today at no charge. Shall I book it?" },
    ],
    line: "Rebooked on the 18:40 to Lisbon",
  },
  {
    name: "Education",
    outcome: "Guide applicants through every step",
    blurb: "Guides applicants and parents through deadlines, documents and fees, and hands off to admissions only when it matters.",
    icon: "graduationcap",
    caller: "Leo T.",
    turns: [
      { who: "caller", text: "I'm stuck on the application, what's next?" },
      { who: "agent", text: "You're on step 3 of 5: uploading transcripts. I'll walk you through it." },
    ],
    line: "Application step 3 of 5 complete",
  },
] as const;

/* The rest of the room: smaller calls fanned out under the case studies */
export const MORE_INDUSTRIES = [
  { name: "Travel", icon: "airplane", line: "Rebooked on the 18:40" },
  { name: "Education", icon: "graduationcap", line: "Application step 3 of 5" },
  { name: "Hospitality", icon: "forkknife", line: "Table for four held, 8 pm" },
  { name: "Logistics", icon: "truck", line: "Driver rerouted, ETA 14:20" },
  { name: "Insurance", icon: "shieldcheck", line: "Claim 2093 opened" },
  { name: "Automotive", icon: "car", line: "Service booked, Friday 9:00" },
  { name: "Legal", icon: "scales", line: "Consultation set, Mon 3 pm" },
  { name: "Telecom", icon: "cellsignal", line: "Plan upgraded, live today" },
  { name: "SaaS", icon: "cloud", line: "Trial extended by 14 days" },
  { name: "Utilities", icon: "lightning", line: "Outage logged, crew sent" },
  { name: "Recruiting", icon: "usersthree", line: "Interview set, Wed 10:00" },
] as const;

/* H10 — Testimonials (mock) */
export const TESTIMONIALS = [
  {
    quote: "We answer every after-hours call now. The booked-demo rate climbed within the first month.",
    metric: "+38%",
    metricLabel: "booked demos",
    name: "Priya Nair",
    role: "VP Revenue",
    company: "Kettleworks",
  },
  {
    quote: "Wait times that used to embarrass us are basically gone, and callers cannot tell it is not a person.",
    metric: "-52%",
    metricLabel: "average wait time",
    name: "Marcus Feld",
    role: "Head of Support",
    company: "Northbeam Health",
  },
  {
    quote: "The QA scoring is the part that sold our compliance team. Every call is graded before we ever see it.",
    metric: "3.4x",
    metricLabel: "more calls handled",
    name: "Elena Rossi",
    role: "COO",
    company: "Lumen Collections",
  },
];

/* H11 — Compliance */
export const COMPLIANCE = ["ISO 27001", "SOC 2 Type II", "GDPR", "HIPAA-ready", "Data residency"];

/* Commitments carousel — what the product actually holds itself to. Red stays the
   through-line (icon glyph colour never changes); the panel fill is the only thing
   that shifts per slide, so the section reads as one brand with a little range,
   not three unrelated colours. */
export const COMMITMENTS = [
  {
    eyebrow: "Reliability",
    headline: "Every call, on time",
    color: "red",
    icon: "lightning",
    body: "Event-day call volume doesn't wait for a signal to catch up. Every call gets answered in under 400ms, scored, and logged, so nothing slips between the RSVP line and the front desk.",
  },
  {
    eyebrow: "Privacy",
    headline: "Your data, your terms",
    color: "navy",
    icon: "lockkey",
    body: "Calls are encrypted in transit and at rest, with configurable data residency and a full audit log for every conversation, so your security team never has to take our word for it.",
  },
  {
    eyebrow: "Voice",
    headline: "Sounds like your team",
    color: "terracotta",
    icon: "waveform",
    body: "Six voices across Indian and US locales, tuned for warmth over robotic pacing, so a guest calling about a wedding hears an assistant, not a script.",
  },
] as const;
