#!/usr/bin/env node

/**
 * Quick script to check where the actual image URLs are stored
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const academySupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const academySupabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const academySupabase = createClient(academySupabaseUrl, academySupabaseKey);

async function checkImageFields() {
  // Get a sample of records and check all URL fields
  const { data: abrahamSample } = await academySupabase
    .from('agent_archives')
    .select('title, image_url, thumbnail_url, source_url, metadata')
    .eq('agent_id', 'abraham')
    .not('thumbnail_url', 'is', null)
    .limit(3);

  console.log('Abraham samples with thumbnail_url:');
  abrahamSample?.forEach((record, i) => {
    console.log(`\n${i + 1}. ${record.title}`);
    console.log(`   image_url: ${record.image_url || 'NULL'}`);
    console.log(`   thumbnail_url: ${record.thumbnail_url || 'NULL'}`);
    console.log(`   source_url: ${record.source_url || 'NULL'}`);
    if (record.metadata?.url) {
      console.log(`   metadata.url: ${record.metadata.url}`);
    }
  });

  // Check if there are records WITH image_url
  const { count: abrahamWithImages } = await academySupabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .not('image_url', 'is', null);

  const { count: abrahamWithThumbnails } = await academySupabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .not('thumbnail_url', 'is', null);

  console.log(`\nAbraham stats:`);
  console.log(`   Records with image_url: ${abrahamWithImages}`);
  console.log(`   Records with thumbnail_url: ${abrahamWithThumbnails}`);
}

checkImageFields().catch(console.error);