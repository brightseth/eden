#!/usr/bin/env tsx
/**
 * Eden2 Monorepo Migration Script
 * Reorganizes scattered architecture into proper monorepo structure
 */

import { promises as fs } from 'fs';
import path from 'path';

const MIGRATIONS = {
  // Academy app migrations - profile pages
  academy: [
    { from: 'src/app/academy/agent', to: 'apps/academy/app/agents' },
    { from: 'src/app/agents', to: 'apps/academy/app/agents-list' },
  ],
  
  // Trainer app migrations - dashboards
  trainer: [
    { from: 'src/app/dashboard', to: 'apps/trainer/app' },
    { from: 'src/app/bm-overview', to: 'apps/trainer/app/citizen/overview' },
  ],
  
  // Agent-shell migrations - sovereign sites
  'agent-shell': [
    { from: 'src/app/sites', to: 'apps/agent-shell/app' },
  ],
  
  // Shared packages
  packages: [
    { from: 'src/lib/registry', to: 'packages/registry-sdk/src' },
    { from: 'src/components/ui', to: 'packages/ui/src/components' },
    { from: 'src/data/agents-registry.ts', to: 'packages/registry-sdk/src/data/agents.ts' },
    { from: 'src/lib/agents', to: 'packages/agent-core/src' },
  ]
};

async function createMonorepoStructure() {
  console.log('📁 Creating monorepo structure...');
  
  const dirs = [
    'apps/academy/app/agents',
    'apps/academy/app/globals.css',
    'apps/agent-shell/app',
    'apps/trainer/app',
    'packages/registry-sdk/src',
    'packages/ui/src',
    'packages/agent-core/src',
    'packages/config/src',
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  console.log('✅ Directory structure created');
}

async function createPackageJsons() {
  console.log('📦 Creating package.json files...');
  
  // Root package.json
  const rootPackage = {
    name: 'eden2',
    private: true,
    scripts: {
      'dev': 'turbo dev',
      'build': 'turbo build',
      'dev:academy': 'turbo dev --filter=academy',
      'dev:agents': 'turbo dev --filter=agent-shell',
      'dev:trainer': 'turbo dev --filter=trainer',
      'clean': 'turbo clean',
      'lint': 'turbo lint',
    },
    devDependencies: {
      'turbo': '^2.1.4',
      'typescript': '^5.7.2',
      '@types/node': '^22.10.5',
    },
    workspaces: ['apps/*', 'packages/*'],
    packageManager: 'npm@10.2.4'
  };
  
  // Academy app - agent profiles
  const academyPackage = {
    name: '@eden2/academy',
    version: '1.0.0',
    private: true,
    scripts: {
      'dev': 'next dev --port 3000',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint',
    },
    dependencies: {
      '@eden2/registry-sdk': 'workspace:*',
      '@eden2/ui': 'workspace:*',
      '@eden2/agent-core': 'workspace:*',
      'next': '15.4.6',
      'react': '19.1.0',
      'react-dom': '19.1.0',
      'typescript': '^5.7.2',
      'tailwindcss': '^3.4.17',
    }
  };
  
  // Agent-shell app - sovereign domains
  const agentShellPackage = {
    name: '@eden2/agent-shell',
    version: '1.0.0',
    private: true,
    scripts: {
      'dev': 'next dev --port 3001',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint',
    },
    dependencies: {
      '@eden2/registry-sdk': 'workspace:*',
      '@eden2/ui': 'workspace:*',
      '@eden2/agent-core': 'workspace:*',
      'next': '15.4.6',
      'react': '19.1.0',
      'react-dom': '19.1.0',
      'typescript': '^5.7.2',
      'tailwindcss': '^3.4.17',
    }
  };
  
  // Trainer app - dashboards
  const trainerPackage = {
    name: '@eden2/trainer',
    version: '1.0.0',
    private: true,
    scripts: {
      'dev': 'next dev --port 3002',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint',
    },
    dependencies: {
      '@eden2/registry-sdk': 'workspace:*',
      '@eden2/ui': 'workspace:*',
      '@eden2/agent-core': 'workspace:*',
      'next': '15.4.6',
      'react': '19.1.0',
      'react-dom': '19.1.0',
      'typescript': '^5.7.2',
      'tailwindcss': '^3.4.17',
    }
  };
  
  await fs.writeFile('package.json', JSON.stringify(rootPackage, null, 2));
  await fs.writeFile('apps/academy/package.json', JSON.stringify(academyPackage, null, 2));
  await fs.writeFile('apps/agent-shell/package.json', JSON.stringify(agentShellPackage, null, 2));
  await fs.writeFile('apps/trainer/package.json', JSON.stringify(trainerPackage, null, 2));
  
  console.log('✅ Package.json files created');
}

async function createMiddleware() {
  console.log('🔀 Creating routing middleware...');
  
  // Agent-shell middleware for sovereign domains
  const agentMiddleware = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Handle *.eden2.io subdomains
  if (host.includes('.eden2.io')) {
    const subdomain = host.split('.')[0];
    
    // Skip www and api subdomains
    if (['www', 'api'].includes(subdomain)) {
      return NextResponse.next();
    }
    
    // Route to agent-specific page
    return NextResponse.rewrite(
      new URL(\`/\${subdomain}\${request.nextUrl.pathname}\`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
`;

  await fs.writeFile('apps/agent-shell/middleware.ts', agentMiddleware);
  
  console.log('✅ Middleware created');
}

async function copyFilesRecursively(src: string, dest: string) {
  try {
    await fs.access(src);
    const stats = await fs.stat(src);
    
    if (stats.isDirectory()) {
      await fs.mkdir(dest, { recursive: true });
      const files = await fs.readdir(src);
      
      for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        await copyFilesRecursively(srcPath, destPath);
      }
    } else {
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(src, dest);
    }
  } catch (error) {
    // Source doesn't exist, skip
  }
}

async function moveFiles() {
  console.log('📂 Moving files to new structure...');
  
  for (const [app, migrations] of Object.entries(MIGRATIONS)) {
    console.log(`  Moving ${app} files...`);
    
    for (const { from, to } of migrations) {
      try {
        const sourcePath = path.resolve(from);
        const destPath = path.resolve(to);
        
        // Copy files recursively
        await copyFilesRecursively(sourcePath, destPath);
        console.log(`    ✓ ${from} → ${to}`);
      } catch (error) {
        console.log(`    ⚠️  ${from} not found, skipping...`);
      }
    }
  }
  
  console.log('✅ Files moved');
}

async function createAppLayouts() {
  console.log('🎨 Creating app layouts...');
  
  // Academy layout
  const academyLayout = `import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Academy - AI Agent Training',
  description: 'Train and develop AI agents with expert guidance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white font-helvetica">
        {children}
      </body>
    </html>
  );
}`;

  // Agent-shell layout
  const agentShellLayout = `import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Agent - Autonomous Creative AI',
  description: 'Sovereign AI agents creating and trading autonomously',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white font-helvetica">
        {children}
      </body>
    </html>
  );
}`;

  // Trainer layout
  const trainerLayout = `import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Trainer Dashboard',
  description: 'Train and manage AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white font-helvetica">
        {children}
      </body>
    </html>
  );
}`;

  await fs.writeFile('apps/academy/app/layout.tsx', academyLayout);
  await fs.writeFile('apps/agent-shell/app/layout.tsx', agentShellLayout);
  await fs.writeFile('apps/trainer/app/layout.tsx', trainerLayout);
  
  // Copy globals.css to each app
  try {
    const globalsCss = await fs.readFile('src/app/globals.css', 'utf8');
    await fs.writeFile('apps/academy/app/globals.css', globalsCss);
    await fs.writeFile('apps/agent-shell/app/globals.css', globalsCss);
    await fs.writeFile('apps/trainer/app/globals.css', globalsCss);
  } catch (error) {
    console.log('  ⚠️  globals.css not found, creating basic ones...');
    const basicCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #000000;
  --foreground: #ffffff;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}`;
    
    await fs.writeFile('apps/academy/app/globals.css', basicCss);
    await fs.writeFile('apps/agent-shell/app/globals.css', basicCss);
    await fs.writeFile('apps/trainer/app/globals.css', basicCss);
  }
  
  console.log('✅ App layouts created');
}

async function createTurboConfig() {
  console.log('⚡ Creating Turborepo config...');
  
  const turboConfig = {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": [".next/**", "!.next/cache/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "lint": {
        "outputs": []
      },
      "clean": {
        "cache": false
      }
    }
  };
  
  await fs.writeFile('turbo.json', JSON.stringify(turboConfig, null, 2));
  
  console.log('✅ Turborepo config created');
}

async function createNextConfigs() {
  console.log('⚙️  Creating Next.js configs...');
  
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

  await fs.writeFile('apps/academy/next.config.ts', nextConfig);
  await fs.writeFile('apps/agent-shell/next.config.ts', nextConfig);
  await fs.writeFile('apps/trainer/next.config.ts', nextConfig);
  
  console.log('✅ Next.js configs created');
}

async function main() {
  console.log('🚀 Starting Eden2 Monorepo Migration\\n');
  
  try {
    await createMonorepoStructure();
    await createPackageJsons();
    await createMiddleware();
    await moveFiles();
    await createAppLayouts();
    await createTurboConfig();
    await createNextConfigs();
    
    console.log('\\n✅ Migration complete!');
    console.log('\\n📋 Next steps:');
    console.log('  1. Run: npm install');
    console.log('  2. Update imports manually');
    console.log('  3. Test with: npm run dev');
    console.log('  4. Deploy with proper domains');
    console.log('\\n🏗️  Structure created:');
    console.log('  apps/academy/     → academy.eden2.io (agent profiles)');
    console.log('  apps/agent-shell/ → *.eden2.io (sovereign sites)');
    console.log('  apps/trainer/     → trainer.eden2.io (dashboards)');
    console.log('  packages/         → shared code');
    
  } catch (error) {
    console.error('\\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();