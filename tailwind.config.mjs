import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{astro,js,ts,jsx,tsx}"],
  darkMode: "class",
  // Ensure these tailwind classes are always available, so may be toggled in Javascript
  safelist: [
    {
      pattern: /(row|col)-(span|start)-(1|2|3|4|8)/,
      variants: ['sm', 'md', 'lg'],     
    },
  ],

  theme: {
    extend: {
      fontFamily: {
      // sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}