const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const SOURCE_DIR = '/Users/seth/Desktop/abraham_2021.b';
const BUCKET = 'eden';

async function replaceAbrahamWorks() {
  console.log('🔄 Replacing Abraham\'s Early Works');
  console.log('=====================================\n');
  
  // Step 1: Delete existing Abraham early works
  console.log('📥 Step 1: Removing old Abraham early works...');
  const { error: deleteError, count: deletedCount } = await supabase
    .from('agent_archives')
    .delete()
    .eq('agent_id', 'abraham')
    .in('archive_type', ['early_work', 'early-work', 'early-works']);
  
  if (deleteError) {
    console.error('Error deleting old records:', deleteError);
    return;
  }
  
  console.log(`✅ Deleted ${deletedCount || 'all'} old Abraham records\n`);
  
  // Step 2: Delete old images from storage
  console.log('📥 Step 2: Cleaning storage...');
  const { data: storageFiles } = await supabase.storage
    .from(BUCKET)
    .list('abraham/early-works', { limit: 1000 });
  
  if (storageFiles && storageFiles.length > 0) {
    const filesToDelete = storageFiles.map(f => `abraham/early-works/${f.name}`);
    const { error: storageDeleteError } = await supabase.storage
      .from(BUCKET)
      .remove(filesToDelete);
    
    if (storageDeleteError) {
      console.error('Warning: Could not clean storage:', storageDeleteError.message);
    } else {
      console.log(`✅ Cleaned ${filesToDelete.length} files from storage\n`);
    }
  }
  
  // Step 3: Read new files
  console.log('📥 Step 3: Reading new Abraham works from', SOURCE_DIR);
  const files = await fs.readdir(SOURCE_DIR);
  const jpgFiles = files.filter(f => f.endsWith('.jpg'));
  
  console.log(`Found ${jpgFiles.length} image files\n`);
  
  // Step 4: Process and upload
  console.log('📤 Step 4: Uploading new works...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  const BATCH_SIZE = 20;
  
  for (let i = 0; i < jpgFiles.length; i += BATCH_SIZE) {
    const batch = jpgFiles.slice(i, Math.min(i + BATCH_SIZE, jpgFiles.length));
    
    await Promise.all(batch.map(async (filename) => {
      try {
        // Parse filename: 0002_Genesis_is_coming.jpg
        const baseName = filename.replace('.jpg', '');
        const parts = baseName.split('_');
        const number = parseInt(parts[0]);
        const title = parts.slice(1).join(' ').replace(/_/g, ' ');
        
        // Read JSON metadata if exists
        const jsonPath = path.join(SOURCE_DIR, baseName + '.json');
        let metadata = {};
        let createdDate = null;
        
        try {
          const jsonContent = await fs.readFile(jsonPath, 'utf8');
          metadata = JSON.parse(jsonContent);
          
          // Try to extract date from metadata
          if (metadata.date) {
            createdDate = new Date(metadata.date);
          } else if (metadata.created_at) {
            createdDate = new Date(metadata.created_at);
          } else if (metadata.timestamp) {
            createdDate = new Date(metadata.timestamp * 1000);
          }
        } catch (e) {
          // No JSON or invalid JSON - that's okay
        }
        
        // If no date in metadata, use summer 2021 timeframe
        // These 2522 works were created in summer 2021 through the online interface
        // They were generated over a few weeks, not daily
        if (!createdDate || isNaN(createdDate.getTime())) {
          // Spread the works across June-July 2021
          const startDate = new Date('2021-06-01');
          const endDate = new Date('2021-07-31');
          const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
          
          // Distribute works across this period
          const dayOffset = Math.floor((number / 4500) * totalDays);
          createdDate = new Date(startDate);
          createdDate.setDate(startDate.getDate() + dayOffset);
        }
        
        // Read and upload image
        const imagePath = path.join(SOURCE_DIR, filename);
        const imageBuffer = await fs.readFile(imagePath);
        
        const storagePath = `abraham/early-works/${number}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });
        
        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
        
        // Insert database record
        const { error: insertError } = await supabase
          .from('agent_archives')
          .insert({
            agent_id: 'abraham',
            archive_type: 'early-work',
            archive_number: number,
            title: title || `Early Work #${number}`,
            image_url: imageUrl,
            created_date: createdDate.toISOString(),
            trainer_id: 'gene',
            metadata: {
              ...metadata,
              source: 'abraham_2021.b',
              original_filename: filename
            }
          });
        
        if (insertError) {
          throw new Error(`Database insert failed: ${insertError.message}`);
        }
        
        successCount++;
        process.stdout.write(`\r✅ Uploaded ${successCount} / ${jpgFiles.length} (${errorCount} errors)`);
        
      } catch (err) {
        errorCount++;
        errors.push({ file: filename, error: err.message });
        process.stdout.write(`\r✅ Uploaded ${successCount} / ${jpgFiles.length} (${errorCount} errors)`);
      }
    }));
  }
  
  console.log('\n\n📊 Import Complete!');
  console.log('===================');
  console.log(`✅ Successfully imported: ${successCount} works`);
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
  
  // Verify final count
  const { count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .eq('archive_type', 'early-work');
  
  console.log(`\n📚 Total Abraham early works in database: ${count}`);
}

replaceAbrahamWorks().catch(console.error);