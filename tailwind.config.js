/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#1A0B2E',
        'electric-blue': '#7B4DFF',
        'neon-pink': '#FF2EC4',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'menu-active': '#9F7AEA',
        'menu-hover': '#B794F4'
      },
      animation: {
        'liquid': 'liquid 1.5s ease-in-out infinite',
      },
      keyframes: {
        liquid: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
}
