const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const ROOT_DIR = path.join(process.env.HOME, 'Desktop', 'solienne.outputs', 'solienne_creations');
const BUCKET = 'eden';
const PREFIX = 'solienne/generations';
const AGENT_ID = 'solienne';
const ARCHIVE_TYPE = 'generation';
const BATCH_SIZE = 20; // Smaller batches for reliability

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Parse filename
function parseFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})_(\d{4})_([a-f0-9]+)\.(json|png|jpg|jpeg)$/);
  if (!match) return null;
  return {
    date: match[1],
    time: match[2],
    userId: match[3],
    extension: match[4]
  };
}

async function resumeImport() {
  console.log('🔄 Resuming Solienne import');
  
  // Get highest existing archive number
  const { data: existing } = await supabase
    .from('agent_archives')
    .select('archive_number')
    .eq('agent_id', AGENT_ID)
    .eq('archive_type', ARCHIVE_TYPE)
    .order('archive_number', { ascending: false })
    .limit(1);
  
  const startFrom = existing?.[0]?.archive_number ? existing[0].archive_number + 1 : 1;
  console.log(`📍 Starting from archive number: ${startFrom}`);
  
  // Get and group files
  const files = await fs.readdir(ROOT_DIR);
  const groups = {};
  
  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed) continue;
    
    const key = `${parsed.date}_${parsed.time}_${parsed.userId}`;
    if (!groups[key]) {
      groups[key] = { ...parsed, files: {} };
    }
    
    if (parsed.extension === 'json') {
      groups[key].files.config = file;
    } else {
      groups[key].files.image = file;
    }
  }
  
  const entries = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  const remaining = entries.slice(startFrom - 1);
  
  console.log(`📊 Total: ${entries.length}, Already done: ${startFrom - 1}, Remaining: ${remaining.length}`);
  
  if (remaining.length === 0) {
    console.log('✅ All generations already imported!');
    return;
  }
  
  let successful = 0;
  let failed = 0;
  const userIds = new Set();
  
  // Process in batches
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const batchStart = startFrom + i;
    const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, startFrom + remaining.length - 1);
    
    console.log(`\n📦 Processing ${batchStart}-${batchEnd}`);
    
    for (let j = 0; j < batch.length; j++) {
      const [key, group] = batch[j];
      const id = batchStart + j;
      
      if (!group.files.image) {
        console.log(`  ⚠️  ${id}: No image`);
        continue;
      }
      
      try {
        // Upload image
        const imagePath = path.join(ROOT_DIR, group.files.image);
        const imageBuffer = await fs.readFile(imagePath);
        const ext = path.extname(group.files.image);
        const storagePath = `${PREFIX}/${id}${ext}`;
        
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, imageBuffer, {
            contentType: `image/${ext.slice(1)}`,
            upsert: true
          });
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(storagePath);
        
        // Read config
        let title = `Generation ${id}`;
        let metadata = {};
        
        if (group.files.config) {
          try {
            const configContent = await fs.readFile(path.join(ROOT_DIR, group.files.config), 'utf-8');
            const config = JSON.parse(configContent);
            metadata = config;
            
            if (config?.task?.args?.prompt) {
              title = config.task.args.prompt.substring(0, 200);
            } else if (config?.prompt) {
              title = config.prompt.substring(0, 200);
            }
          } catch (e) {
            // Continue without config
          }
        }
        
        // Insert record
        const archiveData = {
          agent_id: AGENT_ID,
          archive_type: ARCHIVE_TYPE,
          archive_number: id,
          title,
          image_url: publicUrl,
          created_date: new Date(`${group.date}T${group.time.substr(0,2)}:${group.time.substr(2,2)}:00`).toISOString(),
          created_by_user: group.userId,
          trainer_id: null,
          metadata
        };
        
        const { error: dbError } = await supabase
          .from('agent_archives')
          .insert(archiveData);
        
        if (dbError) throw dbError;
        
        userIds.add(group.userId);
        successful++;
        
        if (successful % 10 === 0) {
          process.stdout.write(`✓`);
        }
        
      } catch (error) {
        console.error(`\n  ❌ ${id}: ${error.message}`);
        failed++;
      }
    }
  }
  
  // Summary
  console.log('\n\n📊 Import Complete:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  // Final count
  const { count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  console.log(`📊 Total in database: ${count}`);
}

resumeImport().catch(console.error);