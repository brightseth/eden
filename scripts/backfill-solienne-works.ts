#!/usr/bin/env tsx
/**
 * Backfill SOLIENNE Works to Registry
 * Migrates 1,740 images from Supabase to Registry metadata
 * Idempotent - safe to run multiple times
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const BATCH_SIZE = 50;
const EXPECTED_COUNT = 1740;
const REGISTRY_BASE = process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry.vercel.app';
const REGISTRY_SERVICE_KEY = process.env.REGISTRY_SERVICE_KEY || 'registry-service-key-2025-eden-solienne-works';

// Initialize Supabase client to check file existence
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bHlneXJraWJ1cGVqbGxnZ2xyIiwicm9sZSI6InNlcnZpY2UiLCJpYXQiOjE3MjI4NzY2NDgsImV4cCI6MjAzODQ1MjY0OH0.y47o6uUz0lxH_OUjFnw86gBMSM0PqEYjNOQxABb_FSU';
const supabase = createClient(
  'https://ctlygyrkibupejllgglr.supabase.co',
  SUPABASE_SERVICE_KEY
);

interface BackfillStats {
  total: number;
  created: number;
  updated: number;
  missing: number;
  errors: number;
}

async function checkFileExists(path: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from('eden')
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1000,
        search: path.split('/').pop()
      });
    
    if (error) {
      console.error(`Error checking file ${path}:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Failed to check file ${path}:`, error);
    return false;
  }
}

async function backfillBatch(start: number, end: number): Promise<Partial<BackfillStats>> {
  const works = [];
  let missing = 0;
  
  for (let ordinal = start; ordinal <= end; ordinal++) {
    const storagePath = `solienne/generations/${ordinal}.png`;
    
    // Check if file exists in Supabase
    const exists = await checkFileExists(storagePath);
    
    if (!exists) {
      console.warn(`Missing file: ${storagePath}`);
      missing++;
      continue;
    }
    
    works.push({
      ordinal,
      storagePath,
      title: `Consciousness Stream #${ordinal}`,
      metadata: {
        source: 'supabase_migration',
        migrated_at: new Date().toISOString()
      }
    });
  }
  
  if (works.length === 0) {
    return { missing };
  }
  
  // Send batch to Registry
  try {
    const response = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-registry-service': REGISTRY_SERVICE_KEY
      },
      body: JSON.stringify({ works })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Registry API error: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log(`Batch ${start}-${end}: Created ${result.created} works`);
    
    return {
      created: result.created,
      missing
    };
  } catch (error) {
    console.error(`Failed to backfill batch ${start}-${end}:`, error);
    return {
      errors: works.length,
      missing
    };
  }
}

async function detectGaps(): Promise<number[]> {
  console.log('🔍 Detecting gaps in ordinal sequence...');
  
  const gaps: number[] = [];
  const batchSize = 100;
  
  for (let start = 1; start <= EXPECTED_COUNT; start += batchSize) {
    const end = Math.min(start + batchSize - 1, EXPECTED_COUNT);
    
    for (let ordinal = start; ordinal <= end; ordinal++) {
      const exists = await checkFileExists(`solienne/generations/${ordinal}.png`);
      if (!exists) {
        gaps.push(ordinal);
      }
    }
    
    if (gaps.length > 0 && gaps.length % 10 === 0) {
      console.log(`Found ${gaps.length} gaps so far...`);
    }
  }
  
  return gaps;
}

async function main() {
  console.log('🚀 Starting SOLIENNE Works backfill to Registry');
  console.log(`Registry: ${REGISTRY_BASE}`);
  console.log(`Expected works: ${EXPECTED_COUNT}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  
  const stats: BackfillStats = {
    total: EXPECTED_COUNT,
    created: 0,
    updated: 0,
    missing: 0,
    errors: 0
  };
  
  // Process in batches
  for (let start = 1; start <= EXPECTED_COUNT; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, EXPECTED_COUNT);
    console.log(`\n📦 Processing batch ${start}-${end}...`);
    
    const batchStats = await backfillBatch(start, end);
    
    stats.created += batchStats.created || 0;
    stats.updated += batchStats.updated || 0;
    stats.missing += batchStats.missing || 0;
    stats.errors += batchStats.errors || 0;
    
    // Progress update
    const processed = end;
    const percentage = Math.round((processed / EXPECTED_COUNT) * 100);
    console.log(`Progress: ${percentage}% (${processed}/${EXPECTED_COUNT})`);
    
    // Rate limiting - wait 500ms between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Detect and report gaps
  console.log('\n🔍 Checking for gaps in sequence...');
  const gaps = await detectGaps();
  
  // Final report
  console.log('\n📊 Backfill Complete!');
  console.log('='.repeat(40));
  console.log(`Total expected: ${stats.total}`);
  console.log(`Created: ${stats.created}`);
  console.log(`Updated: ${stats.updated}`);
  console.log(`Missing files: ${stats.missing}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Success rate: ${Math.round(((stats.created + stats.updated) / stats.total) * 100)}%`);
  
  if (gaps.length > 0) {
    console.log(`\n⚠️ Found ${gaps.length} gaps in ordinal sequence:`);
    console.log(`Gaps: ${gaps.slice(0, 20).join(', ')}${gaps.length > 20 ? '...' : ''}`);
    
    // Write gaps to file for investigation
    const fs = require('fs');
    fs.writeFileSync('solienne-gaps.json', JSON.stringify(gaps, null, 2));
    console.log('Gap list saved to solienne-gaps.json');
  }
  
  if (stats.errors > 0) {
    console.log('\n❌ Backfill completed with errors. Please review and retry.');
    process.exit(1);
  } else if (stats.missing > 100) {
    console.log('\n⚠️ High number of missing files detected. Manual investigation required.');
    process.exit(1);
  } else {
    console.log('\n✅ Backfill successful! Registry is now the source of truth.');
    console.log('Next steps:');
    console.log('1. Deploy Academy with pure Registry proxy');
    console.log('2. Set ALLOW_STORAGE_FALLBACK=false');
    console.log('3. Run smoke tests');
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main as backfillSolienneWorks };