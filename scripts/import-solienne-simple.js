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

async function importSolienne() {
  console.log('🚀 Starting Solienne import (simplified)');
  console.log(`📁 Source: ${ROOT_DIR}`);
  console.log(`🎯 Target: ${BUCKET}/${PREFIX}`);
  
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
  console.log(`📊 Found ${entries.length} generations`);
  
  let successful = 0;
  let failed = 0;
  const userIds = new Set();
  
  // Process each generation
  for (let i = 0; i < entries.length; i++) {
    const [key, group] = entries[i];
    const id = i + 1;
    
    if (!group.files.image) {
      console.log(`⚠️  ${id}: No image`);
      failed++;
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
          
          // Extract title from prompt
          if (config?.task?.args?.prompt) {
            title = config.task.args.prompt.substring(0, 200);
          } else if (config?.prompt) {
            title = config.prompt.substring(0, 200);
          }
        } catch (e) {
          // Config parse failed, continue anyway
        }
      }
      
      // Create database record (using only known columns)
      const archiveData = {
        agent_id: AGENT_ID,
        archive_type: ARCHIVE_TYPE,
        archive_number: id,
        title,
        image_url: publicUrl,
        created_date: new Date(`${group.date}T${group.time.substr(0,2)}:${group.time.substr(2,2)}:00`).toISOString(),
        created_by_user: group.userId,
        trainer_id: null, // Will be mapped later
        metadata
      };
      
      // First check if exists
      const { data: existing } = await supabase
        .from('agent_archives')
        .select('id')
        .eq('agent_id', AGENT_ID)
        .eq('archive_type', ARCHIVE_TYPE)
        .eq('archive_number', id)
        .single();
      
      let dbError;
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('agent_archives')
          .update(archiveData)
          .eq('id', existing.id);
        dbError = error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('agent_archives')
          .insert(archiveData);
        dbError = error;
      }
      
      if (dbError) throw dbError;
      
      userIds.add(group.userId);
      successful++;
      
      if (successful % 100 === 0) {
        console.log(`✅ Progress: ${successful}/${entries.length}`);
      }
      
    } catch (error) {
      console.error(`❌ ${id}: ${error.message}`);
      failed++;
    }
  }
  
  // Summary
  console.log('\n📊 Import Complete:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  // Show unique users
  if (userIds.size > 0) {
    console.log('\n👥 Unique user IDs found:');
    
    // Try to map to names
    try {
      const userDataPath = path.join(process.env.HOME, 'Desktop', 'solienne.outputs', 'user_data_export.json');
      const userData = JSON.parse(await fs.readFile(userDataPath, 'utf-8'));
      
      userIds.forEach(id => {
        const user = userData.find(u => u.id === id);
        const name = user ? (user.name || user.email || 'Unknown') : 'Not in export';
        console.log(`  ${id}: ${name}`);
      });
    } catch (e) {
      userIds.forEach(id => console.log(`  ${id}`));
    }
    
    console.log('\n💡 To map users to trainers, run this SQL:');
    console.log(`
-- See work counts by user
SELECT created_by_user, COUNT(*) as works
FROM agent_archives
WHERE agent_id='solienne' AND archive_type='generation'
GROUP BY created_by_user
ORDER BY works DESC;

-- Map users to trainers (example)
INSERT INTO user_trainer_map (user_id, trainer_id) VALUES
  ('USER_ID_HERE', 'kristi'),
  ('USER_ID_HERE', 'seth')
ON CONFLICT DO NOTHING;

-- Apply trainer mapping
UPDATE agent_archives a
SET trainer_id = m.trainer_id
FROM user_trainer_map m
WHERE a.created_by_user = m.user_id
  AND a.trainer_id IS NULL;
    `);
  }
}

importSolienne().catch(console.error);