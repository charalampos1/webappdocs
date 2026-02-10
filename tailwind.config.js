/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: { 'print': {'raw': 'print'}, },
      colors: { 
          'tech-blue': '#0f172a',
          'brand-accent': '#2563eb',
          'brand-light': '#f8fafc'
      },
      fontFamily: {
          sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
