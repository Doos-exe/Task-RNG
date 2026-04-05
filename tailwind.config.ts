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
        app: {
          sidebar: "#933333", // Maroon/burgundy
          darkMain: "#0A1941", // Dark blue for dark mode
          lightMain: "#2D5F4F", // Green for light mode
          darkText: "#FFFFFF", // White text in dark mode
          lightText: "#000000", // Black text in light mode
          lightBorder: "#CCCCCC", // Light borders
          darkBorder: "#FFFFFF", // White borders in dark mode
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-delay-1": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.2s infinite",
        "pulse-delay-2": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
