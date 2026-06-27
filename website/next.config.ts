import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/app', destination: '/studio', permanent: true },
      { source: '/app/:path*', destination: '/studio/:path*', permanent: true },
    ];
  },
  async rewrites() {
    const apiBase = process.env.API_URL || 'http://localhost:3001';
    const crafingBase =
      process.env.NEXT_PUBLIC_CRAFING_API_URL ||
      process.env.GRAPHQL_URL ||
      'http://127.0.0.1:4000';
    const imageResizeBase =
      process.env.IMAGE_RESIZE_URL ||
      process.env.NEXT_PUBLIC_IMAGE_RESIZE_URL ||
      'http://127.0.0.1:4001';
    return [
      {
        source: '/api/v1/graphql',
        destination: `${crafingBase.replace(/\/$/, '')}/api/v1/graphql`,
      },
      {
        source: '/api/v1/tools/:path*',
        destination: `${imageResizeBase.replace(/\/$/, '')}/api/v1/tools/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
