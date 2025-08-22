const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = 'eden';
const THUMBNAIL_SIZES = {
  small: 200,  // For grid view
  medium: 400, // For list view
  large: 800   // For detail view
};

async function generateThumbnail(imageUrl, size, outputPath) {
  try {
    // Download image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // Generate thumbnail
    await sharp(Buffer.from(buffer))
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
      
    return true;
  } catch (error) {
    console.error(`Failed to generate thumbnail: ${error.message}`);
    return false;
  }
}

async function processBatch(archives, startIdx) {
  const results = [];
  
  for (let i = 0; i < archives.length; i++) {
    const archive = archives[i];
    const idx = startIdx + i;
    
    if (!archive.image_url) {
      results.push({ id: archive.id, status: 'skipped', reason: 'no_image' });
      continue;
    }
    
    try {
      // Extract path from URL
      const urlParts = archive.image_url.split('/storage/v1/object/public/eden/');
      if (urlParts.length !== 2) {
        results.push({ id: archive.id, status: 'skipped', reason: 'invalid_url' });
        continue;
      }
      
      const originalPath = urlParts[1];
      const pathParts = originalPath.split('/');
      const filename = pathParts[pathParts.length - 1];
      const basePath = pathParts.slice(0, -1).join('/');
      
      // Generate thumbnails for each size
      for (const [sizeName, sizeValue] of Object.entries(THUMBNAIL_SIZES)) {
        const thumbnailPath = `${basePath}/thumbnails/${sizeName}/${filename}`;
        
        // Check if thumbnail already exists
        const { data: existing } = await supabase.storage
          .from(BUCKET)
          .list(`${basePath}/thumbnails/${sizeName}`, {
            limit: 1,
            search: filename
          });
        
        if (existing && existing.length > 0) {
          console.log(`  ⏭️  ${idx}: Thumbnail ${sizeName} already exists`);
          continue;
        }
        
        // Generate thumbnail locally
        const tempPath = `/tmp/thumb_${sizeName}_${filename}`;
        const success = await generateThumbnail(archive.image_url, sizeValue, tempPath);
        
        if (!success) {
          console.log(`  ⚠️  ${idx}: Failed to generate ${sizeName} thumbnail`);
          continue;
        }
        
        // Upload to storage
        const thumbnailBuffer = await fs.readFile(tempPath);
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(thumbnailPath, thumbnailBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });
        
        if (uploadError) {
          console.log(`  ❌ ${idx}: Upload failed for ${sizeName}: ${uploadError.message}`);
        } else {
          console.log(`  ✅ ${idx}: Generated ${sizeName} thumbnail`);
        }
        
        // Clean up temp file
        await fs.unlink(tempPath).catch(() => {});
      }
      
      // Update database with thumbnail URLs
      const thumbnailUrls = {};
      for (const sizeName of Object.keys(THUMBNAIL_SIZES)) {
        const thumbnailPath = `${basePath}/thumbnails/${sizeName}/${filename}`;
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(thumbnailPath);
        thumbnailUrls[sizeName] = publicUrl;
      }
      
      // Store thumbnail URLs in metadata
      const { error: updateError } = await supabase
        .from('agent_archives')
        .update({
          metadata: {
            ...archive.metadata,
            thumbnails: thumbnailUrls
          }
        })
        .eq('id', archive.id);
      
      if (updateError) {
        console.log(`  ❌ ${idx}: Failed to update database: ${updateError.message}`);
      }
      
      results.push({ id: archive.id, status: 'success' });
      
    } catch (error) {
      console.error(`  ❌ ${idx}: ${error.message}`);
      results.push({ id: archive.id, status: 'failed', error: error.message });
    }
  }
  
  return results;
}

async function generateAllThumbnails() {
  console.log('🖼️  Thumbnail Generation Tool');
  console.log('==============================\n');
  
  // Check if sharp is installed
  try {
    require('sharp');
  } catch (e) {
    console.log('❌ Sharp not installed. Run: npm install sharp');
    return;
  }
  
  // Get archives that need thumbnails
  const { data: archives, error } = await supabase
    .from('agent_archives')
    .select('id, image_url, metadata, agent_id, archive_type')
    .or('agent_id.eq.abraham,agent_id.eq.solienne')
    .order('created_date', { ascending: false })
    .limit(100); // Start with first 100
  
  if (error) {
    console.error('Failed to fetch archives:', error);
    return;
  }
  
  console.log(`📊 Found ${archives.length} archives to process\n`);
  
  // Process in batches
  const BATCH_SIZE = 10;
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < archives.length; i += BATCH_SIZE) {
    const batch = archives.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(archives.length/BATCH_SIZE)}`);
    
    const results = await processBatch(batch, i);
    successful += results.filter(r => r.status === 'success').length;
    failed += results.filter(r => r.status === 'failed').length;
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${archives.length - successful - failed}`);
}

// Allow running specific agents
const agent = process.argv[2];
if (agent) {
  console.log(`Processing only ${agent} archives...`);
}

generateAllThumbnails().catch(console.error);