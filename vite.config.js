import { defineConfig } from 'vite';

const BANNER = '/*! © 2026 Oleksandr Khrystodul — iPhoenixGSM® | iphoenixgsm@gmail.com | All rights reserved. Designed & Developed by iPhoenixGSM®. Unauthorized use or reproduction is prohibited. */';

function manualChunks(id) {
  if (!id.includes('node_modules')) return undefined;
  if (/[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
  if (id.includes('react-router')) return 'router-vendor';
  if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n-vendor';
  if (id.includes('@supabase')) return 'supabase-vendor';
  if (id.includes('@vercel/analytics') || id.includes('@vercel/speed-insights')) return 'vercel-vendor';
  return 'vendor';
}

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 350,
    rollupOptions: {
      output: {
        banner: BANNER,
        manualChunks,
      },
    },
  },
});
