/**
 * Launch Validation API
 * Endpoint for validating launch readiness before stage advancement
 */

import { NextRequest, NextResponse } from 'next/server';
import { launchValidator, type ValidationContext, type TestResults } from '@/lib/launch/validation';
import { FEATURE_FLAGS } from '@/config/flags';
import type { LaunchStage } from '@/lib/launch/staged-launch';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { featureKey, targetStage, testResults, environmentChecks, includeReport = false } = body;

    // Validate inputs
    if (!featureKey || !FEATURE_FLAGS[featureKey]) {
      return NextResponse.json(
        { error: 'Invalid feature key' }, 
        { status: 400 }
      );
    }

    if (!targetStage || !['off', 'dev', 'beta', 'gradual', 'full'].includes(targetStage)) {
      return NextResponse.json(
        { error: 'Invalid target stage' }, 
        { status: 400 }
      );
    }

    // Build validation context
    const context: ValidationContext = {
      featureKey,
      targetStage: targetStage as LaunchStage,
      environmentChecks,
      testResults: testResults as TestResults
    };

    // Run validation
    const results = await launchValidator.validateLaunchReadiness(context);

    const response: any = {
      featureKey,
      targetStage,
      validation: {
        passed: results.passed,
        errorCount: results.errors.length,
        warningCount: results.warnings.length,
        recommendationCount: results.recommendations.length
      },
      errors: results.errors,
      warnings: results.warnings,
      recommendations: results.recommendations,
      timestamp: new Date().toISOString()
    };

    // Include detailed report if requested
    if (includeReport) {
      response.report = launchValidator.generateValidationReport(results, context);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Launch Validation API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const featureKey = url.searchParams.get('feature');
    const targetStage = url.searchParams.get('stage') as LaunchStage;

    if (!featureKey || !FEATURE_FLAGS[featureKey]) {
      return NextResponse.json(
        { error: 'Feature key required' }, 
        { status: 400 }
      );
    }

    if (!targetStage || !['off', 'dev', 'beta', 'gradual', 'full'].includes(targetStage)) {
      return NextResponse.json(
        { error: 'Valid target stage required' }, 
        { status: 400 }
      );
    }

    // Build basic validation context (without test results)
    const context: ValidationContext = {
      featureKey,
      targetStage
    };

    // Run basic validation (will show warnings for missing test data)
    const results = await launchValidator.validateLaunchReadiness(context);

    return NextResponse.json({
      featureKey,
      targetStage,
      validation: {
        passed: results.passed,
        errorCount: results.errors.length,
        warningCount: results.warnings.length,
        recommendationCount: results.recommendations.length
      },
      errors: results.errors,
      warnings: results.warnings,
      recommendations: results.recommendations,
      report: launchValidator.generateValidationReport(results, context),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Launch Validation API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}