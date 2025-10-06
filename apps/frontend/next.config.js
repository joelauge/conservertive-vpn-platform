/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@heroicons/react'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://34.66.19.167:3001',
  },
  async rewrites() {
    return [
      {
        source: '/api/vpn/:path*',
        destination: `${process.env.BACKEND_URL || 'http://34.66.19.167:3001'}/api/v1/vpn/:path*`,
      },
      {
        source: '/api/billing/:path*',
        destination: `${process.env.BACKEND_URL || 'http://34.66.19.167:3001'}/api/v1/billing/:path*`,
      },
      {
        source: '/api/health',
        destination: `${process.env.BACKEND_URL || 'http://34.66.19.167:3001'}/health`,
      },
      {
        source: '/api/status',
        destination: `${process.env.BACKEND_URL || 'http://34.66.19.167:3001'}/api/v1/status`,
      },
    ];
  },
  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
