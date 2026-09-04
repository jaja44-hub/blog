import type { Config } from "tailwindcss";

// Design tokens for the Addis Crown blog.
// Palette moves away from the "warm cream + terracotta" and
// "near-black + neon accent" AI-generated defaults: a parchment/ink
// base with a deep teal-green primary accent and a muted ochre
// secondary accent, evoking institutional trust and provenance
// (seals, ledgers, legal documents) without leaning on cliche gavel imagery.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",        // primary text / headings
        parchment: "#FBF9F4",  // page background
        parchmentDeep: "#F2EEE3", // section background / cards
        teal: "#2F6F5E",       // primary accent (links, buttons)
        tealDeep: "#234F43",
        ochre: "#C08A2E",      // secondary accent (highlights, tags)
        stone: "#6B6B63",      // secondary text
        line: "#E4DFD3"        // borders / rules
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        body: ["var(--font-public-sans)", "system-ui", "sans-serif"]
      },
      maxWidth: {
        article: "42rem"
      }
    }
  },
  plugins: []
};
export default config;
