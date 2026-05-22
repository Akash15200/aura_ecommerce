/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aura: {
          bg: 'var(--bg-color)',
          card: 'var(--card-bg)',
          border: 'var(--border-color-thick)',
          primary: '#8b5cf6', // Electric Violet
          secondary: '#a78bfa', // Light Lavender
          accent: '#10b981', // Neon Emerald
          gold: '#fbbf24', // Rich Gold
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(139, 92, 246, 0.15)',
        'neon': '0 0 15px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
