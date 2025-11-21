// tailwind.config.js
export default {
  darkMode: 'class', // or 'media'
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], // make sure Tailwind scans your files
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#d9eeff',
          300: '#80c8ff',
          500: '#1e90ff',
          600: '#0b6ef0',
          800: '#083b6b',
        },
        surface: {
          DEFAULT: '#0f1724',
          soft: '#071122',
        },
      },
      boxShadow: {
        'card-dark': '0 8px 30px rgba(2,6,23,0.6)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}
