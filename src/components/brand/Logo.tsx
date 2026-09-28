import Image from "next/image";
import { cn } from "@/lib/utils";
import iconSrc from "../../../public/brand/icon.png";
import lockupSrc from "../../../public/brand/lockup.png";

/**
 * The real Tring Tring mark: a fixed two-colour asset (black wordmark, red "tring"
 * and the notched L), not themed. It stays constant across every accent the preview
 * bar offers, the same way a brand mark does on any product regardless of a seasonal
 * palette. `LogoMark` is the icon alone, for tight corners; `Logo` is the full lockup.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={iconSrc}
      alt=""
      priority
      className={cn("h-9 w-auto", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={lockupSrc}
      alt="Tring Tring"
      priority
      className={cn("h-11 w-auto", className)}
    />
  );
}
