import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { ScrollProgress } from "@/components/brand/SignalPath";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { StatBand } from "@/components/home/StatBand";
import { Pipeline } from "@/components/home/Pipeline";
import { InboundOutbound } from "@/components/home/InboundOutbound";
import { CallQA } from "@/components/home/CallQA";
import { WorkflowBuilder } from "@/components/home/WorkflowBuilder";
import { Integrations } from "@/components/home/Integrations";
import { Industries } from "@/components/home/Industries";
import { Testimonials } from "@/components/home/Testimonials";
import { Commitments } from "@/components/home/Commitments";
import { Compliance } from "@/components/home/Compliance";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <StatBand />
        <Pipeline />
        <InboundOutbound />
        <CallQA />
        <WorkflowBuilder />
        <Integrations />
        <Industries />
        <Testimonials />
        <Commitments />
        <Compliance />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
