const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// Configuration
const ROOT_DIR = path.join(process.env.HOME, 'Desktop', 'solienne.outputs', 'solienne_creations');
const BUCKET = 'eden';
const PREFIX = 'solienne/generations';
const AGENT_ID = 'solienne';
const ARCHIVE_TYPE = 'generation';
const TEST_LIMIT = 10; // Only process first 10

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Parse filename to extract metadata
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

async function testImport() {
  console.log('🧪 Testing Solienne import with first 10 items');
  
  // Get all files
  const files = await fs.readdir(ROOT_DIR);
  const groups = {};
  
  // Group files
  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed) continue;
    
    const baseKey = `${parsed.date}_${parsed.time}_${parsed.userId}`;
    if (!groups[baseKey]) {
      groups[baseKey] = {
        date: parsed.date,
        time: parsed.time,
        userId: parsed.userId,
        files: {}
      };
    }
    
    if (parsed.extension === 'json') {
      groups[baseKey].files.config = file;
    } else if (['png', 'jpg', 'jpeg'].includes(parsed.extension)) {
      groups[baseKey].files.image = file;
    }
  }
  
  const entries = Object.entries(groups).slice(0, TEST_LIMIT);
  console.log(`Processing ${entries.length} test items...`);
  
  for (const [key, group] of entries) {
    const id = entries.indexOf([key, group]) + 1;
    
    if (!group.files.image) {
      console.log(`⚠️  ${id}: No image`);
      continue;
    }
    
    try {
      // Read and upload image
      const imagePath = path.join(ROOT_DIR, group.files.image);
      const imageBuffer = await fs.readFile(imagePath);
      const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
      
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
      
      // Read config if exists
      let config = null;
      if (group.files.config) {
        try {
          const configContent = await fs.readFile(path.join(ROOT_DIR, group.files.config), 'utf-8');
          config = JSON.parse(configContent);
        } catch (e) {
          console.log(`⚠️  Could not parse config for ${id}`);
        }
      }
      
      // Create record
      const archiveData = {
        agent_id: AGENT_ID,
        archive_type: ARCHIVE_TYPE,
        archive_number: id,
        title: config?.task?.args?.prompt || config?.prompt || `Generation ${id}`,
        image_url: publicUrl,
        hash,
        created_date: new Date(`${group.date}T${group.time.substr(0,2)}:${group.time.substr(2,2)}:00`).toISOString(),
        created_by_user: group.userId,
        metadata: config || {}
      };
      
      const { error: dbError } = await supabase
        .from('agent_archives')
        .upsert(archiveData, { onConflict: 'agent_id,archive_type,archive_number' });
      
      if (dbError) throw dbError;
      
      console.log(`✅ ${id}: Success - User: ${group.userId}`);
    } catch (error) {
      console.error(`❌ ${id}: ${error.message}`);
    }
  }
  
  // Check results
  const { data: imported, count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact' })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('archive_number')
    .limit(TEST_LIMIT);
  
  console.log(`\n📊 Test complete: ${count} items in database`);
  if (imported && imported.length > 0) {
    console.log('Sample URLs:');
    imported.slice(0, 3).forEach(item => {
      console.log(`  - ${item.archive_number}: ${item.image_url}`);
    });
  }
}

testImport().catch(console.error);