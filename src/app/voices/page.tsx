import type { Metadata } from "next";
import { PageFrame } from "@/components/page/PageFrame";
import { PageHero, Section, SectionHead, CtaBand, ArrowLink } from "@/components/page/Section";
import { VOICES, LANGUAGE_ROUTING } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Voices and languages",
  description: "Six voices across six locales, and the language routing behind them.",
};

/**
 * A held vowel, drawn as bars. Each voice gets a different phase of the same shape so
 * the six cards do not read as one repeated graphic, and nothing moves until hover.
 */
const BARS = [0.3, 0.52, 0.78, 1, 0.68, 0.44, 0.86, 0.58, 0.36, 0.72, 0.5, 0.9, 0.62, 0.34, 0.54, 0.28];
const wave = (offset: number) => BARS.map((_, i) => BARS[(i + offset * 3) % BARS.length]);

export default function VoicesPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Voices"
        title="Six voices. Pick the one your callers would not question."
        lead="Every caller hears one voice, so it is worth a minute of your time. The setup recommends one from the direction and the language you chose, tells you why, and plays a three second sample before you commit."
      />

      <Section className="!pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((v, vi) => (
            <article
              key={v.name}
              className="group rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft transition-shadow duration-300 ease-signal hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold">{v.name}</h2>
                  <p className="mt-1 text-[0.85rem] text-muted">
                    {v.gender}, {v.language}
                  </p>
                </div>
                <span className="tabular rounded-md bg-accent-2 px-2 py-1 text-[0.68rem] font-medium text-accent-ink">
                  {v.locale}
                </span>
              </div>

              {/* waveform, still until the card is hovered */}
              <div aria-hidden className="mt-6 flex h-11 items-center justify-between gap-[3px]">
                {wave(vi).map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] flex-none rounded-full bg-accent/60 transition-colors duration-300 group-hover:bg-accent group-hover:animate-[eq_1.25s_ease-in-out_infinite]"
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>

              <dl className="mt-6 border-t border-line pt-4 text-[0.88rem]">
                <div className="flex justify-between gap-4 py-1.5">
                  <dt className="text-faint">Style</dt>
                  <dd className="text-right text-ink">{v.style}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1.5">
                  <dt className="text-faint">Best for</dt>
                  <dd className="text-right text-muted">{v.bestFor}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <p className="mt-8 text-[0.88rem] text-muted">
          Samples play inside the product during setup.{" "}
          <ArrowLink href="/test-call">Hear one on a live call instead</ArrowLink>
        </p>
      </Section>

      <Section tone="wash">
        <SectionHead
          eyebrow="Languages"
          title="Six locales, and callers who use two of them at once."
          lead="Speech recognition and speech synthesis are routed per language rather than forced through one model, because the model that handles Hindi best is not the one that handles US English best."
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="pb-3 text-[0.78rem] font-medium uppercase tracking-[0.1em] text-faint">Language</th>
                <th className="pb-3 text-[0.78rem] font-medium uppercase tracking-[0.1em] text-faint">Code</th>
                <th className="pb-3 text-[0.78rem] font-medium uppercase tracking-[0.1em] text-faint">Where it earns its keep</th>
              </tr>
            </thead>
            <tbody>
              {LANGUAGE_ROUTING.map((l) => (
                <tr key={l.code} className="border-b border-line">
                  <td className="py-4 pr-6 font-medium text-ink">{l.language}</td>
                  <td className="tabular py-4 pr-6 text-[0.88rem] text-muted">{l.code}</td>
                  <td className="py-4 text-[0.92rem] leading-relaxed text-muted">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHead eyebrow="Mixed speech" title="Most callers do not pick one language and stay there." />
          <div className="max-w-xl space-y-5 leading-relaxed text-muted">
            <p>
              A caller opens in English, slips into Hindi halfway through a sentence, and finishes with a
              number in whichever one came to mind. An agent set to multilingual starts in English and
              follows them, rather than restarting the sentence in the wrong language.
            </p>
            <p>
              Write your opening lines the way people actually speak. Hinglish reads naturally to the voice
              models, so put it in as you would say it down the phone and it will come out sounding like
              that.
            </p>
            <p>
              Names are the other half of it. A pronunciation dictionary fixes the words that matter to you,
              one per line, so a venue or a family name is never mangled twice.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Hear the difference between two of them."
        lead="The test call uses the default voice. Tell us on the demo which of the six fits your callers and we will switch it live while you listen."
      />
    </PageFrame>
  );
}
