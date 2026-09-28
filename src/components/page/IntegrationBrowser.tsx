"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { INTEGRATIONS } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** The directory: filter by category, search by name, everything else stays put. */
export function IntegrationBrowser() {
  const reduce = useReducedMotion();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const cats = useMemo(() => ["All", ...Array.from(new Set(INTEGRATIONS.map((i) => i.cat)))], []);
  const shown = INTEGRATIONS.filter(
    (i) =>
      (cat === "All" || i.cat === cat) &&
      (q.trim() === "" || `${i.name} ${i.desc}`.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Category" className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "h-9 rounded-[10px] border px-3.5 text-[0.88rem] font-medium transition-colors duration-200 ease-signal",
                cat === c
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="relative w-full md:w-64">
          <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search integrations"
            aria-label="Search integrations"
            className="h-9 w-full rounded-[10px] border border-line bg-surface pl-9 pr-3 text-[0.88rem] text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((it, i) => (
          <motion.article
            key={it.slug}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03, ease: EASE }}
            className="group rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors duration-300 ease-signal hover:border-accent/40"
          >
            <div className="flex items-start justify-between gap-3">
              <Glyph slug={it.slug} name={it.name} />
              <span className="tabular text-[0.66rem] uppercase tracking-wider text-faint">{it.cat}</span>
            </div>
            <h3 className="mt-4 font-medium text-ink">{it.name}</h3>
            <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted">{it.desc}</p>
          </motion.article>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-10 text-center text-muted">
          Nothing matches that yet. Everything is reachable over the REST API and webhooks anyway.
        </p>
      )}
    </div>
  );
}

function Glyph({ slug, name }: { slug: string; name: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-ink text-[0.75rem] font-bold text-white">
        {name[0]}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/0b0b0f`}
      alt=""
      width={28}
      height={28}
      onError={() => setBroken(true)}
      loading="lazy"
      className="h-7 w-7 shrink-0 opacity-75 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  );
}
