/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        deaugusta: ['deaugusta', 'serif'],
        cassandra: ['Cassandra', 'serif'],
      },
      colors: {
        vibz: {
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          }
        },
        'vibz-button-red': {
          DEFAULT: '#DC2727',
          hover: '#B91C1C',
        },
        'vibz-button-beige': {
          DEFAULT: '#FFEFB3',
          hover: '#FFF5CF',
        },
        'vibz-red': '#DC2727',
        'vibz-textbox-text': '#DC2727',
        'vibz-frame': '#DC2727',
        'vibz-bg': '#FFF5CF',
        'vibz-bg-textbox': '#FFEFB3',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      }
    },
  },
  plugins: [],
};