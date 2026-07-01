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
      }
    ];
  },
};

export default withNextIntl(nextConfig);
