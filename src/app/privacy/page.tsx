import type { Metadata } from "next";
import { LegalPage } from "@/components/page/Legal";
import { PRIVACY, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Tring Tring collects, why, how long it is kept, and the rights you have over it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated={LEGAL_UPDATED}
      lead="Plain answers about what we collect, why we need it, how long we keep it, and what you can ask us to do with it."
      sections={PRIVACY}
    />
  );
}
