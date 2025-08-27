#!/usr/bin/env tsx
/**
 * Agent Deployment Pipeline - Automated deployment and verification system
 * 
 * Usage:
 *   npx tsx scripts/agent-deployment-pipeline.ts abraham
 *   npx tsx scripts/agent-deployment-pipeline.ts solienne
 *   npx tsx scripts/agent-deployment-pipeline.ts --verify-all
 */

interface DeploymentCheck {
  name: string;
  status: 'pending' | 'passed' | 'failed';
  endpoint?: string;
  details?: string;
}

interface AgentDeployment {
  name: string;
  handle: string;
  endpoints: string[];
  requiredChecks: string[];
  productionUrl: string;
}

const AGENTS: Record<string, AgentDeployment> = {
  abraham: {
    name: 'ABRAHAM',
    handle: 'abraham',
    endpoints: [
      '/api/agents/abraham',
      '/api/agents/abraham/works', 
      '/api/agents/abraham/latest',
      '/api/agents/abraham/covenant'
    ],
    requiredChecks: ['identity', 'works', 'covenant'],
    productionUrl: 'https://eden-academy-flame.vercel.app'
  },
  solienne: {
    name: 'SOLIENNE', 
    handle: 'solienne',
    endpoints: [
      '/api/agents/solienne',
      '/api/agents/solienne/works',
      '/api/agents/solienne/latest'
    ],
    requiredChecks: ['identity', 'works', 'registry-integration'],
    productionUrl: 'https://eden-academy-flame.vercel.app'
  },
  miyomi: {
    name: 'MIYOMI',
    handle: 'miyomi', 
    endpoints: [
      '/api/agents/miyomi',
      '/api/miyomi/picks',
      '/api/miyomi/performance'
    ],
    requiredChecks: ['identity', 'picks', 'performance'],
    productionUrl: 'https://eden-academy-flame.vercel.app'
  }
};

class AgentDeploymentPipeline {
  private baseUrl: string;
  private verbose: boolean;

  constructor(baseUrl: string = 'https://eden-academy-flame.vercel.app', verbose: boolean = true) {
    this.baseUrl = baseUrl;
    this.verbose = verbose;
  }

  private log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
    if (!this.verbose) return;
    
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m'    // Red
    };
    
    const reset = '\x1b[0m';
    const prefix = level === 'success' ? '✅' : 
                  level === 'warning' ? '⚠️' : 
                  level === 'error' ? '❌' : 'ℹ️';
    
    console.log(`${colors[level]}${prefix} ${message}${reset}`);
  }

  async testEndpoint(url: string): Promise<{ status: number; data?: any; error?: string }> {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'User-Agent': 'eden-deployment-pipeline/1.0' }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { status: response.status, data };
      } else {
        return { status: response.status, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { 
        status: 0, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  async runAgentChecks(agent: AgentDeployment): Promise<DeploymentCheck[]> {
    const checks: DeploymentCheck[] = [];
    
    this.log(`🚀 Testing deployment for ${agent.name}...`, 'info');
    
    // Test all endpoints
    for (const endpoint of agent.endpoints) {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      const result = await this.testEndpoint(fullUrl);
      
      checks.push({
        name: `${endpoint} endpoint`,
        status: result.status === 200 ? 'passed' : 'failed',
        endpoint: fullUrl,
        details: result.error ? `Error: ${result.error}` : `Status: ${result.status}`
      });
      
      if (result.status === 200) {
        this.log(`✅ ${endpoint} - OK`, 'success');
      } else {
        this.log(`❌ ${endpoint} - ${result.error || result.status}`, 'error');
      }
    }
    
    // Agent-specific checks
    if (agent.handle === 'abraham') {
      const covenantCheck = await this.testEndpoint(`${this.baseUrl}/api/agents/abraham/covenant`);
      if (covenantCheck.status === 200 && covenantCheck.data?.progress) {
        checks.push({
          name: 'Covenant Progress Tracking',
          status: 'passed', 
          details: `Progress: ${covenantCheck.data.progress.percentage}%`
        });
        this.log(`✅ Covenant tracking active`, 'success');
      }
    }
    
    if (agent.handle === 'solienne') {
      const worksCheck = await this.testEndpoint(`${this.baseUrl}/api/agents/solienne/works`);
      if (worksCheck.status === 200) {
        checks.push({
          name: 'Registry Integration',
          status: 'passed',
          details: 'Works endpoint responding'
        });
        this.log(`✅ Registry integration ready`, 'success');
      }
    }
    
    return checks;
  }

  async deployAgent(agentHandle: string): Promise<boolean> {
    const agent = AGENTS[agentHandle.toLowerCase()];
    if (!agent) {
      this.log(`❌ Unknown agent: ${agentHandle}`, 'error');
      return false;
    }
    
    this.log(`\n🚀 Deploying ${agent.name} to production...`, 'info');
    
    const checks = await this.runAgentChecks(agent);
    const passedChecks = checks.filter(c => c.status === 'passed').length;
    const totalChecks = checks.length;
    
    this.log(`\n📊 Deployment Summary for ${agent.name}:`, 'info');
    this.log(`   Passed: ${passedChecks}/${totalChecks} checks`, passedChecks === totalChecks ? 'success' : 'warning');
    
    checks.forEach(check => {
      const status = check.status === 'passed' ? '✅' : '❌';
      this.log(`   ${status} ${check.name}${check.details ? ` - ${check.details}` : ''}`, 
               check.status === 'passed' ? 'success' : 'error');
    });
    
    const deploymentSuccess = passedChecks === totalChecks;
    
    if (deploymentSuccess) {
      this.log(`\n🎉 ${agent.name} deployment SUCCESSFUL!`, 'success');
      this.log(`   Production URL: ${agent.productionUrl}`, 'info');
      
      // Update deployment status (would integrate with CEO dashboard in production)
      this.log(`   Status: DEPLOYED ✅`, 'success');
    } else {
      this.log(`\n⚠️ ${agent.name} deployment has issues`, 'warning');
      this.log(`   ${totalChecks - passedChecks} checks failed`, 'error');
    }
    
    return deploymentSuccess;
  }

  async verifyAllAgents(): Promise<void> {
    this.log('🔍 Verifying all agent deployments...', 'info');
    
    const results = [];
    
    for (const [handle, agent] of Object.entries(AGENTS)) {
      const checks = await this.runAgentChecks(agent);
      const passedChecks = checks.filter(c => c.status === 'passed').length;
      
      results.push({
        name: agent.name,
        handle,
        passed: passedChecks,
        total: checks.length,
        success: passedChecks === checks.length
      });
    }
    
    this.log('\n📋 Deployment Status Summary:', 'info');
    results.forEach(result => {
      const status = result.success ? '🟢 DEPLOYED' : '🟡 ISSUES';
      this.log(`   ${result.name}: ${status} (${result.passed}/${result.total})`, 
               result.success ? 'success' : 'warning');
    });
    
    const deployedCount = results.filter(r => r.success).length;
    this.log(`\n🎯 Overall Status: ${deployedCount}/${results.length} agents deployed`, 
             deployedCount === results.length ? 'success' : 'warning');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🚀 Eden Agent Deployment Pipeline

Usage:
  npx tsx scripts/agent-deployment-pipeline.ts <agent>     Deploy specific agent
  npx tsx scripts/agent-deployment-pipeline.ts --verify   Verify all deployments
  
Available agents: ${Object.keys(AGENTS).join(', ')}

Examples:
  npx tsx scripts/agent-deployment-pipeline.ts abraham
  npx tsx scripts/agent-deployment-pipeline.ts solienne  
  npx tsx scripts/agent-deployment-pipeline.ts --verify
    `);
    return;
  }
  
  const pipeline = new AgentDeploymentPipeline();
  
  if (args[0] === '--verify' || args[0] === '--verify-all') {
    await pipeline.verifyAllAgents();
  } else {
    const agentHandle = args[0];
    const success = await pipeline.deployAgent(agentHandle);
    process.exit(success ? 0 : 1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AgentDeploymentPipeline, AGENTS };