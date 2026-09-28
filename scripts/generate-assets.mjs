#!/usr/bin/env node
/**
 * Gvox asset generator.
 * Reads GEMINI_API_KEY from .env.local, generates section imagery with
 * gemini-2.5-flash-image ("Nano Banana"), post-crops with sharp, writes to /public.
 *
 * Usage:
 *   node scripts/generate-assets.mjs            # generate all
 *   node scripts/generate-assets.mjs hero-bg    # generate one by id
 *
 * Prompts are lifted from content.md's IMG PROMPT blocks, tuned for softness.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "generated");

// --- load .env.local -----------------------------------------------------
function loadEnv() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (m) process.env[m[1]] ??= (m[2] || "").replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Missing GEMINI_API_KEY (put it in .env.local).");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// --- asset manifest ------------------------------------------------------
// treatment: { w, h, fit } post-processing with sharp. alpha keeps transparency.
const STUDIO = "warm off-white (#FBFBF9) studio background, electric-indigo (#5B5BFF) accent, soft diffused light, premium, minimal, lots of negative space, no text, no logo, Octane render";

const industry = (id, subject) => ({
  id,
  file: `${id}.png`,
  treatment: { w: 1200, h: 675, fit: "cover" },
  prompt: `Minimal abstract 3D scene representing ${subject}, soft rounded objects, ${STUDIO}, calm composition.`,
});

const ASSETS = [
  {
    id: "hero-bg",
    file: "hero-bg.png",
    treatment: { w: 2100, h: 900, fit: "cover" },
    prompt: `Abstract 3D sound wave made of thousands of ultra-thin electric-indigo (#5B5BFF) filaments flowing gently left to right, very shallow depth of field, lots of clean negative space in the upper-left, ${STUDIO}, calm.`,
  },
  {
    id: "og",
    file: "og.png",
    treatment: { w: 1200, h: 630, fit: "cover" },
    prompt: `Premium minimal brand key visual: a single elegant indigo (#5B5BFF) voice waveform crossing the canvas, huge negative space, soft grain, editorial, ${STUDIO}.`,
  },
  {
    id: "signal-texture",
    file: "signal-texture.png",
    treatment: { w: 1600, h: 1600, fit: "cover" },
    prompt: `Seamless abstract texture of faint indigo signal lines and data particles drifting, extremely subtle, low contrast, for a 6% opacity overlay, no focal point, ${STUDIO}.`,
  },
  {
    id: "scene-outbound",
    file: "scene-outbound.png",
    treatment: { w: 1000, h: 750, fit: "cover" },
    prompt: `Stylized 3D scene of a call going out: a glowing indigo (#5B5BFF) signal arc leaving a single phone node toward several contact silhouettes, ${STUDIO}, soft shadows.`,
  },
  {
    id: "scene-inbound",
    file: "scene-inbound.png",
    treatment: { w: 1000, h: 750, fit: "cover" },
    prompt: `Stylized 3D scene of many incoming indigo (#5B5BFF) signal arcs converging into one glowing agent node, calm, organized, ${STUDIO}, soft depth.`,
  },
  industry("real-estate", "real estate: soft buildings and keys"),
  industry("healthcare", "healthcare: a gentle heartbeat pulse and rounded medical forms"),
  industry("fintech", "fintech: abstract coins, cards, and a rising signal"),
  industry("ecommerce", "e-commerce: a soft shopping bag and floating product boxes"),
  industry("travel", "travel: a stylized plane and a soft globe arc"),
  industry("education", "education: an abstract graduation cap and open book"),
];

// --- generation ----------------------------------------------------------
async function generateOne(asset, attempt = 1) {
  const body = {
    contents: [{ parts: [{ text: asset.prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    if (attempt < 3) {
      console.warn(`  retry ${asset.id} (${res.status})`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      return generateOne(asset, attempt + 1);
    }
    throw new Error(`${asset.id}: HTTP ${res.status} ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData)?.inlineData?.data;
  if (!img) throw new Error(`${asset.id}: no image in response`);
  return Buffer.from(img, "base64");
}

async function run() {
  mkdirSync(OUT, { recursive: true });
  const only = process.argv[2];
  const list = only ? ASSETS.filter((a) => a.id === only) : ASSETS;
  if (!list.length) {
    console.error(`No asset with id "${only}". Ids: ${ASSETS.map((a) => a.id).join(", ")}`);
    process.exit(1);
  }

  for (const asset of list) {
    process.stdout.write(`Generating ${asset.id} ... `);
    try {
      const raw = await generateOne(asset);
      const { w, h, fit } = asset.treatment;
      const out = join(OUT, asset.file);
      await sharp(raw).resize(w, h, { fit }).png({ quality: 90 }).toFile(out);
      console.log(`ok -> public/generated/${asset.file}`);
    } catch (e) {
      console.log("FAILED");
      console.error("  " + e.message);
    }
  }
  console.log("\nDone. Reference generated assets from /generated/<file>.");
}

run();
