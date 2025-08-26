#!/usr/bin/env node

/**
 * Eden Registry CLI - Command-line management utilities
 * 
 * Usage:
 *   npx tsx scripts/registry-cli.js <command> [options]
 * 
 * Commands:
 *   status              - Check Registry health and status
 *   agents              - List all agents
 *   agent <handle>      - Get specific agent details
 *   test <category>     - Run Registry tests
 *   deploy <handle>     - Deploy agent configuration
 *   backup              - Create Registry backup
 *   migrate <from>      - Migrate data between Registry versions
 */

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import figlet from 'figlet';
import fs from 'fs';

// Configuration
const REGISTRY_URL = process.env.EDEN_REGISTRY_API_URL || 'http://localhost:3005';
const ACADEMY_URL = process.env.EDEN_ACADEMY_URL || 'http://localhost:3000';

// Utility functions
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(uptime) {
  if (uptime === 100) return chalk.green('100%');
  if (uptime >= 99) return chalk.yellow(`${uptime}%`);
  return chalk.red(`${uptime}%`);
}

function formatStatus(status) {
  const colors = {
    healthy: chalk.green,
    degraded: chalk.yellow,
    unhealthy: chalk.red,
    ACTIVE: chalk.green,
    INACTIVE: chalk.gray,
    GRADUATED: chalk.blue
  };
  return colors[status] ? colors[status](status) : status;
}

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Command implementations
async function statusCommand() {
  const spinner = ora('Checking Registry status...').start();
  
  try {
    // Check Registry health
    const registryResponse = await fetchWithTimeout(`${REGISTRY_URL}/api/v1/status`);
    const registryData = registryResponse.ok ? await registryResponse.json() : null;
    
    // Check Academy health
    const academyResponse = await fetchWithTimeout(`${ACADEMY_URL}/api/health`);
    const academyData = academyResponse.ok ? await academyResponse.json() : null;
    
    spinner.stop();
    
    // Display header
    console.log(chalk.cyan(figlet.textSync('REGISTRY', { horizontalLayout: 'fitted' })));
    console.log(chalk.gray('Eden Registry CLI Status Dashboard\n'));
    
    // Registry Status Table
    const registryTable = new Table({
      head: ['Component', 'Status', 'Details'],
      colWidths: [20, 15, 50]
    });
    
    if (registryData) {
      registryTable.push(
        ['Registry Core', formatStatus(registryData.status), `Version ${registryData.version || '1.0.0'}`],
        ['Database', formatStatus(registryData.database === 'connected' ? 'healthy' : 'unhealthy'), registryData.database || 'unknown'],
        ['Environment', chalk.blue(registryData.environment || 'development'), `URL: ${REGISTRY_URL}`]
      );
    } else {
      registryTable.push(['Registry Core', formatStatus('unhealthy'), 'Unable to connect']);
    }
    
    if (academyData) {
      registryTable.push(
        ['Academy UI', formatStatus(academyData.status === 'ok' ? 'healthy' : 'unhealthy'), `Features: Registry Sync ${academyData.features?.registrySync ? 'ON' : 'OFF'}`]
      );
    } else {
      registryTable.push(['Academy UI', formatStatus('unhealthy'), 'Unable to connect']);
    }
    
    console.log(registryTable.toString());
    
    // Agent count
    if (registryData && registryData.status === 'healthy') {
      try {
        const agentsResponse = await fetchWithTimeout(`${REGISTRY_URL}/api/v1/agents`);
        if (agentsResponse.ok) {
          const agents = await agentsResponse.json();
          console.log(`\n📊 ${chalk.bold(agents.length)} agents registered\n`);
        }
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Could not fetch agent count\n'));
      }
    }
    
  } catch (error) {
    spinner.fail('Failed to check status');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

async function agentsCommand() {
  const spinner = ora('Fetching agents...').start();
  
  try {
    const response = await fetchWithTimeout(`${REGISTRY_URL}/api/v1/agents`);
    
    if (!response.ok) {
      throw new Error(`Registry returned ${response.status}`);
    }
    
    const agents = await response.json();
    spinner.stop();
    
    console.log(chalk.cyan(figlet.textSync('AGENTS', { horizontalLayout: 'fitted' })));
    console.log(chalk.gray(`Found ${agents.length} agents in Registry\n`));
    
    const table = new Table({
      head: ['Handle', 'Name', 'Role', 'Status', 'Cohort'],
      colWidths: [15, 20, 12, 10, 12]
    });
    
    agents
      .sort((a, b) => a.handle.localeCompare(b.handle))
      .forEach(agent => {
        table.push([
          chalk.bold(agent.handle),
          agent.displayName || agent.handle,
          agent.role || 'GUEST',
          formatStatus(agent.status || 'UNKNOWN'),
          agent.cohort || 'unknown'
        ]);
      });
    
    console.log(table.toString());
    console.log(`\n${chalk.gray('Use')} ${chalk.cyan('registry-cli agent <handle>')} ${chalk.gray('for detailed information')}\n`);
    
  } catch (error) {
    spinner.fail('Failed to fetch agents');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

async function agentCommand(handle) {
  if (!handle) {
    console.error(chalk.red('Error: Agent handle required'));
    console.log(chalk.gray('Usage: registry-cli agent <handle>'));
    process.exit(1);
  }
  
  const spinner = ora(`Fetching agent: ${handle}...`).start();
  
  try {
    const response = await fetchWithTimeout(`${REGISTRY_URL}/api/v1/agents/${handle}`);
    
    if (!response.ok) {
      throw new Error(`Agent '${handle}' not found (${response.status})`);
    }
    
    const agent = await response.json();
    spinner.stop();
    
    console.log(chalk.cyan(figlet.textSync(agent.displayName.toUpperCase(), { horizontalLayout: 'fitted' })));
    console.log(chalk.gray(`Agent Details: @${agent.handle}\n`));
    
    // Basic Info
    const basicTable = new Table({
      head: ['Property', 'Value'],
      colWidths: [20, 60]
    });
    
    basicTable.push(
      ['Handle', chalk.bold(agent.handle)],
      ['Display Name', agent.displayName],
      ['Role', formatStatus(agent.role)],
      ['Status', formatStatus(agent.status)],
      ['Cohort', agent.cohort || 'unknown'],
      ['Visibility', agent.visibility || 'INTERNAL']
    );
    
    console.log(basicTable.toString());
    
    // Profile Info
    if (agent.profile) {
      console.log(chalk.yellow('\n📝 Profile Information:'));
      
      if (agent.profile.statement) {
        console.log(`${chalk.gray('Statement:')} ${agent.profile.statement}`);
      }
      
      if (agent.profile.tags && agent.profile.tags.length > 0) {
        console.log(`${chalk.gray('Tags:')} ${agent.profile.tags.join(', ')}`);
      }
      
      // Extended profile data
      if (agent.profile.links) {
        const links = agent.profile.links;
        
        if (links.personality) {
          console.log(chalk.yellow('\n🎭 Personality:'));
          console.log(`${chalk.gray('Voice:')} ${links.personality.voice || 'Not defined'}`);
          console.log(`${chalk.gray('Philosophy:')} ${links.personality.philosophy || 'Not defined'}`);
        }
        
        if (links.capabilities && Array.isArray(links.capabilities)) {
          console.log(chalk.yellow(`\n🔧 Capabilities (${links.capabilities.length}):`));
          links.capabilities.slice(0, 5).forEach((cap, i) => {
            console.log(`  ${i + 1}. ${cap.replace(/_/g, ' ')}`);
          });
          if (links.capabilities.length > 5) {
            console.log(`  ... and ${links.capabilities.length - 5} more`);
          }
        }
        
        if (links.economicData) {
          console.log(chalk.yellow('\n💰 Economics:'));
          if (links.economicData.monthlyRevenue) {
            console.log(`${chalk.gray('Monthly Revenue:')} $${links.economicData.monthlyRevenue.toLocaleString()}`);
          }
          if (links.economicData.outputRate) {
            console.log(`${chalk.gray('Output Rate:')} ${links.economicData.outputRate} per day`);
          }
        }
      }
    }
    
    console.log(chalk.gray(`\nUse ${chalk.cyan('registry-cli deploy ' + handle)} to update configuration\n`));
    
  } catch (error) {
    spinner.fail(`Failed to fetch agent: ${handle}`);
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

async function testCommand(category) {
  const categories = ['integration', 'contract', 'fallback', 'e2e'];
  
  if (category && !categories.includes(category)) {
    console.error(chalk.red('Error: Invalid test category'));
    console.log(chalk.gray('Available categories:'), categories.join(', '));
    process.exit(1);
  }
  
  const testCategories = category ? [category] : categories;
  
  console.log(chalk.cyan(figlet.textSync('TESTS', { horizontalLayout: 'fitted' })));
  console.log(chalk.gray('Running Registry test suite\n'));
  
  const table = new Table({
    head: ['Category', 'Status', 'Duration', 'Result'],
    colWidths: [15, 12, 12, 40]
  });
  
  for (const testCategory of testCategories) {
    const spinner = ora(`Running ${testCategory} tests...`).start();
    const startTime = Date.now();
    
    try {
      const response = await fetchWithTimeout(`${ACADEMY_URL}/api/v1/registry/test/${testCategory}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, 30000); // 30 second timeout for tests
      
      const duration = Date.now() - startTime;
      const result = await response.json();
      
      spinner.stop();
      
      const status = result.success ? chalk.green('PASSED') : chalk.red('FAILED');
      const durationStr = `${duration}ms`;
      const resultStr = result.success 
        ? `${result.tests?.length || 0} tests passed`
        : result.error || 'Test execution failed';
      
      table.push([
        testCategory.charAt(0).toUpperCase() + testCategory.slice(1),
        status,
        durationStr,
        resultStr
      ]);
      
    } catch (error) {
      spinner.fail(`${testCategory} tests failed`);
      table.push([
        testCategory.charAt(0).toUpperCase() + testCategory.slice(1),
        chalk.red('ERROR'),
        `${Date.now() - startTime}ms`,
        error.message
      ]);
    }
  }
  
  console.log(table.toString());
  console.log(chalk.gray('\nTest suite completed\n'));
}

async function backupCommand() {
  const spinner = ora('Creating Registry backup...').start();
  
  try {
    // Fetch all agents
    const agentsResponse = await fetchWithTimeout(`${REGISTRY_URL}/api/v1/agents`);
    if (!agentsResponse.ok) {
      throw new Error('Failed to fetch agents');
    }
    
    const agents = await agentsResponse.json();
    
    // Create backup data structure
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      registry_url: REGISTRY_URL,
      total_agents: agents.length,
      agents: agents
    };
    
    // Save to file
    const filename = `registry-backup-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    
    spinner.succeed(`Registry backup created: ${filename}`);
    
    console.log(chalk.yellow('\n📦 Backup Details:'));
    console.log(`${chalk.gray('File:')} ${filename}`);
    console.log(`${chalk.gray('Agents:')} ${agents.length}`);
    console.log(`${chalk.gray('Size:')} ${formatBytes(fs.statSync(filename).size)}`);
    console.log(`${chalk.gray('Created:')} ${new Date().toLocaleString()}\n`);
    
  } catch (error) {
    spinner.fail('Failed to create backup');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// CLI Setup
program
  .name('registry-cli')
  .description('Eden Registry CLI - Command-line management utilities')
  .version('1.0.0');

program
  .command('status')
  .description('Check Registry health and status')
  .action(statusCommand);

program
  .command('agents')
  .description('List all agents')
  .action(agentsCommand);

program
  .command('agent <handle>')
  .description('Get specific agent details')
  .action(agentCommand);

program
  .command('test [category]')
  .description('Run Registry tests (integration, contract, fallback, e2e)')
  .action(testCommand);

program
  .command('backup')
  .description('Create Registry backup')
  .action(backupCommand);

program
  .command('deploy <handle>')
  .description('Deploy agent configuration (coming soon)')
  .action((handle) => {
    console.log(chalk.yellow('🚧 Deploy command coming soon!'));
    console.log(chalk.gray(`Will deploy configuration for agent: ${handle}`));
  });

// Parse arguments
program.parse();

// Show help if no command provided
if (process.argv.length <= 2) {
  program.help();
}