const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function analyzeUsers() {
  console.log('🔍 Analyzing Solienne user data\n');
  
  // Get all user IDs with counts from database
  const { data: archives } = await supabase
    .from('agent_archives')
    .select('created_by_user')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  // Count by user
  const userCounts = {};
  archives.forEach(a => {
    if (a.created_by_user) {
      userCounts[a.created_by_user] = (userCounts[a.created_by_user] || 0) + 1;
    }
  });
  
  // Try to load user data export for names
  let userData = [];
  try {
    const userDataPath = path.join(process.env.HOME, 'Desktop', 'solienne.outputs', 'user_data_export.json');
    const rawData = JSON.parse(await fs.readFile(userDataPath, 'utf-8'));
    // Handle both array and object formats
    if (Array.isArray(rawData)) {
      userData = rawData;
    } else if (rawData.users) {
      userData = rawData.users;
    } else {
      userData = Object.values(rawData);
    }
    console.log('✅ Found user data export with', userData.length, 'users\n');
  } catch (e) {
    console.log('⚠️  No user data export found\n');
    userData = [];
  }
  
  // Sort users by creation count
  const sortedUsers = Object.entries(userCounts)
    .sort((a, b) => b[1] - a[1]);
  
  console.log('📊 Top creators (by work count):\n');
  console.log('Count | User ID                          | Name/Email');
  console.log('------|----------------------------------|------------------');
  
  sortedUsers.slice(0, 20).forEach(([userId, count]) => {
    const user = userData.find(u => u.id === userId);
    const name = user ? (user.name || user.email || 'No name') : 'Not in export';
    console.log(`${String(count).padStart(5)} | ${userId} | ${name}`);
  });
  
  console.log('\n📊 Summary:');
  console.log(`Total unique users: ${sortedUsers.length}`);
  console.log(`Total works: ${archives.length}`);
  console.log(`Average works per user: ${(archives.length / sortedUsers.length).toFixed(1)}`);
  
  // Generate SQL for mapping
  console.log('\n💡 SQL to create user-trainer mappings:\n');
  console.log('-- First, check existing trainers');
  console.log('SELECT * FROM trainers;');
  console.log('');
  console.log('-- Map top users to trainers (update with actual trainer IDs)');
  console.log('INSERT INTO user_trainer_map (user_id, trainer_id) VALUES');
  
  sortedUsers.slice(0, 10).forEach(([userId, count], i) => {
    const user = userData.find(u => u.id === userId);
    const name = user ? (user.name || user.email || '') : '';
    const isLast = i === Math.min(9, sortedUsers.length - 1);
    console.log(`  ('${userId}', 'TRAINER_ID_HERE')${isLast ? ';' : ','} -- ${count} works, ${name}`);
  });
  
  console.log('');
  console.log('-- Apply mappings to archives');
  console.log(`UPDATE agent_archives a
SET trainer_id = m.trainer_id
FROM user_trainer_map m
WHERE a.created_by_user = m.user_id
  AND a.agent_id = 'solienne'
  AND a.trainer_id IS NULL;`);
  
  console.log('');
  console.log('-- Verify mappings');
  console.log(`SELECT trainer_id, COUNT(*) as works
FROM agent_archives
WHERE agent_id = 'solienne'
GROUP BY trainer_id
ORDER BY works DESC;`);
}

analyzeUsers().catch(console.error);