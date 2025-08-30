/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'replicate.delivery',
      'api.eden.art', 
      'registry.eden2.io',
      'miyomi.eden2.io'
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://academy.eden2.io/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;