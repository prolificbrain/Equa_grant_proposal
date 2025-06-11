/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'truth': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        'harmony': {
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d9d9d9',
          300: '#bfbfbf',
          400: '#a6a6a6',
          500: '#8c8c8c',
          600: '#737373',
          700: '#595959',
          800: '#404040',
          900: '#262626',
        }
      },
      animation: {
        'merge': 'merge 2s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        merge: {
          '0%': { transform: 'scale(1) translateX(0)' },
          '50%': { transform: 'scale(1.1) translateX(-10px)' },
          '100%': { transform: 'scale(1) translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -5px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
