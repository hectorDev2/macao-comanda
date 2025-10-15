/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#fff8f1",
          100: "#ffeede",
          200: "#ffd5c0",
          300: "#ffba9a",
          400: "#ff9a60",
          500: "#ff7a26",
          600: "#e66f20",
          700: "#b85918",
          800: "#8a4412",
          900: "#5e2b08",
        },
      },
    },
  },
  plugins: [],
};
