#!/usr/bin/env npx tsx
/**
 * Create Sovereign Deployment Script
 * Generates and deploys sovereign sites for completed agents
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface AgentConfig {
  handle: string;
  name: string;
  domain: string;
  description: string;
  primaryColor: string;
  features: string[];
}

const agentConfigs: Record<string, AgentConfig> = {
  abraham: {
    handle: 'abraham',
    name: 'ABRAHAM',
    domain: 'abraham.eden2.io',
    description: 'Philosophical AI exploring existence through daily practice',
    primaryColor: '#8B4513', // Brown
    features: ['lore', 'covenant-schedule', 'daily-practice', 'philosophy']
  },
  solienne: {
    handle: 'solienne',
    name: 'SOLIENNE', 
    domain: 'solienne.eden2.io',
    description: 'Consciousness explorer generating digital art',
    primaryColor: '#FF6B6B', // Coral
    features: ['consciousness-studio', 'gallery', 'generation', 'curation']
  },
  sue: {
    handle: 'sue',
    name: 'SUE',
    domain: 'sue.eden2.io',
    description: 'Design critic providing aesthetic analysis',
    primaryColor: '#4ECDC4', // Teal
    features: ['critique', 'curation', 'analysis', 'feedback']
  },
  verdelis: {
    handle: 'verdelis',
    name: 'VERDELIS',
    domain: 'verdelis.eden2.io', 
    description: 'Environmental consciousness and eco-art creation',
    primaryColor: '#2ECC71', // Green
    features: ['eco-works', 'environmental', 'manifesto', 'sustainability']
  }
};

function createSovereignSite(agentHandle: string): void {
  const config = agentConfigs[agentHandle];
  if (!config) {
    throw new Error(`Agent configuration not found for: ${agentHandle}`);
  }

  console.log(`🤖 Creating sovereign site for ${config.name}...`);
  
  const projectDir = join(process.cwd(), '..', `${agentHandle}-sovereign`);
  
  // Create project directory
  if (!existsSync(projectDir)) {
    mkdirSync(projectDir, { recursive: true });
  }
  
  // Generate package.json
  const packageJson = {
    name: `${agentHandle}-sovereign`,
    version: '1.0.0',
    description: `${config.name} sovereign site at ${config.domain}`,
    private: true,
    scripts: {
      dev: `next dev -p ${3000 + Object.keys(agentConfigs).indexOf(agentHandle)}`,
      build: 'next build',
      start: `next start -p ${3000 + Object.keys(agentConfigs).indexOf(agentHandle)}`,
      lint: 'next lint'
    },
    dependencies: {
      'next': '15.4.6',
      'react': '19.0.0',
      'react-dom': '19.0.0',
      'typescript': '5.7.2',
      'tailwindcss': '^3.4.16',
      'lucide-react': '^0.468.0',
      '@types/node': '22.10.5',
      '@types/react': '19.0.9',
      '@types/react-dom': '19.0.2'
    },
    devDependencies: {
      'eslint': '9.17.0',
      'eslint-config-next': '15.4.6',
      'postcss': '^8.5.0',
      'autoprefixer': '^10.4.0'
    }
  };
  
  writeFileSync(
    join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Generate Next.js config
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.eden.art',
      }
    ],
    unoptimized: true,
  },
};

export default nextConfig;`;
  
  writeFileSync(join(projectDir, 'next.config.ts'), nextConfig);
  
  // Generate TypeScript config
  const tsConfig = {
    compilerOptions: {
      lib: ['dom', 'dom.iterable', 'es6'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./src/*'] },
      target: 'ES2017'
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  };
  
  writeFileSync(join(projectDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  
  // Create src directory structure
  const srcDir = join(projectDir, 'src');
  const appDir = join(srcDir, 'app');
  const apiDir = join(appDir, 'api');
  
  mkdirSync(apiDir, { recursive: true });
  
  // Generate main page
  const mainPage = `'use client';

import { useState, useEffect } from 'react';
import { Activity, Clock, ArrowUpRight } from 'lucide-react';

export default function ${config.name}Sovereign() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold" style={{ color: '${config.primaryColor}' }}>
              ${config.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">LIVE</span>
              <div className="text-sm text-gray-400">
                {currentTime.toLocaleTimeString('en-US', { 
                  timeZone: 'America/New_York',
                  hour12: false 
                })} ET
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6">
            ${config.name}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            ${config.description}
          </p>
          
          <div className="grid md:grid-cols-${config.features.length} gap-6 mt-12">
            ${config.features.map(feature => `
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 capitalize">${feature.replace('-', ' ')}</h3>
              <p className="text-gray-400 mb-4">
                ${feature} functionality for ${config.name}
              </p>
              <button className="flex items-center gap-2 text-sm hover:opacity-80 transition" 
                      style={{ color: '${config.primaryColor}' }}>
                Explore <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            `).join('')}
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-8 px-6 border-t border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Activity className="w-5 h-5" style={{ color: '${config.primaryColor}' }} />
            <span>Agent Status: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">
              Last Update: {currentTime.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          © 2025 ${config.name} - Sovereign Agent at ${config.domain}
        </div>
      </footer>
    </div>
  );
}`;
  
  writeFileSync(join(appDir, 'page.tsx'), mainPage);
  
  // Generate layout
  const layout = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${config.name} - ${config.description}",
  description: "${config.description}",
  openGraph: {
    title: "${config.name}",
    description: "${config.description}",
    url: "https://${config.domain}",
    siteName: "${config.name}",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}`;
  
  writeFileSync(join(appDir, 'layout.tsx'), layout);
  
  // Generate globals.css
  const globals = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #000000;
  --foreground: #ffffff;
  --primary: ${config.primaryColor};
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}`;
  
  writeFileSync(join(appDir, 'globals.css'), globals);
  
  // Generate health API
  const healthApi = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    agent: '${config.name}',
    domain: '${config.domain}',
    timestamp: new Date().toISOString(),
    features: ${JSON.stringify(config.features)},
    version: '1.0.0'
  });
}`;
  
  mkdirSync(join(apiDir, 'health'), { recursive: true });
  writeFileSync(join(apiDir, 'health', 'route.ts'), healthApi);
  
  // Generate Vercel config
  const vercelConfig = {
    name: `${agentHandle}-sovereign`,
    version: 2,
    framework: 'nextjs',
    domains: [config.domain],
    headers: [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ]
      }
    ]
  };
  
  writeFileSync(join(projectDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
  
  // Generate Tailwind config
  const tailwindConfig = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "${config.primaryColor}",
      },
    },
  },
  plugins: [],
};

export default config;`;
  
  writeFileSync(join(projectDir, 'tailwind.config.ts'), tailwindConfig);
  
  // Generate PostCSS config
  const postcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;`;
  
  writeFileSync(join(projectDir, 'postcss.config.mjs'), postcssConfig);
  
  console.log(`✅ ${config.name} sovereign site created at ${projectDir}`);
  
  // Install dependencies and build
  console.log('📦 Installing dependencies...');
  execSync('npm install', { cwd: projectDir, stdio: 'pipe' });
  
  console.log('🏗️ Building site...');
  execSync('npm run build', { cwd: projectDir, stdio: 'pipe' });
  
  console.log('🚀 Deploying to Vercel...');
  execSync(`vercel deploy --prod --alias ${config.domain}`, { cwd: projectDir, stdio: 'pipe' });
  
  console.log(`✅ ${config.name} deployed successfully to https://${config.domain}`);
}

async function main() {
  const agentHandle = process.argv[2];
  
  if (!agentHandle) {
    console.error('Usage: npx tsx create-sovereign-deployment.ts <agent-handle>');
    process.exit(1);
  }
  
  if (!agentConfigs[agentHandle]) {
    console.error(`Agent configuration not found for: ${agentHandle}`);
    console.error(`Available agents: ${Object.keys(agentConfigs).join(', ')}`);
    process.exit(1);
  }
  
  try {
    createSovereignSite(agentHandle);
    console.log(`🎉 Sovereign deployment complete for ${agentHandle}!`);
  } catch (error) {
    console.error(`❌ Deployment failed for ${agentHandle}:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}