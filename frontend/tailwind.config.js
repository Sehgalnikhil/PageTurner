/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Literary Boutique Palette tokens
        boutique: {
          bg: '#F7F3EC',
          'bg-alt': '#F0E9DE',
          surface: '#FFFDFA',
          burgundy: '#8D263B',
          wine: '#67202F',
          rose: '#D9A9A6',
          sage: '#879783',
          lavender: '#DCD4E8',
          gold: '#C6A16B',
          text: '#302A27',
          muted: '#81766D',
          border: '#E8DED1',
        },
        // Backwards-compatible aliases mapped to the refined palette
        paper: {
          DEFAULT: '#F7F3EC',
          light: '#FFFDFA',
          warm: '#F0E9DE',
          card: '#FFFDFA',
          border: '#E8DED1',
        },
        ink: {
          DEFAULT: '#302A27',
          soft: '#4A423E',
          muted: '#81766D',
          faint: '#A89E96',
        },
        burgundy: {
          DEFAULT: '#8D263B',
          dark: '#67202F',
          light: '#A5344B',
          faint: '#FAF0F2',
        },
        ochre: {
          DEFAULT: '#C6A16B',
          dark: '#A68350',
          light: '#D9B682',
          faint: '#FAF5ED',
        },
        sage: {
          DEFAULT: '#879783',
          dark: '#6B7A67',
          light: '#A3B19F',
          faint: '#F2F5F1',
        },
        rose: {
          DEFAULT: '#D9A9A6',
          dark: '#BF8A87',
          light: '#E8C2C0',
          faint: '#FCF5F5',
        },
        lavender: {
          DEFAULT: '#DCD4E8',
          dark: '#BDB1CD',
          light: '#ECE7F3',
          faint: '#F8F6FB',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(48, 42, 39, 0.04), 0 1px 2px 0 rgba(48, 42, 39, 0.02)',
        'card': '0 4px 16px -2px rgba(48, 42, 39, 0.05), 0 1px 3px 0 rgba(48, 42, 39, 0.03)',
        'card-hover': '0 16px 32px -6px rgba(48, 42, 39, 0.10), 0 4px 12px -2px rgba(48, 42, 39, 0.04)',
        'book': '0 8px 24px -4px rgba(48, 42, 39, 0.12), 0 2px 6px -1px rgba(48, 42, 39, 0.06)',
        'book-hover': '0 20px 40px -8px rgba(48, 42, 39, 0.20), 0 6px 14px -2px rgba(48, 42, 39, 0.08)',
        'paper': '0 1px 4px 0 rgba(48, 42, 39, 0.03)',
        'paper-hover': '0 8px 20px -4px rgba(48, 42, 39, 0.08)',
      },
      borderRadius: {
        'boutique': '0.875rem',
        'boutique-lg': '1.25rem',
      },
      transitionTimingFunction: {
        'boutique': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
