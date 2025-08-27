#!/usr/bin/env node
/**
 * Domain Fix Script
 * Systematically replaces incorrect domain references with correct ones
 * Uses centralized domain configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Domain mapping: incorrect -> correct
const DOMAIN_FIXES = {
  'eden-academy.vercel.app': 'eden-academy-flame.vercel.app',
  'eden-academy-ftf22wjgo-edenprojects.vercel.app': 'eden-academy-flame.vercel.app',
  // Add more mappings as needed
};

const EXCLUDE_PATTERNS = [
  'node_modules/',
  '.git/',
  'dist/',
  '.next/',
  'coverage/',
  '.vercel/',
  'fix-domains.js', // Don't modify this file
  'validate-domains.js', // Don't modify the validator
];

function findFilesWithIncorrectDomains(incorrectDomain) {
  try {
    const excludeArgs = EXCLUDE_PATTERNS.map(p => `--exclude-dir=${p}`).join(' ');
    const result = execSync(
      `grep -rl ${excludeArgs} "${incorrectDomain}" . || true`,
      { encoding: 'utf8', cwd: process.cwd() }
    );
    
    return result.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    console.error(`Error finding files with ${incorrectDomain}:`, error.message);
    return [];
  }
}

function replaceInFile(filePath, incorrectDomain, correctDomain) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace all occurrences
    const newContent = content.replace(new RegExp(incorrectDomain, 'g'), correctDomain);
    
    if (newContent !== originalContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      const occurrences = (originalContent.match(new RegExp(incorrectDomain, 'g')) || []).length;
      console.log(`  ✅ Fixed ${filePath} (${occurrences} occurrences)`);
      return occurrences;
    }
    return 0;
  } catch (error) {
    console.error(`  ❌ Error fixing ${filePath}:`, error.message);
    return 0;
  }
}

function fixDomainReferences() {
  console.log('🔧 Starting domain reference fixes...\n');
  
  let totalFixed = 0;
  let totalFiles = 0;
  
  Object.entries(DOMAIN_FIXES).forEach(([incorrect, correct]) => {
    console.log(`🔄 Fixing: ${incorrect} → ${correct}`);
    
    const files = findFilesWithIncorrectDomains(incorrect);
    
    if (files.length === 0) {
      console.log('  ✅ No files found with this incorrect domain\n');
      return;
    }
    
    console.log(`  📁 Found ${files.length} files to fix:`);
    
    let domainFixed = 0;
    files.forEach(file => {
      const occurrences = replaceInFile(file, incorrect, correct);
      domainFixed += occurrences;
      if (occurrences > 0) totalFiles++;
    });
    
    totalFixed += domainFixed;
    console.log(`  📊 Fixed ${domainFixed} occurrences in this domain\n`);
  });
  
  return { totalFixed, totalFiles };
}

function updatePackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add domain validation scripts if they don't exist
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    if (!packageJson.scripts['validate-domains']) {
      packageJson.scripts['validate-domains'] = 'node scripts/validate-domains.js';
    }
    
    if (!packageJson.scripts['fix-domains']) {
      packageJson.scripts['fix-domains'] = 'node scripts/fix-domains.js';
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Updated package.json with domain scripts');
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
  }
}

function generateReport(results) {
  console.log('📋 DOMAIN FIX REPORT');
  console.log('==================');
  console.log(`Fixed ${results.totalFixed} domain references in ${results.totalFiles} files\n`);
  
  if (results.totalFixed > 0) {
    console.log('🎉 Domain fixes completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test the application to ensure everything works');
    console.log('2. Run validation: npm run validate-domains');
    console.log('3. Commit changes and deploy');
    console.log('\n💡 Future Prevention:');
    console.log('- Use centralized config: src/config/domains.ts');
    console.log('- Run validation before deployment');
  } else {
    console.log('ℹ️  No domain fixes were needed.');
  }
}

function main() {
  console.log('🏛️  Eden Academy Domain Fixer');
  console.log('===========================\n');
  
  const results = fixDomainReferences();
  updatePackageJson();
  generateReport(results);
  
  if (results.totalFixed > 0) {
    console.log('\n🔍 Running validation to confirm fixes...');
    try {
      execSync('node scripts/validate-domains.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Validation found remaining issues. Please review manually.');
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixDomainReferences, DOMAIN_FIXES };