import type { Metadata } from "next";
import { LegalPage } from "@/components/page/Legal";
import { TERMS, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The agreement covering the Tring Tring website, platform and API.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated={LEGAL_UPDATED}
      lead="The agreement between your organisation and ours: what you can build, what we owe you, and what happens when either side wants out."
      sections={TERMS}
    />
  );
}
