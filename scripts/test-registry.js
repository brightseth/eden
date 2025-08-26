#!/usr/bin/env node

/**
 * Registry Test Runner
 * Orchestrates comprehensive Registry testing suite
 * Provides CLI interface for running specific test categories
 */

const { spawn } = require('child_process');
const path = require('path');

const TEST_SUITES = {
  integration: {
    name: 'Integration Tests',
    description: 'Test Registry connectivity, health monitoring, and data integrity',
    file: 'src/__tests__/registry/integration.test.ts',
    timeout: 30000
  },
  contract: {
    name: 'Contract Tests', 
    description: 'Validate API contracts and data model consistency',
    file: 'src/__tests__/registry/contract.test.ts',
    timeout: 15000
  },
  fallback: {
    name: 'Fallback Tests',
    description: 'Test graceful degradation and error handling',
    file: 'src/__tests__/registry/fallback.test.ts',
    timeout: 30000
  },
  e2e: {
    name: 'End-to-End Tests',
    description: 'Complete workflow validation across all services',
    file: 'src/__tests__/registry/e2e.test.ts',
    timeout: 45000
  }
};

async function runTests(suites = Object.keys(TEST_SUITES), options = {}) {
  console.log('🚀 Eden Registry Test Suite');
  console.log('==========================\n');

  // Check if Registry is running
  if (!options.skipHealthCheck) {
    console.log('📡 Checking Registry health...');
    await checkRegistryHealth();
  }

  const results = {};
  
  for (const suite of suites) {
    if (!TEST_SUITES[suite]) {
      console.error(`❌ Unknown test suite: ${suite}`);
      continue;
    }

    const testSuite = TEST_SUITES[suite];
    console.log(`\n🧪 Running ${testSuite.name}`);
    console.log(`   ${testSuite.description}`);
    console.log(`   File: ${testSuite.file}`);
    
    try {
      const result = await runJestTest(testSuite.file, testSuite.timeout);
      results[suite] = result;
      
      if (result.success) {
        console.log(`✅ ${testSuite.name} completed successfully`);
      } else {
        console.log(`❌ ${testSuite.name} failed`);
        if (options.verbose) {
          console.log(`   Error: ${result.error}`);
        }
      }
    } catch (error) {
      results[suite] = { success: false, error: error.message };
      console.log(`❌ ${testSuite.name} failed with exception: ${error.message}`);
    }
  }

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  
  let passCount = 0;
  let totalCount = 0;
  
  Object.entries(results).forEach(([suite, result]) => {
    const status = result.success ? '✅' : '❌';
    const testSuite = TEST_SUITES[suite];
    console.log(`${status} ${testSuite.name}`);
    
    if (result.success) passCount++;
    totalCount++;
  });
  
  console.log(`\nOverall: ${passCount}/${totalCount} test suites passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 All Registry tests passed! System is ready for production.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Review results before deploying.');
    process.exit(1);
  }
}

async function checkRegistryHealth() {
  const registryUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3005';
  
  try {
    const response = await fetch(`${registryUrl}/api/v1/health`);
    if (response.ok) {
      console.log('✅ Registry is healthy and ready for testing');
      return true;
    } else {
      console.log(`⚠️  Registry health check returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Registry health check failed:');
    console.log(`   URL: ${registryUrl}/api/v1/health`);
    console.log(`   Error: ${error.message}`);
    console.log('   Please ensure Registry is running on localhost:3005');
    
    if (!process.env.FORCE_TESTS) {
      console.log('\n💡 To run tests anyway, set FORCE_TESTS=true');
      process.exit(1);
    } else {
      console.log('\n⚠️  FORCE_TESTS enabled, proceeding without health check');
      return false;
    }
  }
}

function runJestTest(testFile, timeout) {
  return new Promise((resolve) => {
    const jestArgs = [
      '--testMatch', `**/${testFile}`,
      '--testTimeout', timeout.toString(),
      '--verbose'
    ];

    if (process.env.CI) {
      jestArgs.push('--ci', '--coverage', '--watchAll=false');
    }

    const jest = spawn('npx', ['jest', ...jestArgs], {
      stdio: 'pipe',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        USE_REGISTRY: 'true'
      }
    });

    let output = '';
    let error = '';

    jest.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      if (process.env.VERBOSE || process.env.DEBUG) {
        process.stdout.write(text);
      }
    });

    jest.stderr.on('data', (data) => {
      const text = data.toString();
      error += text;
      if (process.env.VERBOSE || process.env.DEBUG) {
        process.stderr.write(text);
      }
    });

    jest.on('close', (code) => {
      const success = code === 0;
      resolve({
        success,
        code,
        output,
        error: error || (success ? null : `Process exited with code ${code}`)
      });
    });

    jest.on('error', (err) => {
      resolve({
        success: false,
        code: -1,
        output,
        error: err.message
      });
    });
  });
}

function showHelp() {
  console.log('Eden Registry Test Runner');
  console.log('Usage: node scripts/test-registry.js [options] [suites...]');
  console.log('');
  console.log('Available test suites:');
  Object.entries(TEST_SUITES).forEach(([key, suite]) => {
    console.log(`  ${key.padEnd(12)} ${suite.description}`);
  });
  console.log('');
  console.log('Options:');
  console.log('  --help, -h           Show this help');
  console.log('  --verbose, -v        Show detailed output');
  console.log('  --skip-health-check  Skip Registry health check');
  console.log('  --all               Run all test suites (default)');
  console.log('');
  console.log('Environment variables:');
  console.log('  REGISTRY_BASE_URL    Registry URL (default: http://localhost:3005)');
  console.log('  FORCE_TESTS          Run tests even if Registry health check fails');
  console.log('  VERBOSE              Show detailed Jest output');
  console.log('  DEBUG                Show debug information');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/test-registry.js                    # Run all tests');
  console.log('  node scripts/test-registry.js integration        # Run integration tests only');
  console.log('  node scripts/test-registry.js contract fallback  # Run specific suites');
  console.log('  VERBOSE=1 node scripts/test-registry.js          # Run with detailed output');
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  verbose: args.includes('--verbose') || args.includes('-v') || process.env.VERBOSE,
  skipHealthCheck: args.includes('--skip-health-check'),
  all: args.includes('--all')
};

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Filter out option flags to get test suite names
const suites = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));

// If no suites specified or --all flag, run all suites
const suitesToRun = (suites.length === 0 || options.all) ? Object.keys(TEST_SUITES) : suites;

// Run the tests
runTests(suitesToRun, options).catch(error => {
  console.error('❌ Test runner failed:', error.message);
  process.exit(1);
});