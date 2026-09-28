"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useReducedMotion } from "motion/react";
import { CaretDown, List, X, Phone } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { NAV_LINKS, SOLUTIONS_MENU } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prev = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
    if (!mobileOpen && !solutionsOpen) {
      setHidden(latest > prev.current && latest > 240);
    }
    prev.current = latest;
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: reduce ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="site-header fixed inset-x-0 z-50"
    >
      <div className="page flex justify-center pt-3">
        <nav
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-pill px-4 py-2.5 transition-all duration-300 ease-signal",
            scrolled ? "glass" : "bg-transparent",
          )}
        >
          <Link href="/" aria-label="Tring Tring home" className="shrink-0">
            <Logo />
          </Link>

          {/* center links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) =>
              l.label === "Solutions" ? (
                <li
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <button className="inline-flex items-center gap-1 rounded-pill px-3.5 py-2 text-[0.92rem] text-muted transition-colors hover:text-ink">
                    {l.label}
                    <CaretDown size={13} className={cn("transition-transform", solutionsOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {solutionsOpen && <SolutionsMega reduce={!!reduce} />}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="rounded-pill px-3.5 py-2 text-[0.92rem] text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* right */}
          <div className="flex items-center gap-2">
            <Link href="/demo" className="hidden rounded-pill px-3.5 py-2 text-[0.92rem] text-muted transition-colors hover:text-ink sm:inline-flex">
              Book a demo
            </Link>
            <Link
              href="/test-call"
              className="group inline-flex items-center whitespace-nowrap gap-2 rounded-[10px] bg-ink px-4 py-2.5 text-[0.9rem] font-medium text-white transition-colors duration-200 ease-signal hover:bg-accent"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 pulse-dot group-hover:bg-white" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent group-hover:bg-white" />
              </span>
              Make a test call
            </Link>
            <button
              className="grid h-10 w-10 place-items-center rounded-pill text-ink lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="page lg:hidden"
          >
            <div className="panel mt-2 rounded-[var(--radius-card)] p-4">
              <ul className="flex flex-col">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-line-soft py-3 text-ink last:border-0"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/test-call"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-ink py-3 font-medium text-white"
              >
                <Phone weight="fill" size={16} /> Make a test call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function SolutionsMega({ reduce }: { reduce: boolean }) {
  const cols = [SOLUTIONS_MENU.useCase, SOLUTIONS_MENU.industry];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="absolute left-1/2 top-full z-50 mt-2 w-[560px] -translate-x-1/2 overflow-hidden rounded-[var(--radius-card)] panel p-2"
    >
      <div className="relative grid grid-cols-2 gap-1">
        {cols.map((col) => (
          <div key={col.title} className="p-2">
            <p className="eyebrow px-3 pb-1">{col.title}</p>
            {col.items.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                className="block rounded-2xl px-3 py-2.5 transition-colors hover:bg-ink/[0.04]"
              >
                <span className="block text-[0.92rem] font-medium text-ink">{it.label}</span>
                <span className="block text-[0.8rem] text-muted">{it.desc}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
