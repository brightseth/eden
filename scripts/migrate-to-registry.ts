#!/usr/bin/env node

/**
 * Migration script to move Abraham and Solienne data from Academy Supabase to Registry
 * This supports the CRIT integration and Registry-first architecture
 */

import { createClient } from '@supabase/supabase-js';
import { registryApi } from '../src/lib/generated-sdk';
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

interface AcademyArchive {
  id: string;
  agent_id: string;
  archive_type: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  created_date?: string;
  metadata: any;
  archive_number?: number;
  source_url?: string;
}

async function migrateAgent(agentHandle: string) {
  console.log(`\n🔄 Starting migration for ${agentHandle.toUpperCase()}...`);
  
  try {
    // Step 1: Fetch archive data from Academy Supabase
    console.log(`📋 Fetching ${agentHandle} archives from Academy...`);
    const { data: academyArchives, error: archiveError } = await academySupabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', agentHandle)
      .order('created_date', { ascending: false });

    if (archiveError) {
      console.error(`❌ Error fetching archives for ${agentHandle}:`, archiveError);
      return;
    }

    if (!academyArchives || academyArchives.length === 0) {
      console.log(`⚠️  No ${agentHandle} archives found in Academy database`);
      return;
    }

    console.log(`✅ Found ${academyArchives.length} archive records for ${agentHandle}`);

    // Step 3: Check if agent already exists in Registry
    console.log(`🔍 Checking Registry for existing ${agentHandle} agent...`);
    let registryAgent;
    try {
      registryAgent = await registryApi.getAgent(agentHandle);
      console.log(`✅ Agent ${agentHandle} already exists in Registry`);
    } catch (error) {
      console.log(`⚠️  Agent ${agentHandle} not found in Registry, would need manual creation`);
      console.log(`   Registry agents must be created through the Registry admin interface`);
      return;
    }

    // Step 4: Migrate archives to Registry as creations
    if (academyArchives && academyArchives.length > 0) {
      console.log(`🔄 Starting migration of ${academyArchives.length} archive records...`);
      
      let migrated = 0;
      let skipped = 0;
      let errors = 0;

      for (const archive of academyArchives) {
        try {
          // Transform Academy archive to Registry creation format
          const registryCreation = {
            title: archive.title || `${agentHandle.toUpperCase()} #${archive.archive_number || migrated + 1}`,
            mediaUri: archive.image_url,
            status: 'PUBLISHED' as const,
            metadata: {
              ...archive.metadata,
              thumbnailUrl: archive.thumbnail_url,
              description: archive.description,
              archiveType: archive.archive_type,
              archiveNumber: archive.archive_number,
              createdDate: archive.created_date,
              sourceUrl: archive.source_url,
              migratedFrom: 'academy-supabase-archives',
              originalId: archive.id,
              migratedAt: new Date().toISOString()
            }
          };

          // Check if archive already exists in Registry
          const existingCreations = await registryApi.getCreations(agentHandle);
          const creationExists = existingCreations.some(existing => 
            existing.metadata?.originalId === archive.id ||
            (existing.title === archive.title && existing.mediaUri === archive.image_url)
          );

          if (creationExists) {
            console.log(`⏭️  Skipping "${archive.title}" (already exists)`);
            skipped++;
            continue;
          }

          // Create archive as creation in Registry
          await registryApi.createCreation(agentHandle, registryCreation);
          console.log(`✅ Migrated: "${archive.title}"`);
          migrated++;

          // Rate limiting - don't overwhelm the Registry
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
          console.error(`❌ Failed to migrate archive "${archive.title}":`, error);
          errors++;
          
          // If we hit too many errors, pause longer
          if (errors > 5) {
            console.log(`⏸️  Too many errors, pausing for 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }

      console.log(`\n📊 Migration summary for ${agentHandle}:`);
      console.log(`   ✅ Migrated: ${migrated} archives`);
      console.log(`   ⏭️  Skipped: ${skipped} archives`);
      console.log(`   ❌ Errors: ${errors} archives`);
    }

    // Step 5: Agent profile is managed through Registry directly
    console.log(`ℹ️  Agent profile managed through Registry interface`);

  } catch (error) {
    console.error(`❌ Migration failed for ${agentHandle}:`, error);
    console.error('Error details:', error);
  }
}

async function main() {
  console.log('🚀 Starting Registry Migration Script');
  console.log('📍 Migrating from Academy Supabase to Genesis Registry');
  
  // Check Registry connectivity
  console.log('\n🔍 Testing Registry connectivity...');
  try {
    const agents = await registryApi.getAgents({ cohort: 'genesis' });
    console.log(`✅ Registry connected, found ${agents.length} agents in genesis cohort`);
  } catch (error) {
    console.error('❌ Registry connection failed:', error);
    console.error('   Please ensure Registry service is running and credentials are correct');
    process.exit(1);
  }

  // Get command line arguments
  const args = process.argv.slice(2);
  const targetAgent = args[0]?.toLowerCase();

  if (targetAgent && ['abraham', 'solienne'].includes(targetAgent)) {
    // Migrate specific agent
    await migrateAgent(targetAgent);
  } else if (args[0] === 'all') {
    // Migrate both agents
    await migrateAgent('abraham');
    await migrateAgent('solienne');
  } else {
    console.log('\nUsage: npm run migrate-to-registry <agent>');
    console.log('  agent: abraham | solienne | all');
    console.log('\nExample:');
    console.log('  npm run migrate-to-registry abraham');
    console.log('  npm run migrate-to-registry all');
    process.exit(1);
  }

  console.log('\n🎉 Migration completed!');
  console.log('   Registry now contains the migrated data for CRIT integration');
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the migration
if (require.main === module) {
  main().catch(console.error);
}