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
const THUMBNAIL_SIZE = 400; // Single size for now
const BATCH_SIZE = 20;

async function generateThumbnail(imageBuffer, size) {
  try {
    // First, read the image to handle various formats
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    // Handle PNG, JPEG, WebP, etc.
    return await image
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: false
      })
      .jpeg({ 
        quality: 85,
        mozjpeg: true 
      })
      .toBuffer();
  } catch (error) {
    console.error(`Failed to generate thumbnail: ${error.message}`);
    return null;
  }
}

async function processBatch(archives) {
  const results = await Promise.all(archives.map(async (archive) => {
    if (!archive.image_url) {
      return { id: archive.id, status: 'skipped' };
    }
    
    // Skip if already has thumbnail
    if (archive.thumbnail_url) {
      return { id: archive.id, status: 'exists' };
    }
    
    try {
      // Extract path from URL
      const urlPath = archive.image_url.split('/storage/v1/object/public/')[1];
      if (!urlPath) {
        return { id: archive.id, status: 'invalid_url' };
      }
      
      // Download original image
      const { data: imageData, error: downloadError } = await supabase.storage
        .from('eden')
        .download(urlPath.replace('eden/', ''));
      
      if (downloadError) {
        console.error(`Download error for ${archive.agent_id} #${archive.archive_number}:`, downloadError.message);
        return { id: archive.id, status: 'download_failed' };
      }
      
      // Convert to buffer and generate thumbnail
      const buffer = Buffer.from(await imageData.arrayBuffer());
      const thumbnailBuffer = await generateThumbnail(buffer, THUMBNAIL_SIZE);
      
      if (!thumbnailBuffer) {
        return { id: archive.id, status: 'generation_failed' };
      }
      
      // Create thumbnail path
      const ext = path.extname(urlPath);
      const thumbnailPath = urlPath.replace(ext, `_thumb.jpg`);
      
      // Upload thumbnail
      const { error: uploadError } = await supabase.storage
        .from('eden')
        .upload(thumbnailPath.replace('eden/', ''), thumbnailBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (uploadError) {
        console.error(`Upload error for ${archive.agent_id} #${archive.archive_number}:`, uploadError.message);
        return { id: archive.id, status: 'upload_failed' };
      }
      
      // Build public URL
      const thumbnailUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${thumbnailPath}`;
      
      // Update database
      const { error: updateError } = await supabase
        .from('agent_archives')
        .update({ thumbnail_url: thumbnailUrl })
        .eq('id', archive.id);
      
      if (updateError) {
        console.error(`DB update error for ${archive.agent_id} #${archive.archive_number}:`, updateError.message);
        return { id: archive.id, status: 'db_update_failed' };
      }
      
      return { id: archive.id, status: 'success' };
      
    } catch (error) {
      console.error(`Error processing ${archive.agent_id} #${archive.archive_number}:`, error.message);
      return { id: archive.id, status: 'failed', error: error.message };
    }
  }));
  
  return results;
}

async function generateAllThumbnails() {
  console.log('🖼️  Thumbnail Generation Tool');
  console.log('==============================\n');
  
  // Get total count
  const { count: totalCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .not('image_url', 'is', null)
    .is('thumbnail_url', null);
  
  console.log(`📊 Found ${totalCount} images needing thumbnails\n`);
  
  if (totalCount === 0) {
    console.log('✅ All images already have thumbnails!');
    return;
  }
  
  let processed = 0;
  let successful = 0;
  let failed = 0;
  let skipped = 0;
  
  // Process in chunks to avoid memory issues
  const CHUNK_SIZE = 100;
  
  for (let offset = 0; offset < totalCount; offset += CHUNK_SIZE) {
    // Get next chunk
    const { data: archives, error } = await supabase
      .from('agent_archives')
      .select('id, image_url, thumbnail_url, agent_id, archive_number')
      .not('image_url', 'is', null)
      .is('thumbnail_url', null)
      .order('created_date', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);
    
    if (error) {
      console.error('Failed to fetch archives:', error);
      continue;
    }
    
    // Process chunk in batches
    for (let i = 0; i < archives.length; i += BATCH_SIZE) {
      const batch = archives.slice(i, i + BATCH_SIZE);
      process.stdout.write(`\r⏳ Processing ${processed + i}/${totalCount}...`);
      
      const results = await processBatch(batch);
      
      successful += results.filter(r => r.status === 'success').length;
      failed += results.filter(r => r.status === 'failed' || r.status === 'download_failed' || r.status === 'upload_failed').length;
      skipped += results.filter(r => r.status === 'skipped' || r.status === 'exists').length;
    }
    
    processed += archives.length;
  }
  
  console.log('\n\n📊 Final Results:');
  console.log(`✅ Successfully generated: ${successful} thumbnails`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  
  // Verify final count
  const { count: withThumbnails } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .not('thumbnail_url', 'is', null);
  
  console.log(`\n📷 Total records with thumbnails: ${withThumbnails}`);
}

generateAllThumbnails().catch(console.error);