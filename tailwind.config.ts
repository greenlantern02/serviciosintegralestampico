import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#3BBFC0",
          "teal-dark": "#2A9FA0",
          navy: "#1D3F5E",
          "navy-dark": "#142D44",
          yellow: "#F5E200",
          "light-blue": "#EBF5FB",
          "light-blue-2": "#D6EBF5",
          orange: "#E87B3D",
          coral: "#E8896D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
