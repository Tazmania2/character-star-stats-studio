/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-blue-300',
    'bg-pink-100',
    'bg-pink-200',
    'z-[9999]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
