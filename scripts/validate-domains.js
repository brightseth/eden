#!/usr/bin/env node
/**
 * Domain Validation Script
 * Scans codebase for incorrect domain references
 * Prevents deployment with wrong domains
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CORRECT_DOMAINS = [
  'eden-academy.vercel.app',
  'eden-genesis-registry.vercel.app',
  'amanda-art-agent.vercel.app',
  'design-critic-agent.vercel.app',
  'eden2038.vercel.app',
  'spirit-registry.vercel.app',
];

const INCORRECT_PATTERNS = [
  'eden-academy-flame.vercel.app',
  'eden-academy-ftf22wjgo-edenprojects.vercel.app',
  // Add more patterns as needed
];

const EXCLUDE_PATTERNS = [
  'node_modules/',
  '.git/',
  'dist/',
  '.next/',
  'coverage/',
  '.vercel/',
  'validate-domains.js', // Don't scan this file
  'fix-domains.js', // Don't scan the fix script
  'src/config/domains.ts', // Don't scan the domain config (it defines deprecated domains)
];

function scanForIncorrectDomains() {
  console.log('🔍 Scanning for incorrect domain references...\n');
  
  const errors = [];
  
  INCORRECT_PATTERNS.forEach(pattern => {
    try {
      const excludeArgs = EXCLUDE_PATTERNS.map(p => `--exclude-dir=${p}`).join(' ');
      const result = execSync(
        `grep -r ${excludeArgs} "${pattern}" . || true`,
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      if (result.trim()) {
        // Filter out files that should be excluded
        const lines = result.trim().split('\n');
        const filteredLines = lines.filter(line => {
          const filePath = line.split(':')[0];
          return !EXCLUDE_PATTERNS.some(pattern => 
            filePath.includes(pattern.replace('/', '')) || 
            filePath.includes('scripts/fix-domains.js') ||
            filePath.includes('scripts/validate-domains.js') ||
            filePath.includes('src/config/domains.ts')
          );
        });
        
        if (filteredLines.length > 0) {
          console.log(`❌ Found incorrect domain: ${pattern}`);
          console.log(filteredLines.join('\n'));
          errors.push({
            pattern,
            occurrences: filteredLines.length
          });
        } else {
          console.log(`✅ No problematic occurrences of: ${pattern} (only in config files)`);
        }
      }
    } catch (error) {
      // grep returns non-zero when no matches found, which is good
      console.log(`✅ No occurrences of incorrect domain: ${pattern}`);
    }
  });
  
  return errors;
}

function generateReport(errors) {
  if (errors.length === 0) {
    console.log('\n✅ Domain validation passed! No incorrect domains found.');
    return true;
  }
  
  console.log('\n❌ Domain validation failed!');
  console.log(`Found ${errors.length} types of incorrect domain references:`);
  
  errors.forEach(error => {
    console.log(`- ${error.pattern}: ${error.occurrences} occurrences`);
  });
  
  console.log('\n📋 Action Required:');
  console.log('1. Run the domain fix script: npm run fix-domains');
  console.log('2. Or manually replace incorrect domains with correct ones');
  console.log('3. Use centralized domain config: src/config/domains.ts');
  
  return false;
}

function main() {
  console.log('🏛️  Eden Academy Domain Validator');
  console.log('================================\n');
  
  const errors = scanForIncorrectDomains();
  const success = generateReport(errors);
  
  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanForIncorrectDomains, generateReport };