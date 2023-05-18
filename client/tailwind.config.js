/** @type {import('tailwindcss').Config} */
const default_theme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}"
  ],
  theme: {
    colors: {
      'primary': '#5c6ac4',
      'secondary': '#ecc94b',

      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      ...default_theme.colors
    },
    screens: {
      'xs': '475px',
      ...default_theme.screens,
    },
    extend: {},
  },
  plugins: [],
}

