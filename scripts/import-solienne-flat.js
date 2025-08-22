const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const pLimit = require('p-limit').default || require('p-limit');
require('dotenv').config({ path: '.env.local' });

// Configuration
const ROOT_DIR = path.join(process.env.HOME, 'Desktop', 'solienne.outputs', 'solienne_creations');
const BUCKET = 'eden'; // Correct bucket name
const PREFIX = 'solienne/generations';
const AGENT_ID = 'solienne';
const ARCHIVE_TYPE = 'generation';
const CONCURRENCY = 6;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const limit = pLimit(CONCURRENCY);

// Parse filename to extract metadata
function parseFilename(filename) {
  // Format: 2025-04-11_0608_67f8b1decc4e8dea2d571302.json
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})_(\d{4})_([a-f0-9]+)\.(json|png|jpg|jpeg)$/);
  if (!match) return null;
  
  return {
    date: match[1],
    time: match[2],
    userId: match[3],
    extension: match[4]
  };
}

// Group files by their base name (without extension)
async function groupFiles(files) {
  const groups = {};
  
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
  
  return groups;
}

// Process single generation
async function processGeneration(id, group) {
  try {
    if (!group.files.image) {
      console.log(`⚠️  ${id}: No image found, skipping`);
      return { skipped: true, reason: 'no_image' };
    }
    
    // Read image and compute hash
    const imagePath = path.join(ROOT_DIR, group.files.image);
    const imageBuffer = await fs.readFile(imagePath);
    const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
    
    // Check if already exists
    const { data: existing } = await supabase
      .from('agent_archives')
      .select('id')
      .eq('hash', hash)
      .single();
    
    if (existing) {
      console.log(`⏭️  ${id}: Already exists (hash match)`);
      return { skipped: true, reason: 'duplicate' };
    }
    
    // Read config if exists
    let config = null;
    if (group.files.config) {
      try {
        const configPath = path.join(ROOT_DIR, group.files.config);
        const configContent = await fs.readFile(configPath, 'utf-8');
        config = JSON.parse(configContent);
      } catch (e) {
        console.log(`⚠️  ${id}: Could not parse config`);
      }
    }
    
    // Upload to storage
    const ext = path.extname(group.files.image);
    const storagePath = `${PREFIX}/${id}${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, imageBuffer, {
        contentType: `image/${ext.slice(1)}`,
        upsert: true
      });
    
    if (uploadError) {
      console.error(`❌ ${id}: Upload failed:`, uploadError);
      return { error: uploadError.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);
    
    // Extract metadata
    const createdByUser = group.userId;
    const createdDate = new Date(`${group.date}T${group.time.substr(0,2)}:${group.time.substr(2,2)}:00`).toISOString();
    
    // Extract title from config
    let title = `Generation`;
    if (config?.task?.args?.prompt) {
      title = config.task.args.prompt.substring(0, 100);
    } else if (config?.prompt) {
      title = config.prompt.substring(0, 100);
    }
    
    // Create database record
    const archiveData = {
      agent_id: AGENT_ID,
      archive_type: ARCHIVE_TYPE,
      archive_number: id,
      title,
      description: config?.description,
      image_url: publicUrl,
      hash,
      created_date: createdDate,
      created_by_user: createdByUser,
      metadata: config || {}
    };
    
    const { error: dbError } = await supabase
      .from('agent_archives')
      .upsert(archiveData, { onConflict: 'agent_id,archive_type,archive_number' });
    
    if (dbError) {
      console.error(`❌ ${id}: Database error:`, dbError);
      return { error: dbError.message };
    }
    
    console.log(`✅ ${id}: Imported successfully`);
    return { success: true, hash, createdByUser };
    
  } catch (error) {
    console.error(`❌ ${id}: Unexpected error:`, error);
    return { error: error.message };
  }
}

// Main import function
async function importSolienne() {
  console.log('🚀 Starting Solienne import (flat structure)');
  console.log(`📁 Root directory: ${ROOT_DIR}`);
  console.log(`🎯 Target: ${BUCKET}/${PREFIX}`);
  
  // Get all files
  const files = await fs.readdir(ROOT_DIR);
  console.log(`📊 Found ${files.length} files`);
  
  // Group files by generation
  const groups = await groupFiles(files);
  const groupEntries = Object.entries(groups);
  console.log(`📊 Found ${groupEntries.length} generations`);
  
  // Sort by date/time for consistent numbering
  groupEntries.sort((a, b) => a[0].localeCompare(b[0]));
  
  // Process in parallel with concurrency limit
  const results = await Promise.all(
    groupEntries.map(([key, group], index) => 
      limit(async () => {
        const id = index + 1; // Sequential ID starting from 1
        return {
          id,
          key,
          ...await processGeneration(id, group)
        };
      })
    )
  );
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => r.error).length;
  
  console.log('\n📊 Import Summary:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  
  // Find unique user IDs
  const userIds = new Set(results
    .filter(r => r.createdByUser)
    .map(r => r.createdByUser));
  
  if (userIds.size > 0) {
    console.log('\n👥 Unique user IDs found:');
    userIds.forEach(id => console.log(`  - ${id}`));
    
    // Check user_data_export.json for names
    try {
      const userDataPath = path.join(process.env.HOME, 'Desktop', 'solienne.outputs', 'user_data_export.json');
      const userData = JSON.parse(await fs.readFile(userDataPath, 'utf-8'));
      
      console.log('\n🔍 User ID to Name mapping:');
      userIds.forEach(id => {
        const user = userData.find(u => u.id === id);
        if (user) {
          console.log(`  - ${id}: ${user.name || user.email || 'Unknown'}`);
        }
      });
    } catch (e) {
      console.log('Could not read user_data_export.json');
    }
    
    console.log('\n💡 Run this SQL to map trainers:');
    console.log(`
-- Check unmapped users
SELECT DISTINCT created_by_user, COUNT(*) as count
FROM agent_archives
WHERE agent_id='solienne' 
  AND archive_type='generation'
  AND created_by_user IS NOT NULL
  AND created_by_user NOT IN (SELECT user_id FROM user_trainer_map)
GROUP BY created_by_user;

-- Map discovered users (replace with actual IDs)
-- INSERT INTO user_trainer_map (user_id, trainer_id) VALUES 
-- ('67f8b1decc4e8dea2d571302', 'kristi'),
-- ('67f8b215cc4e8dea2d571303', 'seth');

-- Then backfill trainer_ids
UPDATE agent_archives a
SET trainer_id = m.trainer_id
FROM user_trainer_map m
WHERE a.created_by_user = m.user_id
  AND a.trainer_id IS DISTINCT FROM m.trainer_id;
    `);
  }
  
  // Write manifest
  const manifest = results.map(r => ({
    id: r.id,
    key: r.key,
    status: r.success ? 'success' : r.skipped ? 'skipped' : 'failed',
    reason: r.reason || r.error || null,
    hash: r.hash || null,
    createdByUser: r.createdByUser || null
  }));
  
  const manifestPath = path.join(__dirname, `solienne-import-${Date.now()}.json`);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📝 Manifest saved to: ${manifestPath}`);
}

// Run import
importSolienne().catch(console.error);