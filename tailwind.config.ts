import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Uses next/font variable from app/layout.tsx
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["var(--font-display)", "var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        vss: {
          // Deeper graphite base (closer to Swiftec dark theme)
          bg: "#070a0f",
          panel: "rgba(255,255,255,0.055)",
          border: "rgba(255,255,255,0.10)",

          // ✅ Slightly softer / less "white" for premium dark UI
          heading: "#c7cfdb",
          text: "#b9c2cf",
          muted: "rgba(185,194,207,0.62)",

          accent: "#ff8c00",
        },
      },
    },
  },
  plugins: [],
};

export default config;
