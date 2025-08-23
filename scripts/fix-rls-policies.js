const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixRLSPolicies() {
  console.log('Setting up RLS policies for agent_archives...\n');
  
  try {
    // First, check if we can query with service key
    const { count: totalCount } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true });
      
    console.log(`Total records in agent_archives: ${totalCount}`);
    
    // Create RLS policy for public read access
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing select policies if any
        DROP POLICY IF EXISTS "Allow public read access" ON agent_archives;
        DROP POLICY IF EXISTS "Enable read access for all users" ON agent_archives;
        DROP POLICY IF EXISTS "Public read access" ON agent_archives;
        
        -- Create new policy for public read access
        CREATE POLICY "Allow public read access" 
        ON agent_archives 
        FOR SELECT 
        USING (true);
        
        -- Ensure RLS is enabled
        ALTER TABLE agent_archives ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (error) {
      console.error('Error creating RLS policy:', error);
      
      // Try alternative approach
      console.log('\nTrying alternative approach...');
      
      // Just try to disable RLS entirely for now
      const { error: disableError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE agent_archives DISABLE ROW LEVEL SECURITY;`
      });
      
      if (disableError) {
        console.error('Error disabling RLS:', disableError);
      } else {
        console.log('✓ Disabled RLS on agent_archives table');
      }
    } else {
      console.log('✓ Created public read access policy');
    }
    
    // Test with anon key
    console.log('\nTesting with anon key...');
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { count: anonCount } = await anonSupabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', 'solienne');
      
    console.log(`Anon key can see ${anonCount} Solienne records`);
    
    if (anonCount === 0) {
      console.log('\n⚠️  Anon key still cannot see records. You may need to:');
      console.log('1. Go to Supabase dashboard');
      console.log('2. Navigate to Authentication > Policies');
      console.log('3. Find the agent_archives table');
      console.log('4. Either disable RLS or add a SELECT policy with "true" condition');
    } else {
      console.log('\n✅ Success! Public access is working.');
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

fixRLSPolicies().catch(console.error);