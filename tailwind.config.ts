import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        notion: {
          bg: "#F7F7F5",
          border: "#E5E5E5",
          text: "#000000",
          secondary: "#626060",
        },
        task: {
          sidebar: "#8B2C2C", // Dark maroon/burgundy
          main: "#2D5F4F", // Dark green
          lightBg: "#F5F5F5", // Light background
          lightText: "#000000", // Light text
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
