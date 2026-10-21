/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        eco: {
          teal: '#0d9488',
          emerald: '#10b981',
          cyan: '#06b6d4',
          dark: '#0f172a',
          cardDark: '#1e293b',
          cardLight: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(34, 197, 94, 0.4)',
        'glow-teal': '0 0 20px -5px rgba(13, 148, 136, 0.4)',
      }
    },
  },
  plugins: [],
};
