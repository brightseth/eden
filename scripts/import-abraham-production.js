#!/usr/bin/env node

/**
 * Abraham Everydays Production Import Script
 * Imports from desktop folder structure with deduplication and logging
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const CONFIG = {
  rootPath: process.env.ABRAHAM_ROOT || '/Users/seth/Desktop/abraham_2021',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_KEY,
  bucketName: 'eden',
  concurrency: 8,
  dryRun: false,
  limit: null,
  logDir: './imports/abraham',
  quarantineFile: './imports/abraham/quarantine.csv',
  manifestFile: './imports/abraham/manifest.csv'
};

// Parse command line args
const args = process.argv.slice(2);
args.forEach((arg, i) => {
  if (arg === '--dry-run') CONFIG.dryRun = true;
  if (arg === '--limit') CONFIG.limit = parseInt(args[i + 1]);
  if (arg === '--concurrency') CONFIG.concurrency = parseInt(args[i + 1]);
  if (arg === '--root') CONFIG.rootPath = args[i + 1];
});

// Initialize Supabase
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// Ensure log directory exists
if (!fs.existsSync(CONFIG.logDir)) {
  fs.mkdirSync(CONFIG.logDir, { recursive: true });
}

// Initialize CSV logs
const manifestStream = fs.createWriteStream(CONFIG.manifestFile);
const quarantineStream = fs.createWriteStream(CONFIG.quarantineFile);

manifestStream.write('archive_id,folder_name,image_url,hash,status,notes,timestamp\n');
quarantineStream.write('folder_name,issue,timestamp\n');

// Stats tracking
const stats = {
  total: 0,
  processed: 0,
  uploaded: 0,
  skipped: 0,
  quarantined: 0,
  errors: 0,
  duplicates: 0
};

/**
 * Calculate SHA256 hash of a file
 */
function calculateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Parse date from folder name or config
 */
function parseDate(folderName, config) {
  // Try to extract date from config first
  if (config.created_at) {
    return config.created_at.split('T')[0];
  }
  
  // Calculate from folder number (starting Oct 19, 2012)
  const folderNum = parseInt(folderName);
  if (!isNaN(folderNum)) {
    const startDate = new Date('2012-10-19');
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + folderNum - 1);
    return targetDate.toISOString().split('T')[0];
  }
  
  return null;
}

/**
 * Process a single everyday folder
 */
async function processEveryday(folderPath, folderName) {
  const startTime = Date.now();
  
  try {
    // Check for required files
    const imagePath = path.join(folderPath, 'image.jpg');
    const configPath = path.join(folderPath, 'config.json');
    const statsPath = path.join(folderPath, 'stats.json');
    
    if (!fs.existsSync(imagePath)) {
      quarantineStream.write(`${folderName},missing image.jpg,${new Date().toISOString()}\n`);
      stats.quarantined++;
      return;
    }
    
    if (!fs.existsSync(configPath)) {
      quarantineStream.write(`${folderName},missing config.json,${new Date().toISOString()}\n`);
      stats.quarantined++;
      return;
    }
    
    // Read config and stats
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const statsData = fs.existsSync(statsPath) ? 
      JSON.parse(fs.readFileSync(statsPath, 'utf8')) : null;
    
    // Calculate image hash for deduplication
    const imageHash = calculateHash(imagePath);
    
    // Check for duplicates
    const { data: existing } = await supabase
      .from('agent_archives')
      .select('id')
      .eq('agent_id', 'abraham')
      .eq('metadata->hash', imageHash)
      .single();
    
    if (existing) {
      console.log(`⚠️  Duplicate found for ${folderName} (hash: ${imageHash.substring(0, 8)}...)`);
      manifestStream.write(`${folderName},${folderName},,${imageHash},duplicate,,${new Date().toISOString()}\n`);
      stats.duplicates++;
      stats.skipped++;
      return;
    }
    
    // Prepare storage path
    const storagePath = `abraham/everydays/${folderName}/image.jpg`;
    
    // Upload to storage (unless dry run)
    const supabaseHost = CONFIG.supabaseUrl.replace('https://', '').replace('http://', '');
    let publicUrl = `https://${supabaseHost}/storage/v1/object/public/${CONFIG.bucketName}/${storagePath}`;
    
    if (!CONFIG.dryRun) {
      const imageBuffer = fs.readFileSync(imagePath);
      const { error: uploadError } = await supabase.storage
        .from(CONFIG.bucketName)
        .upload(storagePath, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (uploadError) {
        console.error(`❌ Upload failed for ${folderName}:`, uploadError.message);
        stats.errors++;
        return;
      }
    }
    
    // Extract prompts from text_inputs
    const prompts = config.text_inputs?.map(input => input.text).filter(Boolean) || [];
    const primaryPrompt = config.text_input || prompts[0] || '';
    
    // Prepare archive record
    const archiveData = {
      agent_id: 'abraham',
      archive_type: 'everyday',
      archive_number: parseInt(folderName),
      title: `Everyday #${folderName}`,
      description: primaryPrompt.substring(0, 500),
      image_url: publicUrl,
      thumbnail_url: publicUrl, // Will be replaced with actual thumbnail later
      created_date: parseDate(folderName, config),
      metadata: {
        hash: imageHash,
        folder_name: folderName,
        config: {
          model_name: config.model_name,
          clip_model: config.clip_model,
          width: config.width,
          height: config.height,
          text_inputs: config.text_inputs,
          num_iterations: config.num_iterations,
          octave_scale: config.octave_scale,
          cutn: config.cutn
        },
        stats: statsData,
        prompts: prompts,
        import_date: new Date().toISOString()
      }
    };
    
    // Insert to database (unless dry run)
    if (!CONFIG.dryRun) {
      const { error: dbError } = await supabase
        .from('agent_archives')
        .insert(archiveData);
      
      if (dbError) {
        console.error(`❌ DB insert failed for ${folderName}:`, dbError.message);
        stats.errors++;
        return;
      }
    }
    
    // Log success
    const duration = Date.now() - startTime;
    console.log(`✓ ${folderName} imported (${duration}ms)`);
    manifestStream.write(`${archiveData.archive_number},${folderName},${publicUrl},${imageHash},success,,${new Date().toISOString()}\n`);
    stats.uploaded++;
    
  } catch (error) {
    console.error(`❌ Error processing ${folderName}:`, error.message);
    quarantineStream.write(`${folderName},${error.message},${new Date().toISOString()}\n`);
    stats.errors++;
  }
}

/**
 * Process folders in batches with concurrency control
 */
async function processBatch(folders) {
  const batchSize = CONFIG.concurrency;
  
  for (let i = 0; i < folders.length; i += batchSize) {
    const batch = folders.slice(i, i + batchSize);
    await Promise.all(
      batch.map(folder => 
        processEveryday(
          path.join(CONFIG.rootPath, folder),
          folder
        )
      )
    );
    
    stats.processed += batch.length;
    
    // Progress update
    if (stats.processed % 100 === 0) {
      console.log(`\n📊 Progress: ${stats.processed}/${stats.total} folders processed`);
      console.log(`   Uploaded: ${stats.uploaded} | Skipped: ${stats.skipped} | Errors: ${stats.errors}`);
    }
  }
}

/**
 * Main import function
 */
async function main() {
  console.log('🎨 Abraham Everydays Import Script');
  console.log('===================================');
  console.log(`Root path: ${CONFIG.rootPath}`);
  console.log(`Dry run: ${CONFIG.dryRun}`);
  console.log(`Concurrency: ${CONFIG.concurrency}`);
  console.log(`Limit: ${CONFIG.limit || 'all'}`);
  console.log('');
  
  // Get all folders
  let folders = fs.readdirSync(CONFIG.rootPath)
    .filter(f => fs.statSync(path.join(CONFIG.rootPath, f)).isDirectory())
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  // Apply limit if specified
  if (CONFIG.limit) {
    folders = folders.slice(0, CONFIG.limit);
  }
  
  stats.total = folders.length;
  console.log(`Found ${stats.total} folders to process\n`);
  
  if (CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be uploaded\n');
  }
  
  const startTime = Date.now();
  
  // Process all folders
  await processBatch(folders);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  // Final report
  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT COMPLETE');
  console.log('='.repeat(50));
  console.log(`Time elapsed: ${duration} seconds`);
  console.log(`Total processed: ${stats.processed}/${stats.total}`);
  console.log(`✓ Uploaded: ${stats.uploaded}`);
  console.log(`⚠️  Duplicates: ${stats.duplicates}`);
  console.log(`⚠️  Quarantined: ${stats.quarantined}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log('');
  console.log(`📁 Manifest: ${CONFIG.manifestFile}`);
  console.log(`📁 Quarantine: ${CONFIG.quarantineFile}`);
  
  // Close streams
  manifestStream.end();
  quarantineStream.end();
  
  // Run verification queries if not dry run
  if (!CONFIG.dryRun && stats.uploaded > 0) {
    console.log('\n🔍 Running verification queries...\n');
    
    const { count: totalCount } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'abraham')
      .eq('archive_type', 'everyday');
    
    console.log(`Total Abraham everydays in database: ${totalCount}`);
    
    const { data: dateRange } = await supabase
      .from('agent_archives')
      .select('created_date')
      .eq('agent_id', 'abraham')
      .eq('archive_type', 'everyday')
      .order('created_date', { ascending: true })
      .limit(1);
    
    const { data: latestDate } = await supabase
      .from('agent_archives')
      .select('created_date')
      .eq('agent_id', 'abraham')
      .eq('archive_type', 'everyday')
      .order('created_date', { ascending: false })
      .limit(1);
    
    if (dateRange && latestDate) {
      console.log(`Date range: ${dateRange[0].created_date} to ${latestDate[0].created_date}`);
    }
  }
}

// Run the import
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});