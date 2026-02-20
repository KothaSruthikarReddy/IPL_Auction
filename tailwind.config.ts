import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        gold: '#f0c04d'
      },
      boxShadow: {
        glass: '0 8px 40px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
