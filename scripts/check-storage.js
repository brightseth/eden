const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkStorage() {
  // List buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  
  console.log('Available buckets:');
  buckets.forEach(bucket => {
    console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
  });
  
  // Create bucket if needed
  if (!buckets.find(b => b.name === 'eden')) {
    console.log('\nCreating "eden" bucket...');
    const { data, error: createError } = await supabase.storage.createBucket('eden', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });
    
    if (createError) {
      console.error('Error creating bucket:', createError);
    } else {
      console.log('✅ Created "eden" bucket');
    }
  } else {
    console.log('\n✅ "eden" bucket already exists');
  }
}

checkStorage();