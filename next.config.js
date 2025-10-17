/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  // Include video files in the build
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Copy video files to public directory during build
  async rewrites() {
    return [
      {
        source: '/videos/:path*',
        destination: '/api/video/:path*',
      },
    ];
  },
}

module.exports = nextConfig
