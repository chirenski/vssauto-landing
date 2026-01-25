import type { Metadata } from "next";
import "./globals.css";

import { Montserrat } from "next/font/google";

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

/**
 * One font everywhere: Montserrat (№5)
 * - --font-sans: used by Tailwind's font-sans (NavBar/body/etc.)
 * - --font-display: used by font-display (headings/hero/etc.)
 *
 * We intentionally load Montserrat twice with different CSS variables
 * so the whole project uses ONLY Montserrat, without touching other files.
 */
const montserratSans = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const montserratDisplay = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vssauto.net"),
  title: "VSS Auto | Чиптунинг и диагностика",
  description:
    "Професионален чиптунинг и диагностика в София. ECU/TCU софтуерни решения, индивидуален подход и контрол на параметри.",
  openGraph: {
    title: "VSS Auto София",
    description:
      "Чиптунинг, ECU/TCU софтуер и диагностика в София. Надеждност и реални резултати.",
    url: "https://vssauto.net",
    siteName: "VSS Auto",
    locale: "bg_BG",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body
        className={`${montserratSans.variable} ${montserratDisplay.variable} font-sans antialiased bg-vss-bg text-vss-text`}
      >
        <div className="min-h-screen flex flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
