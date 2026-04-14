import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B2545",
        "navy-mid": "#0D1F3C",
        "navy-light": "#112D55",
        gold: "#F2A900",
        background: "#060F1E",
        card: "#162B1F",
        white: "#FFFFFF",
        gray: "#8A99B4",
        green: "#2ECC71",
        red: "#E74C3C",
        teal: "#4FA8B8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
