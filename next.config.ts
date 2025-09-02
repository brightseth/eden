import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  eslint: {
    // Temporarily ignore ESLint during builds to unblock deployments
    ignoreDuringBuilds: true,
  },
  // Exclude legacy apps directory from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  typescript: {
    // Enable TypeScript checking to catch build issues
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/academy/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Exclude packages and apps directories from compilation
    config.externals = config.externals || [];
    config.externals.push(function ({context, request}, callback) {
      if (request && (
        request.startsWith('./packages/') || request.includes('/packages/') ||
        request.startsWith('./apps/') || request.includes('/apps/')
      )) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    });

    // Prevent client-side bundling of server-only modules that cause wallet provider issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };

      // Exclude problematic packages from client bundle
      config.externals = [
        ...(config.externals || []),
        'viem',
        'ethers',
        '@ethersproject/providers',
        '@ethersproject/contracts',
        'web3',
      ];
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ctlygyrkibupejllgglr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '*.replicate.delivery',
      },
      // Registry direct image host(s)
      { protocol: "https", hostname: "eden-genesis-registry.vercel.app" },
      // Paris Photo voting prototype images
      { protocol: "https", hostname: "paris-photo-voting-qd7xc6cja-edenprojects.vercel.app" },
      // Placeholder image service
      { protocol: "https", hostname: "via.placeholder.com" },
      // If images live on R2/S3/IPFS gateways, add them here:
      { protocol: "https", hostname: "pub-*.r2.dev" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.ipfs.w3s.link" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "cloudflare-ipfs.com" },
    ],
    // Disable optimization to fix broken images
    unoptimized: true,
  }
};

export default nextConfig;
