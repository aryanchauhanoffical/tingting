import Link from "next/link";
import { PageFrame } from "@/components/page/PageFrame";

export type LegalSection = { id: string; heading: string; body: readonly string[] };

/**
 * The shape every legal page takes: a sticky contents column on the left, the document
 * on the right, and a measure narrow enough to actually read. No decoration: these pages
 * are for the one person who came here to check a specific clause.
 */
export function LegalPage({
  title,
  updated,
  lead,
  sections,
}: {
  title: string;
  updated: string;
  lead: string;
  sections: readonly LegalSection[];
}) {
  return (
    <PageFrame>
      <header className="page border-b border-line pb-12 pt-10">
        <p className="eyebrow rise">Legal</p>
        <h1 className="font-display rise mt-4 max-w-3xl text-title font-semibold" style={{ animationDelay: "60ms" }}>
          {title}
        </h1>
        <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-muted" style={{ animationDelay: "120ms" }}>
          {lead}
        </p>
        <p className="tabular rise mt-6 text-sm text-faint" style={{ animationDelay: "180ms" }}>
          Last updated {updated}
        </p>
      </header>

      <div className="page grid gap-12 py-14 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-sm font-semibold text-ink">Contents</p>
          <ol className="mt-4 flex flex-col gap-2.5">
            {sections.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="tabular text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <Link
                  href={`#${s.id}`}
                  className="text-[0.88rem] leading-snug text-muted transition-colors hover:text-accent-ink"
                >
                  {s.heading}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-2xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-32 border-t border-line pt-8 first:border-0 first:pt-0 [&+section]:mt-12">
              <h2 className="font-display flex items-baseline gap-3 text-xl font-semibold">
                <span className="tabular text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-4 text-[0.98rem] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <p className="mt-14 rounded-[var(--radius-card)] border border-line bg-surface p-6 text-[0.92rem] leading-relaxed text-muted">
            This document is a working draft published for review. It is not legal advice, and it will be
            replaced by counsel-reviewed text before launch. Questions in the meantime go to{" "}
            <a href="mailto:legal@tringtring.ai" className="font-medium text-accent-ink">
              legal@tringtring.ai
            </a>
            .
          </p>
        </article>
      </div>
    </PageFrame>
  );
}
