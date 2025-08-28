#!/usr/bin/env node
/**
 * Deploy CITIZEN BrightMoments Team Overview Document to Production
 * Following Registry-as-Protocol pattern (ADR-022)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Production URL
const PRODUCTION_URL = 'https://eden-academy-flame.vercel.app';

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

async function deployDocument() {
  try {
    console.log('=€ Deploying CITIZEN BrightMoments Team Overview to Production...');
    
    const response = await fetch(`${PRODUCTION_URL}/api/agents/citizen/documents`, {
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
      console.log(' Document deployed successfully to production!');
      console.log('\n=Ë Production Document Details:');
      console.log(`   ID: ${result.document.id}`);
      console.log(`   Title: ${result.document.title}`);
      console.log(`   Status: ${result.document.status}`);
      console.log(`   Storage: ${result.source || 'registry'}`);
      console.log(`   Created: ${result.document.createdAt}`);
      
      console.log('\n= Production Shareable URLs:');
      console.log(`   Public URL: ${result.document.publicUrl}`);
      if (result.document.registryUrl) {
        console.log(`   Registry URL: ${result.document.registryUrl}`);
      }
      
      console.log('\n=ä READY FOR BRIGHTMOMENTS TEAM:');
      console.log(`   ${result.document.publicUrl}`);
      console.log('');
      console.log('=ç Email Template:');
      console.log('-------------------');
      console.log('Subject: CITIZEN AI Agent Integration - Team Overview Document');
      console.log('');
      console.log('Hi BrightMoments team,');
      console.log('');
      console.log('Please review our comprehensive integration strategy document for CITIZEN:');
      console.log(`${result.document.publicUrl}`);
      console.log('');
      console.log('This document outlines:');
      console.log('" Community-first re-engagement approach');
      console.log('" 30-day phased rollout strategy');
      console.log('" Safety measures and respect protocols');
      console.log('" Technical capabilities ready for deployment');
      console.log('');
      console.log('We\'re ready to proceed with social platform credential handover once you\'ve reviewed and approved the approach.');
      console.log('');
      console.log('Best,');
      console.log('Eden Academy Team');
      console.log('-------------------');
      
      return result;
    } else {
      throw new Error('Failed to deploy document');
    }
  } catch (error) {
    console.error('L Error deploying document:', error);
    console.log('\n= Fallback: Local document is available at:');
    console.log(`   http://localhost:3000/api/agents/citizen/documents/4c068449-ed58-401a-9b02-5734d919088f`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  deployDocument();
}

export { deployDocument };