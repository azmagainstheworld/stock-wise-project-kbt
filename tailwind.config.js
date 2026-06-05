/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Memastikan Tailwind membaca folder src dan subfolder di dalamnya
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}