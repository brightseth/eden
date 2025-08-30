#!/usr/bin/env npx tsx

// Intelligent Sovereign Deployment CLI v2.0
// AI-powered sovereign site generation with smart configuration and auto-optimization

import fs from 'fs';
import path from 'path';
import { enhancedSovereignFactory } from '@/lib/sovereign/enhanced-factory';
import { validateAllDataSources } from '@/lib/sovereign/data-aggregator';
import type { EnhancedSovereignSite } from '@/lib/sovereign/enhanced-factory';

interface IntelligentDeploymentOptions {
  agent: string;
  autoDetect: boolean;
  dryRun: boolean;
  outputDir: string;
  customDomain?: string;
  environment: 'development' | 'staging' | 'production';
  skipValidation: boolean;
  verbose: boolean;
}

class IntelligentSovereignDeployer {
  private options: IntelligentDeploymentOptions;

  constructor(options: IntelligentDeploymentOptions) {
    this.options = options;
  }

  async deploy(): Promise<void> {
    console.log(`🤖 Starting intelligent sovereign deployment for ${this.options.agent.toUpperCase()}`);
    console.log(`⚙️  Auto-detect: ${this.options.autoDetect ? 'ON' : 'OFF'} | Environment: ${this.options.environment}`);

    try {
      // Step 1: Validate data sources if not skipped
      if (!this.options.skipValidation) {
        await this.validateDataSources();
      }

      // Step 2: Generate intelligent sovereign site
      console.log(`🧠 Generating AI-powered configuration...`);
      const sovereignSite = await enhancedSovereignFactory.generateIntelligentSovereignSite(this.options.agent);

      // Step 3: Apply custom overrides if provided
      if (this.options.customDomain) {
        sovereignSite.deployment.domain = this.options.customDomain;
      }

      // Step 4: Display intelligence report
      this.displayIntelligenceReport(sovereignSite);

      // Step 5: Generate files or dry run
      if (this.options.dryRun) {
        this.performDryRun(sovereignSite);
      } else {
        await this.generateFiles(sovereignSite);
      }

      console.log(`✅ Intelligent sovereign deployment completed!`);
      
    } catch (error) {
      console.error(`❌ Intelligent deployment failed:`, error);
      process.exit(1);
    }
  }

  private async validateDataSources(): Promise<void> {
    console.log(`🔍 Validating data sources...`);
    
    const sources = await validateAllDataSources();
    const availableSources = Object.entries(sources).filter(([_, available]) => available);
    const unavailableSources = Object.entries(sources).filter(([_, available]) => !available);

    console.log(`✅ Available: ${availableSources.map(([name]) => name).join(', ')}`);
    if (unavailableSources.length > 0) {
      console.log(`⚠️  Unavailable: ${unavailableSources.map(([name]) => name).join(', ')}`);
    }

    if (availableSources.length === 0) {
      throw new Error('No data sources available for intelligent configuration');
    }
  }

  private displayIntelligenceReport(site: EnhancedSovereignSite): void {
    const { config, recommendations, metadata } = site;
    
    console.log(`\n🧠 AI INTELLIGENCE REPORT`);
    console.log(`═══════════════════════════════════════`);
    
    // Agent Analysis
    console.log(`📊 Agent Analysis:`);
    console.log(`   Type: ${recommendations.analysis.agentType.toUpperCase()} agent`);
    console.log(`   Output: ${recommendations.analysis.outputPatterns.frequency} frequency, ${recommendations.analysis.outputPatterns.quality} quality`);
    console.log(`   Economic Model: ${recommendations.analysis.economicModel}`);
    console.log(`   Community: ${recommendations.analysis.communityEngagement} engagement`);
    console.log(`   Graduation: ${recommendations.analysis.graduationReadiness}% ready`);

    // Recommendations
    console.log(`\n🎨 Smart Recommendations:`);
    console.log(`   Layout: ${recommendations.layout} (optimized for ${recommendations.analysis.agentType})`);
    console.log(`   Components: ${recommendations.components.length} intelligent components`);
    console.log(`   Theme: ${recommendations.theme.name}`);
    console.log(`   Colors: ${recommendations.theme.colors.primary} → ${recommendations.theme.colors.accent}`);

    // Content Strategy
    console.log(`\n📝 Content Strategy:`);
    console.log(`   Focus: ${recommendations.contentStrategy.substring(0, 80)}...`);
    console.log(`   Audience: ${recommendations.audience.primaryAudience}`);

    // Metadata
    console.log(`\n⚙️  Generation Metadata:`);
    console.log(`   Confidence: ${metadata.confidence}%`);
    console.log(`   Data Sources: ${metadata.dataSources.join(', ')}`);
    console.log(`   Generated: ${metadata.generatedAt}`);

    // Optimizations Applied
    console.log(`\n🚀 Applied Optimizations:`);
    metadata.optimizations.forEach((opt, i) => {
      console.log(`   ${i + 1}. ${opt}`);
    });

    console.log(`═══════════════════════════════════════\n`);
  }

  private performDryRun(site: EnhancedSovereignSite): void {
    console.log(`🧪 DRY RUN MODE - Preview of generated files:`);
    
    // Display file structure
    console.log(`\n📁 File Structure:`);
    Object.keys(site.pages).forEach(page => {
      const lineCount = site.pages[page].split('\n').length;
      console.log(`   📄 ${page} (${lineCount} lines)`);
    });

    Object.keys(site.components).forEach(component => {
      const lineCount = site.components[component].split('\n').length;
      console.log(`   🧩 components/${component} (${lineCount} lines)`);
    });

    // Display deployment config
    console.log(`\n🚀 Deployment Configuration:`);
    console.log(`   Domain: ${site.deployment.domain}`);
    console.log(`   Environment: ${site.deployment.environment}`);
    console.log(`   Build Command: ${site.deployment.buildCommand}`);
    console.log(`   Output Directory: ${site.deployment.outputDirectory}`);

    // Display sample code preview
    console.log(`\n📋 Sample Code Preview (main page):`);
    const mainPageLines = site.pages['page.tsx'].split('\n');
    const previewLines = mainPageLines.slice(0, 20);
    previewLines.forEach((line, i) => {
      console.log(`   ${String(i + 1).padStart(2, ' ')} │ ${line}`);
    });
    if (mainPageLines.length > 20) {
      console.log(`   .. │ ... ${mainPageLines.length - 20} more lines`);
    }
  }

  private async generateFiles(site: EnhancedSovereignSite): Promise<void> {
    const { config } = site;
    const siteDir = path.join(this.options.outputDir, `${config.core.handle}-intelligent-sovereign`);

    console.log(`📁 Creating intelligent sovereign site: ${siteDir}`);
    this.ensureDirectoryExists(siteDir);

    // Generate pages
    console.log(`📝 Writing intelligent pages...`);
    for (const [filename, content] of Object.entries(site.pages)) {
      const filePath = path.join(siteDir, filename);
      const fileDir = path.dirname(filePath);
      this.ensureDirectoryExists(fileDir);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✓ ${filename}`);
    }

    // Generate components  
    const componentsDir = path.join(siteDir, 'components');
    this.ensureDirectoryExists(componentsDir);
    console.log(`🧩 Writing intelligent components...`);
    for (const [filename, content] of Object.entries(site.components)) {
      const filePath = path.join(componentsDir, filename);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✓ components/${filename}`);
    }

    // Write configuration files
    await this.writeConfigurationFiles(siteDir, site);

    // Write intelligence report
    this.writeIntelligenceReport(siteDir, site);

    console.log(`\n🎯 Intelligent sovereign site generated successfully!`);
    console.log(`📊 Confidence Score: ${site.metadata.confidence}%`);
    console.log(`🌐 Target Domain: ${site.deployment.domain}`);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private async writeConfigurationFiles(siteDir: string, site: EnhancedSovereignSite): Promise<void> {
    console.log(`⚙️  Writing configuration files...`);
    
    // Enhanced package.json with intelligent dependencies
    const packageJson = {
      name: `${site.config.core.handle}-intelligent-sovereign`,
      version: "2.0.0",
      description: `AI-generated sovereign site for ${site.config.core.displayName}`,
      keywords: [
        site.recommendations.analysis.agentType,
        "sovereign",
        "ai-agent", 
        "eden-academy",
        site.config.dailyPractice.type
      ],
      scripts: {
        dev: "next dev",
        build: "next build", 
        start: "next start",
        lint: "next lint",
        "analyze-site": "echo 'Site generated with AI intelligence'"
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
        "autoprefixer": "^10.0.0",
        "lucide-react": "^0.400.0",
        // Add intelligent dependencies based on agent type
        ...(site.recommendations.analysis.agentType === 'trader' && {
          "recharts": "^2.8.0",
          "date-fns": "^2.30.0"
        }),
        ...(site.recommendations.analysis.agentType === 'creator' && {
          "framer-motion": "^10.16.0",
          "react-image-gallery": "^1.3.0"
        })
      },
      metadata: {
        generatedBy: "Intelligent Sovereign Factory v2.0",
        agentType: site.recommendations.analysis.agentType,
        confidence: site.metadata.confidence,
        generatedAt: site.metadata.generatedAt
      }
    };

    fs.writeFileSync(path.join(siteDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
    console.log(`   ✓ package.json (with intelligent dependencies)`);

    // Enhanced Vercel config with intelligent optimizations
    const vercelConfig = {
      name: `${site.config.core.handle}-intelligent-sovereign`,
      version: 2,
      builds: [{ src: "package.json", use: "@vercel/next" }],
      routes: [{ src: "/(.*)", dest: "/$1" }],
      env: {
        NODE_ENV: site.deployment.environment,
        AGENT_HANDLE: site.config.core.handle,
        AGENT_TYPE: site.recommendations.analysis.agentType,
        LAYOUT_TYPE: site.recommendations.layout,
        CONFIDENCE_SCORE: site.metadata.confidence.toString()
      },
      functions: {
        // Intelligent function configuration based on agent type
        ...(site.recommendations.analysis.agentType === 'trader' && {
          "api/metrics.js": { memory: 1024 }
        })
      }
    };

    fs.writeFileSync(path.join(siteDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2), 'utf8');
    console.log(`   ✓ vercel.json (with intelligent optimizations)`);

    // Enhanced Next.js config
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Intelligent image optimization
  images: {
    domains: [
      'replicate.delivery',
      'api.eden.art',
      'registry.eden2.io',
      '${site.deployment.domain}',
      // Add agent-specific image domains
      ${site.config.social.website ? `'${new URL(site.config.social.website).hostname}',` : ''}
    ],
    ${site.recommendations.analysis.agentType === 'creator' ? `
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,` : ''}
  },

  // Intelligent redirects and rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://academy.eden2.io/api/:path*'
      },
      // Agent-specific API routing
      ${site.recommendations.analysis.agentType === 'trader' ? `
      {
        source: '/trading/:path*',
        destination: '/api/trading/:path*'
      },` : ''}
    ];
  },

  // Performance optimizations based on agent type
  ${site.recommendations.analysis.outputPatterns.frequency === 'high' ? `
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },` : ''}

  // Metadata for intelligent site
  env: {
    AGENT_TYPE: '${site.recommendations.analysis.agentType}',
    GENERATED_AT: '${site.metadata.generatedAt}',
    CONFIDENCE_SCORE: '${site.metadata.confidence}',
  }
};

module.exports = nextConfig;`;

    fs.writeFileSync(path.join(siteDir, 'next.config.js'), nextConfig, 'utf8');
    console.log(`   ✓ next.config.js (with intelligent optimizations)`);

    // Intelligent Tailwind config with theme colors
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Intelligent color scheme from AI recommendations
      colors: {
        primary: '${site.recommendations.theme.colors.primary}',
        accent: '${site.recommendations.theme.colors.accent}',
        background: '${site.recommendations.theme.colors.background}',
        text: '${site.recommendations.theme.colors.text}',
        muted: '${site.recommendations.theme.colors.muted}',
      },
      // Intelligent typography from AI recommendations  
      fontFamily: {
        heading: ['${site.recommendations.theme.typography.heading}', 'sans-serif'],
        body: ['${site.recommendations.theme.typography.body}', 'sans-serif'],
        mono: ['${site.recommendations.theme.typography.mono}', 'monospace'],
      },
      // Intelligent spacing based on output patterns
      spacing: {
        'agent': '${site.recommendations.theme.spacing === 'compact' ? '0.5rem' : '1rem'}',
      },
      // Animation settings based on technical sophistication
      animation: {
        ${site.recommendations.theme.animations === 'dynamic' ? `
        'bounce-slow': 'bounce 3s infinite',
        'pulse-fast': 'pulse 1s infinite',` : `
        'fade-in': 'fadeIn 0.5s ease-in',`}
      },
    },
  },
  plugins: [
    // Add plugins based on agent type
    ${site.recommendations.analysis.agentType === 'creator' ? "require('@tailwindcss/aspect-ratio')," : ''}
    ${site.recommendations.analysis.agentType === 'curator' ? "require('@tailwindcss/typography')," : ''}
  ],
}`;

    fs.writeFileSync(path.join(siteDir, 'tailwind.config.js'), tailwindConfig, 'utf8');
    console.log(`   ✓ tailwind.config.js (with intelligent theme)`);
  }

  private writeIntelligenceReport(siteDir: string, site: EnhancedSovereignSite): void {
    const reportPath = path.join(siteDir, 'INTELLIGENCE_REPORT.md');
    
    const report = `# Intelligent Sovereign Site Report

## Agent: ${site.config.core.displayName}

Generated: ${site.metadata.generatedAt}
Confidence Score: ${site.metadata.confidence}%

## AI Analysis

### Agent Classification
- **Type**: ${site.recommendations.analysis.agentType}
- **Output Patterns**: ${site.recommendations.analysis.outputPatterns.frequency} frequency, ${site.recommendations.analysis.outputPatterns.quality} quality
- **Economic Model**: ${site.recommendations.analysis.economicModel}
- **Community Engagement**: ${site.recommendations.analysis.communityEngagement}
- **Graduation Readiness**: ${site.recommendations.analysis.graduationReadiness}%

### Intelligent Recommendations

#### Layout Selection
- **Chosen Layout**: ${site.recommendations.layout}
- **Reasoning**: Optimized for ${site.recommendations.analysis.agentType} agent type with ${site.recommendations.analysis.outputPatterns.frequency} output frequency

#### Component Selection (${site.recommendations.components.length} components)
${site.recommendations.components.map((comp: string) => `- ${comp}`).join('\n')}

#### Theme Configuration
- **Name**: ${site.recommendations.theme.name}
- **Primary Color**: ${site.recommendations.theme.colors.primary}
- **Accent Color**: ${site.recommendations.theme.colors.accent}
- **Typography**: ${site.recommendations.theme.typography.heading}
- **Spacing**: ${site.recommendations.theme.spacing}
- **Animations**: ${site.recommendations.theme.animations}

### Content Strategy
${site.recommendations.contentStrategy}

### Audience Analysis
- **Primary Audience**: ${site.recommendations.audience.primaryAudience}
- **Content Preferences**: ${site.recommendations.audience.contentPreferences.join(', ')}
- **Engagement Patterns**: ${site.recommendations.audience.engagementPatterns.join(', ')}

## Data Sources Used
${site.metadata.dataSources.map((source: string) => `- ${source.charAt(0).toUpperCase() + source.slice(1)} data`).join('\n')}

## Applied Optimizations
${site.metadata.optimizations.map((opt: string, i: number) => `${i + 1}. ${opt}`).join('\n')}

## Deployment Configuration
- **Domain**: ${site.deployment.domain}
- **Environment**: ${site.deployment.environment}
- **Build Command**: ${site.deployment.buildCommand}

---

*This report was generated by the Intelligent Sovereign Factory v2.0*
*Confidence Score: ${site.metadata.confidence}% | Generated: ${new Date().toLocaleString()}*
`;

    fs.writeFileSync(reportPath, report, 'utf8');
    console.log(`   ✓ INTELLIGENCE_REPORT.md (detailed AI analysis)`);
  }
}

// ============================================
// CLI Interface
// ============================================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
🤖 Intelligent Sovereign Deployment CLI v2.0

DESCRIPTION:
  AI-powered sovereign site generation with intelligent configuration,
  smart component selection, and automatic optimization based on agent 
  characteristics and performance data.

USAGE:
  npx tsx scripts/intelligent-sovereign-deployment.ts <agent> [options]

ARGUMENTS:
  <agent>           Agent handle or ID for intelligent analysis

OPTIONS:
  --auto-detect     Enable full AI auto-detection (default: true)
  --dry-run         Preview intelligent configuration without generating files
  --output <dir>    Output directory (default: ./intelligent-sovereign-sites)
  --domain <url>    Custom domain override
  --env <env>       Environment: development|staging|production (default: production)
  --skip-validation Skip data source validation (faster but less reliable)
  --verbose         Detailed logging and analysis output
  --help           Show this help message

EXAMPLES:
  # Full intelligent deployment for MIYOMI
  npx tsx scripts/intelligent-sovereign-deployment.ts miyomi

  # Preview AI analysis without generating files
  npx tsx scripts/intelligent-sovereign-deployment.ts solienne --dry-run

  # Deploy with custom domain
  npx tsx scripts/intelligent-sovereign-deployment.ts abraham --domain abraham.ai

  # Quick deployment skipping validation
  npx tsx scripts/intelligent-sovereign-deployment.ts citizen --skip-validation

FEATURES:
  🧠 AI-powered agent analysis and classification
  🎨 Intelligent layout and component selection  
  🎯 Smart theme generation based on agent personality
  📊 Data-driven optimization recommendations
  🚀 Automatic performance and SEO optimizations
  📈 Confidence scoring for deployment reliability

The Intelligent Sovereign Factory analyzes your agent's:
- Technical capabilities and output patterns
- Economic model and revenue metrics  
- Community engagement and social presence
- Daily practice type and graduation readiness
- Brand identity and cultural context

Then generates a perfectly optimized sovereign site with:
- Custom layout selection (gallery/dashboard/forum/timeline/portfolio)
- Intelligent component recommendations
- AI-generated color schemes and typography
- Performance optimizations based on usage patterns
- SEO and accessibility enhancements
`);
    return;
  }

  const agent = args[0];
  const options: IntelligentDeploymentOptions = {
    agent,
    autoDetect: !args.includes('--no-auto-detect'),
    dryRun: args.includes('--dry-run'),
    outputDir: args.includes('--output') ? args[args.indexOf('--output') + 1] : './intelligent-sovereign-sites',
    customDomain: args.includes('--domain') ? args[args.indexOf('--domain') + 1] : undefined,
    environment: args.includes('--env') ? args[args.indexOf('--env') + 1] as any : 'production',
    skipValidation: args.includes('--skip-validation'),
    verbose: args.includes('--verbose')
  };

  const deployer = new IntelligentSovereignDeployer(options);
  await deployer.deploy();
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}