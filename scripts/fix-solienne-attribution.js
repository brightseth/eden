const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixSolienneAttribution() {
  console.log('🔧 Fixing Solienne attribution and removing duplicates...\n');
  
  // First, get all Solienne records
  const { data: allRecords } = await supabase
    .from('agent_archives')
    .select('*')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('archive_number', { ascending: true })
    .order('created_at', { ascending: true }); // Keep earliest
  
  // Group by archive_number, keeping first of each
  const uniqueRecords = {};
  const duplicateIds = [];
  
  allRecords?.forEach(record => {
    if (!uniqueRecords[record.archive_number]) {
      uniqueRecords[record.archive_number] = record;
    } else {
      duplicateIds.push(record.id);
    }
  });
  
  console.log(`Found ${Object.keys(uniqueRecords).length} unique works`);
  console.log(`Found ${duplicateIds.length} duplicates to remove`);
  
  // Delete duplicates
  if (duplicateIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('agent_archives')
      .delete()
      .in('id', duplicateIds);
    
    if (deleteError) {
      console.error('Error deleting duplicates:', deleteError);
      return;
    }
    console.log(`✅ Removed ${duplicateIds.length} duplicate records`);
  }
  
  // Update all remaining records to have proper attribution
  const { error: updateError } = await supabase
    .from('agent_archives')
    .update({
      trainer_id: 'kristi',
      created_by_user: null // Clear bogus user IDs
    })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  if (updateError) {
    console.error('Error updating attribution:', updateError);
    return;
  }
  
  console.log('✅ Set all Solienne works to trainer: Kristi');
  console.log('✅ Cleared bogus user IDs');
  
  // Final count
  const { count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  console.log(`\n📊 Final status: ${count} unique Solienne generations`);
  console.log('All properly attributed to Kristi as trainer');
}

fixSolienneAttribution().catch(console.error);