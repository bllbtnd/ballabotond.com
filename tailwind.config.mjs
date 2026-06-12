/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
  theme: {
    extend: {
      colors: {
        // Editorial palette — resolved via CSS custom properties
        'pf-bg': 'var(--pf-bg)',
        'pf-text': 'var(--pf-text)',
        'pf-accent': 'var(--pf-accent)',
        'pf-muted': 'var(--pf-muted)',
        'pf-border': 'var(--pf-border)',
        'pf-surface': 'var(--pf-surface)',
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'serif-display': ['Instrument Serif', 'Georgia', 'serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 1.5rem + 2.5vw, 4rem)',
      },
      letterSpacing: {
        'display': '-0.03em',
      },
      lineHeight: {
        'display': '0.95',
      },
    },
  },
  plugins: [],
}
