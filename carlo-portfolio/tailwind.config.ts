import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        bg: "#050505",
        surface: "#0f0f0f",
        elevated: "#181818",
        border: "rgba(255,255,255,0.07)",
        primary: "#f0ede8",
        secondary: "#8a8680",
        tertiary: "#3a3835",
        accent: "#00e5ff",
        "accent-dim": "#00b8d4",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        blink: "blink 3.5s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
        "float-in": "floatIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "chip-in": "chipIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.05)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1) translateY(0)" },
          "50%": { transform: "scale(1.012) translateY(-3px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,229,255,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(0,229,255,0.35)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        chipIn: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
