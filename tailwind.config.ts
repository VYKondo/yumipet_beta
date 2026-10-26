import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "media"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#79118a",
          secondary: "#ffb901",
          dark: "#5a0d66",
          light: "#f0e6ff",
        },
      },
    },
  },
  plugins: [],
};
export default config;
