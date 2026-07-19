import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Include .jsx/.js for KompasCRM admin pages alongside .tsx/.ts
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    // Allow Next.js <Image> to serve SVGs from /public unoptimised (safe for logos)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // External photo domains used in Team.tsx
    remotePatterns: [
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HSTS додає сам Vercel; CSP не вмикаємо без аудиту інлайн-скриптів.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/en/prices',
        destination: '/en/pricing',
        permanent: true,
      },
      {
        source: '/prices',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/:locale(uk|pl|en|ru|rom)/test/orakul',
        destination: '/:locale/orakul',
        permanent: true,
      },
      {
        source: '/test/orakul',
        destination: '/orakul',
        permanent: true,
      },
      {
        source: '/:locale(uk|pl|en|ru|rom)/test/:path(pricing|karta|plans|book)',
        destination: '/:locale/:path',
        permanent: true,
      },
      {
        source: '/test/:path(pricing|karta|plans|book)',
        destination: '/:path',
        permanent: true,
      },
      {
        source: '/:locale(uk|pl|en|ru|rom)/test',
        destination: '/:locale',
        permanent: true,
      },
      {
        source: '/test',
        destination: '/',
        permanent: true,
      }
    ];
  },
};

export default withNextIntl(nextConfig);
