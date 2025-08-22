const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function renameAbrahamEverydays() {
  console.log('🔄 Renaming Abraham everydays to early-works...');
  
  try {
    // Update archive_type in agent_archives
    const { data, error } = await supabase
      .from('agent_archives')
      .update({ archive_type: 'early_work' })
      .eq('agent_id', 'abraham')
      .eq('archive_type', 'everyday')
      .select();
    
    if (error) {
      console.error('❌ Error updating archive type:', error);
      return;
    }
    
    console.log(`✅ Updated ${data?.length || 0} records from 'everyday' to 'early_work'`);
    
    // Get list of files to rename in storage
    const { data: files, error: listError } = await supabase.storage
      .from('abraham')
      .list('everydays', {
        limit: 10000,
        offset: 0
      });
    
    if (listError) {
      console.error('❌ Error listing files:', listError);
      return;
    }
    
    console.log(`📁 Found ${files?.length || 0} files to rename in storage`);
    
    // Note: Supabase doesn't support direct file renaming
    // We'll need to update the image_url paths in the database
    
    const { data: archives, error: fetchError } = await supabase
      .from('agent_archives')
      .select('id, image_url')
      .eq('agent_id', 'abraham')
      .eq('archive_type', 'early_work');
    
    if (fetchError) {
      console.error('❌ Error fetching archives:', fetchError);
      return;
    }
    
    // Update image URLs from everydays to early-works
    let updateCount = 0;
    for (const archive of archives || []) {
      if (archive.image_url?.includes('/everydays/')) {
        const newUrl = archive.image_url.replace('/everydays/', '/early-works/');
        
        const { error: updateError } = await supabase
          .from('agent_archives')
          .update({ image_url: newUrl })
          .eq('id', archive.id);
        
        if (updateError) {
          console.error(`❌ Error updating URL for ${archive.id}:`, updateError);
        } else {
          updateCount++;
        }
      }
    }
    
    console.log(`✅ Updated ${updateCount} image URLs`);
    
    // Verify the changes
    const { count } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'abraham')
      .eq('archive_type', 'early_work');
    
    console.log(`\n📊 Final count: ${count} early works for Abraham`);
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

renameAbrahamEverydays();