import type { Config } from 'tailwindcss';

// Tailwind 4 uses CSS-first config via @theme in app/globals.css.
// This file mainly scopes content paths for class detection.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {
      colors: {
        primusBlue: '#3b82f6',
        monitorGreen: '#10b981',
        godGold: '#fbbf24',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      },
    },
  },
  plugins: [],
};
export default config;
