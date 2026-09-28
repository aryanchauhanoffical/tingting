/**
 * Legal copy. Working drafts written to be readable, not to be final: every page says so
 * at the bottom. Replace with counsel-reviewed text before launch (House Rules launch gate).
 */

import type { LegalSection } from "@/components/page/Legal";

export const LEGAL_UPDATED = "25 September 2026";

export const PRIVACY: readonly LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: [
      "Tring Tring is a voice agent platform operated by GlobalVox. When you use our website or our product, we are the data controller for the information described here. When your agents handle calls for your own customers, you are the controller and we are your processor, acting on your instructions under a data processing agreement.",
      "You can reach our privacy team at privacy@tringtring.ai. If you are in the EU or UK, that address also reaches our representative.",
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: [
      "Account data: name, work email, company, role, and billing details for paid plans. Usage data: which features you open, how many minutes you run, error and performance logs tied to your workspace.",
      "Call data: audio, transcripts, the structured outcome of each call, and any fields your agent collects during it. Call data belongs to you. We store it so you can review, score and export it, and we delete it on the schedule you set.",
      "Website data: pages visited and referrer, collected with privacy-respecting analytics. We do not run advertising trackers and we do not sell any of it.",
    ],
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    body: [
      "To run the service: place and receive calls, transcribe them, generate responses, score quality, and show you the results. To bill you accurately. To keep the platform secure and to investigate abuse. To support you when you ask for help.",
      "We do not use your call audio or transcripts to train general purpose models. Tuning that improves your own agents happens inside your workspace and stays there.",
    ],
  },
  {
    id: "recording-and-consent",
    heading: "Recording and consent",
    body: [
      "Call recording law varies by country and by state. The platform gives you per-campaign controls for disclosure announcements, recording on or off, and consent capture, and it logs which were in force for every call.",
      "Configuring those controls correctly for the places you call is your responsibility as the controller. We give you the switches and the audit trail; you decide the policy.",
    ],
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    body: [
      "Subprocessors that make the product work: cloud hosting, telephony carriers, speech and language model providers, payment processing, and error monitoring. Each is under contract, assessed before onboarding, and listed on our subprocessor page.",
      "Authorities, where a valid legal order requires it. We will tell you first unless we are legally prevented from doing so.",
      "We never sell personal information and we never share it for cross-context behavioural advertising.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    body: [
      "Call audio and transcripts follow the retention window set on your workspace, from 7 days to 7 years, with a default of 90 days. Deleting a call removes the audio, the transcript and the derived scores.",
      "Account and billing records are kept while your account is open and for the period tax law requires afterwards. Security logs are kept for 12 months.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: [
      "Depending on where you live, you can ask for a copy of your data, correct it, delete it, restrict or object to how we use it, or receive it in a portable format. Workspace owners can do most of this themselves from the settings area without asking us.",
      "Write to privacy@tringtring.ai and we will answer inside 30 days. If you are not satisfied, you can complain to your local data protection authority.",
    ],
  },
  {
    id: "transfers-and-security",
    heading: "Transfers and security",
    body: [
      "You choose where your workspace stores data. Where data moves across borders we rely on Standard Contractual Clauses and the UK addendum.",
      "Data is encrypted in transit and at rest. Access is role based, logged, and reviewed. We run background checks on staff with production access and require hardware keys for it.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this notice",
    body: [
      "We will post any change here and update the date at the top. If a change materially affects you, we will email workspace owners at least 30 days before it takes effect.",
    ],
  },
];

export const TERMS: readonly LegalSection[] = [
  {
    id: "agreement",
    heading: "The agreement",
    body: [
      "These terms cover your use of the Tring Tring website, platform and API. By creating a workspace or placing a call through us, you accept them on behalf of your organisation.",
      "If you have signed a separate order form or master agreement with us, that document wins wherever the two disagree.",
    ],
  },
  {
    id: "accounts",
    heading: "Accounts and access",
    body: [
      "You are responsible for who you invite into your workspace and what they do there. Keep credentials and API keys secret, and rotate a key the moment you suspect it has leaked.",
      "Roles control what each member can see and change. Owners can remove access at any time, and we will act on a written request from an owner if you lose control of an account.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: [
      "You may not use voice agents to defraud, impersonate a real person without disclosure, harass, or contact numbers you have no lawful basis to call. You may not use the platform for emergency services, and it must never be the only route to one.",
      "You must honour do-not-call registries, calling-hour rules, and consent requirements in every market you dial. Campaigns that ignore them will be suspended.",
      "We may suspend an agent immediately where there is a credible risk of harm, fraud, or a carrier violation. We will tell you what happened and what it takes to restore it.",
    ],
  },
  {
    id: "your-content",
    heading: "Your content, your data",
    body: [
      "Your prompts, knowledge files, contact lists, recordings and transcripts remain yours. You give us only the licence we need to run the service for you: store it, process it, and show it back to you.",
      "You confirm you have the right to upload what you upload, including any contact data and any voice you ask us to clone.",
    ],
  },
  {
    id: "fees",
    heading: "Fees and billing",
    body: [
      "Plans are billed in advance. Usage above the included minutes is billed monthly in arrears at the rate on your plan. Telephony numbers and carrier charges are passed through at cost plus the margin shown at checkout.",
      "Invoices are due 30 days from issue. We can suspend a workspace that is more than 30 days late, after notice. Fees are exclusive of tax.",
    ],
  },
  {
    id: "uptime",
    heading: "Service levels",
    body: [
      "Paid plans carry a 99.9 percent monthly uptime commitment on call handling, measured against our status page. Enterprise plans can negotiate a higher target with service credits.",
      "Planned maintenance is announced at least 48 hours ahead and runs outside business hours in your primary region wherever possible.",
    ],
  },
  {
    id: "ai-output",
    heading: "About AI output",
    body: [
      "Voice agents generate language. They can be wrong, and they can be wrong confidently. Review the guardrails, the escalation rules and the QA scores before you let an agent act without a human behind it.",
      "You are responsible for what your agent says on your behalf. We give you transcripts, scoring and audit logs so you can check.",
    ],
  },
  {
    id: "termination",
    heading: "Ending the agreement",
    body: [
      "You can close a workspace at any time from settings. We can end this agreement for a material breach that is not fixed within 30 days of notice.",
      "After termination you have 30 days to export your data. After that we delete it, other than what we must keep for legal reasons.",
    ],
  },
  {
    id: "liability",
    heading: "Warranties and liability",
    body: [
      "The service is provided as described in our documentation. Beyond that, and to the extent the law allows, we disclaim implied warranties.",
      "Neither side is liable for indirect or consequential loss. Our total liability in any 12 month period is capped at the fees you paid us in that period. Nothing here limits liability that cannot lawfully be limited.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the state of Delaware, United States, without regard to conflict of law rules. Disputes go to the courts of that state, and both sides waive any objection to that venue.",
    ],
  },
];

export const TRADEMARK: readonly LegalSection[] = [
  {
    id: "marks",
    heading: "The marks",
    body: [
      "Tring Tring, the Tring Tring logotype, and the signal mark are trademarks of GlobalVox. The wordmark is used in title case, always as two words, and never translated or abbreviated to an acronym.",
      "Registration is pending in the United States, the European Union, the United Kingdom and India. The absence of a registration symbol on a page is not a waiver of any right.",
    ],
  },
  {
    id: "permitted",
    heading: "What you can do without asking",
    body: [
      "Refer to Tring Tring accurately in plain text: a blog post about the product, a job listing, a comparison, a press article, a slide that names it as part of your stack.",
      "Say that your product integrates with Tring Tring, as long as it genuinely does and the sentence makes clear which company is which.",
      "Use the logo files from our brand kit, unmodified, at the sizes and clear space the kit specifies.",
    ],
  },
  {
    id: "not-permitted",
    heading: "What needs permission",
    body: [
      "Using the name or logo in your own product name, app name, domain, social handle, or company name. Registering a domain that contains the mark or a close misspelling of it.",
      "Suggesting partnership, sponsorship, certification or endorsement that does not exist.",
      "Merchandise, event branding, or anything that puts the mark on a physical product for sale.",
    ],
  },
  {
    id: "using-the-logo",
    heading: "Using the logo",
    body: [
      "Do not stretch it, rotate it, recolour it outside the approved palette, add effects to it, or rebuild it in another typeface. Keep clear space of at least the height of the mark on every side, and never place it on a background that drops contrast below 4.5 to 1.",
      "Do not lock our mark up with your own into a single combined logo. Place them side by side, separated by a rule.",
    ],
  },
  {
    id: "reporting",
    heading: "Reporting misuse and asking for permission",
    body: [
      "Send requests and reports to brand@tringtring.ai with a description and, if you can, a screenshot or a link. We answer permission requests within 10 working days.",
      "The brand kit, including logo files, colour values and type, is available on request from the same address.",
    ],
  },
];
