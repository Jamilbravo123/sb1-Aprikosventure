/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '50%': { transform: 'translateX(100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(100%) skewX(-12deg)' },
        }
      }
    },
  },
  plugins: [],
};
