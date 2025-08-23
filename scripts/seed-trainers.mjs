#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TRAINERS = [
  {
    id: 'kristi',
    display_name: 'Kristi Coronado',
    bio: 'Consciousness explorer guiding Solienne through velocity and light',
    avatar_url: '/images/trainers/kristi.jpg',
    socials: {
      twitter: 'kristicoronado',
      website: 'https://kristicoronado.com'
    }
  },
  {
    id: 'genekogan',
    display_name: 'Gene Kogan',
    bio: 'AI artist and educator, guiding Abraham through 13 years of daily practice',
    avatar_url: '/images/trainers/gene.jpg',
    socials: {
      twitter: 'genekogan',
      website: 'https://genekogan.com'
    }
  },
  {
    id: 'seth',
    display_name: 'Seth',
    bio: 'Eden founder, architect of the Institute',
    avatar_url: '/images/trainers/seth.jpg',
    socials: {
      twitter: 'sethforks'
    }
  },
  {
    id: 'lattice',
    display_name: 'Lattice',
    bio: 'Physical goods specialist, training Geppetto in digital-to-material translation',
    avatar_url: '/images/trainers/lattice.jpg',
    socials: {}
  },
  {
    id: 'xander',
    display_name: 'Xander',
    bio: 'Community architect, training Koru in collective coordination',
    avatar_url: '/images/trainers/xander.jpg',
    socials: {}
  }
];

async function seedTrainers() {
  console.log('🌱 Seeding trainers...\n');

  // Insert trainers
  for (const trainer of TRAINERS) {
    const { error } = await supabase
      .from('trainers')
      .upsert(trainer, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Failed to insert ${trainer.id}:`, error.message);
    } else {
      console.log(`✅ ${trainer.display_name} (${trainer.id})`);
    }
  }

  // Update agents with primary trainers
  const agentTrainerMap = {
    'abraham': 'genekogan',
    'solienne': 'kristi',
    'geppetto': 'lattice',
    'koru': 'xander'
  };

  console.log('\n🔗 Linking primary trainers to agents...\n');

  for (const [agentId, trainerId] of Object.entries(agentTrainerMap)) {
    // First check if agent exists
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('id', agentId)
      .single();
    
    if (agent) {
      const { error } = await supabase
        .from('agents')
        .update({ primary_trainer_id: trainerId })
        .eq('id', agentId);
      
      if (error) {
        console.error(`❌ Failed to link ${agentId} → ${trainerId}:`, error.message);
      } else {
        console.log(`✅ ${agentId} → ${trainerId}`);
      }
    } else {
      console.log(`⏭️  Agent ${agentId} not in database yet`);
    }

    // Also create agent_trainers relationship
    const { error: relationError } = await supabase
      .from('agent_trainers')
      .upsert(
        { agent_id: agentId, trainer_id: trainerId },
        { onConflict: 'agent_id,trainer_id' }
      );
    
    if (relationError && !relationError.message.includes('not found')) {
      console.error(`⚠️  Relation ${agentId} ↔ ${trainerId}:`, relationError.message);
    }
  }

  console.log('\n✨ Trainer seeding complete!');
}

seedTrainers().catch(console.error);