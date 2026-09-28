/**
 * Content for the pages beyond the home page.
 *
 * Unlike content.ts, most of this is drawn from the actual product: the voice set, the
 * language routing, the builder nodes, the plan limits and the permission model are all
 * real. Prices are the exception and are deliberately absent, because the product does
 * not set one yet (sales confirms terms per workspace).
 */

/* ============================================================
   Product
   ============================================================ */

export const PRODUCT_PILLARS = [
  {
    id: "agents",
    eyebrow: "Agents",
    title: "Build the agent in four steps, or open the whole graph.",
    lead: "Most people never leave the guided setup. The ones who need a branching call flow get a real canvas, not a longer form.",
    rows: [
      {
        title: "Guided setup",
        body: "Basics, voice, opening line, review. Pick a direction and a language and it recommends the voice, with a reason and a three second sample.",
      },
      {
        title: "Templates you can adopt",
        body: "RSVP caller, helpline, day-before reminder, post-event feedback. Using one copies it in as a draft, so later template edits never move under you.",
      },
      {
        title: "Behaviour, not prompt engineering",
        body: "Four sliders: how caring, how energetic, accuracy or speed, answer length. Under them sit the opening line, the closing line and the rules every step inherits.",
      },
      {
        title: "Teach it from your best calls",
        body: "Upload up to ten recordings of calls that went well and the agent takes its tone and pacing from them.",
      },
      {
        title: "Versions that hold still",
        body: "Publishing creates an immutable version and pushes it to every number and campaign using that agent. Restoring an old one copies it into the draft rather than overwriting anything.",
      },
    ],
  },
  {
    id: "flow",
    eyebrow: "Flow builder",
    title: "Seven node types, one canvas.",
    lead: "Conditions on the edges are written in plain words, because the model reads them, not a rules engine.",
    rows: [
      { title: "Start call", body: "Greeting, delayed start and a pre-call data fetch that can look the caller up by number before anyone speaks." },
      { title: "Agent step", body: "A prompt with its own tools, documents and variable extraction. Interruptions on or off per step." },
      { title: "Global rules", body: "Instructions every step can opt into. Keep replies short, never invent a fact, follow the caller between languages." },
      { title: "Trigger and webhook", body: "An HTTP path that starts the flow from outside a call, and a webhook that posts the collected variables when the call reaches it." },
      { title: "Call QA", body: "Scores a sample of finished calls against your rubric. Twenty five percent by default, on calls over twenty seconds." },
      { title: "End call", body: "The closing line, then hang up. Publishing is blocked until every path reaches one." },
    ],
  },
  {
    id: "numbers",
    eyebrow: "Numbers",
    title: "Real numbers, carrier routing handled.",
    lead: "Pick a city code or a toll-free line, clear verification once, and the number is attached the moment it is approved.",
    rows: [
      { title: "Local and toll-free", body: "Jaipur, Mumbai, Delhi, Bengaluru, Hyderabad, Pune, Ahmedabad, and 1800 toll-free lines that cost the caller nothing." },
      { title: "One number, one agent", body: "Every assigned number routes to exactly one published agent. Anything unassigned plays a short unavailable message rather than ringing out." },
      { title: "Verification with a clock on it", body: "Business PAN, GST certificate, address proof and signatory ID. Review takes 24 to 48 working hours and you hear either way." },
      { title: "Or bring your own trunk", body: "SIP over TLS with G.711 or Opus. The test connection has to pass before anything switches, and recordings and transcripts are unaffected because they happen on the bridge." },
    ],
  },
  {
    id: "campaigns",
    eyebrow: "Campaigns",
    title: "A campaign is one job for one agent.",
    lead: "An audience, an agent, a purpose, and a window it is allowed to call inside. A second script or a second language is a second campaign.",
    rows: [
      { title: "Audience", body: "A saved group, a CSV, or contacts picked one by one. Anyone marked do-not-call is dropped from the audience automatically." },
      { title: "Hard calling hours", body: "Set the window and the working days. No call goes out outside them, whatever the schedule says, and retries stay inside them too." },
      { title: "Retries with a gap", body: "Decide how many attempts an unanswered number gets and how long to wait between them." },
      { title: "A fallback for the dead end", body: "When the agent cannot help: transfer to a person, end politely, or take a callback request. Chosen per campaign, not left to chance." },
      { title: "Follow-ups, grouped by reason", body: "Call back, said maybe, handed over, complaint, voicemail, never reached. The work left over from a campaign arrives sorted." },
    ],
  },
  {
    id: "qa",
    eyebrow: "Calls and QA",
    title: "Watch it happen, then prove what happened.",
    lead: "Every call is transcribed turn by turn, scored against your rubric, and written to a log that cannot be edited afterwards.",
    rows: [
      { title: "Live board", body: "Calls in progress with a ticking timer and the latest turn, updating as they speak. Open one and follow the transcript live." },
      { title: "Ten outcomes, three sentiments", body: "Confirmed, declined, undecided, callback, transferred, no answer, info given, complaint, voicemail, other. Rolled up into resolved, escalated and dropped." },
      { title: "Recordings with a paper trail", body: "Waveform scrubber, download and share link. Every play is written to the access log with the name of whoever pressed it." },
      { title: "Reports that answer the obvious", body: "Calls, answer rate, average length, minutes billed, inbound against outbound per day, calls by hour, outcomes, and a table broken down by agent." },
    ],
  },
  {
    id: "tools",
    eyebrow: "Tools and API",
    title: "The agent can do things, not just say them.",
    lead: "Mid-conversation it can call your systems, hand over to a person, or send a message, and then tell you what it did.",
    rows: [
      { title: "HTTP tools", body: "Any method, your headers, your timeout. The agent says it is checking, and moves on gracefully if the call takes too long." },
      { title: "MCP servers", body: "Point at a server, refresh the function list, and choose which of its functions agents are allowed to call." },
      { title: "Built in", body: "Transfer to a human with the transcript so far, send a WhatsApp card, or end the call. Nothing to configure." },
      { title: "REST and webhooks", body: "Scoped keys, 60 requests a minute. Six events, from call started to campaign completed, signed and retried with backoff for 24 hours." },
      { title: "Knowledge files", body: "PDF, DOCX, TXT or CSV up to 20 MB, indexed in seconds and attached per step or per campaign." },
    ],
  },
] as const;

/* ============================================================
   Voices and languages
   ============================================================ */

export type Voice = {
  name: string;
  gender: "Female" | "Male";
  locale: string;
  language: string;
  style: string;
  bestFor: string;
};

export const VOICES: readonly Voice[] = [
  { name: "Aisha", gender: "Female", locale: "en-IN", language: "English (India)", style: "Warm, unhurried", bestFor: "Confirmation calls and older callers" },
  { name: "Kabir", gender: "Male", locale: "en-IN", language: "English (India)", style: "Clear, friendly", bestFor: "Helplines and general use" },
  { name: "Meera", gender: "Female", locale: "hi-IN", language: "Hindi", style: "Soft, polite", bestFor: "Hindi confirmation rounds" },
  { name: "Arjun", gender: "Male", locale: "hi-IN", language: "Hindi", style: "Confident, quick", bestFor: "Busy helplines" },
  { name: "Nina", gender: "Female", locale: "en-US", language: "English (US)", style: "Neutral, bright", bestFor: "International callers" },
  { name: "Dev", gender: "Male", locale: "en-US", language: "English (US)", style: "Calm, low", bestFor: "Late evening calls" },
];

export const LANGUAGE_ROUTING = [
  { language: "English (India)", code: "en-IN", note: "Most helplines and confirmation rounds in metros." },
  { language: "Hindi", code: "hi-IN", note: "North India, older callers, and anyone who switches mid sentence." },
  { language: "Gujarati", code: "gu-IN", note: "Gujarat and Mumbai households. Falls back to the Hindi voices." },
  { language: "Marathi", code: "mr-IN", note: "Pune and Mumbai households. Falls back to the Hindi voices." },
  { language: "Tamil", code: "ta-IN", note: "Tamil Nadu lists, with matching transcription." },
  { language: "English (US)", code: "en-US", note: "Overseas callers and international guest lists." },
];

/* ============================================================
   Pricing
   ============================================================ */

export type Plan = {
  name: string;
  tagline: string;
  minutes: string;
  price: string;
  priceNote: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: readonly string[];
};

export const PLANS: readonly Plan[] = [
  {
    name: "Trial",
    tagline: "Fourteen days, one number, inbound only. No card.",
    minutes: "60",
    price: "Free",
    priceNote: "14 days",
    cta: "Start the trial",
    href: "/demo",
    features: [
      "2 agents, 2 concurrent lines",
      "1 phone number, inbound",
      "100 contacts, 2 seats",
      "Recordings and transcripts included",
    ],
  },
  {
    name: "Standard",
    tagline: "The working plan for a team that lives on the phone.",
    minutes: "1,500",
    price: "Talk to sales",
    priceNote: "Billed monthly, in 30 second steps",
    cta: "Get a quote",
    href: "/contact",
    featured: true,
    features: [
      "10 agents, 5 concurrent lines",
      "6 phone numbers, inbound and outbound",
      "5,000 contacts, 10 seats",
      "WhatsApp follow-ups",
      "Integrations and webhooks",
    ],
  },
  {
    name: "Growth",
    tagline: "Several teams, several cities, one workspace.",
    minutes: "6,000",
    price: "Talk to sales",
    priceNote: "Billed monthly, in 30 second steps",
    cta: "Get a quote",
    href: "/contact",
    features: [
      "30 agents, 10 concurrent lines",
      "10 phone numbers",
      "25,000 contacts, 25 seats",
      "Everything in Standard",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom caps, and a dedicated bridge region on request.",
    minutes: "25,000",
    price: "Custom",
    priceNote: "Annual agreement",
    cta: "Talk to us",
    href: "/contact",
    features: [
      "100 agents, 25 concurrent lines",
      "40 phone numbers",
      "100,000 contacts, 100 seats",
      "Bring your own SIP trunk",
      "Dedicated region and named support",
    ],
  },
];

export const PLAN_MATRIX = {
  columns: ["Trial", "Standard", "Growth", "Enterprise"],
  groups: [
    {
      title: "Capacity",
      rows: [
        { label: "Minutes per month", values: ["60", "1,500", "6,000", "25,000"] },
        { label: "Concurrent lines", values: ["2", "5", "10", "25"] },
        { label: "Phone numbers", values: ["1", "6", "10", "40"] },
        { label: "Agents", values: ["2", "10", "30", "100"] },
        { label: "Contacts stored", values: ["100", "5,000", "25,000", "100,000"] },
        { label: "Team seats", values: ["2", "10", "25", "100"] },
      ],
    },
    {
      title: "Calling",
      rows: [
        { label: "Inbound calls", values: [true, true, true, true] },
        { label: "Outbound campaigns", values: [false, true, true, true] },
        { label: "WhatsApp follow-ups", values: [false, true, true, true] },
        { label: "Bring your own SIP trunk", values: [false, false, false, true] },
      ],
    },
    {
      title: "Records",
      rows: [
        { label: "Call recordings", values: [true, true, true, true] },
        { label: "Transcripts and summaries", values: [true, true, true, true] },
        { label: "Access log on every play", values: [true, true, true, true] },
        { label: "API keys and webhooks", values: [false, true, true, true] },
      ],
    },
  ],
} as const;

export const PRICING_FAQ = [
  {
    q: "Why is there no price on the page?",
    a: "Because a minute of voice costs different amounts depending on the language, the destination and how much of it is silence, and we would rather quote you honestly than publish a number we have to walk back. Tell us roughly how many calls a week you make and you will have a figure the same working day.",
  },
  {
    q: "How are minutes counted?",
    a: "In thirty second steps, on connected calls only. A call that rings out and is never answered does not draw down your balance. Minutes reset on the first of the month, and a live call is added when it ends.",
  },
  {
    q: "What happens if we run out?",
    a: "You get a warning when the balance drops below fifteen percent, by notification and email, and you can move that threshold. Nothing stops dead without telling you first.",
  },
  {
    q: "Why does every call end at fifteen minutes?",
    a: "It protects your minutes from a caller who puts the phone down without hanging up, and it keeps concurrency predictable for everyone. The agent is told when a minute is left and wraps up politely. In practice almost every helpline and confirmation call finishes inside five.",
  },
  {
    q: "What do the phone numbers cost?",
    a: "Numbers are billed separately from minutes: a local city number, a toll-free 1800 line, or a vanity number, each at a fixed monthly rate that is shown before you request it. Numbers start counting against your plan limit from the day they are approved.",
  },
  {
    q: "Can we change plan later?",
    a: "Yes, in either direction. Request the change from the plan page and sales confirms the terms before anything switches. We will not silently upgrade you for going over.",
  },
] as const;

/* ============================================================
   Solutions
   ============================================================ */

export const USE_CASES = [
  {
    id: "outbound",
    label: "Outbound",
    title: "Call the whole list before the list goes cold.",
    body: "Point a campaign at a group, a CSV or a hand-picked set of contacts, give it a window it is allowed to call inside, and let it work. Anyone on the do-not-call list is removed from the audience before the first dial, retries stay inside your hours, and everything the agent collects on the call comes back as a field you can filter on.",
    points: [
      "Confirm attendance, headcount and preferences in one pass",
      "Retries with a gap you choose, never outside your calling window",
      "Do-not-call honoured automatically across every campaign",
      "Outcomes and extracted fields written back to the contact",
    ],
    proof: { k: "Purposes ready to use", v: "Confirmations, reminders, directions, feedback, sales, collections" },
  },
  {
    id: "inbound",
    label: "Inbound",
    title: "Answer on the first ring, at any hour, in their language.",
    body: "A published agent sits on the number and picks up. It answers from the documents you attached, looks things up over your API mid-conversation, and hands over to a person the moment the conversation needs one, with the transcript so far already in their hands.",
    points: [
      "Answers from indexed PDFs, docs and spreadsheets",
      "Starts in English and follows the caller into Hindi or Gujarati",
      "Transfer to a human, or press zero at any point",
      "Escalates rather than guessing when it does not know",
    ],
    proof: { k: "Hands over with", v: "The full transcript, the summary and the caller record" },
  },
  {
    id: "reminders",
    label: "Reminders",
    title: "The short call that stops a no-show.",
    body: "A day-before reminder is thirty seconds of work that saves an empty slot. The agent confirms, offers directions if they ask, reschedules if they cannot make it, and marks anyone who wants a callback so a person can pick it up.",
    points: [
      "Confirm, reschedule or cancel inside the same call",
      "Directions and details on request, without a human",
      "A WhatsApp card after the call where the plan allows it",
      "Leftovers grouped by reason, not dumped in a list",
    ],
    proof: { k: "Typical call length", v: "Under two minutes" },
  },
  {
    id: "collections",
    label: "Collections",
    title: "A regulated conversation that stays inside the lines.",
    body: "Verification, balance, arrangement. The rules that apply to every step are written once and inherited, the call is scored against your rubric while it is still running, and which consent and disclosure settings were in force is stamped onto the call record for later.",
    points: [
      "Global rules every step inherits, so the script cannot drift",
      "Live scoring against your own rubric, not a generic one",
      "Immutable published versions, so you can prove what ran",
      "Every recording play written to the access log with a name",
    ],
    proof: { k: "Review coverage", v: "Every call, not a sample" },
  },
] as const;
