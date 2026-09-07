import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          'green-light': 'var(--color-green-300)',
          'green': 'var(--color-green-500)',
          'green-dark': 'var(--color-green-700)',
          'orange-light': 'var(--color-orange-300)',
          'orange': 'var(--color-orange-500)',
          'orange-dark': 'var(--color-orange-700)',
          'yellow': 'var(--color-yellow-400)',
          'cream-light': 'var(--color-cream-100)',
          'cream-dark': 'var(--color-cream-900)',
          'brown-light': 'var(--color-brown-200)',
          'brown': 'var(--color-brown-600)',
          'brown-dark': 'var(--color-brown-800)',
          'brown-darker': 'var(--color-brown-900)',
        },
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          accent: 'var(--color-brand-accent)',
        },
        bg: {
          main: 'var(--color-bg-main)',
          card: 'var(--color-bg-card)',
        },
        border: {
          card: 'var(--color-border-card)',
        },
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
        },
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'pill': 'var(--radius-pill)',
      },
      spacing: {
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
