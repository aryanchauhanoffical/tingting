import type { Metadata } from "next";
import { LegalPage } from "@/components/page/Legal";
import { TRADEMARK, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Trademark and brand use",
  description: "How to refer to Tring Tring, what you can use without asking, and what needs permission.",
};

export default function TrademarkPage() {
  return (
    <LegalPage
      title="Trademark and brand use"
      updated={LEGAL_UPDATED}
      lead="How to write our name, when you can use the logo, and the short list of things you need to ask us about first."
      sections={TRADEMARK}
    />
  );
}
