#!/usr/bin/env node

/**
 * API Test Runner
 * Main entry point for running API tests
 */

import { Command } from 'commander';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';

const program = new Command();

interface TestOptions {
  env?: string;
  suite?: string;
  verbose?: boolean;
  bail?: boolean;
  timeout?: number;
  grep?: string;
  watch?: boolean;
}

/**
 * Run Jest tests
 */
async function runJestTests(pattern: string, options: TestOptions): Promise<void> {
  const jestArgs = [
    '--config', 'tests/api/jest.config.js',
    '--testMatch', pattern,
    '--colors',
  ];

  if (options.verbose) {
    jestArgs.push('--verbose');
  }

  if (options.bail) {
    jestArgs.push('--bail');
  }

  if (options.timeout) {
    jestArgs.push('--testTimeout', String(options.timeout));
  }

  if (options.grep) {
    jestArgs.push('--testNamePattern', options.grep);
  }

  if (options.watch) {
    jestArgs.push('--watch');
  }

  const env = {
    ...process.env,
    TEST_ENV: options.env || 'local',
    NODE_ENV: 'test',
  };

  return new Promise((resolve, reject) => {
    const jest = spawn('npx', ['jest', ...jestArgs], {
      stdio: 'inherit',
      env,
    });

    jest.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Get test pattern for suite
 */
function getTestPattern(suite?: string): string {
  const suitePatterns: Record<string, string> = {
    agents: '**/agents/**/*.test.ts',
    works: '**/works/**/*.test.ts',
    health: '**/health/**/*.test.ts',
    registry: '**/registry/**/*.test.ts',
    miyomi: '**/miyomi/**/*.test.ts',
    all: '**/*.test.ts',
  };

  return suitePatterns[suite || 'all'] || suitePatterns.all;
}

/**
 * Validate environment
 */
async function validateEnvironment(env: string): Promise<void> {
  const validEnvs = ['local', 'development', 'staging', 'production'];
  
  if (!validEnvs.includes(env)) {
    throw new Error(`Invalid environment: ${env}. Must be one of: ${validEnvs.join(', ')}`);
  }

  if (env === 'production') {
    console.warn('⚠️  WARNING: Running tests against production environment!');
    console.warn('   Set PRODUCTION_TEST_CONFIRMED=true to proceed.');
    
    if (process.env.PRODUCTION_TEST_CONFIRMED !== 'true') {
      throw new Error('Production testing not confirmed');
    }
  }

  // Check if .env file exists for the environment
  const envFile = env === 'local' ? '.env.test' : `.env.${env}`;
  const envPath = path.resolve(process.cwd(), envFile);
  
  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️  Environment file ${envFile} not found`);
  }
}

/**
 * Main CLI
 */
program
  .name('api-test')
  .description('Eden Academy API Test Runner')
  .version('1.0.0');

program
  .command('run [suite]')
  .description('Run API tests')
  .option('-e, --env <environment>', 'Test environment (local|development|staging|production)', 'local')
  .option('-v, --verbose', 'Verbose output')
  .option('-b, --bail', 'Stop on first test failure')
  .option('-t, --timeout <ms>', 'Test timeout in milliseconds', parseInt)
  .option('-g, --grep <pattern>', 'Only run tests matching pattern')
  .option('-w, --watch', 'Watch mode')
  .action(async (suite: string | undefined, options: TestOptions) => {
    try {
      console.log('🧪 Eden Academy API Test Suite');
      console.log('================================\n');

      await validateEnvironment(options.env || 'local');

      console.log(`Environment: ${options.env || 'local'}`);
      console.log(`Test Suite: ${suite || 'all'}`);
      console.log('');

      const pattern = getTestPattern(suite);
      await runJestTests(pattern, options);

      console.log('\n✅ Tests completed successfully!');
    } catch (error: any) {
      console.error('\n❌ Test run failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available test suites')
  .action(() => {
    console.log('Available test suites:');
    console.log('  - agents     : Agent management APIs');
    console.log('  - works      : Creative works APIs');
    console.log('  - health     : Health check and monitoring APIs');
    console.log('  - registry   : Registry integration tests');
    console.log('  - miyomi     : Miyomi-specific APIs');
    console.log('  - all        : Run all tests');
  });

program
  .command('coverage')
  .description('Run tests with coverage report')
  .option('-e, --env <environment>', 'Test environment', 'local')
  .action(async (options: TestOptions) => {
    try {
      await validateEnvironment(options.env || 'local');

      const jestArgs = [
        '--config', 'tests/api/jest.config.js',
        '--coverage',
        '--coverageDirectory', 'tests/api/coverage',
        '--colors',
      ];

      const env = {
        ...process.env,
        TEST_ENV: options.env || 'local',
        NODE_ENV: 'test',
      };

      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: 'inherit',
        env,
      });

      jest.on('close', (code) => {
        if (code === 0) {
          console.log('\n📊 Coverage report generated in tests/api/coverage/');
        } else {
          console.error(`\n❌ Coverage run failed with exit code ${code}`);
          process.exit(code);
        }
      });
    } catch (error: any) {
      console.error('❌ Coverage run failed:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);