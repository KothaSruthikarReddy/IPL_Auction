import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: '#171722',
        accent: {
          gold: '#f2b94b',
          saffron: '#ff9933'
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg,#ffdd88,#f2b94b,#cf8f1f)'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
