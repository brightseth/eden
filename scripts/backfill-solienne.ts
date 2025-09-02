#!/usr/bin/env tsx
// Backfill Worker: Supabase → Registry Migration
// Idempotent upsert of 1,740 SOLIENNE works

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { upsertWork, markMissingWorks } from '../src/lib/registry/works-api';

const BATCH_SIZE = 100;
const EXPECTED_COUNT = 1740;
const SOLIENNE_AGENT_ID = 'cmewg2y1r0006it9j5p6nrc53'; // From Registry

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const prisma = new PrismaClient();

interface BackfillStats {
  scanned: number;
  inserted: number;
  updated: number;
  missing: number;
  errors: number;
  startTime: number;
}

async function main() {
  const stats: BackfillStats = {
    scanned: 0,
    inserted: 0,
    updated: 0,
    missing: 0,
    errors: 0,
    startTime: Date.now()
  };

  console.log('🚀 Starting SOLIENNE backfill from Supabase to Registry');
  console.log(`   Agent ID: ${SOLIENNE_AGENT_ID}`);
  console.log(`   Expected: ${EXPECTED_COUNT} works`);

  try {
    // Step 1: List all files in Supabase
    console.log('\n📋 Scanning Supabase storage...');
    const files = await listAllFiles('eden', 'solienne/generations');
    console.log(`   Found ${files.length} files`);

    // Step 2: Process in batches
    const ordinals: number[] = [];
    
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      console.log(`\n⚙️  Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)}`);
      
      for (const file of batch) {
        stats.scanned++;
        
        // Extract ordinal from filename (e.g., "1234.png" → 1234)
        const match = file.name.match(/^(\d+)\.png$/);
        if (!match) {
          console.warn(`   ⚠️  Skipping non-conforming file: ${file.name}`);
          continue;
        }
        
        const ordinal = parseInt(match[1], 10);
        if (isNaN(ordinal) || ordinal < 1 || ordinal > EXPECTED_COUNT) {
          console.warn(`   ⚠️  Invalid ordinal ${ordinal} from ${file.name}`);
          stats.errors++;
          continue;
        }
        
        ordinals.push(ordinal);
        
        // Upsert work (idempotent)
        try {
          const result = await upsertWork(
            prisma,
            SOLIENNE_AGENT_ID,
            ordinal,
            'eden',
            `solienne/generations/${file.name}`,
            {
              bytes: file.metadata?.size || undefined
            }
          );
          
          if (result[0]) {
            stats.inserted++;
            if (stats.inserted % 100 === 0) {
              console.log(`   ✅ Inserted ${stats.inserted} works`);
            }
          }
        } catch (error) {
          console.error(`   ❌ Failed to upsert ordinal ${ordinal}:`, error);
          stats.errors++;
        }
      }
    }

    // Step 3: Detect and mark missing ordinals
    console.log('\n🔍 Detecting gaps...');
    const expectedOrdinals = Array.from({ length: EXPECTED_COUNT }, (_, i) => i + 1);
    const missingCount = await markMissingWorks(
      prisma,
      SOLIENNE_AGENT_ID,
      expectedOrdinals,
      ordinals
    );
    stats.missing = missingCount;
    
    if (missingCount > 0) {
      console.warn(`   ⚠️  Found ${missingCount} missing ordinals`);
    } else {
      console.log(`   ✅ No gaps detected`);
    }

    // Step 4: Queue checksum computation (async)
    console.log('\n🔐 Queueing checksum computation...');
    await prisma.$executeRaw`
      INSERT INTO checksum_queue (work_id, priority)
      SELECT id, 1 FROM work 
      WHERE agent_id = ${SOLIENNE_AGENT_ID}::uuid
        AND sha256 IS NULL
        AND status = 'active'::work_status
      ON CONFLICT DO NOTHING
    `;

    // Step 5: Final verification
    const finalCount = await prisma.work.count({
      where: {
        agent_id: SOLIENNE_AGENT_ID,
        status: 'active'
      }
    });

    // Print summary
    const duration = Math.round((Date.now() - stats.startTime) / 1000);
    console.log('\n📊 Backfill Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Duration:  ${duration}s`);
    console.log(`   Scanned:   ${stats.scanned} files`);
    console.log(`   Inserted:  ${stats.inserted} works`);
    console.log(`   Missing:   ${stats.missing} ordinals`);
    console.log(`   Errors:    ${stats.errors}`);
    console.log(`   Final DB:  ${finalCount} active works`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (finalCount !== EXPECTED_COUNT - stats.missing) {
      console.warn(`\n⚠️  WARNING: Expected ${EXPECTED_COUNT - stats.missing} active works, found ${finalCount}`);
    } else {
      console.log('\n✅ SUCCESS: All works migrated to Registry!');
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function listAllFiles(bucket: string, prefix: string) {
  const files: any[] = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { 
        limit,
        offset,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) throw error;
    if (!data || data.length === 0) break;
    
    files.push(...data);
    
    if (data.length < limit) break;
    offset += limit;
  }
  
  return files;
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}