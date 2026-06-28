/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F0E8',
        ink: '#2C1F14',
        'oil-umber': '#8B4513',
        'warm-brown': '#C19A6B',
        'oil-red': '#C44D2A',
        ember: '#E85D3A',
        'teal-glow': '#2A9D8F',
        charcoal: '#1A1410',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slow-spin': 'slow-spin 60s linear infinite',
      },
      keyframes: {
        'slow-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};