import { cn } from "@/lib/utils";

import type { FlagCode as Code } from "@/components/home/heroLangs";

/** Small inline flags (3:2). Drawn as SVG so they render the same on every platform. */
export function Flag({ code, className }: { code: Code; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      aria-hidden
      className={cn("h-[13px] w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-ink/10", className)}
    >
      {FLAGS[code]}
    </svg>
  );
}

const FLAGS: Record<Code, React.ReactNode> = {
  gb: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
    </>
  ),
  in: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <rect width="60" height="13.4" fill="#FF9933" />
      <rect y="26.6" width="60" height="13.4" fill="#138808" />
      <circle cx="30" cy="20" r="5" fill="none" stroke="#000080" strokeWidth="1.4" />
    </>
  ),
  es: (
    <>
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
    </>
  ),
  fr: (
    <>
      <rect width="20" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </>
  ),
  jp: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="12" fill="#BC002D" />
    </>
  ),
  de: (
    <>
      <rect width="60" height="13.4" fill="#000" />
      <rect y="13.3" width="60" height="13.4" fill="#DD0000" />
      <rect y="26.6" width="60" height="13.4" fill="#FFCE00" />
    </>
  ),
};
