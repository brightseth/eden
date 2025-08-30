/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Intelligent image optimization
  images: {
    domains: [
      'replicate.delivery',
      'api.eden.art',
      'registry.eden2.io',
      'unknown.eden2.io',
      // Add agent-specific image domains
      
    ],
    
  },

  // Intelligent redirects and rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://academy.eden2.io/api/:path*'
      },
      // Agent-specific API routing
      
      {
        source: '/trading/:path*',
        destination: '/api/trading/:path*'
      },
    ];
  },

  // Performance optimizations based on agent type
  
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Metadata for intelligent site
  env: {
    AGENT_TYPE: 'trader',
    GENERATED_AT: '2025-08-29T14:19:16.393Z',
    CONFIDENCE_SCORE: '70',
  }
};

module.exports = nextConfig;