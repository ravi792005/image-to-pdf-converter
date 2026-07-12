/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design tokens - see DESIGN.md for rationale
        ink: "#0B1220",        // near-black navy, dark mode background
        paper: "#F7F9FC",      // soft blue-white, light mode background
        brand: {
          DEFAULT: "#2451D6",  // primary action blue
          dark: "#16306B",     // deep indigo, headings/hero
          light: "#5B82F0",    // hover/accent
        },
        surface: {
          light: "#FFFFFF",
          dark: "#111A2E",
        },
        mist: "#E7ECF7",       // subtle borders/dividers, light mode
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"Inter\"", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(22, 48, 107, 0.12)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "stack-fold": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(-6px) rotate(-2deg)", opacity: "0.9" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
