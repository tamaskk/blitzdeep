import type { Config } from "tailwindcss";

/**
 * Design tokens reverse-engineered from the BlitzDeep reference screenshot.
 * Spacing/radius/shadow values are kept in one place so the whole UI can be
 * re-themed from here.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand orange (CTA buttons, accents, links)
        brand: {
          DEFAULT: "#F1592A",
          hover: "#DC4A1E",
          light: "#FF7A4D",
          50: "#FFF3EC",
          100: "#FFE3D5",
        },
        // Near-black used for dark cards, the contact form and footer
        ink: {
          DEFAULT: "#171513",
          800: "#211E1B",
          700: "#2C2825",
          muted: "#9A938C",
        },
        // Neutral surface / border ramp
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F6F4",
          subtle: "#FAF9F7",
        },
        line: "#E9E6E1",
        body: "#6B6661",
        heading: "#1A1714",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        // Tightened display sizes matching the reference proportions
        "display-lg": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.875rem, 3.2vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 21, 19, 0.04), 0 8px 24px -12px rgba(23, 21, 19, 0.10)",
        "card-hover": "0 2px 4px rgba(23, 21, 19, 0.06), 0 20px 40px -16px rgba(23, 21, 19, 0.18)",
        btn: "0 1px 2px rgba(241, 89, 42, 0.30), 0 8px 20px -8px rgba(241, 89, 42, 0.45)",
      },
      maxWidth: {
        container: "1216px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-22px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(0, 26px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.21, 0.6, 0.35, 1) both",
        "fade-down": "fade-down 0.6s ease-out both",
        "fade-in": "fade-in 0.9s ease-out both",
        "scale-in": "scale-in 0.6s ease-out both",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
