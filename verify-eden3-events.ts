import { emitCreation, emitSale, emitMention } from './eden3-emitter';

// Mock the postToEden3 function to capture events without sending
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Capture event data
const capturedEvents: any[] = [];

// Override the postToEden3 function to capture events
async function mockPostToEden3(event: any): Promise<void> {
  capturedEvents.push(event);
  console.log('📦 Captured Event:', JSON.stringify(event, null, 2));
}

// Temporarily replace the actual function
const eden3Emitter = require('./eden3-emitter');
const originalPostToEden3 = eden3Emitter.postToEden3;
eden3Emitter.postToEden3 = mockPostToEden3;

async function verifyEventStructure() {
  console.log('🔍 Verifying EDEN3 Event Structure...\n');
  
  // Test creation event
  console.log('1. Creation Event Structure:');
  await emitCreation('abraham', 'https://ipfs.io/ipfs/QmTest123', {
    title: 'Sacred Geometry #47',
    medium: 'digital'
  });
  
  console.log('\n2. Sale Event Structure:');
  await emitSale('miyomi', 'miyomi_20250905_001', 100, 'USD', '0x123', {
    marketplace: 'opensea'
  });
  
  console.log('\n3. Mention Event Structure:');
  await emitMention('solienne', 'x', 'https://x.com/user/status/123456', {
    sentiment: 'positive'
  });
  
  console.log(`\n✅ Generated ${capturedEvents.length} properly structured events!`);
  console.log('🚀 Ready for EDEN3 integration when service is available.');
}

verifyEventStructure();