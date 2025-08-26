#!/usr/bin/env node

/**
 * Production Readiness Validation Script
 * Comprehensive pre-deployment checks for Registry integration
 * Validates all services are ready for production deployment
 */

const { spawn } = require('child_process');
const https = require('https');
const http = require('http');

class ProductionReadinessValidator {
  constructor() {
    this.results = {
      environment: [],
      registry: [],
      services: [],
      data: [],
      security: [],
      performance: []
    };
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('🔍 Eden Academy Production Readiness Validation');
    console.log('================================================\n');

    await this.validateEnvironment();
    await this.validateRegistryHealth();
    await this.validateServiceIntegration();
    await this.validateDataIntegrity();
    await this.validateSecurity();
    await this.validatePerformance();

    this.generateReport();
  }

  async validateEnvironment() {
    console.log('🌍 Environment Configuration');
    console.log('-----------------------------');

    const requiredEnvVars = [
      'NODE_ENV',
      'REGISTRY_BASE_URL', 
      'USE_REGISTRY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    const productionEnvVars = [
      'REGISTRY_API_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXTAUTH_SECRET',
      'VERCEL_URL'
    ];

    // Check required environment variables
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        this.results.environment.push(`✅ ${envVar} is set`);
      } else {
        this.errors.push(`❌ Missing required environment variable: ${envVar}`);
        this.results.environment.push(`❌ ${envVar} is missing`);
      }
    });

    // Check production-specific variables
    if (process.env.NODE_ENV === 'production') {
      productionEnvVars.forEach(envVar => {
        if (process.env[envVar]) {
          this.results.environment.push(`✅ ${envVar} is set (production)`);
        } else {
          this.warnings.push(`⚠️  Production environment variable missing: ${envVar}`);
          this.results.environment.push(`⚠️  ${envVar} is missing (production)`);
        }
      });
    }

    // Validate environment configuration
    if (process.env.USE_REGISTRY !== 'true') {
      this.errors.push('❌ USE_REGISTRY must be "true" for production deployment');
      this.results.environment.push('❌ USE_REGISTRY is not enabled');
    } else {
      this.results.environment.push('✅ USE_REGISTRY is enabled');
    }

    console.log(`   Checked ${requiredEnvVars.length} required variables`);
    console.log(`   Checked ${productionEnvVars.length} production variables\n`);
  }

  async validateRegistryHealth() {
    console.log('🏥 Registry Health & Connectivity');
    console.log('----------------------------------');

    const registryUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3005';
    
    try {
      // Health check
      const healthResponse = await this.makeRequest(`${registryUrl}/api/v1/health`);
      if (healthResponse.ok) {
        this.results.registry.push('✅ Registry health endpoint responding');
      } else {
        this.errors.push(`❌ Registry health check failed: ${healthResponse.status}`);
        this.results.registry.push(`❌ Registry health check failed (${healthResponse.status})`);
      }

      // Test critical endpoints
      const criticalEndpoints = [
        '/api/v1/agents',
        '/api/v1/agents/amanda',
        '/api/v1/agents/amanda/profile'
      ];

      for (const endpoint of criticalEndpoints) {
        try {
          const response = await this.makeRequest(`${registryUrl}${endpoint}`);
          if (response.ok) {
            this.results.registry.push(`✅ ${endpoint} responding`);
          } else {
            this.errors.push(`❌ Critical endpoint failed: ${endpoint} (${response.status})`);
            this.results.registry.push(`❌ ${endpoint} failed (${response.status})`);
          }
        } catch (error) {
          this.errors.push(`❌ Critical endpoint error: ${endpoint} - ${error.message}`);
          this.results.registry.push(`❌ ${endpoint} error: ${error.message}`);
        }
      }

      // Test response times
      const startTime = Date.now();
      await this.makeRequest(`${registryUrl}/api/v1/agents`);
      const responseTime = Date.now() - startTime;

      if (responseTime < 1000) {
        this.results.registry.push(`✅ Response time acceptable (${responseTime}ms)`);
      } else if (responseTime < 3000) {
        this.warnings.push(`⚠️  Registry response time slow: ${responseTime}ms`);
        this.results.registry.push(`⚠️  Response time slow (${responseTime}ms)`);
      } else {
        this.errors.push(`❌ Registry response time too slow: ${responseTime}ms`);
        this.results.registry.push(`❌ Response time too slow (${responseTime}ms)`);
      }

    } catch (error) {
      this.errors.push(`❌ Registry connectivity failed: ${error.message}`);
      this.results.registry.push(`❌ Connectivity failed: ${error.message}`);
    }

    console.log(`   Tested Registry connectivity and performance\n`);
  }

  async validateServiceIntegration() {
    console.log('🔗 Service Integration');
    console.log('----------------------');

    // Test Registry client configuration
    try {
      const { registryClient } = require('../src/lib/registry/client');
      
      if (registryClient.isEnabled()) {
        this.results.services.push('✅ Registry client is enabled');
      } else {
        this.errors.push('❌ Registry client is not enabled');
        this.results.services.push('❌ Registry client is not enabled');
      }

      // Test health monitor
      const { registryHealthMonitor } = require('../src/lib/registry/health-monitor');
      const health = await registryHealthMonitor.performHealthCheck();
      
      if (health.success) {
        this.results.services.push('✅ Health monitor functional');
      } else {
        this.errors.push(`❌ Health monitor failed: ${health.error}`);
        this.results.services.push(`❌ Health monitor failed: ${health.error}`);
      }

    } catch (error) {
      this.errors.push(`❌ Service integration error: ${error.message}`);
      this.results.services.push(`❌ Integration error: ${error.message}`);
    }

    // Test feature flags
    try {
      const { featureFlags } = require('../src/config/flags');
      const allFlags = featureFlags.getAllFlags();
      
      const registryFlags = Object.keys(allFlags).filter(flag => 
        flag.toLowerCase().includes('registry')
      );
      
      if (registryFlags.length > 0) {
        this.results.services.push(`✅ Registry feature flags configured (${registryFlags.length})`);
      } else {
        this.warnings.push('⚠️  No Registry-specific feature flags found');
        this.results.services.push('⚠️  No Registry feature flags found');
      }

    } catch (error) {
      this.errors.push(`❌ Feature flags validation failed: ${error.message}`);
      this.results.services.push(`❌ Feature flags error: ${error.message}`);
    }

    console.log('   Validated service integrations and configurations\n');
  }

  async validateDataIntegrity() {
    console.log('💾 Data Integrity');
    console.log('-----------------');

    try {
      const { registryClient } = require('../src/lib/registry/client');

      // Test Amanda agent data completeness
      const amanda = await registryClient.getAgent('amanda', ['profile', 'capabilities']);
      
      const requiredFields = ['id', 'handle', 'name', 'role', 'cohort', 'status'];
      const missingFields = requiredFields.filter(field => !amanda[field]);
      
      if (missingFields.length === 0) {
        this.results.data.push('✅ Amanda core data complete');
      } else {
        this.errors.push(`❌ Amanda missing required fields: ${missingFields.join(', ')}`);
        this.results.data.push(`❌ Amanda missing fields: ${missingFields.join(', ')}`);
      }

      // Test profile completeness
      if (amanda.profile?.bio && amanda.profile?.avatar_url) {
        this.results.data.push('✅ Amanda profile complete');
      } else {
        this.warnings.push('⚠️  Amanda profile incomplete (missing bio or avatar)');
        this.results.data.push('⚠️  Amanda profile incomplete');
      }

      // Test capabilities
      if (Array.isArray(amanda.capabilities) && amanda.capabilities.length > 0) {
        this.results.data.push('✅ Amanda capabilities defined');
      } else {
        this.warnings.push('⚠️  Amanda capabilities not defined');
        this.results.data.push('⚠️  Amanda capabilities not defined');
      }

      // Test operational configuration
      if (amanda.operational_config) {
        this.results.data.push('✅ Amanda operational config present');
      } else {
        this.errors.push('❌ Amanda operational config missing');
        this.results.data.push('❌ Amanda operational config missing');
      }

      // Test all agents have required fields
      const agents = await registryClient.getAgents();
      const incompleteAgents = agents.filter(agent => 
        !agent.id || !agent.handle || !agent.name || !agent.role
      );

      if (incompleteAgents.length === 0) {
        this.results.data.push(`✅ All ${agents.length} agents have complete data`);
      } else {
        this.errors.push(`❌ ${incompleteAgents.length} agents have incomplete data`);
        this.results.data.push(`❌ ${incompleteAgents.length} agents incomplete`);
      }

    } catch (error) {
      this.errors.push(`❌ Data integrity validation failed: ${error.message}`);
      this.results.data.push(`❌ Validation failed: ${error.message}`);
    }

    console.log('   Validated Registry data integrity\n');
  }

  async validateSecurity() {
    console.log('🔒 Security Configuration');
    console.log('-------------------------');

    // Check HTTPS configuration
    const registryUrl = process.env.REGISTRY_BASE_URL || '';
    
    if (registryUrl.startsWith('https://')) {
      this.results.security.push('✅ Registry URL uses HTTPS');
    } else if (registryUrl.startsWith('http://localhost')) {
      this.warnings.push('⚠️  Registry URL uses HTTP (localhost - acceptable for development)');
      this.results.security.push('⚠️  Registry URL uses HTTP (development)');
    } else {
      this.errors.push('❌ Registry URL should use HTTPS in production');
      this.results.security.push('❌ Registry URL not using HTTPS');
    }

    // Check API key configuration
    if (process.env.REGISTRY_API_KEY) {
      this.results.security.push('✅ Registry API key configured');
    } else if (process.env.NODE_ENV === 'production') {
      this.errors.push('❌ Registry API key required for production');
      this.results.security.push('❌ Registry API key missing (production)');
    } else {
      this.warnings.push('⚠️  Registry API key not configured (development)');
      this.results.security.push('⚠️  Registry API key not configured');
    }

    // Check environment variable security
    const sensitiveVars = ['REGISTRY_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXTAUTH_SECRET'];
    sensitiveVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        if (value.length >= 32) {
          this.results.security.push(`✅ ${varName} has adequate length`);
        } else {
          this.warnings.push(`⚠️  ${varName} may be too short for security`);
          this.results.security.push(`⚠️  ${varName} potentially weak`);
        }
      }
    });

    console.log('   Validated security configurations\n');
  }

  async validatePerformance() {
    console.log('⚡ Performance Requirements');
    console.log('---------------------------');

    try {
      const { registryClient } = require('../src/lib/registry/client');

      // Test single request performance
      const singleRequestStart = Date.now();
      await registryClient.getAgent('amanda');
      const singleRequestTime = Date.now() - singleRequestStart;

      if (singleRequestTime < 500) {
        this.results.performance.push(`✅ Single request performance excellent (${singleRequestTime}ms)`);
      } else if (singleRequestTime < 1000) {
        this.results.performance.push(`✅ Single request performance good (${singleRequestTime}ms)`);
      } else if (singleRequestTime < 2000) {
        this.warnings.push(`⚠️  Single request performance slow: ${singleRequestTime}ms`);
        this.results.performance.push(`⚠️  Single request slow (${singleRequestTime}ms)`);
      } else {
        this.errors.push(`❌ Single request too slow: ${singleRequestTime}ms`);
        this.results.performance.push(`❌ Single request too slow (${singleRequestTime}ms)`);
      }

      // Test concurrent request performance
      const concurrentStart = Date.now();
      const concurrentPromises = Array.from({ length: 5 }, () => 
        registryClient.getAgent('amanda')
      );
      await Promise.all(concurrentPromises);
      const concurrentTime = Date.now() - concurrentStart;
      const avgConcurrentTime = concurrentTime / 5;

      if (avgConcurrentTime < 800) {
        this.results.performance.push(`✅ Concurrent requests efficient (${avgConcurrentTime.toFixed(0)}ms avg)`);
      } else if (avgConcurrentTime < 1500) {
        this.warnings.push(`⚠️  Concurrent requests moderately slow: ${avgConcurrentTime.toFixed(0)}ms avg`);
        this.results.performance.push(`⚠️  Concurrent requests slow (${avgConcurrentTime.toFixed(0)}ms avg)`);
      } else {
        this.errors.push(`❌ Concurrent requests too slow: ${avgConcurrentTime.toFixed(0)}ms avg`);
        this.results.performance.push(`❌ Concurrent requests too slow (${avgConcurrentTime.toFixed(0)}ms avg)`);
      }

    } catch (error) {
      this.errors.push(`❌ Performance validation failed: ${error.message}`);
      this.results.performance.push(`❌ Performance validation failed: ${error.message}`);
    }

    console.log('   Validated performance requirements\n');
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https://') ? https : http;
      
      const req = client.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  generateReport() {
    console.log('📋 Production Readiness Report');
    console.log('===============================\n');

    const categories = [
      { name: 'Environment', key: 'environment', icon: '🌍' },
      { name: 'Registry', key: 'registry', icon: '🏥' },
      { name: 'Services', key: 'services', icon: '🔗' },
      { name: 'Data', key: 'data', icon: '💾' },
      { name: 'Security', key: 'security', icon: '🔒' },
      { name: 'Performance', key: 'performance', icon: '⚡' }
    ];

    categories.forEach(category => {
      console.log(`${category.icon} ${category.name}`);
      console.log('-'.repeat(category.name.length + 2));
      
      const results = this.results[category.key];
      if (results.length > 0) {
        results.forEach(result => console.log(`   ${result}`));
      } else {
        console.log('   No validations performed');
      }
      console.log('');
    });

    // Overall summary
    const totalErrors = this.errors.length;
    const totalWarnings = this.warnings.length;

    console.log('🎯 Overall Assessment');
    console.log('=====================');

    if (totalErrors === 0 && totalWarnings === 0) {
      console.log('🎉 ✅ PRODUCTION READY');
      console.log('   All validations passed. System is ready for deployment.');
    } else if (totalErrors === 0) {
      console.log('⚠️  🟡 PRODUCTION READY WITH WARNINGS');
      console.log(`   ${totalWarnings} warning(s) found, but no blockers.`);
      console.log('   Review warnings before deployment.');
    } else {
      console.log('❌ 🔴 NOT PRODUCTION READY');
      console.log(`   ${totalErrors} error(s) must be resolved before deployment.`);
      if (totalWarnings > 0) {
        console.log(`   ${totalWarnings} warning(s) should also be reviewed.`);
      }
    }

    console.log('');

    if (totalErrors > 0) {
      console.log('🚨 Critical Issues (must fix):');
      this.errors.forEach(error => console.log(`   ${error}`));
      console.log('');
    }

    if (totalWarnings > 0) {
      console.log('⚠️  Warnings (should review):');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
      console.log('');
    }

    // Exit with appropriate code
    process.exit(totalErrors > 0 ? 1 : 0);
  }
}

// Run validation
const validator = new ProductionReadinessValidator();
validator.validate().catch(error => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});