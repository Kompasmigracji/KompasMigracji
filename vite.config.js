import { defineConfig } from 'vite';

const BANNER = '/*! © 2026 Oleksandr Khrystodul — iPhoenixGSM® | iphoenixgsm@gmail.com | All rights reserved. Designed & Developed by iPhoenixGSM®. Unauthorized use or reproduction is prohibited. */';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        banner: BANNER,
      },
    },
  },
});
