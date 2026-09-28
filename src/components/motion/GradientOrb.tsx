import { cn } from "@/lib/utils";

/**
 * Corner-anchored soft accent gradient orb (§0). One per section, bleeds off-edge.
 * Pure CSS radial gradient — cheap, no image dependency.
 *
 * Fades through accent-soft rather than straight to transparent. A saturated colour
 * fading purely by alpha reads as a flat stain once blurred (worst on a vivid red,
 * where it starts to look like a bruise); fading through a lighter tint of the same
 * hue first reads as a light source in every hue this site has offered, so a client
 * switching the accent never has to worry the glow will misbehave on their colour.
 */
export function GradientOrb({
  className,
  intensity = 0.5,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-[100px]", className)}
      style={{
        background: `radial-gradient(circle at center, rgb(var(--accent-rgb) / ${intensity}), rgb(var(--accent-soft-rgb) / ${(intensity * 0.32).toFixed(3)}) 45%, rgb(var(--accent-soft-rgb) / 0) 75%)`,
      }}
    />
  );
}
