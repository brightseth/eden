// Get the actual agent ID for Solienne
// Run with: node scripts/get-agent-id.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getAgentId() {
  try {
    // Get Solienne agent
    const { data: agents, error } = await supabase
      .from('agents')
      .select('id, name, creator_name, daily_practice_active')
      .eq('name', 'Solienne');
    
    if (error) throw error;
    
    console.log('Found agents:', agents);
    
    if (agents && agents.length > 0) {
      const agentId = agents[0].id;
      console.log(`\nSolienne Agent ID: ${agentId}`);
      
      // Test the financial model
      const { data: financialModel } = await supabase
        .from('financial_models')
        .select('*')
        .eq('agent_id', agentId)
        .eq('active', true);
      
      console.log('Financial model found:', financialModel ? 'Yes' : 'No');
      
      // Test daily practice entries
      const { data: practiceEntries } = await supabase
        .from('daily_practice_entries')
        .select('date, theme, collects')
        .eq('agent_id', agentId)
        .order('date', { ascending: false })
        .limit(3);
      
      console.log('Recent practice entries:', practiceEntries?.length || 0);
      if (practiceEntries?.length > 0) {
        console.log('Latest entry:', practiceEntries[0]);
      }
      
      return agentId;
    } else {
      console.log('No Solienne agent found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAgentId();