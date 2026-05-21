import type { Config } from 'tailwindcss';

// Tailwind 4 uses CSS-first config via @theme in app/globals.css.
// This file mainly scopes content paths for class detection.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
  ],
};

export default config;
