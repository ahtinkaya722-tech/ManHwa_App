/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bungee: ['Bungee', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        racing: ['"Racing Sans One"', 'cursive'],
      },
    },
  },
  plugins: [],
}