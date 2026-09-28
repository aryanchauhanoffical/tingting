"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";

const FIELD =
  "h-12 w-full rounded-[12px] border border-line bg-surface px-4 text-ink placeholder:text-faint transition-colors duration-200 ease-signal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

/**
 * The form is deliberately short: name, work email, and the one sentence that tells a
 * human where to route it. There is no backend wired yet, so it confirms locally and
 * says plainly what happens next.
 */
export function ContactForm({
  intents,
  submitLabel = "Send",
}: {
  intents: readonly string[];
  submitLabel?: string;
}) {
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-7 shadow-soft sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start gap-4 py-6"
          >
            <CheckCircle size={38} weight="fill" className="text-accent" />
            <div>
              <h3 className="font-display text-xl font-semibold">That is with us.</h3>
              <p className="mt-2 max-w-sm leading-relaxed text-muted">
                Someone from the team replies inside one working day. If it is urgent, call the number
                above and an agent will take a message and page us.
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-[0.92rem] font-medium text-accent-ink underline-offset-4 hover:underline"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={false}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[0.85rem] font-medium text-ink">Name</span>
                <input required name="name" autoComplete="name" placeholder="Priya Nair" className={FIELD} />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.85rem] font-medium text-ink">Work email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={FIELD}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[0.85rem] font-medium text-ink">What is this about</span>
              <select required name="intent" defaultValue={intents[0]} className={`${FIELD} appearance-none`}>
                {intents.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-[0.85rem] font-medium text-ink">A sentence or two</span>
              <textarea
                required
                name="message"
                rows={4}
                placeholder="We take about 400 calls a week and lose most of the evening ones."
                className={`${FIELD} h-auto resize-none py-3 leading-relaxed`}
              />
            </label>

            <button
              type="submit"
              className="group mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-ink px-6 font-medium text-white transition-all duration-200 ease-signal hover:-translate-y-0.5 hover:bg-accent hover:text-accent-contrast"
            >
              {submitLabel}
              <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="text-[0.8rem] leading-relaxed text-faint">
              We use what you send here to reply to you, nothing else. See the privacy policy.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
