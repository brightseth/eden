#!/usr/bin/env node
/**
 * Store CITIZEN BrightMoments Team Overview Document in Registry
 * Following Registry-as-Protocol pattern (ADR-022)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Read the document content
const docPath = join(process.cwd(), 'docs', 'CITIZEN_BM_TEAM_OVERVIEW.md');
const content = readFileSync(docPath, 'utf-8');

const document = {
  title: 'CITIZEN Social Integration: BrightMoments Team Overview',
  content,
  description: 'Executive summary and strategy document for CITIZEN AI agent integration with BrightMoments DAO governance systems',
  tags: [
    'citizen',
    'brightmoments',
    'dao-governance',
    'community-coordination',
    'strategy',
    'social-integration'
  ],
  isPublic: true
};

async function storeDocument() {
  try {
    console.log('=� Storing CITIZEN BrightMoments Team Overview in Registry...');
    
    const response = await fetch('http://localhost:3000/api/agents/citizen/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log(' Document stored successfully!');
      console.log('\n=� Document Details:');
      console.log(`   ID: ${result.document.id}`);
      console.log(`   Title: ${result.document.title}`);
      console.log(`   Status: ${result.document.status}`);
      console.log(`   Created: ${result.document.createdAt}`);
      
      console.log('\n= Shareable URLs:');
      console.log(`   Public URL: ${result.document.publicUrl}`);
      console.log(`   Registry URL: ${result.document.registryUrl}`);
      
      console.log('\n=� Ready to share with BrightMoments team:');
      console.log(`   ${result.document.publicUrl}`);
      
      return result;
    } else {
      throw new Error('Failed to store document');
    }
  } catch (error) {
    console.error('L Error storing document:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  storeDocument();
}

export { storeDocument };