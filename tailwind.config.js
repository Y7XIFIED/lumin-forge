/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lumin-red': '#ff2a2a',
        'lumin-dark': '#000000',
        'lumin-gray': '#1a1a1a',
      },
      fontFamily: {
        sans: ['"TerminaTest"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"TerminaTest"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        'red-glow': 'radial-gradient(circle, rgba(255,42,42,0.15) 0%, rgba(0,0,0,0) 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 20px rgba(255, 42, 42, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
