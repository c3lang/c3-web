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
    {
      pattern: /grid-(rows|cols)-[repeat\((1|2|3|4|8),minmax\(0,1fr\)\)]/,
      variants: ['sm', 'md', 'lg'],     
    },
  ],

  theme: {
    extend: {
      backgroundImage: () => ({
        'gradient-radial-to-tr': `radial-gradient(
          70vw 200vh at 50vw -25vh, 
          var(--tw-gradient-stops)
        )`,
        // 'gradient-radial-to-tr': 'radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))',
        // 'gradient-radial-to-tl': 'radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))',
        // 'gradient-radial-to-br': 'radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))',
        // 'gradient-radial-to-bl': 'radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))',
      }),

      fontFamily: {
        // sans: ['Atkinson_Hyperlegible', ...defaultTheme.fontFamily.sans],
        // sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}