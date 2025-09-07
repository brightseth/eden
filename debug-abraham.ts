/**
 * Debug Abraham SDK to see what's happening
 */

import { AbrahamClaudeSDK } from './src/lib/agents/abraham-claude-sdk';

async function debugAbraham() {
  console.log('🔍 Testing Abraham SDK directly...');
  
  try {
    console.log('1. Creating Abraham SDK instance...');
    const abraham = new AbrahamClaudeSDK();
    
    console.log('2. Testing chat method...');
    const response = await abraham.chat('What is your covenant about?');
    
    console.log('3. Response received:');
    console.log('Type:', typeof response);
    console.log('Value:', response);
    console.log('Length:', response?.length);
    
    if (response) {
      console.log('✅ Abraham responded successfully');
    } else {
      console.log('❌ Abraham returned undefined/null');
    }
    
  } catch (error) {
    console.error('❌ Error testing Abraham:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run debug
debugAbraham();