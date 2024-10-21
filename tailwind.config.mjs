import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{astro,js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
      // sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}