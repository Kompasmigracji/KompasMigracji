import { defineConfig } from 'vite';

const BANNER =
  '/*! (c) 2026 Oleksandr Khrystodul - iPhoenixGSM (R) | iphoenixgsm@gmail.com | All rights reserved. */';

// Manual vendor chunking for production builds.
// Goal: keep the main entry under ~250 KB by isolating large deps into
// their own cacheable chunks. Routes are already split via React.lazy.
function manualChunks(id) {
  if (!id.includes('node_modules')) return undefined;

  // React core - must stay together (React, ReactDOM, scheduler share internals)
  if (/[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/.test(id)) {
    return 'react-vendor';
  }

  // Routing
  if (id.includes('react-router')) return 'router-vendor';

  // i18n
  if (id.includes('i18next') || id.includes('react-i18next')) {
    return 'i18n-vendor';
  }

  // Supabase client - large, used by /admin
  if (id.includes('@supabase')) return 'supabase-vendor';

  // Vercel analytics + speed-insights
  if (id.includes('@vercel/analytics') || id.includes('@vercel/speed-insights')) {
    return 'vercel-vendor';
  }

  // Everything else from node_modules
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
