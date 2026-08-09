import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tc: {
          bg: "#10131a",
          elevated: "#171b23",
          surface: "#1b2029",
          "surface-hover": "#212734",
          border: "#2a3140",
          "border-strong": "#39435a",
          text: "#e7eaef",
          "text-secondary": "#8992a6",
          "text-tertiary": "#5c6478",
          accent: "#e8a33d",
          "accent-strong": "#f5b95c",
          success: "#5fbe85",
          danger: "#e2686b",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        tc: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
