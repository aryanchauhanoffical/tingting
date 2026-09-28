# CLAUDE_DESIGN.md — Design & Motion Arsenal for Claude Code

> **What this is:** A single, portable reference that gives Claude (and you) everything needed to
> build premium UI and scroll-driven motion in any project — the MCP design servers, how to invoke
> them, and the **complete** GSAP + Framer Motion scroll-animation knowledge embedded inline
> (no external files needed).
>
> **How to reuse in a new project:** Copy this file to the project root (or keep the global copy at
> `~/.claude/CLAUDE_DESIGN.md`). The MCP servers below are installed at **user scope**, so they are
> already available in every project — no per-project setup. Just tell Claude *"use the design arsenal"*.

---

## House Rules: Read First. These Override Everything Below.

Project-owner constraints, not suggestions. They outrank every skill, MCP output, and pattern
in the rest of this file. If a generated design conflicts with this section, **the design is
wrong, not the rule.** Check work against this list before showing it to anyone.

### A. Never Ship

**Visual**
- Purple-to-blue gradients, and purple gradients of any kind
- Gradient text in a hero
- Pill-shaped buttons (fully rounded ends)
- Glassmorphism cards
- Cards with a coloured left border
- Low-contrast dark mode
- Grain or noise texture overlays
- A badge floating above the headline
- Three icon boxes in a row
- Inconsistent spacing (one scale, no exceptions)

**Type**
- Inter used as the font for everything
- Space Grotesk paired with Instrument Serif
- Serif italics used to accent a word
- Em dashes anywhere in shipped copy. Use a comma, a colon, or a full stop.

**Icons and imagery**
- Emoji used as icons, and emoji in headings
- Lucide icons everywhere by default
- AI-slop photography
- Untouched shadcn/ui components straight out of the box

**Copy**
- AI-slop copy
- Vague hero text
- Generic buzzwords
- Fake reviews, fake metrics, fake customer counters

**Motion**
- Over-the-top scroll animation
- Sections that fade in as you scroll
- Cursor-following lines and cursor trails
- Buttons whose only hover state is a fade

### B. Launch Gate

Not launched until every line is true:

- [ ] Custom domain connected
- [ ] Favicon added
- [ ] "Made with AI" tag removed
- [ ] Privacy policy page live
- [ ] Terms and conditions page live

### C. UX Principles

Twenty rules. Apply per screen, not per project.

**Reduce load**

| Principle | In practice |
|---|---|
| Reduce choices per screen | One decision per view. Move the rest behind a step or a menu. |
| Simplify complex interfaces | If a screen needs a legend, redesign the screen. |
| Reveal complexity gradually | Defaults visible, advanced settings collapsed but discoverable. |
| Write content in chunks | Short blocks with headings. Never a wall of text. |
| Group related information | Related fields share a container. Unrelated fields do not. |
| Put essentials first | The thing they came for is above everything else. |

**Guide the action**

| Principle | In practice |
|---|---|
| Highlight the primary action | Exactly one primary button per view. Everything else is secondary or ghost. |
| Place key actions near each other | Actions that get used together sit together. No cross-screen hunting. |
| Use sensible defaults | Prefill the common answer. Most users should be able to press Continue. |
| Make targets large | 44px minimum touch target. Generous click areas on rows and cards. |
| Connect related elements visually | Proximity, alignment and shared containers carry the relationship, not a label. |

**Respect familiarity**

| Principle | In practice |
|---|---|
| Follow familiar patterns | Tables behave like tables. Nav sits where nav sits. Invention needs a reason. |
| Maintain pattern consistency | The same interaction looks and behaves the same way everywhere in the product. |

**Handle errors**

| Principle | In practice |
|---|---|
| Prevent errors proactively | Constrain the input. Disable what cannot be chosen. Validate before submit. |
| Make errors recoverable | Every error states what happened and the next step. Never lose entered data. |

**Momentum and closure**

| Principle | In practice |
|---|---|
| Interactions respond within 400ms | Feedback inside 400ms, always. Beyond that, show a determinate indicator. |
| Show visible progress | Multi-step flows show which step this is and how many remain. |
| Reduce task completion time | Count the clicks and keystrokes for the main task. Then cut them. |
| Make completion feel closer | Show progress already made. Start the bar above zero where honest. |
| End flows memorably | The last screen confirms what happened and offers the obvious next thing. |

### D. Checking Work

Before showing any UI:

1. Read section A top to bottom against the actual screen.
2. Run `npx impeccable detect <file|dir|url>` for a mechanical anti-pattern pass.
3. Screenshot it with Playwright (§2.3) at desktop and mobile width and look at it.

---

## 0. The Arsenal at a Glance

| Capability | Tool | Auth | Use it for |
|---|---|---|---|
| Design-to-code (full screens, design systems) | **stitch** (MCP) | OAuth / API key | Generate screens, design systems, variants |
| UI components from text | **magic** / @21st-dev/magic (MCP) | API key | Navbars, heroes, tables, pricing, sidebars |
| Same, over hosted HTTP | **21st** (MCP) | API key header | The remote 21st.dev endpoint. See §2.2 on which to use. |
| Source-backed animated components & blocks | **watermelon** (MCP) | none | Search and install real component source from Watermelon UI (§2.4) |
| File operations | **filesystem** (MCP) | none | Read/write files in the project |
| Browser automation & screenshots | **playwright** (MCP) | none | Test pages, capture screenshots, scrape |
| Structured reasoning | **sequential-thinking** (MCP) | none | Multi-step planning |
| Live library docs | **context7** (MCP) | none | Up-to-date docs for GSAP, Framer, React, etc. |
| Premium design taste & critique | **15 design skills** (§2.5) | none | Anti-slop UI, audits, polish, redesigns, image-gen |
| Scroll animations | **GSAP + Framer Motion** (knowledge, §3–4 below) | n/a | Parallax, pinning, reveals, horizontal scroll |
| 3D scenes (Svelte only) | **Threlte** (knowledge, §5 below) | n/a | Declarative three.js in Svelte / SvelteKit projects |

---

## 1. Replicate This Setup in Any Project

These were added at **user scope** (`-s user`) so they persist across all projects. To recreate on a new
machine, run:

```bash
# Stitch — official remote MCP (design-to-code). Authenticates via OAuth on first use.
claude mcp add --transport http stitch https://stitch.googleapis.com/mcp \
  --header "X-Goog-Api-Key: YOUR_STITCH_API_KEY"

# 21st.dev Magic — UI components from natural language (local, via npx)
claude mcp add magic -s user -- npx -y @21st-dev/magic@latest YOUR_21ST_API_KEY

# 21st.dev — the same service over hosted HTTP. Either is enough; see §2.2.
claude mcp add --transport http 21st https://21st.dev/api/mcp -s user \
  --header "x-api-key: YOUR_21ST_API_KEY"

# Watermelon UI — source-backed components, blocks and templates. Hosted HTTP, no API key.
claude mcp add --transport http watermelon https://mcp.watermelon.sh/mcp -s user

# Filesystem — see "Per-project bootstrap" below. Do not hardcode a path here.
claude mcp add filesystem -s user -- npx -y @modelcontextprotocol/server-filesystem /ABSOLUTE/PROJECT/PATH

# Playwright — browser automation & screenshots
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest

# Sequential Thinking — structured multi-step reasoning
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking

# Context7 — live, version-accurate library documentation
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp

# Verify
claude mcp list
```

### Per-project bootstrap

Every server above is portable except **filesystem**, which is pinned to an absolute path and is
therefore the one thing that does not follow this file into a new project. Two ways to handle it.

**Option 1 (recommended): skip it.** Claude Code's built-in `Read` / `Write` / `Edit` / `Glob` /
`Grep` already operate on whatever directory you launched in, with no configuration and no path to
keep in sync. The filesystem MCP server adds nothing on top of them in Claude Code. It matters for
harnesses that lack native file tools. If that is your situation, use option 2.

**Option 2: bind it per project.** Drop this file in the project root, `cd` there, and run:

```bash
# Project scope: writes .mcp.json in the current project. Travels with the repo.
claude mcp add filesystem -s project -- npx -y @modelcontextprotocol/server-filesystem "$(pwd)"
```

`$(pwd)` is what makes this portable: the same command in any project binds to that project. Use
`-s local` instead of `-s project` to keep it private to your machine rather than committed.

**If you already have a user-scope filesystem server**, it holds one fixed path and will point at
whichever project you set up first. The server accepts multiple roots, so widen it rather than
repointing it and breaking the other project:

```bash
claude mcp remove filesystem -s user
claude mcp add filesystem -s user -- npx -y @modelcontextprotocol/server-filesystem \
  /path/to/project-a /path/to/project-b
```

That works but does not scale. Prefer project scope once you have more than two.

> Check which root you are actually bound to before trusting it: `claude mcp list | grep filesystem`.
> A filesystem server silently pointed at the wrong project reads and writes real files in it.

### Design skills (installed at user/global scope)

These were installed via the community `skills` CLI (`~/.agents/skills/`, symlinked into `~/.claude/skills/`)
plus impeccable's own installer. Recreate on a new machine with:

```bash
# Taste-skill family (13 skills) — global, all agents
npx -y skills@latest add https://github.com/Leonxlnx/taste-skill -g -s '*' -y

# Emil Kowalski's design-engineering skill — global
npx -y skills@latest add emilkowalski/skill -g -s '*' -y

# Impeccable (/impeccable + 24 commands) — installs PROJECT-level into .claude/ and .github/
npx -y impeccable@latest skills install
# To make impeccable global like the rest:
cp -R .claude/skills/impeccable ~/.claude/skills/impeccable

# Verify what's registered
ls ~/.claude/skills/
```

> ⚠️ **Secrets:** Keep API keys out of committed files. Prefer env vars or a gitignored config.
> If a key has ever been pasted into a tracked file, rotate it.

---

## 2. MCP Server Playbooks

### 2.1 Stitch — Design-to-Code

Creates projects, design systems, and full UI screens. Available tools:

| Tool | Purpose |
|---|---|
| `create_project` / `get_project` / `list_projects` | Manage Stitch projects |
| `generate_screen_from_text` | Generate a full UI screen from a description |
| `get_screen` / `list_screens` | Inspect generated screens |
| `edit_screens` | Modify existing screens with new instructions |
| `generate_variants` | Produce multiple design variants of a screen |
| `create_design_system` / `update_design_system` / `apply_design_system` | Manage tokens (colors, type, spacing) |
| `create_design_system_from_design_md` / `upload_design_md` | Drive a design system from a markdown spec |
| `list_design_systems` | List available design systems |

**Example asks:**
- "Create a Stitch project called *Brand Site* and generate a landing hero screen."
- "Make a design system: dark bg `#0a0a0a`, accent `#c8f135`, then apply it to the project."
- "Generate 3 variants of the pricing section and show them."

### 2.2 Magic (@21st.dev) — Components from Text

Returns production-ready React/Tailwind/shadcn components. **Stacks:** React, Next.js, Vue, Svelte, Tailwind, shadcn/ui.

**Example asks:** "navbar with logo + links", "3-tier pricing table", "collapsible dashboard sidebar",
"hero with CTA", "sortable data table".

**Two servers reach 21st.dev, and both are registered:**

| Server | Transport | Notes |
|---|---|---|
| `magic` | local, `npx @21st-dev/magic` | Downloads on first run. Works offline once cached. Tool names are `mcp__magic__*`. |
| `21st` | hosted HTTP, `21st.dev/api/mcp` | No local install. Key travels as an `x-api-key` header. |

Keeping both is harmless. If you want one, prefer `21st` for a clean machine and `magic` if you
would rather not send the key on every request. Remove either with `claude mcp remove <name> -s user`.

> Whichever you drop, do it deliberately. Two servers offering near-identical tools makes it
> ambiguous which one a given request used, which matters when one of them starts failing.

### 2.3 Filesystem / Playwright / Sequential-Thinking / Context7

- **filesystem** — read/write within the configured root.
- **playwright** — "open localhost:3000 and screenshot the hero", "check the page renders on mobile width".
- **sequential-thinking** — "plan this refactor step by step before coding".
- **context7** — "get the current GSAP ScrollSmoother docs" (avoids stale API guesses).

### 2.4 Watermelon UI — Source-Backed Components

Open-source (MIT) library of animated components, blocks, dashboards and templates from
[github.com/watermeloncorp](https://github.com/watermeloncorp). Catalog and previews at
[ui.watermelon.sh](https://ui.watermelon.sh). **Stack:** React 19, TypeScript, Tailwind CSS 4, Motion.
Unlike Magic, nothing is generated: every result is real source you can read before installing.

The hosted MCP server (`watermelon-mcp` 2.0.0) is read-only and needs no key. Tool names are
`mcp__watermelon__*`:

| Tool | Purpose |
|---|---|
| `search` | Search the full catalog: components, animated components, blocks, templates |
| `get_inspiration` | 3 to 6 visually relevant options for a design goal, before committing to one |
| `get_component` | One entry with preview, dependencies, install command and source files |
| `compose_page` | A page plan built from compatible blocks, one per requested section |
| `list_categories` / `catalog_summary` | Categories and entry counts |
| `list_catalog_entries` / `get_catalog_entry` | Compatibility aliases for list and get by kind and slug |

**Install without the MCP.** Every entry is a shadcn registry item, so the shadcn CLI pulls it directly:

```bash
npx shadcn@latest add https://registry.watermelon.sh/r/<slug>.json
# e.g. https://registry.watermelon.sh/r/card-split-accordian.json
```

Files land in `components/watermelon/`. Needs a `components.json` (`npx shadcn@latest init`) first.

**Example asks:** "search Watermelon for an animated pricing toggle", "get inspiration for a logo
marquee, show me the options", "compose a landing page: hero, features, testimonials, footer".

> **House Rules still apply.** Watermelon entries are shadcn-style and commonly depend on
> `lucide-react` and `react-icons`. Treat the source as a starting point: swap icons to the project's
> icon set, restyle to the project's tokens, and check the result against §A. Installing one untouched
> is exactly the "untouched shadcn/ui" ban.

> The upstream README also lists `npx @watermelon-ui/cli init --client claude`. That package returned
> 404 on npm when this section was written (2026-09-21), so use the `claude mcp add` line in §1.

### 2.5 Installed Design Skills (15, global)

These live in `~/.claude/skills/` and are usable from **any** project. They are knowledge/behavior skills —
invoke by naming them or by intent (e.g. *"use design-taste-frontend"*, *"run /impeccable audit"*).

**Impeccable** — the flagship design system (`/impeccable` + 24 commands, v3.5)

| Command group | Commands |
|---|---|
| Plan / build | `/shape` `/craft` `/init` |
| Review | `/audit` `/critique` |
| Enhance | `/animate` `/bolder` `/colorize` `/delight` `/layout` `/overdrive` `/quieter` `/typeset` |
| Refine | `/adapt` `/clarify` `/distill` |
| Production | `/harden` `/onboard` `/optimize` `/polish` |
| System | `/document` `/extract` `/live` `/impeccable` |

> Run `/impeccable init` once per project to generate design context. Also ships a CLI: `npx impeccable detect <file|dir|url>` to scan for UI anti-patterns without an AI harness.

**Taste-skill family** (from github.com/Leonxlnx/taste-skill)

| Skill | What it does |
|---|---|
| `design-taste-frontend` | **Default (v2).** Anti-slop frontend for landing pages, portfolios, redesigns. Infers design direction, builds real design systems, audit-first on redesigns. |
| `design-taste-frontend-v1` | Older v1 variant of the above. |
| `gpt-taste` | Stricter variant: forced layout randomization, AIDA structure, wide editorial type, gapless bento grids, strict GSAP ScrollTriggers. |
| `high-end-visual-design` | Agency-grade fonts, spacing, shadows, card structures, animations. Blocks cheap/generic defaults. |
| `minimalist-ui` | Clean editorial monochrome — typographic contrast, flat bento grids, no gradients/heavy shadows. |
| `industrial-brutalist-ui` | Raw mechanical/terminal aesthetic — rigid grids, extreme type contrast, analog degradation. |
| `redesign-existing-projects` | Upgrades existing sites/apps to premium quality without breaking functionality. Any CSS framework. |
| `stitch-design-taste` | Generates agent-friendly `DESIGN.md` for Google Stitch — premium, anti-generic UI standards. |
| `brandkit` | Premium brand-kit image generation (logo systems, identity decks, visual-world boards). |
| `image-to-code` | Image-first pipeline: generate design images, analyze, then implement to match. |
| `imagegen-frontend-web` | Generates one horizontal design-reference image **per section** of a site (image-gen only). |
| `imagegen-frontend-mobile` | Premium mobile screen concepts inside phone mockups (image-gen only). |
| `full-output-enforcement` | Overrides LLM truncation — bans placeholders, enforces complete unabridged code output. |

**Emil Kowalski** (from github.com/emilkowalski/skill)

| Skill | What it does |
|---|---|
| `emil-design-eng` | Encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great. |

> Security note: skills run with full agent permissions — these are reputable community/author skills, but review before trusting blindly. Update all with `npx skills update -g`.

---

## 3. GSAP ScrollTrigger — Complete Reference

> Pairs with creative/design judgement: animation should enhance, never overwhelm.

### 3.1 Setup (always first)

```bash
npm install gsap          # vanilla
npm install gsap @gsap/react   # React
```
```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother'; // optional
gsap.registerPlugin(ScrollTrigger, ScrollSmoother); // MUST run before any ScrollTrigger use
```
CDN (vanilla):
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14/dist/ScrollTrigger.min.js"></script>
```

### 3.2 Library Selector

| Need | Use |
|---|---|
| Vanilla JS, Webflow, Vue | **GSAP** |
| Pinning, horizontal scroll, complex timelines | **GSAP** |
| React / Next.js, declarative | **Framer Motion** |
| `whileInView` entrance animations | **Framer Motion** |

### 3.3 ScrollTrigger Config Reference

```js
gsap.to('.element', {
  x: 500,
  ease: 'none',                 // 'none' for scrub animations
  scrollTrigger: {
    trigger: '.section',        // element whose position triggers animation
    start: 'top 80%',           // "[trigger edge] [viewport edge]"
    end: 'bottom 20%',
    scrub: 1,                   // link to scroll; true = instant, number = smooth lag
    pin: true,                  // pin trigger during scroll (or pass a selector)
    pinSpacing: true,
    markers: true,              // DEBUG only — REMOVE in production
    toggleActions: 'play none none reverse', // onEnter onLeave onEnterBack onLeaveBack
    toggleClass: 'active',
    snap: { snapTo: 'labels', duration: 0.3, ease: 'power1.inOut' },
    fastScrollEnd: true,
    horizontal: false,
    anticipatePin: 1,           // reduce pin jump
    invalidateOnRefresh: true,  // recalc on resize
    id: 'my-trigger',
    onEnter: () => {}, onLeave: () => {}, onEnterBack: () => {}, onLeaveBack: () => {},
    onUpdate: self => console.log(self.progress), // 0→1
    onToggle: self => console.log(self.isActive),
  }
});
```

### 3.4 Start / End Syntax

Format: `"[trigger position] [viewport position]"`

| Value | Meaning |
|---|---|
| `"top bottom"` | Top of trigger hits bottom of viewport (enters view) |
| `"top 80%"` | Top of trigger reaches 80% down from top of viewport |
| `"top center"` | Top of trigger reaches viewport center |
| `"top top"` | Top of trigger at top of viewport |
| `"center center"` | Centers align |
| `"bottom top"` | Bottom of trigger at top of viewport (exits) |
| `"+=200"` / `"-=100"` | 200px after / 100px before trigger |
| `"+=200%"` | 200% of viewport height after trigger |

### 3.5 toggleActions

```
toggleActions: "play pause resume reset"
                ^onEnter ^onLeave ^onEnterBack ^onLeaveBack
```
Values: `play`, `pause`, `resume`, `reverse`, `reset`, `restart`, `none`.
Most common entrance: `"play none none none"` (animate once, no reverse).

### 3.6 Recipes

**1. Fade-in batch reveal** (perf-friendly for many elements)
```js
ScrollTrigger.batch('.card', {
  onEnter: els => gsap.from(els, { opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: 'power2.out' }),
  start: 'top 85%',
});
```

**2. Scrub (scroll-linked)**
```js
gsap.to('.hero-image', {
  scale: 1.3, opacity: 0, ease: 'none', // linear ease is critical for scrub
  scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
});
```

**3. Pinned timeline**
```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.story-section', start: 'top top', end: '+=300%', pin: true, scrub: 1, anticipatePin: 1 }
});
tl.from('.title', { opacity: 0, y: 60, duration: 1 })
  .from('.image', { scale: 0.85, opacity: 0, duration: 1 }, '-=0.3')
  .from('.text',  { x: 80, opacity: 0, duration: 1 }, '-=0.3');
```

**4. Parallax layers**
```js
gsap.to('.parallax-bg', { yPercent: -20, ease: 'none',
  scrollTrigger: { trigger: '.parallax-section', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.to('.parallax-fg', { yPercent: -60, ease: 'none',
  scrollTrigger: { trigger: '.parallax-section', start: 'top bottom', end: 'bottom top', scrub: true } });
```

**5. Horizontal scroll**
```js
const sections = gsap.utils.toArray('.panel');
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1), ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section', pin: true, scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => `+=${document.querySelector('.panels-container').offsetWidth}`, // function form recalcs on resize
    invalidateOnRefresh: true,
  }
});
```
```css
.horizontal-section { overflow: hidden; }
.panels-container   { display: flex; flex-wrap: nowrap; width: 400vw; }
.panel              { width: 100vw; height: 100vh; flex-shrink: 0; }
```

**6. Character stagger text reveal**
```bash
npm install split-type
```
```js
import SplitType from 'split-type';
const text = new SplitType('.hero-title', { types: 'chars' });
gsap.from(text.chars, {
  opacity: 0, y: 80, rotateX: -90, stagger: 0.03, duration: 0.6, ease: 'back.out(1.7)',
  scrollTrigger: { trigger: '.hero-title', start: 'top 85%', toggleActions: 'play none none none' }
});
```

**7. Scroll snap sections**
```js
const sections = gsap.utils.toArray('section');
sections.forEach(s => gsap.from(s, { scale: 0.9, opacity: 0.6,
  scrollTrigger: { trigger: s, start: 'top 90%', toggleActions: 'play none none reverse' } }));
ScrollTrigger.create({
  snap: { snapTo: p => { const step = 1 / (sections.length - 1); return Math.round(p / step) * step; },
          duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' }
});
```

**8. Scroll progress bar**
```js
gsap.to('.progress-bar', { scaleX: 1, ease: 'none', transformOrigin: 'left center',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
```
```css
.progress-bar { position: fixed; top: 0; left: 0; width: 100%; height: 4px;
  background: #6366f1; transform-origin: left; transform: scaleX(0); z-index: 999; }
```

**9. ScrollSmoother**
```js
import { ScrollSmoother } from 'gsap/ScrollSmoother';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.5, effects: true, smoothTouch: 0.1 });
```
```html
<div id="smooth-wrapper"><div id="smooth-content">
  <img data-speed="0.5" src="bg.jpg" />        <!-- 50% scroll speed -->
  <div data-lag="0.3" class="float">...</div>  <!-- 0.3s lag -->
</div></div>
```

**10. Animated number counter**
```js
document.querySelectorAll('.counter').forEach(el => {
  const obj = { val: 0 };
  gsap.to(obj, { val: parseInt(el.dataset.target, 10), duration: 2, ease: 'power2.out',
    onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString(); },
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
});
```

### 3.7 React Integration (useGSAP)

```bash
npm install gsap @gsap/react
```
```jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AnimatedSection() {
  const containerRef = useRef(null);
  useGSAP(() => {
    gsap.from('.card', {
      opacity: 0, y: 60, stagger: 0.12, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' }
    });
  }, { scope: containerRef }); // scope so selectors don't leak outside the component
  return <div ref={containerRef}><div className="card">One</div><div className="card">Two</div></div>;
}
```
**Why `useGSAP` not `useEffect`:** it auto-kills ScrollTriggers on unmount (no leaks) and handles React strict-mode double-invoke.

**Next.js:** guard registration — `if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);` or register inside `useGSAP`.

### 3.8 Lenis Smooth Scroll
```bash
npm install lenis
```
```js
import Lenis from 'lenis';
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
const raf = time => lenis.raf(time * 1000);
gsap.ticker.add(raf);
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);
// React cleanup: return () => { lenis.destroy(); gsap.ticker.remove(raf); };
```

### 3.9 Responsive — matchMedia
```js
const mm = gsap.matchMedia();
mm.add({ isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)', noMotion: '(prefers-reduced-motion: reduce)' },
  ctx => {
    const { isDesktop, isMobile, noMotion } = ctx.conditions;
    if (noMotion) return;
    gsap.from('.box', { x: isDesktop ? 200 : 0, y: isMobile ? 100 : 0, opacity: 0,
      scrollTrigger: { trigger: '.box', start: 'top 80%' } });
  });
```

### 3.10 Accessibility
```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reduce.matches) {
  gsap.from('.box', { opacity: 0, y: 50, scrollTrigger: { trigger: '.box', start: 'top 85%' } });
} else {
  gsap.set('.box', { opacity: 1, y: 0 }); // show immediately, no animation
}
```

### 3.11 Performance & Cleanup
```js
st.kill();                 // kill one trigger
ScrollTrigger.killAll();   // kill all (e.g. page transition)
ScrollTrigger.refresh();   // recalc positions after dynamic content loads
```
- Animate only `transform` & `opacity` (GPU, no layout). Avoid `width/height/top/left/box-shadow/filter`.
- Use `ScrollTrigger.batch()` for many similar elements.
- `will-change: transform` only on actively animating elements.
- Remove `markers: true` before production.

### 3.12 Critical Rules
- Always `gsap.registerPlugin(ScrollTrigger)` before use.
- Scrub animations → `ease: 'none'`.
- React → `useGSAP`, never plain `useEffect`.
- Horizontal scroll → use the **function form** for `end` so it recalcs on resize.
- Long scrub timelines → `pin: true` or shorten distance, else element scrolls out of view.

---

## 4. Framer Motion (Motion v12) — Complete Reference

> Renamed to **Motion** in 2025 → package `motion`, import `motion/react`. `framer-motion` still works (same API).

### 4.1 Setup
```bash
npm install motion          # recommended
# npm install framer-motion # legacy, same API
```
```js
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useReducedMotion } from 'motion/react';
```
**v12 (2025):** hardware-accelerated scroll (browser ScrollTimeline), GPU `useScroll` by default, `oklch`/`oklab`/`color-mix` animatable, full React 19 support.

### 4.2 Two Types of Scroll Animation

**Scroll-triggered** (fires once when entering view):
```jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}   // negative margin triggers early
  transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
>Content</motion.div>
```

**Scroll-linked** (continuous, tied to scroll position):
```jsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
return <motion.div style={{ opacity }}>Content</motion.div>; // must be style, not animate
```

### 4.3 useScroll Options
```js
const { scrollX, scrollY, scrollXProgress, scrollYProgress } = useScroll({
  container: containerRef,   // track a scrollable element instead of viewport
  target: targetRef,         // track an element's position within the container
  offset: ['start end', 'end start'], // "[target pos] [container pos]"
  trackContentSize: false,
});
// Offset words: start=0, center=0.5, end=1. Common pairs:
// ['start end','end start']  → track while element is anywhere in view
// ['start start','end end']  → track from element top reaching top to bottom reaching bottom
```

### 4.4 useTransform
```js
const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]); // multi-stop
const color = useTransform(scrollYProgress, [0, 0.5, 1], ['#6366f1', '#ec4899', '#f97316']);
const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)']);
const yNoClamp = useTransform(scrollYProgress, [0, 1], [0, -200], { clamp: false });
```
**Rule:** output is a `MotionValue` — it must go into the `style` prop of a `motion.*` element. A plain `<div style={{ y }}>` does nothing.

### 4.5 useSpring (smoothing)
```js
const { scrollYProgress } = useScroll();
const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
return <motion.div style={{ scaleX: smooth }} />;
```

### 4.6 Recipes

**1. Scroll progress bar**
```tsx
'use client';
import { useScroll, useSpring, motion } from 'motion/react';
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50" />;
}
```

**2. Reusable ScrollReveal wrapper**
```tsx
'use client';
import { motion } from 'motion/react';
interface ScrollRevealProps { children: React.ReactNode; delay?: number; duration?: number; once?: boolean; className?: string; }
export function ScrollReveal({ children, delay = 0, duration = 0.6, once = true, className }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >{children}</motion.div>
  );
}
```

**3. Parallax layers**
```tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-bg.jpg)', y: backgroundY, scale: 1.2 }} />
      <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center text-white">
        <h2 className="text-6xl font-bold">Parallax Title</h2>
      </motion.div>
    </section>
  );
}
```

**4. Horizontal scroll (sticky pattern)**
```tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
const cards = [{ id: 1, title: 'One', color: 'bg-indigo-500' }, { id: 2, title: 'Two', color: 'bg-pink-500' }, { id: 3, title: 'Three', color: 'bg-amber-500' }, { id: 4, title: 'Four', color: 'bg-teal-500' }];
export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);
  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x, width: `${cards.length * 100}vw` }} className="flex gap-6 h-full items-center px-8">
          {cards.map(c => (
            <div key={c.id} className={`${c.color} w-screen h-[70vh] rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <h3 className="text-white text-4xl font-bold">{c.title}</h3>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
```

**5. Image reveal with clipPath**
```tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
export function ImageReveal({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  return (
    <div ref={ref} className="overflow-hidden rounded-xl">
      <motion.img src={src} alt={alt} style={{ clipPath, scale }} className="w-full h-full object-cover" />
    </div>
  );
}
```

**6. Scroll-linked navbar (hide on scroll down)**
```tsx
'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const prevRef = useRef(0);
  useMotionValueEvent(scrollY, 'change', latest => {
    setScrolled(latest > 80);
    setHidden(latest > prevRef.current && latest > 200);
    prevRef.current = latest;
  });
  return (
    <motion.nav
      animate={{ y: hidden ? -80 : 0,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)',
        boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.08)' : 'none' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
    >{/* nav links */}</motion.nav>
  );
}
```

**7. Staggered card grid (variants)**
```tsx
'use client';
import { motion } from 'motion/react';
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const cardVariants = { hidden: { opacity: 0, y: 40, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } } };
export function CardGrid({ cards }: { cards: { id: number; title: string }[] }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-3 gap-6">
      {cards.map(c => <motion.div key={c.id} variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border"><h3>{c.title}</h3></motion.div>)}
    </motion.div>
  );
}
```

**8. 3D tilt on scroll**
```tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return (
    <div ref={ref} style={{ perspective: '1000px' }}>
      <motion.div style={{ rotateX, scale, opacity }} className="bg-white rounded-2xl p-8 shadow-lg">{children}</motion.div>
    </div>
  );
}
```

### 4.7 Variants Pattern (stagger)
```tsx
const parent = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2, when: 'beforeChildren' } } };
const child = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
// Children with variants={child} inherit the stagger when parent toggles hidden↔visible.
```

### 4.8 Motion Value Events
```tsx
const { scrollY } = useScroll();
useMotionValueEvent(scrollY, 'change', latest => { /* imperative side effect / state */ });
// useTransform → smooth CSS values; useMotionValueEvent → React state / side effects.
```

### 4.9 Next.js / App Router
- Every file using `useScroll`/`useTransform`/`motion.*` needs `'use client'` at the top.
- Keep `motion.*` components in separate client files; import into Server Components.
- Use `AnimatePresence` at the layout level for page transitions.
- SSR-safe gate if needed: `const [m,setM]=useState(false); useEffect(()=>setM(true),[]); if(!m) return null;`

### 4.10 Accessibility
```tsx
import { useReducedMotion } from 'motion/react';
const reduce = useReducedMotion();
const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [100, -100]);
```

### 4.11 Common Pitfalls
- Missing `'use client'` in Next.js App Router files.
- `style` MotionValue on a plain `<div>` (silently does nothing → use `motion.div`).
- Legacy import `from 'framer-motion'` (works, but canonical is `motion/react`).
- Forgetting `offset` on `useScroll` (tracks full page, not the element).
- `target: ref` without attaching `ref` to the DOM element.
- Using `animate` for scroll-linked values (must be `style`).
- Not smoothing `scrollYProgress` with `useSpring` for polished UI.

---

## 5. Threlte — three.js for Svelte

> **Svelte only.** Threlte does not run in React or Next.js. In a React project the equivalent is
> React Three Fiber (`@react-three/fiber` + `@react-three/drei`). Check the framework before reaching
> for this section. Docs: [threlte.xyz](https://threlte.xyz/docs/learn/getting-started/introduction/)

Threlte renders three.js declaratively and state-driven inside Svelte, with strictly typed
components. Current versions need **Svelte 5+** and **three 0.160+**.

### 5.1 Setup
```bash
npm install three @threlte/core          # minimum
npm install @threlte/extras              # almost always wanted too
npm install -D @types/three              # TypeScript
```

### 5.2 Packages

| Package | What it is |
|---|---|
| `@threlte/core` | The Svelte binding to three.js. `<Canvas>`, the `<T>` component, hooks such as `useTask` and `useThrelte`. |
| `@threlte/extras` | Plugins and components: `OrbitControls`, `interactivity`, `useGltf`, `Text`, `Environment`, `Float`, and more. |
| `@threlte/gltf` | CLI that turns a GLTF asset into a declarative Threlte component. |
| `@threlte/rapier` | Physics through the Rapier engine. |
| `@threlte/theatre` | Animation authoring through Theatre.js. |
| `@threlte/xr` | VR and AR. |
| `@threlte/flex` | Flexbox layout in 3D through yoga-layout. |

### 5.3 The `<T>` component
`<T.Anything>` maps to `new THREE.Anything()`. Props set properties, array props call `.set()`,
and a child geometry or material attaches itself to its parent mesh.

```svelte
<!-- App.svelte -->
<script>
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
</script>

<div style="height: 100vh"><Canvas><Scene /></Canvas></div>
```
```svelte
<!-- Scene.svelte: hooks only work inside <Canvas>, so the scene is its own component -->
<script>
  import { T, useTask } from '@threlte/core';
  import { interactivity } from '@threlte/extras';

  interactivity();
  let rotation = $state(0);
  let hovered = $state(false);
  useTask((delta) => { rotation += delta; });   // runs every frame
</script>

<T.PerspectiveCamera makeDefault position={[6, 6, 6]} oncreate={(ref) => ref.lookAt(0, 1, 0)} />
<T.DirectionalLight position={[0, 10, 10]} castShadow />

<T.Mesh
  position.y={1}
  rotation.y={rotation}
  scale={hovered ? 1.2 : 1}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>
```

### 5.4 Critical Rules
- The `<Canvas>` fills its parent. Give the parent an explicit height or nothing renders.
- `useTask`, `useThrelte` and every other hook must run in a child of `<Canvas>`, never beside it.
- Pointer events on meshes do nothing until `interactivity()` from `@threlte/extras` is called.
- Constructor arguments go in `args={[...]}`. Changing `args` rebuilds the object, so animate props instead.
- Pierced props (`position.y`, `rotation.y`) update one axis without allocating a new array each frame.
- SvelteKit: if SSR throws on three imports, add `ssr: { noExternal: ['three'] }` to `vite.config`.
- Respect `prefers-reduced-motion` and pause `useTask` loops when the canvas is offscreen. 3D is the
  easiest way to break the "over-the-top animation" ban in House Rules §A.

---

## 6. Quick Picker

| You want… | Reach for |
|---|---|
| To know what is banned outright | **House Rules §A** (top of file) |
| To know if it can launch | **House Rules §B** (top of file) |
| A whole screen / design system | **Stitch** (§2.1) |
| One component fast | **Magic** (§2.2) |
| A real, readable component or block instead of a generated one | **Watermelon UI** (§2.4) |
| Make AI output not look generic / "slop" | **design-taste-frontend** or **high-end-visual-design** (§2.5) |
| Audit / critique / polish an existing UI | **/impeccable audit·critique·polish** (§2.5) |
| Upgrade an existing site to premium | **redesign-existing-projects** (§2.5) |
| Design-reference images before coding | **imagegen-frontend-web/mobile** or **image-to-code** (§2.5) |
| UI polish & animation taste | **emil-design-eng** (§2.5) |
| Vanilla/Vue, pinning, horizontal scroll, timelines | **GSAP** (§3) |
| React/Next entrance + scroll-linked motion | **Framer Motion** (§4) |
| 3D in a Svelte / SvelteKit project | **Threlte** (§5). React projects: React Three Fiber instead. |
| Verify it renders / screenshot | **Playwright** (§2.3) |
| Current API docs before coding | **Context7** (§2.3) |
