#!/usr/bin/env node

/**
 * Preview migration script - shows what data would be migrated from Academy to Registry
 * This helps verify the migration logic without actually connecting to Registry
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const academySupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const academySupabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!academySupabaseUrl || !academySupabaseKey) {
  console.error('❌ Missing Academy Supabase credentials');
  process.exit(1);
}

const academySupabase = createClient(academySupabaseUrl, academySupabaseKey);

async function previewAgentMigration(agentHandle: string) {
  console.log(`\n📋 Preview migration for ${agentHandle.toUpperCase()}`);
  console.log('='.repeat(50));
  
  try {
    // Check what tables exist and look for agent-related data
    console.log(`🔍 Looking for ${agentHandle} data in Academy database...`);
    
    // Try agent_archives table (used in existing scripts)
    const { data: archiveData, error: archiveError } = await academySupabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', agentHandle)
      .limit(10);
      
    console.log(`📋 Found ${archiveData?.length || 0} records in agent_archives for ${agentHandle}`);
    if (archiveError) {
      console.log(`   Archive error: ${archiveError.message}`);
    }

    if (!archiveData || archiveData.length === 0) {
      console.log(`⚠️  No ${agentHandle} data found in Academy database`);
      return;
    }

    // Show sample archive data structure
    const firstRecord = archiveData[0];
    console.log(`✅ Found agent archives in Academy:`);
    console.log(`   Agent ID: ${firstRecord.agent_id}`);
    console.log(`   Total Records: ${archiveData.length}`);
    console.log(`   Sample fields: ${Object.keys(firstRecord).join(', ')}`);
    
    if (firstRecord.metadata) {
      console.log(`   Sample metadata keys: ${Object.keys(firstRecord.metadata).join(', ')}`);
    }

    // Get total count for this agent
    const { count: totalCount, error: countError } = await academySupabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentHandle);
    
    if (!countError) {
      console.log(`   Total works in database: ${totalCount}`);
    }

    if (archiveData && archiveData.length > 0) {
      console.log(`\n📊 Archive samples (first 5):`);
      archiveData.slice(0, 5).forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.title || record.file_name || 'Untitled'}`);
        console.log(`      Created: ${record.created_at}`);
        console.log(`      File: ${record.file_name || 'N/A'}`);
        console.log(`      Image URL: ${record.image_url ? 'Yes' : 'No'}`);
        console.log(`      Thumbnail: ${record.thumbnail_url ? 'Yes' : 'No'}`);
        if (record.metadata) {
          console.log(`      Metadata keys: ${Object.keys(record.metadata).join(', ')}`);
        }
        console.log('');
      });

      // Show what would be migrated
      console.log(`\n🔄 Migration preview:`);
      console.log(`   Agent would be checked/updated in Registry`);
      console.log(`   ${totalCount || archiveData.length} archive records would be migrated`);
      console.log(`   Each archive record would become a Registry creation:`);
      console.log(`     - Title from file_name or metadata`);
      console.log(`     - Media URL preserved`);
      console.log(`     - Migration metadata (source, timestamp, original ID)`);
      console.log(`     - Archive metadata preserved`);
      
      // Check for potential issues
      const recordsWithoutMedia = archiveData.filter(r => !r.image_url);
      const recordsWithoutTitle = archiveData.filter(r => !r.title && !r.file_name);
      
      if (recordsWithoutMedia.length > 0) {
        console.log(`   ⚠️  ${recordsWithoutMedia.length}/10 sample records missing image URLs`);
      } else {
        console.log(`   ✅ All sample records have image URLs`);
      }
      if (recordsWithoutTitle.length > 0) {
        console.log(`   ⚠️  ${recordsWithoutTitle.length}/10 sample records missing titles`);
      }
    }

  } catch (error) {
    console.error(`❌ Preview failed for ${agentHandle}:`, error);
  }
}

async function main() {
  console.log('🔍 Registry Migration Preview');
  console.log('📍 Analyzing Academy Supabase data for migration readiness');
  
  // Get command line arguments
  const args = process.argv.slice(2);
  const targetAgent = args[0]?.toLowerCase();

  if (targetAgent && ['abraham', 'solienne'].includes(targetAgent)) {
    // Preview specific agent
    await previewAgentMigration(targetAgent);
  } else if (args[0] === 'all') {
    // Preview both agents
    await previewAgentMigration('abraham');
    await previewAgentMigration('solienne');
  } else {
    console.log('\nUsage: npx tsx scripts/preview-migration.ts <agent>');
    console.log('  agent: abraham | solienne | all');
    console.log('\nExample:');
    console.log('  npx tsx scripts/preview-migration.ts abraham');
    console.log('  npx tsx scripts/preview-migration.ts all');
    process.exit(1);
  }

  console.log('\n✅ Preview completed!');
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the preview
if (require.main === module) {
  main().catch(console.error);
}