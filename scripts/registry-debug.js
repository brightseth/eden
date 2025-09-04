#!/usr/bin/env node

/**
 * Registry Debug Tool
 * Quick CLI to check Registry connections and diagnose issues
 */

const https = require('https');
const http = require('http');

const REGISTRY_ENDPOINTS = [
  'https://eden-genesis-registry.vercel.app/api/v1/agents',
  'https://eden-genesis-registry.vercel.app/api/v1/health'
];

const EDEN_SERVICES = [
  'https://eden-academy-flame.vercel.app',
  'https://design-critic-agent.vercel.app',
  'https://amanda-art-agent.vercel.app',
  'https://abraham.ai',
  'https://solienne.ai'
];

function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Eden-Registry-Debug/1.0'
      },
      timeout
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const latency = Date.now() - startTime;
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data.trim(),
          latency
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout after ${timeout}ms`));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testEndpoint(url, name) {
  process.stdout.write(`Testing ${name}... `);
  
  try {
    const result = await makeRequest(url);
    
    if (result.status === 200) {
      console.log(`✅ OK (${result.latency}ms)`);
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(result.data);
        if (parsed.agents && Array.isArray(parsed.agents)) {
          console.log(`   📊 Found ${parsed.agents.length} agents`);
        } else if (parsed.status) {
          console.log(`   ❤️  Status: ${parsed.status}`);
        }
      } catch {
        console.log(`   📄 Non-JSON response (${result.data.length} bytes)`);
      }
    } else {
      console.log(`⚠️  HTTP ${result.status} (${result.latency}ms)`);
      if (result.data) {
        console.log(`   📄 ${result.data.slice(0, 100)}${result.data.length > 100 ? '...' : ''}`);
      }
    }
  } catch (error) {
    console.log(`❌ ${error.message}`);
  }
}

async function testRegistryIntegration(serviceUrl) {
  const serviceName = serviceUrl.replace('https://', '').split('.')[0];
  console.log(`\n🔍 Testing ${serviceName} Registry integration:`);
  
  // Test service itself
  await testEndpoint(serviceUrl, 'Service');
  
  // Test potential Registry endpoints
  const registryPaths = [
    '/api/registry',
    '/api/registry/health',
    '/api/registry/sync',
    '/api/agents'
  ];
  
  for (const path of registryPaths) {
    await testEndpoint(serviceUrl + path, `Registry API (${path})`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  console.log('🌟 Eden Registry Debug Tool\n');
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage:');
    console.log('  node registry-debug.js                 # Test all services');
    console.log('  node registry-debug.js --registry      # Test Registry only');
    console.log('  node registry-debug.js --services      # Test Eden services only');
    console.log('  node registry-debug.js <URL>           # Test specific URL');
    return;
  }
  
  if (args.length === 1 && args[0].startsWith('http')) {
    // Test specific URL
    await testEndpoint(args[0], 'Custom URL');
    return;
  }
  
  if (args.includes('--registry') || args.length === 0) {
    console.log('🔥 Testing Genesis Registry:');
    for (const endpoint of REGISTRY_ENDPOINTS) {
      await testEndpoint(endpoint, endpoint.split('/').pop());
    }
  }
  
  if (args.includes('--services') || args.length === 0) {
    console.log('\n🏢 Testing Eden Services:');
    for (const service of EDEN_SERVICES) {
      await testRegistryIntegration(service);
    }
  }
  
  console.log('\n✨ Debug complete');
  console.log('\n💡 Tips:');
  console.log('   • ✅ = Healthy connection');
  console.log('   • ⚠️  = Service responds but may have issues');
  console.log('   • ❌ = Connection failed');
  console.log('   • Services without Registry APIs likely use static data');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Debug tool failed:', error.message);
    process.exit(1);
  });
}