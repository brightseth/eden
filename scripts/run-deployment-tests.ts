#!/usr/bin/env npx tsx

/**
 * Complete SDK Deployment Test Suite
 * Runs all deployment validation tests and generates comprehensive report
 */

import { runSDKDeploymentTests } from './test-sdk-deployments';
import { runRegistrySyncValidation } from './test-registry-sync';
import { runClaudeEnvironmentTests } from './claude-environment-test';
import { runProductionSyncValidation } from './production-registry-sync';

interface DeploymentReport {
  timestamp: Date;
  overallStatus: 'ready' | 'needs_work' | 'blocked';
  testSuites: {
    sdkFunctionality: { passed: number; total: number; ready: boolean };
    registrySync: { passed: number; total: number; ready: boolean };
    claudeIntegration: { passed: number; total: number; ready: boolean };
    productionSync: { passed: number; total: number; ready: boolean };
  };
  readyForDeployment: string[];
  blockers: string[];
  recommendations: string[];
}

async function runCompleteDeploymentValidation(): Promise<DeploymentReport> {
  console.log('🚀 EDEN ACADEMY CLAUDE SDK DEPLOYMENT VALIDATION');
  console.log('='.repeat(60));
  console.log('Running comprehensive deployment tests...\n');

  let report: DeploymentReport = {
    timestamp: new Date(),
    overallStatus: 'blocked',
    testSuites: {
      sdkFunctionality: { passed: 0, total: 0, ready: false },
      registrySync: { passed: 0, total: 0, ready: false },
      claudeIntegration: { passed: 0, total: 0, ready: false },
      productionSync: { passed: 0, total: 0, ready: false }
    },
    readyForDeployment: [],
    blockers: [],
    recommendations: []
  };

  try {
    // 1. SDK Functionality Tests
    console.log('📦 PHASE 1: SDK Functionality Validation');
    console.log('-'.repeat(50));
    const sdkResults = await runSDKDeploymentTests();
    const sdkPassed = sdkResults.filter(r => r.status === 'pass').length;
    report.testSuites.sdkFunctionality = {
      passed: sdkPassed,
      total: sdkResults.length,
      ready: (sdkPassed / sdkResults.length) >= 0.8
    };

    // 2. Registry Sync Tests  
    console.log('\n🔄 PHASE 2: Registry Sync Validation');
    console.log('-'.repeat(50));
    const registryResults = await runRegistrySyncValidation();
    const registryPassed = registryResults.filter(r => r.status === 'pass').length;
    report.testSuites.registrySync = {
      passed: registryPassed,
      total: registryResults.length,
      ready: (registryPassed / registryResults.length) >= 0.7
    };

    // 3. Claude Environment Tests
    console.log('\n🤖 PHASE 3: Claude Environment Integration');
    console.log('-'.repeat(50));
    const claudeResults = await runClaudeEnvironmentTests();
    const claudePassed = claudeResults.filter(r => r.deploymentReady).length;
    report.testSuites.claudeIntegration = {
      passed: claudePassed,
      total: claudeResults.length,
      ready: claudePassed === claudeResults.length
    };

    // 4. Production Sync Tests
    console.log('\n🏭 PHASE 4: Production Registry Sync');
    console.log('-'.repeat(50));
    const productionResults = await runProductionSyncValidation();
    const productionPassed = productionResults.filter(r => r.status === 'pass').length;
    report.testSuites.productionSync = {
      passed: productionPassed,
      total: productionResults.length,
      ready: (productionPassed / productionResults.length) >= 0.7
    };

    // Generate final assessment
    report = generateFinalAssessment(report);

  } catch (error) {
    console.error('\n💥 Deployment validation failed:', error);
    report.overallStatus = 'blocked';
    report.blockers.push(`Critical test failure: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Print comprehensive report
  printDeploymentReport(report);
  
  return report;
}

function generateFinalAssessment(report: DeploymentReport): DeploymentReport {
  const readyCount = Object.values(report.testSuites).filter(suite => suite.ready).length;
  const totalSuites = Object.keys(report.testSuites).length;

  // Determine overall status
  if (readyCount === totalSuites) {
    report.overallStatus = 'ready';
  } else if (readyCount >= totalSuites - 1) {
    report.overallStatus = 'needs_work';
  } else {
    report.overallStatus = 'blocked';
  }

  // Identify ready agents
  if (report.testSuites.sdkFunctionality.ready && report.testSuites.claudeIntegration.ready) {
    report.readyForDeployment = ['Solienne', 'Abraham', 'Sue', 'Miyomi', 'Bertha'];
  }

  // Identify blockers
  if (!report.testSuites.sdkFunctionality.ready) {
    report.blockers.push('SDK functionality issues detected');
  }
  if (!report.testSuites.registrySync.ready) {
    report.blockers.push('Registry sync reliability below threshold');
  }
  if (!report.testSuites.claudeIntegration.ready) {
    report.blockers.push('Claude environment integration not ready');
  }
  if (!report.testSuites.productionSync.ready) {
    report.blockers.push('Production sync performance issues');
  }

  // Generate recommendations
  report.recommendations = generateRecommendations(report);

  return report;
}

function generateRecommendations(report: DeploymentReport): string[] {
  const recommendations: string[] = [];

  // SDK-specific recommendations
  if (report.testSuites.sdkFunctionality.passed < report.testSuites.sdkFunctionality.total) {
    recommendations.push('Fix SDK functionality issues before deployment');
  }

  // Registry recommendations
  if (!report.testSuites.registrySync.ready) {
    recommendations.push('Resolve Registry connectivity and authentication issues');
    recommendations.push('Implement Registry failover and retry mechanisms');
  }

  // Claude integration recommendations
  if (report.testSuites.claudeIntegration.ready) {
    recommendations.push('✅ Claude SDKs ready - proceed with staged deployment');
  }

  // Production recommendations
  if (!report.testSuites.productionSync.ready) {
    recommendations.push('Optimize Registry sync performance before production');
    recommendations.push('Implement production monitoring and alerting');
  }

  // Overall recommendations based on status
  switch (report.overallStatus) {
    case 'ready':
      recommendations.push('🟢 READY: Begin phased deployment starting with single agent');
      recommendations.push('Deploy Registry monitoring and alerting systems');
      recommendations.push('Prepare rollback procedures for each agent');
      break;
    
    case 'needs_work':
      recommendations.push('🟡 Address minor issues before full deployment');
      recommendations.push('Consider pilot deployment with one agent while fixing issues');
      break;
    
    case 'blocked':
      recommendations.push('🔴 Resolve critical blockers before any deployment');
      recommendations.push('Focus on Registry connectivity and authentication');
      break;
  }

  return recommendations;
}

function printDeploymentReport(report: DeploymentReport): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE DEPLOYMENT VALIDATION REPORT');
  console.log('='.repeat(80));
  
  // Overall status
  const statusIcon = report.overallStatus === 'ready' ? '🟢' : 
                    report.overallStatus === 'needs_work' ? '🟡' : '🔴';
  console.log(`\n${statusIcon} OVERALL STATUS: ${report.overallStatus.toUpperCase()}`);
  
  // Test suite results
  console.log('\n📋 TEST SUITE RESULTS:');
  Object.entries(report.testSuites).forEach(([name, results]) => {
    const percentage = (results.passed / results.total * 100).toFixed(0);
    const statusIcon = results.ready ? '✅' : '❌';
    console.log(`  ${statusIcon} ${name}: ${results.passed}/${results.total} (${percentage}%)`);
  });

  // Ready agents
  if (report.readyForDeployment.length > 0) {
    console.log('\n🚀 READY FOR DEPLOYMENT:');
    report.readyForDeployment.forEach(agent => console.log(`  ✅ ${agent}`));
  }

  // Blockers
  if (report.blockers.length > 0) {
    console.log('\n⛔ DEPLOYMENT BLOCKERS:');
    report.blockers.forEach(blocker => console.log(`  ❌ ${blocker}`));
  }

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  report.recommendations.forEach(rec => console.log(`  • ${rec}`));

  // Next steps
  console.log('\n🎯 NEXT STEPS:');
  switch (report.overallStatus) {
    case 'ready':
      console.log('  1. Begin staged deployment with Solienne or Abraham');
      console.log('  2. Monitor Registry sync performance in production');  
      console.log('  3. Gradually deploy remaining agents');
      console.log('  4. Set up comprehensive monitoring and alerting');
      break;
    
    case 'needs_work':
      console.log('  1. Address Registry connectivity issues');
      console.log('  2. Consider pilot deployment while fixing issues');
      console.log('  3. Implement production monitoring');
      console.log('  4. Re-run validation tests');
      break;
    
    case 'blocked':
      console.log('  1. Fix Registry authentication and connectivity');
      console.log('  2. Resolve SDK functionality issues');
      console.log('  3. Re-run complete validation suite');
      console.log('  4. Consider Registry infrastructure review');
      break;
  }

  console.log('\n📅 Report Generated:', report.timestamp.toISOString());
  console.log('='.repeat(80));
}

// CLI execution
if (require.main === module) {
  runCompleteDeploymentValidation()
    .then((report) => {
      const exitCode = report.overallStatus === 'blocked' ? 1 : 0;
      console.log(`\n${report.overallStatus === 'ready' ? '🎉' : '⚠️'} Deployment validation complete!`);
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Deployment validation suite failed:', error);
      process.exit(1);
    });
}

export { runCompleteDeploymentValidation };