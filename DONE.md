# DONE.md — Gvox Website · What's Done

> Completed work log. Pairs with [TODO.md](TODO.md).

**Status:** 🟢 Home page built end-to-end and verified. Production build passes. Dev server on :3000.

---

## Setup & decisions
- **2026-07-03** — Analyzed [CLAUDE_DESIGN.md](CLAUDE_DESIGN.md) and [content.md](content.md); locked scope to Home end-to-end.
- **2026-07-03** — Locked: white-dominant canvas, **indigo `#5B5BFF`** single accent, placeholder content, name **Gvox**, custom logo, **no gradient/multicolor text**.
- **2026-07-03** — Verified Gemini image pipeline (alpha PNGs via `gemini-2.5-flash-image`). ⚠️ Key exposed in chat — **rotate before launch**.

## Phase 0 — Project setup ✅
- Next.js 15.5.20 (App Router) + TypeScript + Tailwind v4 (CSS-first `@theme`) scaffolded in-place.
- Deps: motion, gsap + @gsap/react, lenis, split-type, recharts, @phosphor-icons/react, clsx, tailwind-merge, sharp.
- `.env.local` (gitignored) holds GEMINI_API_KEY; `.gitignore`, `next.config.ts` (pinned `outputFileTracingRoot`).

## Phase 1 — Design system ✅
- Tokens in [globals.css](src/app/globals.css): bg/surface/ink/muted/line/accent/accent-2, radii, tinted shadow scale, `--ease-signal`.
- Fonts via next/font: Space Grotesk (display), Inter (body), JetBrains Mono (technical numerals).
- Fluid type scale (hero/display/title), eyebrow + tabular utilities, glass surface, fixed 4% film-grain overlay, reduced-motion global collapse.

## Phase 2 — Brand & motion primitives ✅
- [Logo](src/components/brand/Logo.tsx) (animated waveform mark + wordmark) + `/public/favicon.svg`.
- [Waveform](src/components/brand/Waveform.tsx) (canvas, reactive, reduced-motion static), [SignalPath + ScrollProgress](src/components/brand/SignalPath.tsx).
- Motion: [ScrollReveal/RevealGroup](src/components/motion/ScrollReveal.tsx), [AnimatedCounter](src/components/motion/AnimatedCounter.tsx), [GradientOrb](src/components/motion/GradientOrb.tsx), [SmoothScroll (Lenis+GSAP)](src/components/motion/SmoothScroll.tsx).

## Phase 3 — Shared shell ✅
- [Navbar](src/components/shell/Navbar.tsx): glass, hide-on-scroll, Solutions mega-dropdown, live "Make a test call" pill, mobile sheet.
- [Footer](src/components/shell/Footer.tsx): columns, newsletter, compliance badges, giant kinetic wordmark.
- [TestCallWidget](src/components/shell/TestCallWidget.tsx): mocked idle→dialing→connected→done with ripple + waveform.

## Phase 4 — Home sections (H2–H13) ✅
Hero (live call card, 3D tilt, typed transcript) · TrustStrip · StatBand (counters + micro-viz) · **Pipeline** (pinned horizontal scrub centerpiece) · InboundOutbound (toggle + direction viz) · CallQA (Recharts dashboard + flags) · WorkflowBuilder (draggable node canvas) · Integrations (logo grid + monogram fallback) · Industries (3D tilt cards) · Testimonials (typed quote) · Compliance (badges) · FinalCta (test-call band). Assembled in [page.tsx](src/app/page.tsx).

## Phase 5 — Assets ✅ (11 images generated with Gemini)
- [scripts/generate-assets.mjs](scripts/generate-assets.mjs): Gemini `gemini-2.5-flash-image` → sharp crops → `/public/generated`. Re-run any with `npm run gen:assets [id]`.
- **Generated & wired:** `hero-bg` (hero backdrop, filament wave), `og` (OG/Twitter metadata), 6 industry thumbnails (Industries cards), `scene-inbound`/`scene-outbound` (InboundOutbound panel backdrop). `signal-texture` generated, available, not yet wired.
- Video slot left in FinalCta (commented `<video>` with prompt) for user's loops.
- Note: industry scenes render on a slightly warm-beige ground vs pure off-white; the card gradient overlay blends it.

## Phase 6 — QA ✅
- **Production build passes clean** (no type/lint/syntax errors). Page 203 kB / 305 kB First Load JS.
- Playwright desktop (1440) + mobile (390) screenshots reviewed for every section. No horizontal overflow on mobile.
- Fixed: RSC crash (Compliance/FinalCta importing Phosphor in server components → `"use client"`); hero headline was 5 lines → shortened to 2 + rescaled to fit viewport; Simple Icons 404s → monogram fallback; workflow node clipping → nudged inward; workspace-root warning → pinned.
- Reduced-motion fallbacks in every animated primitive.

---

### Known issues / follow-ups
- ⚠️ **Rotate the Gemini API key** (was pasted in chat).
- Dev-mode HMR can momentarily blank Motion entrances while editing with the browser open — a cosmetic dev artifact; production is unaffected (verified on `next start`).
- Minor Motion console warning ("non-static position" on a useScroll target) — cosmetic, low priority.
- Not built this pass: the other 8 pages (Product, Solutions, Integrations, Pricing, Customers, Resources, About, Demo) — they reuse Home's components.
- Optional: run `npm run gen:assets` to generate hero/OG imagery and wire into Hero/metadata.
