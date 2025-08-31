import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  eslint: {
    // Only ignore ESLint during builds if absolutely necessary
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript checking for better production builds
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
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
    ],
    // Disable optimization to fix broken images
    unoptimized: true,
  },
};

export default nextConfig;
