module.exports = {
  content: [
    "./*.html",
    "./html/**/*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [
    require('@tailwindcss/typography')
  ]
}
