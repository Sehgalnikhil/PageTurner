/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#FAF7F2',
          light: '#FFFDFB',
          warm: '#F5F0E6',
          card: '#FFFFFF',
          border: '#E8E2D8',
        },
        ink: {
          DEFAULT: '#1C1917',
          soft: '#292524',
          muted: '#57534E',
          faint: '#78716C',
        },
        burgundy: {
          DEFAULT: '#7B1826',
          dark: '#5C101B',
          light: '#962334',
          faint: '#FBECEE',
        },
        ochre: {
          DEFAULT: '#C87828',
          dark: '#9E5B19',
          light: '#E2913D',
          faint: '#FDF4EB',
        },
        sage: {
          DEFAULT: '#556952',
          dark: '#40503E',
          light: '#6E856A',
          faint: '#F1F4F0',
        },
        matte: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
      },
      boxShadow: {
        'book': '0 10px 30px -5px rgba(28, 25, 23, 0.12), 0 4px 10px -2px rgba(28, 25, 23, 0.05)',
        'book-hover': '0 20px 40px -10px rgba(28, 25, 23, 0.18), 0 8px 16px -4px rgba(28, 25, 23, 0.08)',
        'paper': '0 2px 12px 0 rgba(28, 25, 23, 0.04), 0 1px 3px 0 rgba(28, 25, 23, 0.03)',
        'paper-hover': '0 12px 32px -4px rgba(28, 25, 23, 0.09), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}
