/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'luxury-gold': '#c9a96b',
        'luxury-gold-light': '#e8c474',
        'luxury-gray': '#b4b4b6',
        'luxury-gray-dark': '#8e8e93',
        // Portfolio palette
        'pf-bg': '#F0EBE3',
        'pf-text': '#1A1A1A',
        'pf-accent': '#7A6C5D',
        'pf-accent-light': '#9B8E7E',
        'pf-muted': '#B8B2A8',
        'pf-border': '#E5E2DC',
        'pf-surface': '#F0EDE8',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'serif-display': ['Instrument Serif', 'Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 1.5rem + 2.5vw, 4rem)',
        'fluid-3xl': 'clamp(2.5rem, 1.5rem + 5vw, 6rem)',
        'fluid-4xl': 'clamp(3rem, 1.5rem + 7.5vw, 9rem)',
        'fluid-hero': 'clamp(3.5rem, 2rem + 10vw, 12rem)',
      },
      letterSpacing: {
        'brutal': '-0.04em',
        'tight-brutal': '-0.02em',
      },
      lineHeight: {
        'brutal': '0.9',
        'tight-display': '0.95',
        'display': '1.05',
      },
      gridTemplateColumns: {
        'asymmetric': '1fr 1.618fr',
        'asymmetric-reverse': '1.618fr 1fr',
        'gallery': 'repeat(12, 1fr)',
      },
    },
  },
  plugins: [],
}
