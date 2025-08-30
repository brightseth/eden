#!/usr/bin/env npx tsx

// Sovereign Site Deployment Script for Eden2 Federation
// Generates and deploys agent-specific domains using the template factory

import fs from 'fs';
import path from 'path';
import { sovereignTemplateFactory, validateSovereignConfig } from '@/lib/sovereign/template-factory';
import { EDEN_AGENTS } from '@/data/eden-agents-manifest';

interface DeploymentOptions {
  agent: string;
  domain?: string;
  environment: 'development' | 'staging' | 'production';
  dryRun: boolean;
  outputDir: string;
}

class SovereignDeploymentManager {
  private options: DeploymentOptions;

  constructor(options: DeploymentOptions) {
    this.options = options;
  }

  async deploy(): Promise<void> {
    console.log(`🚀 Starting sovereign site deployment for ${this.options.agent.toUpperCase()}`);
    
    try {
      // 1. Validate agent exists
      const agent = EDEN_AGENTS.find(a => a.id === this.options.agent || a.handle === this.options.agent);
      if (!agent) {
        throw new Error(`Agent not found: ${this.options.agent}`);
      }

      // 2. Generate site configuration and code
      console.log(`📋 Generating site configuration for ${agent.name}...`);
      const siteData = sovereignTemplateFactory.generateSovereignSite(this.options.agent);
      
      // 3. Validate configuration
      const validation = validateSovereignConfig(siteData.config);
      if (!validation.valid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }

      // 4. Create output directory structure
      const siteDir = path.join(this.options.outputDir, `${agent.handle}-sovereign`);
      
      if (this.options.dryRun) {
        console.log(`🧪 DRY RUN MODE - Would create directory: ${siteDir}`);
        this.logConfiguration(siteData.config);
        this.logGeneratedFiles(siteData.pages);
        return;
      }

      this.ensureDirectoryExists(siteDir);
      
      // 5. Write page components
      console.log(`📝 Writing page components...`);
      for (const [filename, content] of Object.entries(siteData.pages)) {
        const filePath = path.join(siteDir, filename);
        const fileDir = path.dirname(filePath);
        this.ensureDirectoryExists(fileDir);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   ✓ ${filename}`);
      }

      // 6. Write configuration file
      const configPath = path.join(siteDir, 'sovereign.config.json');
      fs.writeFileSync(configPath, JSON.stringify(siteData.config, null, 2), 'utf8');
      console.log(`   ✓ sovereign.config.json`);

      // 7. Write deployment manifests
      await this.writeDeploymentManifests(siteDir, siteData);

      // 8. Log deployment summary
      this.logDeploymentSummary(siteData);

      console.log(`✅ Sovereign site deployment completed successfully!`);
      console.log(`📁 Output directory: ${siteDir}`);
      console.log(`🌐 Target domain: ${siteData.config.deployment.domain}`);
      
    } catch (error) {
      console.error(`❌ Deployment failed:`, error);
      process.exit(1);
    }
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private async writeDeploymentManifests(siteDir: string, siteData: any): Promise<void> {
    // Vercel deployment configuration
    const vercelConfig = {
      name: `${siteData.config.agent.handle}-sovereign`,
      version: 2,
      builds: [
        {
          src: "package.json",
          use: "@vercel/next"
        }
      ],
      routes: [
        {
          src: "/(.*)",
          dest: "/$1"
        }
      ],
      env: {
        NODE_ENV: siteData.config.deployment.environment,
        AGENT_HANDLE: siteData.config.agent.handle,
        AGENT_NAME: siteData.config.agent.name
      }
    };

    fs.writeFileSync(
      path.join(siteDir, 'vercel.json'), 
      JSON.stringify(vercelConfig, null, 2), 
      'utf8'
    );
    console.log(`   ✓ vercel.json`);

    // Package.json for dependencies
    const packageJson = {
      name: `${siteData.config.agent.handle}-sovereign-site`,
      version: "1.0.0",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        "next": "15.4.6",
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.4.0",
        "postcss": "^8.0.0",
        "autoprefixer": "^10.0.0"
      }
    };

    fs.writeFileSync(
      path.join(siteDir, 'package.json'), 
      JSON.stringify(packageJson, null, 2), 
      'utf8'
    );
    console.log(`   ✓ package.json`);

    // Next.js configuration
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'replicate.delivery',
      'api.eden.art', 
      'registry.eden2.io',
      '${siteData.config.deployment.domain}'
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

module.exports = nextConfig;`;

    fs.writeFileSync(path.join(siteDir, 'next.config.js'), nextConfig, 'utf8');
    console.log(`   ✓ next.config.js`);

    // Tailwind configuration
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'helvetica': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`;

    fs.writeFileSync(path.join(siteDir, 'tailwind.config.js'), tailwindConfig, 'utf8');
    console.log(`   ✓ tailwind.config.js`);
  }

  private logConfiguration(config: any): void {
    console.log(`\n📋 Generated Configuration:`);
    console.log(`   Agent: ${config.agent.name} (@${config.agent.handle})`);
    console.log(`   Domain: ${config.deployment.domain}`);
    console.log(`   Practice: ${config.practice.title} (${config.practice.type})`);
    console.log(`   Brand Voice: ${config.brand.voice.substring(0, 50)}...`);
    console.log(`   Sections: ${config.structure.sections.length} configured`);
    console.log(`   Features: ${config.structure.features.filter((f: any) => f.enabled).length} enabled`);
  }

  private logGeneratedFiles(pages: Record<string, string>): void {
    console.log(`\n📝 Generated Files:`);
    Object.keys(pages).forEach(filename => {
      const lineCount = pages[filename].split('\n').length;
      console.log(`   ${filename} (${lineCount} lines)`);
    });
  }

  private logDeploymentSummary(siteData: any): void {
    console.log(`\n📊 Deployment Summary:`);
    console.log(`   Agent: ${siteData.config.agent.name}`);
    console.log(`   Domain: ${siteData.config.deployment.domain}`);
    console.log(`   Pages: ${Object.keys(siteData.pages).length} generated`);
    console.log(`   Environment: ${siteData.config.deployment.environment}`);
    console.log(`   SSL: ${siteData.config.deployment.ssl ? 'Enabled' : 'Disabled'}`);
    console.log(`   CDN: ${siteData.config.deployment.cdn ? 'Enabled' : 'Disabled'}`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
🏗️  Eden2 Sovereign Site Deployment Tool

Usage:
  npx tsx scripts/deploy-sovereign-site.ts <agent> [options]

Arguments:
  <agent>           Agent handle or ID (e.g., 'miyomi', 'solienne', 'abraham')

Options:
  --domain <url>    Custom domain (default: <agent>.eden2.io)
  --env <env>       Environment: development|staging|production (default: production)
  --dry-run         Preview configuration without creating files
  --output <dir>    Output directory (default: ./sovereign-sites)
  --help           Show this help message

Examples:
  # Deploy MIYOMI sovereign site
  npx tsx scripts/deploy-sovereign-site.ts miyomi

  # Dry run for SOLIENNE
  npx tsx scripts/deploy-sovereign-site.ts solienne --dry-run

  # Custom domain deployment
  npx tsx scripts/deploy-sovereign-site.ts abraham --domain abraham.ai --env production

Available Agents:
${EDEN_AGENTS.map(agent => `  ${agent.handle.padEnd(12)} - ${agent.name}`).join('\n')}
`);
    return;
  }

  const agent = args[0];
  const options: DeploymentOptions = {
    agent,
    domain: args.includes('--domain') ? args[args.indexOf('--domain') + 1] : undefined,
    environment: args.includes('--env') ? args[args.indexOf('--env') + 1] as any : 'production',
    dryRun: args.includes('--dry-run'),
    outputDir: args.includes('--output') ? args[args.indexOf('--output') + 1] : './sovereign-sites'
  };

  const deployer = new SovereignDeploymentManager(options);
  await deployer.deploy();
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export { SovereignDeploymentManager, type DeploymentOptions };