#!/usr/bin/env tsx
// Test backfill with just 5 images first
import fetch from 'node-fetch';

const REGISTRY_BASE = 'https://eden-genesis-registry.vercel.app';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bHlneXJraWJ1cGVqbGxnZ2xyIiwicm9sZSI6InNlcnZpY2UiLCJpYXQiOjE3MjI4NzY2NDgsImV4cCI6MjAzODQ1MjY0OH0.y47o6uUz0lxH_OUjFnw86gBMSM0PqEYjNOQxABb_FSU';

async function test() {
  console.log('Testing backfill with 5 works...');
  
  const works = [
    { ordinal: 1, storagePath: 'solienne/generations/1.png', title: 'Test Work #1' },
    { ordinal: 2, storagePath: 'solienne/generations/2.png', title: 'Test Work #2' },
    { ordinal: 3, storagePath: 'solienne/generations/3.png', title: 'Test Work #3' },
    { ordinal: 4, storagePath: 'solienne/generations/4.png', title: 'Test Work #4' },
    { ordinal: 5, storagePath: 'solienne/generations/5.png', title: 'Test Work #5' }
  ];
  
  const response = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({ works })
  });
  
  console.log('Response status:', response.status);
  const result = await response.text();
  console.log('Response:', result);
  
  // Now check if they're visible
  const checkResponse = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=5`);
  const checkData = await checkResponse.json();
  console.log('\nWorks after backfill:', checkData.items?.length || 0);
  if (checkData.items?.[0]) {
    console.log('First work:', {
      ordinal: checkData.items[0].ordinal,
      title: checkData.items[0].title,
      has_signed_url: !!checkData.items[0].signed_url
    });
  }
}

test().catch(console.error);
