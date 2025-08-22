#!/usr/bin/env node

// Daily Drop Scheduler
// Manages automated daily drops for all agents with timezone support

import * as cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { getStreakManager, StreakManager } from '../src/lib/streak-manager';
import { AGENT_CONFIGS } from '../src/lib/agent-config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const streakManager = getStreakManager(supabaseUrl, supabaseKey);

// Track scheduled tasks
const scheduledTasks: Map<string, cron.ScheduledTask> = new Map();

/**
 * Generate a daily drop for an agent
 */
async function generateDailyDrop(agentId: string): Promise<string | null> {
  try {
    console.log(`🎨 Generating daily drop for ${agentId}...`);
    
    // Check if practice has started
    const config = AGENT_CONFIGS[agentId];
    if (!config) {
      console.error(`No configuration found for ${agentId}`);
      return null;
    }
    
    const practiceStart = new Date(config.practice_start);
    const now = new Date();
    
    if (now < practiceStart) {
      console.log(`Practice hasn't started yet for ${agentId}. Starts: ${config.practice_start}`);
      return null;
    }
    
    // Calculate practice day
    const daysSincePracticeStart = Math.floor((now.getTime() - practiceStart.getTime()) / (1000 * 60 * 60 * 24));
    const practiceDay = daysSincePracticeStart + 1;
    
    // Get current drop count for drop number
    const { count: dropCount } = await supabase
      .from('drops')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .eq('drop_type', 'daily');
    
    const dropNumber = (dropCount || 0) + 1;
    
    // TODO: Integrate with actual generation pipeline
    // For now, create a placeholder drop
    const dropData = {
      agent_id: agentId,
      title: `${config.practice_name} Day ${practiceDay}`,
      description: `Daily drop #${dropNumber} from ${agentId}'s ${config.practice_name}`,
      image_url: `https://placeholder.com/${agentId}/${dropNumber}.jpg`, // Replace with actual generation
      drop_type: 'daily',
      practice_day: practiceDay,
      drop_number: dropNumber,
      practice_phase: practiceDay <= 100 ? 'training' : 'graduated',
      streak_day: 0, // Will be updated by streak manager
      metadata: {
        generated_at: new Date().toISOString(),
        timezone: config.timezone,
        practice_name: config.practice_name
      }
    };
    
    // Insert drop into database
    const { data: drop, error } = await supabase
      .from('drops')
      .insert(dropData)
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating drop for ${agentId}:`, error);
      return null;
    }
    
    // Update streak
    await streakManager.recordDrop(agentId, drop.id);
    
    console.log(`✓ Drop created for ${agentId}: Day ${practiceDay}, Drop #${dropNumber}`);
    return drop.id;
    
  } catch (error) {
    console.error(`Error generating drop for ${agentId}:`, error);
    return null;
  }
}

/**
 * Fallback drop generation with protection
 */
async function generateFallbackDrop(agentId: string): Promise<boolean> {
  console.log(`⚠️ Attempting fallback drop generation for ${agentId}...`);
  
  try {
    // Try different generation strategies
    const strategies = [
      () => generateWithAlternatePrompt(agentId),
      () => selectFromDraftPool(agentId),
      () => useBackupModel(agentId),
      () => createMinimalDrop(agentId)
    ];
    
    for (const strategy of strategies) {
      const dropId = await strategy();
      if (dropId) {
        console.log(`✓ Fallback successful for ${agentId} using strategy`);
        return true;
      }
    }
    
    // All strategies failed - activate protection
    console.log(`❌ All fallback strategies failed for ${agentId}. Activating protection...`);
    await streakManager.activateProtection(agentId, 24);
    await notifyEmergency(agentId, 'All drop generation strategies failed');
    
    return false;
  } catch (error) {
    console.error(`Error in fallback generation for ${agentId}:`, error);
    await streakManager.activateProtection(agentId, 24);
    return false;
  }
}

// Fallback strategies
async function generateWithAlternatePrompt(agentId: string): Promise<string | null> {
  // TODO: Implement alternate prompt generation
  return null;
}

async function selectFromDraftPool(agentId: string): Promise<string | null> {
  // TODO: Select from pre-generated drafts
  return null;
}

async function useBackupModel(agentId: string): Promise<string | null> {
  // TODO: Use backup LoRA or model
  return null;
}

async function createMinimalDrop(agentId: string): Promise<string | null> {
  // Create a minimal drop to maintain streak
  console.log(`Creating minimal drop for ${agentId}...`);
  
  const { data: drop, error } = await supabase
    .from('drops')
    .insert({
      agent_id: agentId,
      title: `Emergency Drop - ${new Date().toISOString().split('T')[0]}`,
      description: 'Automated drop to maintain streak',
      image_url: `https://placeholder.com/emergency/${agentId}.jpg`,
      drop_type: 'daily',
      metadata: {
        emergency: true,
        reason: 'Generation failure',
        timestamp: new Date().toISOString()
      }
    })
    .select()
    .single();
  
  return drop?.id || null;
}

/**
 * Notify emergency contacts
 */
async function notifyEmergency(agentId: string, reason: string) {
  console.error(`🚨 EMERGENCY: ${agentId} - ${reason}`);
  
  // TODO: Implement actual notifications
  // - Discord webhook
  // - Email alert
  // - SMS notification
  // - Slack message
}

/**
 * Check and maintain streaks for all agents
 */
async function checkAllStreaks() {
  console.log('\n📊 Checking all agent streaks...');
  
  for (const [agentId, config] of Object.entries(AGENT_CONFIGS)) {
    const status = await streakManager.checkStreak(agentId);
    
    if (!status) {
      console.log(`❌ No streak record for ${agentId}`);
      continue;
    }
    
    console.log(`${agentId}:`);
    console.log(`  Current streak: ${status.current_streak} days`);
    console.log(`  Longest streak: ${status.longest_streak} days`);
    console.log(`  Total drops: ${status.total_drops}`);
    console.log(`  Streak intact: ${status.streak_intact ? '✓' : '✗'}`);
    
    if (status.needs_protection) {
      console.log(`  ⚠️ NEEDS DROP TODAY!`);
      
      // Try to generate drop immediately
      const dropId = await generateDailyDrop(agentId);
      if (!dropId) {
        // Try fallback
        await generateFallbackDrop(agentId);
      }
    }
  }
}

/**
 * Schedule daily drops for an agent
 */
function scheduleDailyDrop(agentId: string, config: any) {
  // Parse drop time (HH:MM format)
  const [hours, minutes] = config.drop_time.split(':').map(Number);
  
  // Create cron expression
  // Format: minute hour * * *
  const cronExpression = `${minutes} ${hours} * * *`;
  
  console.log(`📅 Scheduling ${agentId} daily drop at ${config.drop_time} ${config.timezone}`);
  
  // Schedule the task
  const task = cron.schedule(cronExpression, async () => {
    console.log(`\n⏰ Running scheduled drop for ${agentId} at ${new Date().toISOString()}`);
    
    const dropId = await generateDailyDrop(agentId);
    
    if (!dropId) {
      console.error(`Failed to generate scheduled drop for ${agentId}`);
      await generateFallbackDrop(agentId);
    } else {
      // Notify subscribers
      await notifySubscribers(agentId, dropId);
    }
  }, {
    timezone: config.timezone
  });
  
  scheduledTasks.set(agentId, task);
}

/**
 * Notify drop subscribers
 */
async function notifySubscribers(agentId: string, dropId: string) {
  const { data: subscribers } = await supabase
    .from('drop_subscriptions')
    .select('*')
    .eq('agent_id', agentId)
    .eq('active', true);
  
  if (!subscribers || subscribers.length === 0) return;
  
  console.log(`📧 Notifying ${subscribers.length} subscribers for ${agentId}'s new drop`);
  
  // TODO: Implement actual notifications
  for (const sub of subscribers) {
    if (sub.notification_type === 'webhook' && sub.webhook_url) {
      // Call webhook
    } else if (sub.notification_type === 'email' && sub.subscriber_email) {
      // Send email
    }
  }
}

/**
 * Initialize all scheduled tasks
 */
async function initializeScheduler() {
  console.log('🚀 Initializing Daily Drop Scheduler...\n');
  
  // Schedule drops for each agent
  for (const [agentId, config] of Object.entries(AGENT_CONFIGS)) {
    if (config.drop_schedule === 'daily') {
      scheduleDailyDrop(agentId, config);
    }
  }
  
  // Schedule hourly streak check
  cron.schedule('0 * * * *', async () => {
    console.log('\n⏰ Hourly streak check...');
    await checkAllStreaks();
  });
  
  // Schedule daily emergency check at 23:00 UTC
  cron.schedule('0 23 * * *', async () => {
    console.log('\n🚨 Daily emergency check...');
    
    const agentsNeedingDrops = await streakManager.getAgentsNeedingDrops();
    
    if (agentsNeedingDrops.length > 0) {
      console.log(`⚠️ Agents still needing drops: ${agentsNeedingDrops.join(', ')}`);
      
      for (const agentId of agentsNeedingDrops) {
        const dropId = await generateDailyDrop(agentId);
        if (!dropId) {
          await generateFallbackDrop(agentId);
        }
      }
    } else {
      console.log('✓ All agents have dropped today');
    }
  });
  
  console.log(`\n✓ Scheduler initialized with ${scheduledTasks.size} daily tasks`);
  console.log('✓ Hourly streak checks enabled');
  console.log('✓ Daily emergency check at 23:00 UTC enabled\n');
  
  // Initial streak check
  await checkAllStreaks();
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down scheduler...');
  
  scheduledTasks.forEach((task, agentId) => {
    console.log(`Stopping schedule for ${agentId}`);
    task.stop();
  });
  
  process.exit(0);
});

// Main execution
async function main() {
  const command = process.argv[2];
  
  if (command === 'check') {
    // One-time streak check
    await checkAllStreaks();
  } else if (command === 'generate') {
    // Manual drop generation
    const agentId = process.argv[3];
    if (!agentId) {
      console.error('Please specify agent ID');
      process.exit(1);
    }
    
    const dropId = await generateDailyDrop(agentId);
    if (!dropId) {
      console.error('Drop generation failed');
      await generateFallbackDrop(agentId);
    }
  } else {
    // Start the scheduler
    await initializeScheduler();
    console.log('📡 Scheduler running... Press Ctrl+C to stop');
  }
}

// Run the scheduler
main().catch(console.error);