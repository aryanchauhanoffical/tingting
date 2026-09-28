import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ThemeBar } from "@/components/shell/ThemeBar";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gvox.ai"),
  title: {
    default: "Tring Tring — AI voice agents that close the loop",
    template: "%s · Tring Tring",
  },
  description:
    "Tring Tring handles your calls, inbound and outbound, in every language. Sub-400ms latency, human-quality voice, and automated QA on every call.",
  openGraph: {
    title: "Tring Tring — AI voice agents that close the loop",
    description:
      "Handle every call, inbound and outbound, in every language. Human-quality voice with automated QA.",
    type: "website",
    images: [{ url: "/generated/og.png", width: 1200, height: 630, alt: "Tring Tring" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tring Tring — AI voice agents that close the loop",
    images: ["/generated/og.png"],
  },
  icons: {
    // The real mark (from public/brand/icon.png), not the old abstract waveform
    // SVG. An SVG favicon wins over PNG in most browsers regardless of list order,
    // so favicon.svg is dropped here rather than merely reordered.
    icon: [
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        {/* the hero's intro flag, set before first paint so the nav never flashes in (Hero clears it on the first click) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(location.pathname==='/'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-intro','')",
          }}
        />
        {/* restores a saved accent before first paint, so it never flashes the wrong colour first */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <ThemeBar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
