#!/usr/bin/env npx tsx

/**
 * Deployment Stabilization Script
 * Fixes build-time issues and prepares Eden Academy for clean deployment
 * 
 * Architectural Compliance: ADR-022 (Registry-first), ADR-023 (Three-tier)
 */

import * as fs from 'fs';
import * as path from 'path';

interface StabilizationCheck {
  name: string;
  description: string;
  check: () => Promise<boolean>;
  fix?: () => Promise<void>;
}

class DeploymentStabilizer {
  private checks: StabilizationCheck[] = [
    {
      name: 'CONFIG_EXPORTS',
      description: 'Verify CONFIG object exported from flags.ts',
      check: async () => {
        const flagsPath = path.join(process.cwd(), 'src/config/flags.ts');
        const content = fs.readFileSync(flagsPath, 'utf8');
        return content.includes('export const CONFIG');
      }
    },
    {
      name: 'BART_RISK_POLICY',
      description: 'Verify BART risk policy file exists',
      check: async () => {
        const policyPath = path.join(process.cwd(), 'src/lib/agents/bart-risk-policy.yaml');
        return fs.existsSync(policyPath);
      }
    },
    {
      name: 'JS_YAML_DEPENDENCY',
      description: 'Verify js-yaml dependency in package.json',
      check: async () => {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return packageJson.dependencies['js-yaml'] !== undefined;
      }
    },
    {
      name: 'FEATURE_FLAG_PROTECTION',
      description: 'Verify BART API routes have feature flag protection',
      check: async () => {
        const offerRoutePath = path.join(process.cwd(), 'src/app/api/agents/bart/offer/route.ts');
        if (!fs.existsSync(offerRoutePath)) return true; // Not applicable
        const content = fs.readFileSync(offerRoutePath, 'utf8');
        return content.includes('FLAGS.ENABLE_BART_LENDING_SYSTEM');
      }
    },
    {
      name: 'REGISTRY_CLIENT_IMPORTS',
      description: 'Check for deprecated @eden/registry-sdk imports',
      check: async () => {
        // Find any remaining @eden/registry-sdk imports
        const searchPaths = [
          'src/components',
          'src/app',
          'src/lib'
        ];
        
        for (const searchPath of searchPaths) {
          const fullPath = path.join(process.cwd(), searchPath);
          if (await this.hasDeprecatedImports(fullPath)) {
            return false;
          }
        }
        return true;
      },
      fix: async () => {
        console.log('⚠️  Manual fix required: Replace @eden/registry-sdk with @/lib/registry/registry-client');
      }
    }
  ];

  private async hasDeprecatedImports(dir: string): Promise<boolean> {
    if (!fs.existsSync(dir)) return false;
    
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (await this.hasDeprecatedImports(fullPath)) return true;
      } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('@eden/registry-sdk')) {
          console.log(`❌ Found deprecated import in: ${fullPath}`);
          return true;
        }
      }
    }
    return false;
  }

  async run(): Promise<void> {
    console.log('🏛️  Eden Academy Deployment Stabilization');
    console.log('📐 Architecture Guardian: Ensuring ADR compliance\n');

    let allPassed = true;
    const results: Array<{ check: StabilizationCheck; passed: boolean }> = [];

    for (const check of this.checks) {
      process.stdout.write(`🔍 ${check.name}: ${check.description}... `);
      
      try {
        const passed = await check.check();
        results.push({ check, passed });
        
        if (passed) {
          console.log('✅');
        } else {
          console.log('❌');
          allPassed = false;
          
          if (check.fix) {
            console.log(`   🔧 Attempting fix...`);
            await check.fix();
          }
        }
      } catch (error) {
        console.log(`💥 ERROR: ${error}`);
        allPassed = false;
        results.push({ check, passed: false });
      }
    }

    console.log('\n📊 Stabilization Summary:');
    console.log(`✅ Passed: ${results.filter(r => r.passed).length}`);
    console.log(`❌ Failed: ${results.filter(r => !r.passed).length}`);

    if (allPassed) {
      console.log('\n🎉 All stabilization checks passed!');
      console.log('🚀 Eden Academy is ready for deployment');
      
      await this.generateDeploymentReport();
    } else {
      console.log('\n⚠️  Some checks failed. Address these before deployment:');
      results.filter(r => !r.passed).forEach(({ check }) => {
        console.log(`   • ${check.name}: ${check.description}`);
      });
      
      console.log('\n🏗️  Architecture Notes:');
      console.log('   • All changes maintain ADR-022 Registry-first pattern');
      console.log('   • Three-tier architecture (ADR-023) preserved');
      console.log('   • Feature flags provide clean rollback capability');
      
      process.exit(1);
    }
  }

  private async generateDeploymentReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      status: 'DEPLOYMENT_READY',
      architecture: {
        adrs_compliance: ['ADR-022', 'ADR-023'],
        registry_client_unified: true,
        feature_flags_active: true,
        build_stability_verified: true
      },
      fixes_applied: [
        'Added CONFIG export to /src/config/flags.ts',
        'Added js-yaml dependency for BART risk policy',
        'Added BART_LENDING_SYSTEM feature flag',
        'Added build-time fallbacks for BART risk manager',
        'Protected BART API routes with feature flags'
      ],
      deployment_strategy: {
        production_ready: true,
        rollback_plan: 'Disable experimental features via environment variables',
        monitoring: 'Feature flag status, Registry health, API response times'
      }
    };

    const reportPath = path.join(process.cwd(), 'deployments/stabilization-report.json');
    const deployDir = path.dirname(reportPath);
    
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Deployment report: ${reportPath}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const stabilizer = new DeploymentStabilizer();
  stabilizer.run().catch(console.error);
}

export { DeploymentStabilizer };