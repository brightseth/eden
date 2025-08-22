const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const pLimit = require('p-limit');
require('dotenv').config({ path: '.env.local' });

// Configuration
const ROOT_DIR = process.env.SOLIENNE_ROOT || path.join(process.env.HOME, 'Desktop', 'solienne.outputs');
const BUCKET = 'abraham'; // Using existing bucket
const PREFIX = 'solienne/generations';
const AGENT_ID = 'solienne';
const ARCHIVE_TYPE = 'generation';
const CONCURRENCY = 6;
const CURATION_FILE = process.env.CURATION_CSV || null;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const limit = pLimit(CONCURRENCY);

// Load curation list if provided
async function loadCurationList() {
  if (!CURATION_FILE) return new Set();
  
  try {
    const content = await fs.readFile(CURATION_FILE, 'utf-8');
    const ids = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
    console.log(`📋 Loaded ${ids.length} items for Paris Photo curation`);
    return new Set(ids);
  } catch (error) {
    console.log('📋 No curation file found, skipping curation tags');
    return new Set();
  }
}

// Find image file in folder
async function findImageFile(folderPath) {
  const possibleNames = ['image.jpg', 'image.jpeg', 'image.png', 'output.jpg', 'output.png'];
  
  for (const name of possibleNames) {
    const imagePath = path.join(folderPath, name);
    try {
      await fs.access(imagePath);
      return { path: imagePath, name };
    } catch {}
  }
  
  // Fallback: find any image file
  const files = await fs.readdir(folderPath);
  const imageFile = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  if (imageFile) {
    return { path: path.join(folderPath, imageFile), name: imageFile };
  }
  
  return null;
}

// Find config file in folder
async function findConfigFile(folderPath) {
  const possibleNames = ['config.json', 'meta.json', 'metadata.json'];
  
  for (const name of possibleNames) {
    const configPath = path.join(folderPath, name);
    try {
      await fs.access(configPath);
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch {}
  }
  
  return null;
}

// Process single archive folder
async function processArchive(archiveId, folderPath, curatedFor = []) {
  try {
    // Find image
    const imageInfo = await findImageFile(folderPath);
    if (!imageInfo) {
      console.log(`⚠️  ${archiveId}: No image found, skipping`);
      return { skipped: true, reason: 'no_image' };
    }
    
    // Find config
    const config = await findConfigFile(folderPath);
    
    // Read image and compute hash
    const imageBuffer = await fs.readFile(imageInfo.path);
    const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
    
    // Check if already exists
    const { data: existing } = await supabase
      .from('agent_archives')
      .select('id')
      .eq('hash', hash)
      .single();
    
    if (existing) {
      console.log(`⏭️  ${archiveId}: Already exists (hash match)`);
      return { skipped: true, reason: 'duplicate' };
    }
    
    // Upload to storage
    const ext = path.extname(imageInfo.name);
    const storagePath = `${PREFIX}/${archiveId}${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, imageBuffer, {
        contentType: `image/${ext.slice(1)}`,
        upsert: true
      });
    
    if (uploadError) {
      console.error(`❌ ${archiveId}: Upload failed:`, uploadError);
      return { error: uploadError.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);
    
    // Extract created_by_user from config
    const createdByUser = config?.user || config?.task?.user || null;
    
    // Parse creation date from config or folder
    let createdDate = new Date().toISOString();
    if (config?.createdAt) {
      createdDate = new Date(config.createdAt).toISOString();
    } else if (config?.timestamp) {
      createdDate = new Date(config.timestamp).toISOString();
    }
    
    // Create database record
    const archiveData = {
      agent_id: AGENT_ID,
      archive_type: ARCHIVE_TYPE,
      archive_id: parseInt(archiveId),
      title: config?.task?.args?.prompt || config?.prompt || `Generation ${archiveId}`,
      description: config?.description,
      image_url: publicUrl,
      hash,
      basename: archiveId,
      created_date: createdDate,
      created_by_user: createdByUser,
      metadata: { config },
      curated_for: curatedFor.length > 0 ? curatedFor : null
    };
    
    const { error: dbError } = await supabase
      .from('agent_archives')
      .upsert(archiveData, { onConflict: 'agent_id,archive_type,archive_id' });
    
    if (dbError) {
      console.error(`❌ ${archiveId}: Database error:`, dbError);
      return { error: dbError.message };
    }
    
    console.log(`✅ ${archiveId}: Imported successfully${curatedFor.length > 0 ? ' [CURATED]' : ''}`);
    return { success: true, hash, createdByUser };
    
  } catch (error) {
    console.error(`❌ ${archiveId}: Unexpected error:`, error);
    return { error: error.message };
  }
}

// Main import function
async function importSolienne() {
  console.log('🚀 Starting Solienne import');
  console.log(`📁 Root directory: ${ROOT_DIR}`);
  console.log(`🎯 Target: ${BUCKET}/${PREFIX}`);
  
  // Load curation list
  const curationSet = await loadCurationList();
  
  // Get all folders
  const folders = await fs.readdir(ROOT_DIR);
  const archiveFolders = folders
    .filter(f => /^\d{4}$/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  console.log(`📊 Found ${archiveFolders.length} archive folders`);
  
  // Process in parallel with concurrency limit
  const results = await Promise.all(
    archiveFolders.map(folder => 
      limit(async () => {
        const folderPath = path.join(ROOT_DIR, folder);
        const curatedFor = curationSet.has(folder) ? ['paris_photo'] : [];
        return {
          folder,
          ...await processArchive(folder, folderPath, curatedFor)
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
    console.log('\n💡 Run this SQL to discover unmapped trainers:');
    console.log(`
SELECT DISTINCT created_by_user
FROM agent_archives
WHERE agent_id='solienne' 
  AND archive_type='generation'
  AND created_by_user IS NOT NULL
  AND created_by_user NOT IN (SELECT user_id FROM user_trainer_map);
    `);
  }
  
  // Write manifest
  const manifest = results.map(r => ({
    folder: r.folder,
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