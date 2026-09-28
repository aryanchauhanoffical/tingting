import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { ScrollProgress } from "@/components/brand/SignalPath";

/**
 * The shell every page other than the home page sits in. The home page keeps its own
 * arrangement because its hero owns the whole viewport and the intro gate; everything
 * else starts below the fixed navigation and ends on the same footer.
 */
export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-[calc(var(--preview-bar,0px)+5.5rem)]">{children}</main>
      <Footer />
    </>
  );
}
