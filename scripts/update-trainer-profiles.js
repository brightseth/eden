const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function updateTrainerProfiles() {
  console.log('Updating trainer profiles...');

  const trainers = [
    {
      id: 'gene',
      display_name: 'Gene Kogan',
      bio: 'Artist and programmer who creates tools for creative expression using machine learning and AI. Founded Abraham, the first autonomous artificial artist, and has been pioneering the intersection of creativity and artificial intelligence for over a decade.',
      socials: {
        website: 'https://genekogan.com',
        twitter: 'genekogan',
        instagram: 'genekogan',
        github: 'genekogan'
      }
    },
    {
      id: 'kristi',
      display_name: 'Kristi Coronado',
      bio: 'Fashion tech innovator bridging fashion, technology, and digital art. As Solienne\'s trainer, she explores how AI can push the boundaries of visual aesthetics and consciousness through light.',
      socials: {
        website: 'https://kristicoronado.com',
        twitter: 'kristicoronado',
        instagram: 'kristicoronado'
      }
    },
    {
      id: 'seth',
      display_name: 'Seth Goldstein',
      bio: 'Co-trainer of Solienne, exploring the intersection of consciousness, velocity, and architectural light through AI-driven creative exploration.',
      socials: {
        twitter: 'sethgoldstein'
      }
    },
    {
      id: 'martin',
      display_name: 'Martin Antiquel',
      bio: 'Physical Design Lead at Lattice, specializing in bridging digital creativity with physical manufacturing. Co-trains Geppetto in parametric design, manufacturing constraints, and functional object creation.',
      socials: {
        website: 'https://lattice.xyz',
        twitter: 'lattice',
        email: 'martin@lattice.xyz'
      }
    },
    {
      id: 'colin',
      display_name: 'Colin McBride',
      bio: 'Manufacturing Intelligence specialist at Lattice, focused on production optimization and manufacturing processes. Co-trains Geppetto in technical aspects of bringing digital designs into physical reality.',
      socials: {
        website: 'https://lattice.xyz',
        twitter: 'lattice', 
        email: 'colin@lattice.xyz'
      }
    }
  ];

  for (const trainer of trainers) {
    const { error } = await supabase
      .from('trainers')
      .upsert(trainer, { onConflict: 'id' });

    if (error) {
      console.error(`Error updating ${trainer.display_name}:`, error);
    } else {
      console.log(`✅ Updated ${trainer.display_name}`);
    }
  }

  // Update agent-trainer relationships
  const relationships = [
    { agent_id: 'abraham', trainer_id: 'gene' },
    { agent_id: 'solienne', trainer_id: 'kristi' },
    { agent_id: 'solienne', trainer_id: 'seth' },
    { agent_id: 'geppetto', trainer_id: 'martin' },
    { agent_id: 'geppetto', trainer_id: 'colin' }
  ];

  for (const rel of relationships) {
    const { error } = await supabase
      .from('agent_trainers')
      .upsert(rel, { onConflict: ['agent_id', 'trainer_id'] });

    if (error) {
      console.error(`Error creating relationship:`, error);
    } else {
      console.log(`✅ Linked ${rel.agent_id} to ${rel.trainer_id}`);
    }
  }

  console.log('Done updating trainer profiles!');
}

updateTrainerProfiles();