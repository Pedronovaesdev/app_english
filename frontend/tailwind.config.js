/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        ink: { 950: "#0a0f1a", 900: "#0f172a", 800: "#1e293b" },
        ember: { 400: "#fb923c", 500: "#f97316" },
      },
    },
  },
  plugins: [],
};
