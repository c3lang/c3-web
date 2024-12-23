module.exports = {
  content: ["./index.html", "./src/**/*.{astro,js,ts,jsx,tsx}"],
  darkMode: "class",
  plugins: [],
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
};
