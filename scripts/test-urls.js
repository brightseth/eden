#!/usr/bin/env node
/**
 * URL Functionality Test
 * Tests that key URLs still resolve correctly after domain fixes
 */

const https = require('https');
const http = require('http');

const TEST_URLS = [
  // Local development
  'http://localhost:3000',
  'http://localhost:3000/admin/docs',
  'http://localhost:3000/dashboard/registry',
  
  // External Registry API (if accessible)
  'https://eden-genesis-registry.vercel.app/api/v1/health',
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode < 400
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: null,
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: null,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🌐 Testing URL Functionality');
  console.log('============================\n');
  
  const results = [];
  
  for (const url of TEST_URLS) {
    console.log(`Testing: ${url}`);
    const result = await testUrl(url);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} OK`);
    } else {
      console.log(`❌ ${result.status || 'FAILED'} - ${result.error || 'Unknown error'}`);
    }
    console.log('');
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('📊 TEST SUMMARY');
  console.log('================');
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All URLs are working correctly!');
    return true;
  } else {
    console.log('\n⚠️  Some URLs failed. Please review the results above.');
    return false;
  }
}

if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests, testUrl };