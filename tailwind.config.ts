import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
  extend: {
  colors: {
    bg: "#0E1A2B",
    surface: "#16263D",
    accent: "#2F80ED",
    text: "#F5F7FA",
    muted: "#B0B7C3",
  },
}

  },
  plugins: [],
};
export default config;
