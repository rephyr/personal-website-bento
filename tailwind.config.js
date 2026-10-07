import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', ...defaultTheme.fontFamily.sans],
        display: ['Geist', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // The one accent colour: hover, focus and call-to-action states only
        accent: '#e8b56b',
      },
    },
  },
  plugins: [],
}
