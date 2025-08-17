// Simple API test script
// Run with: node scripts/test-api-simple.js

const AGENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const BASE_URL = 'http://localhost:3004/api/agents';

async function testAPIs() {
  console.log('Testing Operator Playbook APIs...\n');
  
  try {
    // Test 1: Get Financial Model
    console.log('1. Testing GET financial-model...');
    const res1 = await fetch(`${BASE_URL}/${AGENT_ID}/financial-model`);
    const data1 = await res1.json();
    console.log('✓ Financial Model:', data1);
    
    // Test 2: Get Daily Practice
    console.log('\n2. Testing GET daily-practice...');
    const res2 = await fetch(`${BASE_URL}/${AGENT_ID}/daily-practice?limit=7`);
    const data2 = await res2.json();
    console.log('✓ Daily Practice Entries:', data2.entries?.length || 0, 'entries');
    
    // Test 3: Get Metrics
    console.log('\n3. Testing GET metrics...');
    const res3 = await fetch(`${BASE_URL}/${AGENT_ID}/metrics`);
    const data3 = await res3.json();
    console.log('✓ Metrics:', {
      sevenDay: data3.seven_day ? 'Available' : 'Not available',
      fourteenDay: data3.fourteen_day ? 'Available' : 'Not available',
      canGraduate: data3.readiness?.can_graduate || false
    });
    
    console.log('\n✅ All API tests passed!');
    
  } catch (error) {
    console.error('\n❌ API test failed:', error.message);
    console.error('Make sure the dev server is running: npm run dev');
  }
}

testAPIs();