/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#FF6A00",
        "brand-purple": "#6D28D9"
      }
    },
  },
  plugins: [],
}
