import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Instrument Serif"', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        // The one accent colour: hover, focus and call-to-action states only
        accent: '#e8b56b',
      },
    },
  },
  plugins: [],
}
