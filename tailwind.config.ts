import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        lora: ["var(--font-lora)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        background: "#0d0d0f",
        surface: "#161618",
        border: "#2a2a2e",
        gold: "#c9a84c",
        arcane: "#7c5cbf",
        danger: "#c0392b",
        parchment: "#f0ece0",
        muted: "#888070",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 4px #c9a84c44" },
          "50%": { boxShadow: "0 0 16px #c9a84c99" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
