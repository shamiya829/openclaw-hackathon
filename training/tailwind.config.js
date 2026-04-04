/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0d0d14',
        surface:  '#14141f',
        surface2: '#1c1c2e',
        border:   '#2a2a3d',
        accent:   '#c8a84b',
        accent2:  '#e8c96a',
        'ms-green': '#4ade80',
        'ms-red':   '#f87171',
        muted:    '#6b7280',
        text:     '#e8e8f0',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,168,75,0)' },
          '50%':      { boxShadow: '0 0 16px 4px rgba(200,168,75,0.25)' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.3s ease-out both',
        'shimmer':    'shimmer 2s linear infinite',
        'glow':       'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
