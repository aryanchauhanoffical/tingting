import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-[12px] transition-[transform,background,color,box-shadow] duration-200 ease-signal active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-accent hover:text-accent-contrast hover:shadow-accent",
  ghost: "text-ink hover:bg-ink/[0.05]",
  outline: "border border-line text-ink bg-surface shadow-soft hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "solid", size = "md", href, className, children, ...props }: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
