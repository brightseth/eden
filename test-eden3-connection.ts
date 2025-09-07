import { emitCreation, emitSale, emitMention } from './eden3-emitter';

async function testAllEventTypes() {
  console.log('Testing EDEN3 Event Emission...\n');
  
  // Test creation event
  console.log('1. Testing creation event...');
  await emitCreation('abraham', 'https://ipfs.io/ipfs/QmTest123', {
    title: 'Sacred Geometry #47',
    medium: 'digital',
    dimensions: '1024x1024'
  });
  
  // Test sale event
  console.log('2. Testing sale event...');
  await emitSale(
    'miyomi',
    'miyomi_20250105_001',
    100,
    'USD',
    '0x1234567890abcdef',
    { marketplace: 'opensea' }
  );
  
  // Test mention event
  console.log('3. Testing mention event...');
  await emitMention(
    'solienne',
    'x',
    'https://x.com/user/status/123456',
    { sentiment: 'positive' }
  );
  
  console.log('\n✅ All test events sent! Check EDEN3 logs.');
}

testAllEventTypes();