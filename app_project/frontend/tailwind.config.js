/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#2E3A47',
        'custom-text': '#E0E0E0',
      },
    },
  },
  plugins: [],
}

