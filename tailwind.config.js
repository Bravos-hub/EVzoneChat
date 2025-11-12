/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ev: { green: "#03cd8c", orange: "#f77f00", grey: "#a6a6a6", light: "#f2f2f2" }
      },
      borderRadius: { 'xl': '12px' }
    },
  },
  plugins: [],
};
