/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': {
        '50': '#eef2ff',
        '100': '#e0e6ff',
        '200': '#c7d0fe',
        '300': '#a5b2fc',
        '400': '#8189f8',
        '500': '#5e5df0',
        '600': '#5346e5',
        '700': '#4738ca',
        '800': '#3a30a3',
        '900': '#332e81',
        '950': '#1f1b4b',
    },
    
      }
    },
  },
  plugins: [],
}

