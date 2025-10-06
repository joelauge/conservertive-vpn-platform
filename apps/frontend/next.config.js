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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/vpn/:path*',
        destination: `${backendUrl}/api/v1/vpn/:path*`,
      },
      {
        source: '/api/billing/:path*',
        destination: `${backendUrl}/api/v1/billing/:path*`,
      },
      {
        source: '/api/sponsorship-requests/:path*',
        destination: `${backendUrl}/sponsorship-requests/:path*`,
      },
      {
        source: '/api/health',
        destination: `${backendUrl}/health`,
      },
      {
        source: '/api/status',
        destination: `${backendUrl}/api/v1/status`,
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
