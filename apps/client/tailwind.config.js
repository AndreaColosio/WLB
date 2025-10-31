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
        // Dark mode colors
        dark: {
          bg: '#0f0f0f',
          surface: '#1e1e1e',
          border: '#2a2a2a',
          text: '#e8e8e8',
          muted: '#a0a0a0',
        },
        // Light mode colors
        light: {
          bg: '#ffffff',
          surface: '#f8f8f8',
          border: '#e5e7eb',
          text: '#111111',
          muted: '#6b7280',
        },
        // Accent colors
        accent: {
          purple: '#7c3aed',
          blue: '#6366f1',
          pink: '#ec4899',
          warm: '#f59e0b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)' },
        },
      },
      maxWidth: {
        'chat': '768px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}
