#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('Setting up storage buckets...\n');
  
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  
  console.log('Existing buckets:', buckets?.map(b => b.name).join(', ') || 'none');
  
  const bucketName = 'eden';
  const bucketExists = buckets?.some(b => b.name === bucketName);
  
  if (!bucketExists) {
    console.log(`\nCreating '${bucketName}' bucket...`);
    
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
    } else {
      console.log(`✓ Bucket '${bucketName}' created successfully`);
    }
  } else {
    console.log(`✓ Bucket '${bucketName}' already exists`);
  }
  
  // Test upload
  console.log('\nTesting storage upload...');
  const testPath = 'test/test.txt';
  const testContent = 'Eden Academy Storage Test';
  
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(testPath, testContent, {
      contentType: 'text/plain',
      upsert: true
    });
  
  if (uploadError) {
    console.error('Upload test failed:', uploadError);
  } else {
    console.log('✓ Upload test successful');
    
    // Clean up test file
    await supabase.storage.from(bucketName).remove([testPath]);
  }
}

setupStorage().catch(console.error);