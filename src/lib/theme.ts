/**
 * Accent theming for the client preview.
 *
 * One picked colour drives every accent token on the site. The derivations run in
 * OKLCH, not HSL, so a green and an orange at the same lightness actually look
 * equally strong, and every derived value is checked against WCAG contrast before
 * it ships: text on the accent, the accent used as text on the page, and the tint
 * used on the dark sections.
 */

export type Theme = {
  /** exactly the colour that was picked */
  accent: string;
  /** white or ink, whichever is readable on top of the accent */
  accentContrast: string;
  /** the accent as text on the light page, darkened until it clears AA */
  accentInk: string;
  /** soft wash behind icons and chips */
  accent2: string;
  /** lighter wash for panels */
  accent3: string;
  /** the tint used on the ink-coloured sections */
  accentSoft: string;
  /** partner hue, a rotation off the accent, for the second-tier live readouts */
  support: string;
  /** "0 133 66" for the partner hue */
  supportRgb: string;
  /** "233 0 0", for rgb(var(--accent-rgb) / <alpha>) */
  accentRgb: string;
  /** accentSoft as an unpacked triple, so glows can fade through it rather than to flat transparent */
  accentSoftRgb: string;
  /** filter that shifts the baked-in purple of the product renders toward the accent */
  shotFilter: string;
};

export type Palette = { id: string; name: string; hex: string };

/**
 * The swatches. All ten sit at the same perceived lightness as the brand red and
 * clear 4.7:1 against white, so swapping between them changes the hue without
 * quietly changing how heavy the design feels. Tring Red is the shipped brand colour;
 * the rest stay on hand for a client comparing options.
 */
export const PALETTES: Palette[] = [
  { id: "red", name: "Tring Red", hex: "#e90000" },
  { id: "indigo", name: "Indigo", hex: "#5b5bff" },
  { id: "violet", name: "Violet", hex: "#9a3fe4" },
  { id: "blue", name: "Blue", hex: "#0074d1" },
  { id: "cyan", name: "Cyan", hex: "#007f94" },
  { id: "teal", name: "Teal", hex: "#008176" },
  { id: "emerald", name: "Emerald", hex: "#008542" },
  { id: "green", name: "Green", hex: "#4c8000" },
  { id: "orange", name: "Orange", hex: "#b65800" },
  { id: "graphite", name: "Graphite", hex: "#61636a" },
];

export const DEFAULT_ACCENT = PALETTES[0].hex;
export const STORAGE_KEY = "tt-accent";
export const THEME_EVENT = "tt-theme";

const BG = "#ffffff";
const SURFACE = "#ffffff";
const INK = "#0b0b0f";
/** hue and chroma of the indigo the product renders were drawn in */
const SHOT_HUE = 275.95;
const SHOT_CHROMA = 0.236;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]: number[]): string {
  const t = (v: number) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${t(r)}${t(g)}${t(b)}`;
}

function rgbToOklch([r, g, b]: number[]): [number, number, number] {
  const lr = srgbToLinear(r / 255), lg = srgbToLinear(g / 255), lb = srgbToLinear(b / 255);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, Math.sqrt(A * A + B * B), H];
}

function oklchToRgbRaw([L, C, H]: number[]): number[] {
  const h = (H * Math.PI) / 180;
  const A = C * Math.cos(h), B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Pull chroma in until the colour fits inside sRGB, so no hue ever clips to mud. */
function oklchToHex([L, C, H]: number[]): string {
  const inGamut = (v: number[]) => v.every((c) => c >= -0.001 && c <= 1.001);
  let fit = oklchToRgbRaw([L, C, H]);
  if (!inGamut(fit)) {
    let lo = 0, hi = C;
    fit = oklchToRgbRaw([L, 0, H]);
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const t = oklchToRgbRaw([L, mid, H]);
      if (inGamut(t)) { fit = t; lo = mid; } else hi = mid;
    }
  }
  return rgbToHex(fit.map((c) => clamp(c, 0, 1) * 255));
}

const luminance = ([r, g, b]: number[]) => {
  const [R, G, B] = [r, g, b].map((c) => srgbToLinear(c / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export function contrast(a: string, b: string): number {
  const la = luminance(hexToRgb(a)), lb = luminance(hexToRgb(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Every accent token, derived from one colour so a new hue never breaks the system. */
export function deriveTheme(hex: string): Theme {
  const accent = hex.toLowerCase();
  const [L, C, H] = rgbToOklch(hexToRgb(accent));

  // Text that sits ON the accent: white or ink, whichever the eye can actually read.
  // This is why an orange or a yellow accent does not end up with unreadable white labels.
  const accentContrast = contrast("#ffffff", accent) >= contrast(INK, accent) ? "#ffffff" : INK;

  // The accent used AS text on the light page. Darken until it clears AA on the page
  // background and on white cards.
  let inkL = Math.min(L, 0.55);
  let accentInk = oklchToHex([inkL, C, H]);
  for (let i = 0; i < 40 && Math.min(contrast(accentInk, BG), contrast(accentInk, SURFACE)) < 5.5; i++) {
    inkL -= 0.012;
    accentInk = oklchToHex([inkL, C, H]);
  }

  const accent2 = oklchToHex([0.932, Math.min(C * 0.3, 0.06), H]);
  const accent3 = oklchToHex([0.966, Math.min(C * 0.16, 0.032), H]);

  // The tint used on the ink sections, checked against #0b0b0f.
  const softC = Math.min(C * 0.6, 0.13);
  let softL = 0.76;
  let accentSoft = oklchToHex([softL, softC, H]);
  for (let i = 0; i < 30 && contrast(accentSoft, INK) < 6; i++) {
    softL += 0.012;
    accentSoft = oklchToHex([softL, softC, H]);
  }

  // The two product renders have the indigo baked into the pixels, so they get a
  // hue rotation instead. Not colour-accurate, but it keeps them in the same family
  // as the rest of the page instead of staying stubbornly purple.
  let delta = H - SHOT_HUE;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  // The renders' "black" chrome is actually a faint indigo, not neutral grey, so a big
  // rotation reads as an all-over colour cast rather than a subtle recolour. Damping the
  // swing and desaturating keeps large hue jumps (like indigo -> red) from overpowering
  // the shot instead of just tinting its accent bits.
  const dampedDelta = clamp(delta, -100, 100);
  const sat = clamp(C / SHOT_CHROMA, 0.12, 1.25) * 0.55;
  const shotFilter = `hue-rotate(${dampedDelta.toFixed(1)}deg) saturate(${sat.toFixed(2)})`;

  // A partner hue so the page is never one colour plus a hard-coded green. Rotated far
  // enough off the accent to read as a second colour, held at a light, legible level
  // because it only ever appears on the ink sections.
  const supH = (H + 148) % 360;
  let supL = 0.74;
  let support = oklchToHex([supL, Math.min(C * 0.65, 0.14), supH]);
  for (let i = 0; i < 30 && contrast(support, INK) < 6; i++) {
    supL += 0.012;
    support = oklchToHex([supL, Math.min(C * 0.65, 0.14), supH]);
  }

  return {
    accent,
    accentContrast,
    accentInk,
    accent2,
    accent3,
    accentSoft,
    support,
    supportRgb: hexToRgb(support).map(Math.round).join(" "),
    accentRgb: hexToRgb(accent).map(Math.round).join(" "),
    accentSoftRgb: hexToRgb(accentSoft).map(Math.round).join(" "),
    shotFilter,
  };
}

/**
 * The theme as the CSS custom properties it maps onto. These are the raw inputs:
 * globals.css feeds them into the --color-accent* design tokens, so the token names
 * the components use never change.
 */
export function themeVars(t: Theme): Record<string, string> {
  return {
    "--accent": t.accent,
    "--accent-contrast": t.accentContrast,
    "--accent-ink": t.accentInk,
    "--accent-2": t.accent2,
    "--accent-3": t.accent3,
    "--accent-soft": t.accentSoft,
    "--accent-rgb": t.accentRgb,
    "--accent-soft-rgb": t.accentSoftRgb,
    "--support": t.support,
    "--support-rgb": t.supportRgb,
    "--shot-filter": t.shotFilter,
  };
}

/** Writes the theme onto <html> and tells the canvas and WebGL pieces to repaint. */
export function applyTheme(hex: string, persist = true) {
  if (typeof document === "undefined") return;
  const t = deriveTheme(hex);
  const vars = themeVars(t);
  const s = document.documentElement.style;
  for (const [k, v] of Object.entries(vars)) s.setProperty(k, v);

  if (persist) {
    try {
      // the resolved variables are stored, not just the hex, so the pre-paint script
      // can restore them without running the colour maths again
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hex, vars }));
    } catch {
      /* private mode, the choice just will not survive a reload */
    }
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: t }));
}

/** The accent saved from a previous visit, if there is one. */
export function savedAccent(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { hex?: string };
    return typeof parsed.hex === "string" ? parsed.hex : null;
  } catch {
    return null;
  }
}

/** Reads the live accent from CSS, for canvas and WebGL that cannot use variables. */
export function readAccent(): string {
  if (typeof document === "undefined") return DEFAULT_ACCENT;
  const v = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();
  return v || DEFAULT_ACCENT;
}

/** Runs before first paint so a saved choice never flashes indigo first. */
export const THEME_BOOT_SCRIPT =
  `(function(){try{var r=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(!r)return;` +
  `var v=JSON.parse(r).vars||{},s=document.documentElement.style;` +
  `for(var k in v)s.setProperty(k,v[k]);}catch(e){}})()`;
