#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing agent_archives insert...\n');
  
  const testData = {
    agent_id: 'abraham',
    archive_type: 'everyday',
    archive_number: 9999,
    title: 'Test Everyday',
    description: 'Test description',
    image_url: 'https://example.com/test.jpg',
    created_date: '2024-01-01',
    metadata: {
      test: true
    }
  };
  
  const { data, error } = await supabase
    .from('agent_archives')
    .insert(testData)
    .select();
  
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert successful:', data);
    
    // Clean up
    if (data && data[0]) {
      await supabase
        .from('agent_archives')
        .delete()
        .eq('id', data[0].id);
      console.log('Test record cleaned up');
    }
  }
}

testInsert().catch(console.error);