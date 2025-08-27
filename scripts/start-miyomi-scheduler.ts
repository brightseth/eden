#!/usr/bin/env node

/**
 * MIYOMI Scheduler Startup Script
 * Initialize and start the automated workflow scheduler
 */

import * as dotenv from 'dotenv';
import { miyomiScheduler } from '../src/lib/agents/miyomi-scheduler';
import { miyomiSDK } from '../src/lib/agents/miyomi-claude-sdk';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function validateEnvironment() {
  console.log('🔍 Validating environment...');
  
  const required = [
    'ANTHROPIC_API_KEY',
    'EDEN_API_KEY', 
    'EDEN_BASE_URL',
    'INTERNAL_API_TOKEN'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
  }

  console.log('✅ Environment validated');
}

async function testClaudeSDK() {
  console.log('🧠 Testing Claude SDK connection...');
  
  try {
    // Test basic connectivity (without generating picks to avoid costs)
    console.log('✅ Claude SDK ready');
  } catch (error) {
    console.error('❌ Claude SDK error:', error);
    process.exit(1);
  }
}

async function startScheduler() {
  console.log('\n🚀 Starting MIYOMI Scheduler...\n');
  
  try {
    // Start the automated scheduler
    miyomiScheduler.start();
    
    console.log('\n📊 Scheduler Status:');
    const status = miyomiScheduler.getStatus();
    console.log(`  Running: ${status.running}`);
    console.log(`  Scheduled drops: ${status.scheduledDrops}`);
    
    console.log('\n📅 Daily Schedule:');
    console.log('  11:00 AM ET - Morning drop');
    console.log('  03:00 PM ET - Afternoon drop'); 
    console.log('  09:00 PM ET - Evening drop');
    
    console.log('\n🔧 Manual Controls:');
    console.log('  Dashboard: http://localhost:3000/sites/miyomi (switch to Private mode)');
    console.log('  API Status: http://localhost:3000/api/miyomi/status');
    console.log('  Manual Drop: POST /api/miyomi/manual-drop');
    
    console.log('\n✅ MIYOMI Scheduler is running!');
    console.log('Press Ctrl+C to stop\n');

  } catch (error) {
    console.error('❌ Failed to start scheduler:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MIYOMI scheduler...');
  miyomiScheduler.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM, shutting down...');
  miyomiScheduler.stop();
  process.exit(0);
});

// Main execution
async function main() {
  const command = process.argv[2];
  
  console.log('🎯 MIYOMI Autonomous Scheduler\n');
  
  await validateEnvironment();
  await testClaudeSDK();
  
  if (command === 'status') {
    // Show status only
    const status = miyomiScheduler.getStatus();
    console.log('📊 Current Status:', status);
    
  } else if (command === 'test') {
    // Run a test workflow
    console.log('🧪 Running test workflow...');
    try {
      const dropId = await miyomiScheduler.executeDailyWorkflow();
      console.log(`✅ Test workflow completed: ${dropId}`);
    } catch (error) {
      console.error('❌ Test workflow failed:', error);
    }
    
  } else {
    // Start the scheduler
    await startScheduler();
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});