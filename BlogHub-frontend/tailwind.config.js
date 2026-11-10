/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f3eee3',
        ink: {
          DEFAULT: '#111111',
          muted: 'rgba(17, 17, 17, 0.7)',
          faint: 'rgba(17, 17, 17, 0.1)',
        },
        accent: {
          DEFAULT: '#D9541E',
          hover: '#c24615',
        },
      },
    },
  },
  plugins: [],
}
