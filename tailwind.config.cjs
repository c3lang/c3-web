module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{astro,js,ts,jsx,tsx}",
  ],
  darkMode : 'class',
  plugins: [
    require('preline/plugin'),
  ]
}