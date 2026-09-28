# TODO.md — Gvox Website · Needs To Be Done

> Living backlog. Completed work moves to [DONE.md](DONE.md). Scope source: [content.md](content.md).

**Status:** 🟢 Home page done end-to-end (Phases 0–6 complete — see DONE.md). Backlog below is next-up work.

**Locked decisions:** Home-first · white-dominant · indigo `#5B5BFF` single accent · **no gradient text** · placeholders · Next.js + TS + Tailwind v4 + Motion + GSAP.

---

## Now / near-term
- [ ] `P0` **Rotate the Gemini API key** (it was pasted in chat) and update `.env.local`.
- [ ] `P1` Optional: `npm run gen:assets` → generate hero backdrop + OG image, wire into Hero and `metadata.openGraph.images`.
- [ ] `P1` Drop real video loops into `/public/video/` and uncomment the `<video>` slot in [FinalCta](src/components/home/FinalCta.tsx) (hero waveform, band ripple).
- [ ] `P2` Swap placeholder content for real stats, pricing, customer logos, testimonials, compliance certs ([src/lib/content.ts](src/lib/content.ts)).
- [ ] `P2` Resolve the minor Motion "non-static position" console warning.

## Other 8 pages (reuse Home components)
- [ ] `P1` `/product` — anatomy of a call, latency race bar, voice quality, brain, QA expanded, handoff, reliability, CTA.
- [ ] `P1` `/solutions` — by use case + by industry, sticky scroll-spy sub-nav, per-block script + metric.
- [ ] `P1` `/pricing` — 3 tiers, monthly/annual toggle, usage calculator, comparison table, FAQ.
- [ ] `P1` `/integrations` — filterable grid, "how connections work" diagram, request-integration CTA.
- [ ] `P2` `/customers` — logo wall, case studies with charts, testimonial grid.
- [ ] `P2` `/resources` — featured post + filterable article grid.
- [ ] `P2` `/about` — mission, story, team grid, trust, careers.
- [ ] `P2` `/demo` — split test-call widget + booking form/calendar, success animation.

## Polish backlog
- [ ] `P2` Wire the signal-line motif (`SignalPath`) between more sections as connective tissue.
- [ ] `P2` Run `/impeccable audit` → `/polish`; run emil-design-eng micro-detail pass.
- [ ] `P2` Lighthouse pass (LCP/INP/CLS); lazy-load below-fold heavy sections (Recharts).
- [ ] `P2` a11y sweep: focus states, keyboard nav on dropdown/toggle/slider, alt text.
