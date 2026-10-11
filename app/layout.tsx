import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { Montserrat } from "next/font/google";

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

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

        <Script id="openai-pixel" strategy="afterInteractive">
          {`
            !function(w,d,s,u){
              if(w.oaiq)return;
              var q=function(){q.q.push(arguments)};
              q.q=[];
              w.oaiq=q;
              var j=d.createElement(s);
              j.async=1;
              j.src=u;
              var f=d.getElementsByTagName(s)[0];
              f.parentNode.insertBefore(j,f);
            }(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");

            oaiq("init",{
              pixelId:"NiRiJ3dUppAthzRsQgAsL9",
              debug:false
            });
          `}
        </Script>
      </body>
    </html>
  );
}
