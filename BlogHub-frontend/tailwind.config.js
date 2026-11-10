/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0C0E',        // 60% - Main Background
        chrome: '#C0C0C0',          // 30% - Secondary text and borders
        'chrome-bright': '#FFFFFF', // Headings
        crimson: '#FF003C',         // 10% - Accents, buttons, hovers
      },
    },
  },
  plugins: [],
}
