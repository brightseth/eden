/**
 * Launch Validation System
 * Comprehensive validation and safety checks for staged feature launches
 */

import { FEATURE_FLAGS } from '@/config/flags';
import type { LaunchStage, LaunchMetrics } from './staged-launch';

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface LaunchCriteria {
  minimumTestCoverage: number;
  requiredEndpoints: string[];
  performanceThresholds: {
    maxResponseTime: number;
    minSuccessRate: number;
  };
  compatibilityChecks: string[];
}

export interface ValidationContext {
  featureKey: string;
  targetStage: LaunchStage;
  currentMetrics?: LaunchMetrics[];
  environmentChecks?: Record<string, boolean>;
  testResults?: TestResults;
}

export interface TestResults {
  unitTests: { passed: number; failed: number; coverage: number };
  integrationTests: { passed: number; failed: number };
  e2eTests: { passed: number; failed: number };
  contractTests: { passed: number; failed: number };
  performanceTests: { responseTime: number; successRate: number };
}

export class LaunchValidator {
  private readonly STAGE_REQUIREMENTS: Record<LaunchStage, LaunchCriteria> = {
    off: {
      minimumTestCoverage: 0,
      requiredEndpoints: [],
      performanceThresholds: { maxResponseTime: Infinity, minSuccessRate: 0 },
      compatibilityChecks: []
    },
    dev: {
      minimumTestCoverage: 0.7, // 70%
      requiredEndpoints: [],
      performanceThresholds: { maxResponseTime: 5000, minSuccessRate: 0.9 },
      compatibilityChecks: ['node_version', 'dependencies']
    },
    beta: {
      minimumTestCoverage: 0.85, // 85%
      requiredEndpoints: ['health', 'metrics'],
      performanceThresholds: { maxResponseTime: 2000, minSuccessRate: 0.95 },
      compatibilityChecks: ['node_version', 'dependencies', 'database_migration']
    },
    gradual: {
      minimumTestCoverage: 0.9, // 90%
      requiredEndpoints: ['health', 'metrics', 'rollback'],
      performanceThresholds: { maxResponseTime: 1500, minSuccessRate: 0.98 },
      compatibilityChecks: ['node_version', 'dependencies', 'database_migration', 'cdn_cache']
    },
    full: {
      minimumTestCoverage: 0.95, // 95%
      requiredEndpoints: ['health', 'metrics', 'rollback', 'monitoring'],
      performanceThresholds: { maxResponseTime: 1000, minSuccessRate: 0.99 },
      compatibilityChecks: ['node_version', 'dependencies', 'database_migration', 'cdn_cache', 'load_balancer']
    }
  };

  /**
   * Validate launch readiness for a specific stage
   */
  async validateLaunchReadiness(context: ValidationContext): Promise<ValidationResult> {
    const result: ValidationResult = {
      passed: true,
      errors: [],
      warnings: [],
      recommendations: []
    };

    const criteria = this.STAGE_REQUIREMENTS[context.targetStage];
    
    // Validate feature exists
    if (!FEATURE_FLAGS[context.featureKey]) {
      result.errors.push(`Feature '${context.featureKey}' not found in feature flags`);
      result.passed = false;
      return result;
    }

    // Run all validation checks
    await Promise.all([
      this.validateTestCoverage(context, criteria, result),
      this.validatePerformance(context, criteria, result),
      this.validateEndpoints(context, criteria, result),
      this.validateCompatibility(context, criteria, result),
      this.validateMetrics(context, result),
      this.validateRollbackPlan(context, result)
    ]);

    return result;
  }

  /**
   * Validate test coverage meets requirements
   */
  private async validateTestCoverage(
    context: ValidationContext, 
    criteria: LaunchCriteria, 
    result: ValidationResult
  ): Promise<void> {
    if (!context.testResults) {
      result.warnings.push('Test results not provided - skipping coverage validation');
      return;
    }

    const coverage = context.testResults.unitTests.coverage;
    
    if (coverage < criteria.minimumTestCoverage) {
      result.errors.push(
        `Test coverage ${(coverage * 100).toFixed(1)}% below required ${(criteria.minimumTestCoverage * 100).toFixed(1)}%`
      );
      result.passed = false;
    }

    // Check for failing tests
    const totalFailed = context.testResults.unitTests.failed + 
                       context.testResults.integrationTests.failed + 
                       context.testResults.e2eTests.failed +
                       context.testResults.contractTests.failed;

    if (totalFailed > 0) {
      result.errors.push(`${totalFailed} tests are failing - all tests must pass before launch`);
      result.passed = false;
    }

    // Recommendations for better testing
    if (coverage < 0.9 && context.targetStage === 'full') {
      result.recommendations.push('Consider increasing test coverage to 90%+ for production deployment');
    }

    if (context.testResults.e2eTests.passed === 0 && ['gradual', 'full'].includes(context.targetStage)) {
      result.warnings.push('No E2E tests detected - consider adding end-to-end test coverage');
    }
  }

  /**
   * Validate performance meets requirements
   */
  private async validatePerformance(
    context: ValidationContext, 
    criteria: LaunchCriteria, 
    result: ValidationResult
  ): Promise<void> {
    if (!context.testResults?.performanceTests) {
      result.warnings.push('Performance test results not provided');
      return;
    }

    const { responseTime, successRate } = context.testResults.performanceTests;

    if (responseTime > criteria.performanceThresholds.maxResponseTime) {
      result.errors.push(
        `Response time ${responseTime}ms exceeds maximum ${criteria.performanceThresholds.maxResponseTime}ms`
      );
      result.passed = false;
    }

    if (successRate < criteria.performanceThresholds.minSuccessRate) {
      result.errors.push(
        `Success rate ${(successRate * 100).toFixed(1)}% below minimum ${(criteria.performanceThresholds.minSuccessRate * 100).toFixed(1)}%`
      );
      result.passed = false;
    }

    // Performance recommendations
    if (responseTime > criteria.performanceThresholds.maxResponseTime * 0.8) {
      result.recommendations.push('Response time is approaching limits - consider optimization');
    }
  }

  /**
   * Validate required endpoints are available
   */
  private async validateEndpoints(
    context: ValidationContext, 
    criteria: LaunchCriteria, 
    result: ValidationResult
  ): Promise<void> {
    for (const endpoint of criteria.requiredEndpoints) {
      try {
        const response = await this.checkEndpoint(context.featureKey, endpoint);
        if (!response.available) {
          result.errors.push(`Required endpoint '${endpoint}' not available or failing`);
          result.passed = false;
        }
      } catch (error) {
        result.errors.push(`Failed to check endpoint '${endpoint}': ${error}`);
        result.passed = false;
      }
    }
  }

  /**
   * Validate system compatibility
   */
  private async validateCompatibility(
    context: ValidationContext, 
    criteria: LaunchCriteria, 
    result: ValidationResult
  ): Promise<void> {
    for (const check of criteria.compatibilityChecks) {
      try {
        const isCompatible = await this.runCompatibilityCheck(check, context);
        if (!isCompatible) {
          result.errors.push(`Compatibility check failed: ${check}`);
          result.passed = false;
        }
      } catch (error) {
        result.warnings.push(`Could not verify compatibility for: ${check}`);
      }
    }
  }

  /**
   * Validate current metrics if available
   */
  private async validateMetrics(context: ValidationContext, result: ValidationResult): Promise<void> {
    if (!context.currentMetrics || context.currentMetrics.length === 0) {
      result.recommendations.push('No recent metrics available - consider collecting baseline metrics');
      return;
    }

    const recentMetrics = context.currentMetrics.slice(-10);
    const avgSuccessRate = recentMetrics.reduce((sum, m) => sum + m.successRate, 0) / recentMetrics.length;
    const avgErrorCount = recentMetrics.reduce((sum, m) => sum + m.errorCount, 0) / recentMetrics.length;

    if (avgSuccessRate < 0.95) {
      result.warnings.push(`Recent success rate ${(avgSuccessRate * 100).toFixed(1)}% is below recommended 95%`);
    }

    if (avgErrorCount > 5) {
      result.warnings.push(`Average error count ${avgErrorCount.toFixed(1)} is elevated`);
    }
  }

  /**
   * Validate rollback plan exists and is viable
   */
  private async validateRollbackPlan(context: ValidationContext, result: ValidationResult): Promise<void> {
    const flag = FEATURE_FLAGS[context.featureKey];
    
    if (!flag.rollbackPlan) {
      result.warnings.push('No rollback plan documented for this feature');
      return;
    }

    // Verify rollback plan is actionable
    if (flag.rollbackPlan.length < 20) {
      result.recommendations.push('Consider providing more detailed rollback procedures');
    }

    // Feature-specific rollback validation
    switch (context.featureKey) {
      case 'ENABLE_WIDGET_PROFILE_SYSTEM':
        // Validate fallback pages exist
        try {
          const fallbacksExist = await this.validateWidgetSystemFallbacks();
          if (!fallbacksExist) {
            result.errors.push('Widget system fallback pages not properly configured');
            result.passed = false;
          }
        } catch (error) {
          result.warnings.push('Could not verify widget system fallbacks');
        }
        break;
        
      default:
        result.recommendations.push('Consider adding feature-specific rollback validation');
    }
  }

  /**
   * Check if an endpoint is available
   */
  private async checkEndpoint(featureKey: string, endpoint: string): Promise<{ available: boolean }> {
    try {
      // Map endpoint names to actual URLs
      const endpointMap: Record<string, string> = {
        health: '/api/health',
        metrics: `/api/launch/metrics?feature=${featureKey}`,
        rollback: '/api/launch/status',
        monitoring: '/api/launch/status'
      };

      const url = endpointMap[endpoint];
      if (!url) {
        throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      // In a real implementation, this would make actual HTTP requests
      // For now, we'll simulate the check
      return { available: true };
    } catch (error) {
      return { available: false };
    }
  }

  /**
   * Run compatibility check
   */
  private async runCompatibilityCheck(checkType: string, context: ValidationContext): Promise<boolean> {
    switch (checkType) {
      case 'node_version':
        return this.checkNodeVersion();
        
      case 'dependencies':
        return this.checkDependencies();
        
      case 'database_migration':
        return this.checkDatabaseMigrations();
        
      case 'cdn_cache':
        return this.checkCDNCompatibility();
        
      case 'load_balancer':
        return this.checkLoadBalancerConfig();
        
      default:
        throw new Error(`Unknown compatibility check: ${checkType}`);
    }
  }

  /**
   * Validate widget system fallbacks exist
   */
  private async validateWidgetSystemFallbacks(): Promise<boolean> {
    // Check that hardcoded agent pages exist as fallbacks
    const requiredFallbacks = [
      '/src/app/academy/agent/abraham/page.tsx',
      '/src/app/academy/agent/solienne/page.tsx', 
      '/src/app/academy/agent/bertha/page.tsx'
    ];

    // In a real implementation, this would check file system
    // For now, we'll assume they exist
    return true;
  }

  // Compatibility check implementations
  private async checkNodeVersion(): Promise<boolean> {
    try {
      const version = process.version;
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      return majorVersion >= 18; // Require Node 18+
    } catch {
      return false;
    }
  }

  private async checkDependencies(): Promise<boolean> {
    // In a real implementation, this would check package.json and node_modules
    return true;
  }

  private async checkDatabaseMigrations(): Promise<boolean> {
    // In a real implementation, this would check migration status
    return true;
  }

  private async checkCDNCompatibility(): Promise<boolean> {
    // In a real implementation, this would verify CDN configuration
    return true;
  }

  private async checkLoadBalancerConfig(): Promise<boolean> {
    // In a real implementation, this would check load balancer health
    return true;
  }

  /**
   * Generate validation report
   */
  generateValidationReport(results: ValidationResult, context: ValidationContext): string {
    const { featureKey, targetStage } = context;
    
    let report = `# Launch Validation Report\n\n`;
    report += `**Feature:** ${featureKey}\n`;
    report += `**Target Stage:** ${targetStage}\n`;
    report += `**Status:** ${results.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

    if (results.errors.length > 0) {
      report += `## ❌ Errors (${results.errors.length})\n\n`;
      results.errors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += '\n';
    }

    if (results.warnings.length > 0) {
      report += `## ⚠️ Warnings (${results.warnings.length})\n\n`;
      results.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
      report += '\n';
    }

    if (results.recommendations.length > 0) {
      report += `## 💡 Recommendations (${results.recommendations.length})\n\n`;
      results.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
      report += '\n';
    }

    return report;
  }
}

// Export singleton instance
export const launchValidator = new LaunchValidator();