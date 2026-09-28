# content.md — Build Brief for an AI Call-Agent Automation Website

> **Read me first (AI builder instructions).**
> You are building a **multi-page, production-grade marketing website** for a voice/call-agent
> automation product. Stack: **Next.js (App Router) + Tailwind + Framer Motion (`motion/react`)**,
> with **GSAP ScrollTrigger** for pinned/horizontal/scrubbed sequences. Use the design arsenal in
> `CLAUDE_DESIGN.md` (Stitch, Magic, design-taste-frontend, high-end-visual-design, emil-design-eng,
> impeccable). Run `/impeccable init` first, design-token the whole thing, then build.
>
> **The three references, and what to take from each:**
> - **Content depth & enterprise credibility → like Haptik** (haptik.ai): product breadth, proof,
>   verticals, compliance, metrics, a real narrative.
> - **Component set & layout → like Ringg** (ringg.ai): voice-first hero with a *live call demo*,
>   inbound+outbound, a **call-QA/analytics** module, a **visual workflow builder**, integrations grid,
>   transparent pricing.
> - **Motion & flow feel → like VoiceCraft** (voicecraftai.com): scroll-driven "the call flows through
>   the system" animations, a big **"Make a test call now"** CTA, clean and kinetic.
>
> **Creative mandate:** Do NOT copy their layouts pixel-for-pixel. Every component below ends with a
> **`🎨 IMAGINE`** block — that is your license to invent a *crazy, sexy, premium* execution. Push the
> aesthetic. White-dominant canvas, one electric accent, real motion, zero template smell.
>
> **Asset mandate:** Every visual slot has an **`🖼️ IMG PROMPT`** or **`🎬 VIDEO/LOOP PROMPT`** block.
> These are ready-to-paste generation prompts (for the image-gen skills / brandkit / your image tool).
> Respect the stated **crop/aspect/treatment** (masked, cropped-bleed, duotone, etc.).

---

## 0. Global Design System (define once, use everywhere)

**Aesthetic direction:** "Clinical-luxury telecom." A near-white editorial canvas, huge confident
type, one high-voltage accent, glass + soft depth, and sound/voice made *visible* (waveforms,
spectrograms, signal paths). Think Linear × Stripe × a high-end audio brand.

**Tokens (starting point — you may retune, keep it tasteful):**
- `--bg`: `#FBFBF9` (warm off-white, never pure #fff for large fields)
- `--surface`: `#FFFFFF` cards on `--bg`
- `--ink`: `#0B0B0F` (near-black text)
- `--muted`: `#6B6B76`
- `--accent`: `#5B5BFF` electric indigo (voice/signal color) — OR pick one: acid-lime `#C8F135`,
  or signal-orange `#FF5A1F`. **Pick ONE and commit.**
- `--accent-2`: a soft complementary wash for gradients (`#E9E9FF` for indigo)
- `--line`: `#E7E7E2` hairlines
- Radii: cards `20px`, pills `999px`. Shadows: layered, low-opacity, never harsh.

**Type:** Display = a characterful grotesk/serif hybrid (e.g. *Aeonik*, *PP Neue Montreal*,
*Instrument Serif* for accents). Body = clean grotesk (*Inter*, *Geist*). Big editorial scale:
hero display clamp(3.5rem, 8vw, 7rem), tight leading, `-0.03em` tracking.

**Motion language (global rules):**
- Ease everything with `[0.21, 0.47, 0.32, 0.98]` or `power3.out`. No linear, no bounce.
- Entrances: `y:24 → 0`, `opacity:0 → 1`, staggered `0.08`. `viewport={{ once:true, margin:'-80px' }}`.
- Smooth scroll: GSAP ScrollSmoother (or Lenis). Smooth every `scrollYProgress` with `useSpring`.
- Respect `useReducedMotion()` everywhere — provide static fallbacks.
- A recurring motif: an **animated voice-signal line** (a thin waveform/EKG path) that threads
  between sections as you scroll — this is the site's signature (VoiceCraft-style flow).

**🎨 IMAGINE (global):** Invent a signature "signal" visual system — a living waveform that reacts to
scroll velocity, morphs from speech-waveform → data-packets → checkmark. Reuse it as connective
tissue across all pages. Make the white feel *expensive*: grain overlay at 3–4% opacity, subtle
noise, one perfectly-placed gradient orb per section.

**🖼️ IMG PROMPT (global texture, use as faint overlay 3–6% opacity, full-bleed):**
> "Ultra-fine film grain and subtle paper fiber texture, warm off-white #FBFBF9, seamless, high
> resolution, no pattern repetition, neutral, minimal — for use as a low-opacity overlay." — export
> PNG, tileable, desaturated.

**🖼️ IMG PROMPT (global accent orb / gradient mesh, one per section, corner-anchored):**
> "Soft volumetric gradient orb, electric indigo #5B5BFF fading into transparent, blurred bokeh glow,
> studio-clean, on transparent background, subtle grain, premium SaaS aesthetic." — export PNG with
> alpha, crop to a soft circle that bleeds off the section edge.

---

## SITE MAP (multi-page)

1. **Home** (`/`) — the flagship. Full narrative + all signature components.
2. **Product** (`/product`) — how the voice agent works: pipeline, latency, QA, workflow builder.
3. **Solutions** (`/solutions`) — by use case (Sales/Outbound, Support/Inbound) + by industry.
4. **Integrations** (`/integrations`) — the ecosystem grid + how connections work.
5. **Pricing** (`/pricing`) — transparent tiers + usage calculator.
6. **Customers** (`/customers`) — logos, case studies, metrics, testimonials.
7. **Resources / Blog** (`/resources`) — thought leadership (Haptik-style depth).
8. **Company / About** (`/about`) — team, mission, trust & compliance.
9. **Contact / Book a demo** (`/demo`) — form + calendar + live test-call.

Shared across all pages: **Navbar**, **Footer**, **the signal-line scroll motif**, **CTA band**.

---

# ============ HOME PAGE (`/`) ============

## H1 — Navbar (shared)

**Content:** Logo (left). Center links: Product, Solutions ▾, Integrations, Pricing, Customers,
Resources. Right: "Sign in" (ghost) + "**Make a test call**" (solid accent pill, with a tiny live
pulse dot). Solutions is a mega-dropdown (two columns: *By use case* / *By industry*).

**Components (from Ringg-style set):** sticky glass navbar, hide-on-scroll-down/show-on-scroll-up,
frosted background that fades in after 80px (use the arsenal's scroll-linked navbar pattern §4.6/#6).

**🎨 IMAGINE:** The "Make a test call" button should feel *alive* — a micro voice-waveform animates
inside it on hover, and the pulse dot beats at ~60bpm. Mega-dropdown slides with a soft spring and a
faint spectrogram backdrop.

**🖼️ IMG PROMPT (logo mark, if none exists):**
> "Minimal geometric logo mark combining a sound waveform and a phone/signal node, single-weight,
> electric indigo on transparent, ultra-clean, scalable, tech startup identity." — export SVG-style
> PNG, tight square crop, transparent.

---

## H2 — Hero (voice-first, Ringg-shaped, VoiceCraft-kinetic)

**Content:**
- Eyebrow pill: "AI voice agents that actually close the loop"
- Display headline (huge): *"Your calls, handled. Inbound and outbound, in every language."*
- Sub: one confident sentence — sub-400ms latency, 20+ languages, human-quality voice, full QA.
- Dual CTA: "**Make a test call**" (solid) + "See it work ▸" (ghost, scrolls to demo).
- Trust strip beneath: "Trusted by teams at —" + greyscale logo row.

**Right side / center-stage:** a **live call visualizer** — an animated device or floating call card
where a real-feeling conversation transcribes in real time, waveform reacting, with caller/agent
turn indicators. This is the hero's showpiece (Ringg's live-demo idea, elevated).

**Motion:** headline words rise in a stagger; the waveform is scroll-reactive; on load, a single
signal-line draws itself from the CTA down into the next section (VoiceCraft flow motif starts here).

**🎨 IMAGINE:** Go big. Make the call card feel like a premium phone-call-in-glass: floating,
parallaxed on mouse-move (3D tilt), live captions typing, a spectrogram breathing behind it. Optional
WebGL/Three.js waveform if you're feeling it. This is the "sexy" moment — earn it.

**🖼️ IMG PROMPT (hero backdrop, full-bleed, subtle):**
> "Abstract 3D sound wave made of thousands of thin indigo filaments flowing left to right, on warm
> off-white, soft studio light, shallow depth of field, premium, minimal, lots of negative space,
> Octane render." — 21:9, crop so the wave sits lower-right and leaves clean space for headline top-left.

**🎬 VIDEO/LOOP PROMPT (hero call-card waveform, seamless loop, muted autoplay):**
> "Seamless looping animation of a live audio waveform reacting to speech, thin indigo bars on white,
> smooth organic motion, 6-second loop, minimal, high-fps, transparent or white background." — export
> WebM/MP4, 1:1 or 4:5 crop, loop-friendly.

**🖼️ IMG PROMPT (greyscale client logos):** use real/placeholder SVG logos; render at 40% opacity,
uniform height, desaturated.

---

## H3 — Stat band / proof metrics (Haptik-style credibility)

**Content:** 3–4 big animated counters on a tinted band:
- "< 400ms" response latency
- "20+" languages, natively
- "120K+" concurrent interactions / hour
- "98%" call-QA pass rate (or similar)
Each with a one-line caption. Numbers count up on scroll into view.

**🎨 IMAGINE:** Let each stat have a tiny bespoke micro-visualization (a latency spark, a globe of
languages, a throughput swarm). Not just numbers — *evidence*.

**🖼️ IMG PROMPT (band texture):** reuse global gradient orb, indigo, anchored behind the numbers, blurred.

---

## H4 — "How it works" pipeline (Product teaser, VoiceCraft-flow centerpiece)

**This is the signature scroll section.** A horizontal / pinned scroll sequence (GSAP ScrollTrigger
pin + scrub, arsenal §3 and §4.4/#4) that walks a single call through the system:

`Incoming/Outgoing call → Speech-to-text → Intent + LLM brain → Tools/CRM lookup → Response →
Text-to-speech → Live QA scoring → Outcome (booked / resolved / escalated)`

As you scroll, the voice-signal line travels node to node, each node lights up, a mini caption
explains it, and the waveform morphs into data → back into voice → into a checkmark at the end.

**Components:** pinned section, horizontal track of stage-cards, animated connector path (SVG
`strokeDashoffset` scrubbed to scroll), per-stage micro-demos.

**🎨 IMAGINE:** This should feel like watching a call *travel through a beautiful machine.* Nodes as
glass chips, the signal as a living light, data particles flowing along the wire. This is where you
out-VoiceCraft VoiceCraft. Make it the thing people screenshot.

**🎬 VIDEO/LOOP PROMPT (per-node ambient loops, optional):**
> "Minimal looping animation of glowing data particles flowing along a thin curved wire, indigo on
> white, seamless 4s loop, premium tech, transparent background." — small crop, loop, place inside each node.

**🖼️ IMG PROMPT (stage icons, consistent set):**
> "Set of minimal line icons on transparent: microphone, brainwave/AI node, database/CRM, speaker,
> checkmark-shield, calendar — single-weight indigo strokes, rounded, cohesive icon family, premium SaaS."
> — export as individual transparent PNGs, uniform crop/padding.

---

## H5 — Inbound + Outbound split (Ringg's dual capability)

**Content:** A two-column (or toggle/tab) section.
- **Outbound:** lead qualification, follow-ups, reminders, collections, surveys. (VoiceCraft's core.)
- **Inbound:** support, triage, booking, FAQ, 24/7 answering with human handoff.
Each side: 3 bullet outcomes + a mini live snippet + a "See outbound/inbound →" link.

**Components:** segmented toggle that swaps the visual + copy with a spring crossfade; two large
glass panels.

**🎨 IMAGINE:** The toggle physically *flips the call direction* — the signal line reverses direction
and the waveform mirrors. Delightful, on-theme.

**🖼️ IMG PROMPT (outbound visual, cropped/masked into panel):**
> "Stylized 3D scene of a call going out — a glowing indigo signal arc leaving a phone node toward
> multiple contact silhouettes, white studio background, minimal, soft shadows." — crop into a rounded
> 4:3 mask, bleed slightly off the panel edge.

**🖼️ IMG PROMPT (inbound visual, mirrored):**
> "Stylized 3D scene of many incoming signal arcs converging into a single glowing agent node, indigo
> on white, calm, organized, premium, soft depth." — mirror composition, same crop treatment.

---

## H6 — Call QA & Analytics (Ringg's standout differentiator)

**Content:** Show the analytics layer — a dashboard-style component. Per-call scoring: relevance,
obedience/adherence, latency, sentiment; auto-flagging of hallucinations and interruptions;
transcripts with highlights; trend charts.

**Components:** a faux-live dashboard card (charts via Recharts), a scored-call list, a transcript
panel with color-coded flags, filter chips. Animate rows in on scroll, let one metric "live-update."

**🎨 IMAGINE:** Make the dashboard feel *real and premium* — like a product screenshot from the future.
A call gets scored in front of the user, a hallucination flag pulses, a trend line draws itself. This
sells trust more than any headline.

**🖼️ IMG PROMPT (dashboard hero shot / product frame):**
> "Clean modern SaaS analytics dashboard UI for call quality — score cards, a line chart, a
> color-coded transcript, indigo accent on white, generous whitespace, crisp, Figma-quality, front-on."
> — export at high res, crop into a browser/glass frame with a soft drop shadow, slight 3D tilt optional.

---

## H7 — Visual Workflow Builder (Ringg's canvas)

**Content:** Showcase the drag-and-drop agent builder: nodes for greeting → conditions → tool calls
→ handoff, connected on a canvas. Emphasize no-code, conditionals, and tool/integration nodes.

**Components:** an interactive-looking node canvas (nodes + bezier connectors), a side palette, a
"drag a node" micro-interaction. Even if not fully functional, make it *feel* manipulable
(hover states, a node that snaps in on scroll).

**🎨 IMAGINE:** Let the user actually drag one demo node and watch a connector spring to it. Canvas
has a faint dot-grid, nodes are glass chips, connectors animate their draw. Playful but pro.

**🖼️ IMG PROMPT (workflow canvas backdrop):**
> "Node-based workflow editor canvas, faint dot grid on white, a few connected glass nodes with
> bezier curves in indigo, minimal, premium, front-on, Figma-quality." — wide crop, place behind live nodes.

---

## H8 — Integrations grid (Ringg/Haptik ecosystem)

**Content:** Logos of tools it connects to: CRMs (HubSpot, Salesforce), calendars (Calendly, Google),
comms (WhatsApp, Twilio), commerce (Shopify), data (Sheets, Notion, Airtable), + "and 100 more."
Grid of logo tiles; on hover each shows what the integration does.

**Components:** responsive logo grid, hover-reveal caption, "Explore integrations →" to `/integrations`.
Optional: a slow marquee row of logos.

**🎨 IMAGINE:** Logos orbit a central agent node, or tiles subtly magnetize toward the cursor. The
signal line threads through the grid connecting a few tiles live.

**🖼️ IMG PROMPT (fallback tiles):** greyscale brand logos, uniform padding inside rounded tiles,
desaturated, 20% opacity until hover.

---

## H9 — Industries / Solutions preview (Haptik verticals)

**Content:** Cards for verticals: Real estate, Healthcare/clinics, Fintech/collections, E-commerce,
Travel, Education, Insurance. Each card: icon, one outcome line, "Learn more →".

**Components:** staggered card grid (arsenal §4.4/#7), scroll-reveal, hover lift + accent border.

**🎨 IMAGINE:** Each card carries a faint industry-specific waveform texture; hover tilts the card in
3D (arsenal §4.4/#8) and the icon animates.

**🖼️ IMG PROMPT (per-industry thumbnail, cropped into card top):**
> "Minimal abstract 3D scene representing [INDUSTRY] — soft objects, indigo accent, white studio,
> premium, lots of negative space." (generate one per industry) — crop to a 16:9 card-top with a
> rounded top mask.

---

## H10 — Testimonials / case-study strip (Haptik proof)

**Content:** 2–3 pull-quotes with name, role, company, headshot; one hero metric each ("+38% booked
demos", "-52% wait time"). Optional logo of the customer.

**Components:** quote cards or a slider; big metric typography; subtle auto-advance.

**🎨 IMAGINE:** A quote that "types itself" like a live transcript, then settles. Metric counts up.

**🖼️ IMG PROMPT (headshots, if placeholder):**
> "Professional friendly business portrait, neutral studio background, soft light, diverse, natural,
> premium editorial." — circle-crop tight to face, consistent size.

---

## H11 — Trust & compliance band (Haptik enterprise signal)

**Content:** Badges: ISO 27001, SOC 2, GDPR, HIPAA-ready, data-residency. One line on security.
Reassures enterprise buyers.

**Components:** simple badge row + a short security statement + "Read our security posture →".

**🖼️ IMG PROMPT (badges):** clean monochrome compliance badge icons, uniform, on transparent.

---

## H12 — Final CTA band + test-call (VoiceCraft's signature close)

**Content:** Full-width tinted band. Big line: *"Hear it for yourself."* Subline. A prominent
**phone-number input + "Call me now"** widget (the live test-call) plus "Book a demo".

**Components:** the test-call widget (input + button + status states: dialing → connected →
waveform), CTA band with the signal-line resolving into a checkmark.

**🎨 IMAGINE:** When they submit, the whole band comes alive — waveform pulses, a "ringing" ripple,
status animates. Make submitting feel *magical*, not form-y.

**🎬 VIDEO/LOOP PROMPT (band ambient):**
> "Slow seamless loop of soft indigo signal ripples emanating outward on white, like a call
> connecting, minimal, premium, 8s loop, transparent bg." — full-bleed, low opacity behind content.

---

## H13 — Footer (shared)

**Content:** Logo + tagline; columns (Product, Solutions, Resources, Company, Legal); newsletter
input; social; compliance mini-badges; "Made for voice." Big watermark wordmark at the bottom.

**🎨 IMAGINE:** A giant kinetic wordmark of the brand name that a faint waveform passes through on
scroll. Newsletter input with an inline send-arrow micro-interaction.

---

# ============ PRODUCT PAGE (`/product`) ============

Deep-dive on the engine. Sections:
1. **Hero:** "The anatomy of a perfect call." Sub + test-call CTA.
   🖼️ IMG PROMPT: *"Exploded-view 3D diagram of a voice-AI pipeline, glass modules floating and
   connected by indigo signal lines, white studio, premium, front-on, lots of negative space."* —
   wide crop, center-stage.
2. **Latency deep-dive:** animated race bar showing sub-400ms vs typical. Scrubbed on scroll.
3. **Voice quality:** waveform + language pills (20+); a play-a-sample interaction.
   🎬 VIDEO/LOOP: *"Waveform morphing between multiple languages' speech patterns, indigo on white, loop."*
4. **The brain (LLM + RAG):** how it uses your docs/CRM. Diagram + node animation.
5. **QA engine (expanded from H6):** full analytics story.
6. **Human handoff:** seamless escalation flow, animated hand-off of the signal line to a person.
7. **Reliability/scale:** 120K/hr, uptime, infra. Stat band.
8. **CTA band** (shared).

**🎨 IMAGINE:** Treat this page like an interactive spec sheet — each capability gets its own tasteful
scroll-triggered micro-demo. Cohesive, technical, gorgeous.

---

# ============ SOLUTIONS PAGE (`/solutions`) ============

Two axes, like Ringg + Haptik combined:
- **By use case:** Outbound sales / Inbound support / Reminders & follow-ups / Surveys & feedback /
  Lead qualification / Collections. Each = a mini landing block (problem → agent → outcome + metric).
- **By industry:** the H9 verticals expanded, one detailed block each with a tailored script sample
  and a metric.

**Components:** left sticky sub-nav that scroll-spies the sections; each block has a live script
snippet, an outcome metric, and a "test-call this use case" CTA.

**🖼️ IMG PROMPT (per use-case scene):** *"Minimal 3D vignette of [USE CASE] as a signal flow, indigo
on white, premium, negative space."* — one per block, consistent crop (16:9, rounded mask).

**🎨 IMAGINE:** As you scroll each use case, the shared signal-line reconfigures to match that flow —
one continuous story down the page.

---

# ============ INTEGRATIONS PAGE (`/integrations`) ============

1. Hero: "Plug your agent into everything." + search/filter bar.
2. **Filterable grid** by category (CRM, Calendar, Comms, Commerce, Data, Support).
3. "How connections work" — a 3-step animated diagram (Auth → Map fields → Go live).
4. "Request an integration" CTA.

**Components:** searchable/filterable logo grid, category chips, per-integration modal/hover card.

**🖼️ IMG PROMPT (connection diagram):** *"Three-step integration flow: OAuth key, field-mapping
nodes, live signal — glass cards connected by indigo lines on white, minimal, premium."* — wide crop.

**🎨 IMAGINE:** Central agent node with integration logos magnetically orbiting; connecting one
animates a live data pulse along the wire.

---

# ============ PRICING PAGE (`/pricing`) ============

**Content (transparent, Ringg-style):** 3 tiers — Starter / Growth / Enterprise. Per-minute or
per-call + monthly. Feature comparison table. A **usage calculator** (slider: calls/month → est. cost).
FAQ accordion. "Talk to sales" for Enterprise.

**Components:** 3 pricing cards (middle = "Most popular", accent-ringed, slight scale), monthly/annual
toggle, interactive slider calculator (live number), comparison table with checks, FAQ accordion.

**🎨 IMAGINE:** The calculator slider drives a live waveform whose density = call volume, and the
price counts up smoothly. The "Most popular" card has a subtle animated accent aura.

**🖼️ IMG PROMPT (tier accents):** three soft gradient orbs (cool → indigo → deep) to tint each card corner.

---

# ============ CUSTOMERS PAGE (`/customers`) ============

Logos wall → 3–4 full case studies (challenge → solution → result metric, with a quote and a chart)
→ testimonial grid → "Join them" CTA.

**🖼️ IMG PROMPT (case-study hero per story):** *"Editorial abstract representing [OUTCOME], indigo on
white, premium, minimal."* + real/placeholder logos and headshots (circle-crop).

**🎨 IMAGINE:** Each case study result metric animates a bespoke chart; the logo wall subtly parallaxes.

---

# ============ RESOURCES / BLOG (`/resources`) ============

Haptik-level content depth. Featured post hero + filterable article grid (categories: Guides,
Product, Voice-AI, Industry). Article card = cropped cover image + tag + title + read-time.

**🖼️ IMG PROMPT (article covers):** *"Abstract editorial cover for a voice-AI article about [TOPIC],
indigo + off-white, minimal, premium magazine style."* — 16:9, consistent crop, tag chip overlay.

**🎨 IMAGINE:** Cards reveal in a masonry stagger; featured post has a parallaxed cover with a
waveform sweeping across on scroll.

---

# ============ ABOUT / COMPANY (`/about`) ============

Mission hero → the story → team grid (photos) → trust & compliance (expanded H11) → careers CTA.

**🖼️ IMG PROMPT (team photos):** *"Consistent editorial team portraits, neutral warm background, soft
light, candid, premium startup."* — uniform crop, rounded, same size.

**🎨 IMAGINE:** A timeline that draws itself as a signal line; team cards flip to reveal a fun fact.

---

# ============ DEMO / CONTACT (`/demo`) ============

Split layout: left = value recap + the **live test-call widget** (star of the page) + trust badges;
right = booking form / embedded calendar. Success states animate.

**Components:** test-call widget (phone input, region select, "Call me" → dialing → connected states),
form with inline validation, calendar embed, confirmation animation.

**🎨 IMAGINE:** On successful test-call trigger, a full-screen-ish celebratory signal-ripple + the
waveform resolves into a checkmark. Make it the most satisfying moment on the site.

**🎬 VIDEO/LOOP PROMPT:** reuse the "ringing ripple" loop from H12 for the dialing state.

---

## Build order (recommended for the AI)

1. `/impeccable init` → lock the design system & tokens (§0). Pick ONE accent, commit.
2. Build **shared**: Navbar, Footer, CTA band, the **signal-line scroll motif**, motion primitives.
3. Build **Home** end-to-end (it contains every signature component).
4. Reuse Home's components to assemble Product, Solutions, Integrations, Pricing, Customers,
   Resources, About, Demo.
5. Generate all assets from the `🖼️/🎬` prompts (use brandkit / imagegen-frontend-web, one reference
   image per section; image-to-code where helpful). Respect the stated crops/masks.
6. Wire the **live test-call** widget states (even if mocked) — it appears in Navbar, H12, and `/demo`.
7. Pass with `/impeccable audit` → `/polish` → `/animate`. Run **emil-design-eng** for micro-detail.
8. Screenshot every page at desktop + mobile via Playwright; fix reflow; verify reduced-motion.

## Non-negotiables checklist
- [ ] White-dominant, ONE committed accent, expensive-feeling grain/gradients.
- [ ] The signal-line motif threads across every page.
- [ ] Live test-call CTA present and delightful (Navbar + H12 + `/demo`).
- [ ] Pinned/scrubbed "how it works" flow (the VoiceCraft-beating centerpiece).
- [ ] Call-QA analytics module + visual workflow builder (the Ringg differentiators).
- [ ] Enterprise proof: stats, logos, case studies, compliance (the Haptik depth).
- [ ] Every section has generated, correctly-cropped imagery/loops from the prompts.
- [ ] Reduced-motion fallbacks, mobile-perfect, `'use client'` where motion is used.
- [ ] Zero template smell. If it looks generic, run `/bolder` and redesign.
