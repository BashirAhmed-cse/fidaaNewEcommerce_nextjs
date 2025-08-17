import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http', // for non-SSL dev
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '*.ngrok-free.app',
    '9b6d-45-127-245-65.ngrok-free.app'
  ],
  
  // Remove swcMinify as it's now default and can't be configured
  // Remove compress as it's also enabled by default
  
  // Modern Next.js 15.x optimizations
  experimental: {
    optimizePackageImports: [
      // Add frequently used packages here for optimization
      '@heroicons/react',
      'lodash-es'
    ],
  },
  
  // Keep these standard configurations
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;