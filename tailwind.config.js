/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'deep-blue': '#1B2A4A',
        'light-blue': '#69B7E3',
        'electric-blue': '#7B4DFF',
        'neon-pink': '#FF2EC4',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'menu-active': '#69B7E3',
        'menu-hover': '#1B2A4A'
      },
      animation: {
        'liquid': 'liquid 1.5s ease-in-out infinite',
      },
      keyframes: {
        liquid: {
          '0%, 100%': { borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%' },
          '14%': { borderRadius: '40% 60% 54% 46% / 49% 60% 40% 51%' },
          '28%': { borderRadius: '54% 46% 38% 62% / 49% 70% 30% 51%' },
          '42%': { borderRadius: '61% 39% 55% 45% / 61% 38% 62% 39%' },
          '56%': { borderRadius: '61% 39% 67% 33% / 70% 50% 50% 30%' },
          '70%': { borderRadius: '50% 50% 34% 66% / 56% 68% 32% 44%' },
          '84%': { borderRadius: '46% 54% 50% 50% / 35% 61% 39% 65%' }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
