const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const SOURCE_DIR = '/Users/seth/Desktop/solienne.outputs/solienne_creations';
const BUCKET = 'eden';

async function importSolienne() {
  console.log('🎨 Importing Solienne Generations - Phase 1');
  console.log('==========================================\n');
  
  // Check existing Solienne data
  const { count: existingCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  console.log(`Existing Solienne generations: ${existingCount || 0}`);
  
  if (existingCount > 0) {
    console.log('⚠️  Solienne data already exists. Skipping import.');
    console.log('   Run cleanup script first if you want to re-import.\n');
    
    // Just do the trainer backfill
    await backfillTrainers();
    return;
  }
  
  // Read all files
  const files = await fs.readdir(SOURCE_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png'));
  
  console.log(`Found ${pngFiles.length} images to import\n`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  const BATCH_SIZE = 20;
  
  // Process in batches
  for (let i = 0; i < pngFiles.length; i += BATCH_SIZE) {
    const batch = pngFiles.slice(i, Math.min(i + BATCH_SIZE, pngFiles.length));
    
    await Promise.all(batch.map(async (filename) => {
      try {
        // Parse filename: 2025-04-11_0608_67f8b1decc4e8dea2d571302.png
        const baseName = filename.replace('.png', '');
        const parts = baseName.split('_');
        
        if (parts.length !== 3) {
          throw new Error('Invalid filename format');
        }
        
        const dateStr = parts[0]; // 2025-04-11
        const timeStr = parts[1]; // 0608
        const userId = parts[2];   // 67f8b1decc4e8dea2d571302
        
        // Parse date and time
        const [year, month, day] = dateStr.split('-').map(Number);
        const hour = parseInt(timeStr.substring(0, 2));
        const minute = parseInt(timeStr.substring(2, 4));
        const createdDate = new Date(year, month - 1, day, hour, minute);
        
        // Read metadata if exists
        const jsonPath = path.join(SOURCE_DIR, baseName + '.json');
        let metadata = {};
        let title = null;
        
        try {
          const jsonContent = await fs.readFile(jsonPath, 'utf8');
          metadata = JSON.parse(jsonContent);
          
          // Extract title from metadata
          if (metadata.text_input) {
            title = metadata.text_input.substring(0, 100);
          } else if (metadata.prompt) {
            title = metadata.prompt.substring(0, 100);
          }
        } catch (e) {
          // No JSON or invalid JSON - that's okay
        }
        
        // Read and upload image
        const imagePath = path.join(SOURCE_DIR, filename);
        const imageBuffer = await fs.readFile(imagePath);
        
        // Create storage path with folder structure
        const storagePath = `solienne/generations/${baseName}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, imageBuffer, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
        
        // Determine trainer based on user ID
        // Seth's ID: 67b89e92a7ea02717c1ea36d
        // IDs starting with 67f8 are likely Kristi's sessions
        let trainerId = null;
        if (userId === '67b89e92a7ea02717c1ea36d') {
          trainerId = 'seth';
        } else if (userId.startsWith('67f8') || userId.startsWith('67f9')) {
          trainerId = 'kristi'; // Most likely Kristi based on timeframe
        }
        
        // Insert database record
        const { error: insertError } = await supabase
          .from('agent_archives')
          .insert({
            agent_id: 'solienne',
            archive_type: 'generation',
            archive_number: i + successCount + 1, // Sequential numbering
            title: title || `Generation ${dateStr}`,
            image_url: imageUrl,
            created_date: createdDate.toISOString(),
            created_by_user: userId,
            trainer_id: trainerId,
            metadata: {
              ...metadata,
              source: 'solienne.outputs',
              original_filename: filename
            }
          });
        
        if (insertError) {
          throw new Error(`Database insert failed: ${insertError.message}`);
        }
        
        successCount++;
        process.stdout.write(`\r✅ Imported ${successCount} / ${pngFiles.length} (${errorCount} errors)`);
        
      } catch (err) {
        errorCount++;
        errors.push({ file: filename, error: err.message });
        process.stdout.write(`\r✅ Imported ${successCount} / ${pngFiles.length} (${errorCount} errors)`);
      }
    }));
  }
  
  console.log('\n\n📊 Import Complete!');
  console.log('===================');
  console.log(`✅ Successfully imported: ${successCount} generations`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Error details:');
    errors.slice(0, 10).forEach(e => {
      console.log(`  - ${e.file}: ${e.error}`);
    });
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`);
    }
  }
  
  // Backfill trainers
  await backfillTrainers();
}

async function backfillTrainers() {
  console.log('\n🔧 Backfilling trainer attributions...\n');
  
  // Get unique user IDs
  const { data: uniqueUsers } = await supabase
    .from('agent_archives')
    .select('created_by_user')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .not('created_by_user', 'is', null);
  
  const userIds = [...new Set(uniqueUsers?.map(u => u.created_by_user) || [])];
  console.log(`Found ${userIds.length} unique user IDs`);
  
  // Count by prefix to guess attribution
  const prefixCounts = {};
  userIds.forEach(id => {
    const prefix = id.substring(0, 4);
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
  });
  
  console.log('User ID prefixes:', prefixCounts);
  
  // Update trainer_id based on our best guess
  // Seth's known ID: 67b89e92a7ea02717c1ea36d
  const { error: sethUpdate } = await supabase
    .from('agent_archives')
    .update({ trainer_id: 'seth' })
    .eq('agent_id', 'solienne')
    .eq('created_by_user', '67b89e92a7ea02717c1ea36d');
  
  if (!sethUpdate) {
    console.log('✅ Updated Seth\'s works');
  }
  
  // IDs starting with 67f8/67f9 are likely Kristi (based on timeline)
  const { error: kristiUpdate } = await supabase
    .from('agent_archives')
    .update({ trainer_id: 'kristi' })
    .eq('agent_id', 'solienne')
    .or('created_by_user.like.67f8%,created_by_user.like.67f9%');
  
  if (!kristiUpdate) {
    console.log('✅ Updated Kristi\'s works (67f8/67f9 prefixes)');
  }
  
  // Final counts
  const { data: trainerCounts } = await supabase
    .from('agent_archives')
    .select('trainer_id')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  const counts = {};
  trainerCounts?.forEach(t => {
    const trainer = t.trainer_id || 'unknown';
    counts[trainer] = (counts[trainer] || 0) + 1;
  });
  
  console.log('\n📊 Final trainer attribution:');
  Object.entries(counts).forEach(([trainer, count]) => {
    console.log(`  ${trainer}: ${count} works`);
  });
}

importSolienne().catch(console.error);