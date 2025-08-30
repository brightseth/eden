#!/usr/bin/env npx tsx
// EMERGENCY VALIDATION SCRIPT - COVENANT WITNESS REGISTRY
// Critical Path: HOUR 18-24 - End-to-end system validation before founding witness recruitment

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface ValidationResult {
  component: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
}

class WitnessRegistryValidator {
  private results: ValidationResult[] = [];

  async validateSystem(): Promise<boolean> {
    console.log('🎯 COVENANT WITNESS REGISTRY - SYSTEM VALIDATION');
    console.log('=' .repeat(60));
    console.log('📅 LAUNCH TARGET: October 19, 2025 (00:00:00 EDT)');
    console.log('🎯 WITNESS TARGET: 100 Founding Witnesses');
    console.log('⏰ CURRENT TIME:', new Date().toISOString());
    console.log('');

    await this.validateDatabase();
    await this.validateAPIs();
    await this.validateEmailSystem();
    await this.validateFrontendComponents();
    await this.validateSmartContractIntegration();
    await this.validateLaunchReadiness();

    this.printResults();
    return this.results.every(r => r.status !== 'FAIL');
  }

  private async validateDatabase(): Promise<void> {
    console.log('💾 VALIDATING DATABASE LAYER...');
    
    try {
      // Test covenant_witnesses table
      const { data: witnesses, error: witnessError, count } = await supabase
        .from('covenant_witnesses')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .limit(5);

      if (witnessError) {
        this.addResult('Database', 'FAIL', `covenant_witnesses table error: ${witnessError.message}`);
        return;
      }

      this.addResult('Database', 'PASS', `covenant_witnesses table operational (${count || 0} active witnesses)`);

      // Test witness_notifications table
      const { data: notifications, error: notifError } = await supabase
        .from('witness_notifications')
        .select('*')
        .limit(1);

      if (notifError) {
        this.addResult('Database', 'FAIL', `witness_notifications table error: ${notifError.message}`);
        return;
      }

      this.addResult('Database', 'PASS', 'witness_notifications table operational');

      // Test covenant_events table
      const { data: events, error: eventsError } = await supabase
        .from('covenant_events')
        .select('*')
        .limit(1);

      if (eventsError) {
        this.addResult('Database', 'FAIL', `covenant_events table error: ${eventsError.message}`);
        return;
      }

      this.addResult('Database', 'PASS', 'covenant_events table operational');

      // Test database functions
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_witness_count');

      if (statsError) {
        this.addResult('Database', 'WARNING', `get_witness_count function error: ${statsError.message}`);
      } else {
        this.addResult('Database', 'PASS', `Database functions operational (${JSON.stringify(statsData)})`);
      }

    } catch (error: any) {
      this.addResult('Database', 'FAIL', `Database connection failed: ${error.message}`);
    }
  }

  private async validateAPIs(): Promise<void> {
    console.log('🌐 VALIDATING API ENDPOINTS...');

    try {
      // Test GET /api/covenant/witnesses
      const witnessResponse = await fetch(`${BASE_URL}/api/covenant/witnesses?includeStats=true`);
      if (witnessResponse.ok) {
        const witnessData = await witnessResponse.json();
        this.addResult('API', 'PASS', `GET /api/covenant/witnesses operational (${witnessData.total} witnesses)`);
        
        // Validate stats structure
        if (witnessData.stats && typeof witnessData.stats.percentComplete === 'number') {
          this.addResult('API', 'PASS', `Statistics calculation working (${witnessData.stats.percentComplete}% complete)`);
        } else {
          this.addResult('API', 'WARNING', 'Statistics structure incomplete');
        }
      } else {
        this.addResult('API', 'FAIL', `GET /api/covenant/witnesses failed (${witnessResponse.status})`);
      }

      // Test GET /api/covenant/notifications
      const notificationResponse = await fetch(`${BASE_URL}/api/covenant/notifications?limit=1`);
      if (notificationResponse.ok) {
        this.addResult('API', 'PASS', 'GET /api/covenant/notifications operational');
      } else {
        this.addResult('API', 'FAIL', `GET /api/covenant/notifications failed (${notificationResponse.status})`);
      }

      // Test POST /api/covenant/witnesses (validation only)
      const testRegistration = {
        address: '0x0000000000000000000000000000000000000000', // Invalid but formatted
        transaction_hash: '0x' + '0'.repeat(64),
        signed_at: new Date().toISOString()
      };

      const registrationResponse = await fetch(`${BASE_URL}/api/covenant/witnesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testRegistration)
      });

      // Should fail due to invalid address, but API should be responsive
      if (registrationResponse.status === 409 || registrationResponse.status === 400) {
        this.addResult('API', 'PASS', 'POST /api/covenant/witnesses validation working');
      } else {
        this.addResult('API', 'WARNING', `POST /api/covenant/witnesses unexpected response (${registrationResponse.status})`);
      }

    } catch (error: any) {
      this.addResult('API', 'FAIL', `API validation failed: ${error.message}`);
    }
  }

  private async validateEmailSystem(): Promise<void> {
    console.log('📧 VALIDATING EMAIL SYSTEM...');

    try {
      // Test email service file exists
      const fs = await import('fs');
      const path = await import('path');
      
      const emailServicePath = path.join(process.cwd(), 'src', 'lib', 'covenant', 'email-notifications.ts');
      if (fs.existsSync(emailServicePath)) {
        this.addResult('Email', 'PASS', 'Email service file exists');
      } else {
        this.addResult('Email', 'FAIL', 'Email service file missing');
        return;
      }

      // Test notification API endpoints
      const testNotificationData = {
        type: 'batch_test',
        testType: 'welcome',
        testEmails: ['validation@test.com']
      };

      const notificationResponse = await fetch(`${BASE_URL}/api/covenant/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testNotificationData)
      });

      if (notificationResponse.ok) {
        const result = await notificationResponse.json();
        if (result.success) {
          this.addResult('Email', 'PASS', 'Email notification system operational');
        } else {
          this.addResult('Email', 'WARNING', 'Email notification system responded but may have issues');
        }
      } else {
        this.addResult('Email', 'FAIL', `Email notification API failed (${notificationResponse.status})`);
      }

      // Test emergency notification endpoint
      const emergencyData = {
        type: 'emergency',
        urgencyLevel: 'info',
        subject: 'VALIDATION TEST',
        message: 'System validation test - ignore',
        actionRequired: 'No action required'
      };

      const emergencyResponse = await fetch(`${BASE_URL}/api/covenant/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emergencyData)
      });

      if (emergencyResponse.ok) {
        this.addResult('Email', 'PASS', 'Emergency notification system operational');
      } else {
        this.addResult('Email', 'WARNING', 'Emergency notification system may have issues');
      }

    } catch (error: any) {
      this.addResult('Email', 'FAIL', `Email system validation failed: ${error.message}`);
    }
  }

  private async validateFrontendComponents(): Promise<void> {
    console.log('🎨 VALIDATING FRONTEND COMPONENTS...');

    try {
      // Test covenant landing page
      const covenantPageResponse = await fetch(`${BASE_URL}/covenant`);
      if (covenantPageResponse.ok) {
        this.addResult('Frontend', 'PASS', 'Covenant landing page accessible');
      } else {
        this.addResult('Frontend', 'WARNING', `Covenant page status: ${covenantPageResponse.status}`);
      }

      // Test witness registry page
      const registryPageResponse = await fetch(`${BASE_URL}/covenant/witness-registry`);
      if (registryPageResponse.ok) {
        this.addResult('Frontend', 'PASS', 'Witness registry page accessible');
      } else {
        this.addResult('Frontend', 'WARNING', `Witness registry page status: ${registryPageResponse.status}`);
      }

      // Test dashboard page
      const dashboardResponse = await fetch(`${BASE_URL}/covenant/dashboard`);
      if (dashboardResponse.ok) {
        this.addResult('Frontend', 'PASS', 'Covenant dashboard accessible');
      } else {
        this.addResult('Frontend', 'WARNING', `Covenant dashboard status: ${dashboardResponse.status}`);
      }

    } catch (error: any) {
      this.addResult('Frontend', 'WARNING', `Frontend validation partial: ${error.message}`);
    }
  }

  private async validateSmartContractIntegration(): Promise<void> {
    console.log('⚡ VALIDATING SMART CONTRACT INTEGRATION...');

    try {
      // Check if Web3 integration files exist
      const fs = await import('fs');
      const path = await import('path');

      const contractPath = path.join(process.cwd(), 'contracts', 'AbrahamCovenant.sol');
      if (fs.existsSync(contractPath)) {
        this.addResult('Smart Contract', 'PASS', 'Smart contract file exists');
      } else {
        this.addResult('Smart Contract', 'FAIL', 'Smart contract file missing');
      }

      // Check for Web3 integration components
      const web3ComponentPath = path.join(process.cwd(), 'src', 'components', 'covenant', 'WitnessRegistryInterface.tsx');
      if (fs.existsSync(web3ComponentPath)) {
        this.addResult('Smart Contract', 'PASS', 'Web3 integration components exist');
      } else {
        this.addResult('Smart Contract', 'FAIL', 'Web3 integration components missing');
      }

      // Check environment variables for Web3
      if (process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL) {
        this.addResult('Smart Contract', 'PASS', 'Ethereum RPC URL configured');
      } else {
        this.addResult('Smart Contract', 'WARNING', 'Ethereum RPC URL not configured');
      }

    } catch (error: any) {
      this.addResult('Smart Contract', 'WARNING', `Smart contract validation partial: ${error.message}`);
    }
  }

  private async validateLaunchReadiness(): Promise<void> {
    console.log('🚀 VALIDATING LAUNCH READINESS...');

    try {
      // Get current witness statistics
      const { data: witnesses, count } = await supabase
        .from('covenant_witnesses')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      const totalWitnesses = count || 0;
      const targetWitnesses = 100;
      const percentComplete = Math.round((totalWitnesses / targetWitnesses) * 100);

      // Calculate days to launch
      const launchDate = new Date('2025-10-19T00:00:00-04:00');
      const now = new Date();
      const daysRemaining = Math.ceil((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Determine critical status
      let criticalStatus: string;
      if (percentComplete >= 100) {
        criticalStatus = 'LAUNCH READY';
      } else if (daysRemaining <= 7 && percentComplete < 75) {
        criticalStatus = 'CRITICAL';
      } else if (percentComplete < 50) {
        criticalStatus = 'CRITICAL';
      } else if (percentComplete < 75) {
        criticalStatus = 'WARNING';
      } else {
        criticalStatus = 'PROGRESS';
      }

      this.addResult('Launch Readiness', 
        criticalStatus === 'CRITICAL' ? 'FAIL' : 
        criticalStatus === 'WARNING' ? 'WARNING' : 'PASS',
        `${totalWitnesses}/${targetWitnesses} witnesses (${percentComplete}%) - ${criticalStatus}`);

      this.addResult('Launch Timeline', 
        daysRemaining <= 0 ? 'FAIL' : 
        daysRemaining <= 7 ? 'WARNING' : 'PASS',
        `${daysRemaining} days until October 19, 2025`);

      // Calculate required daily witness rate
      if (daysRemaining > 0 && totalWitnesses < targetWitnesses) {
        const witnessesNeeded = targetWitnesses - totalWitnesses;
        const dailyRateNeeded = Math.ceil(witnessesNeeded / daysRemaining);
        
        this.addResult('Recruitment Rate',
          dailyRateNeeded > 5 ? 'FAIL' :
          dailyRateNeeded > 3 ? 'WARNING' : 'PASS',
          `Need ${witnessesNeeded} more witnesses (${dailyRateNeeded}/day required)`);
      }

      // Check recent witness activity
      const { data: recentWitnesses, count: recentCount } = await supabase
        .from('covenant_witnesses')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const weeklyRate = recentCount || 0;
      this.addResult('Recent Activity',
        weeklyRate === 0 ? 'WARNING' : 'PASS',
        `${weeklyRate} witnesses joined in last 7 days`);

    } catch (error: any) {
      this.addResult('Launch Readiness', 'FAIL', `Launch readiness check failed: ${error.message}`);
    }
  }

  private addResult(component: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: any): void {
    this.results.push({ component, status, message, details });
  }

  private printResults(): void {
    console.log('\n🎯 VALIDATION RESULTS');
    console.log('=' .repeat(60));

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;

    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : 
                   result.status === 'WARNING' ? '⚠️' : '❌';
      console.log(`${icon} ${result.component}: ${result.message}`);
    });

    console.log('\n📊 SUMMARY');
    console.log(`✅ PASSED: ${passed}`);
    console.log(`⚠️  WARNINGS: ${warnings}`);
    console.log(`❌ FAILED: ${failed}`);

    const overallStatus = failed === 0 ? 
      (warnings === 0 ? 'SYSTEM READY' : 'READY WITH WARNINGS') : 
      'SYSTEM NOT READY';

    console.log(`\n🎯 OVERALL STATUS: ${overallStatus}`);

    if (overallStatus === 'SYSTEM READY') {
      console.log('\n🚀 COVENANT WITNESS REGISTRY IS READY FOR FOUNDING WITNESS RECRUITMENT!');
      console.log('📧 Email notifications are operational');
      console.log('💾 Database is ready for 100+ witnesses');
      console.log('🌐 APIs are responsive and validated');
      console.log('⚡ Smart contract integration is prepared');
    } else if (overallStatus === 'READY WITH WARNINGS') {
      console.log('\n⚠️  SYSTEM IS FUNCTIONAL BUT HAS WARNINGS');
      console.log('🔧 Review warnings before full launch');
      console.log('✅ Core witness registration flow is operational');
    } else {
      console.log('\n❌ CRITICAL ISSUES MUST BE RESOLVED BEFORE LAUNCH');
      console.log('🚨 DO NOT PROCEED WITH FOUNDING WITNESS RECRUITMENT');
    }
  }
}

// Main execution
async function main() {
  const validator = new WitnessRegistryValidator();
  const systemReady = await validator.validateSystem();
  
  process.exit(systemReady ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}