#!/usr/bin/env node

/**
 * Fix brand violations in Eden Academy codebase
 * Enforces brutal minimalist aesthetic:
 * - Remove all colors except black/white/gray
 * - Remove all rounded corners
 * - Remove all gradients
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color replacements map
const colorReplacements = {
  // Text colors
  'text-green-400': 'text-white',
  'text-green-500': 'text-white',
  'text-green-600': 'text-white',
  'text-yellow-400': 'text-gray-400',
  'text-yellow-500': 'text-gray-400', 
  'text-red-400': 'text-gray-400',
  'text-red-500': 'text-gray-400',
  'text-blue-400': 'text-gray-400',
  'text-blue-500': 'text-gray-400',
  'text-purple-400': 'text-gray-400',
  'text-purple-500': 'text-gray-400',
  'text-orange-400': 'text-gray-400',
  'text-orange-500': 'text-gray-400',
  'text-pink-400': 'text-gray-400',
  'text-pink-500': 'text-gray-400',
  
  // Background colors
  'bg-green-400': 'bg-gray-800',
  'bg-green-500': 'bg-gray-800',
  'bg-green-500/5': 'bg-gray-900',
  'bg-green-500/10': 'bg-gray-900',
  'bg-green-500/20': 'bg-gray-900',
  'bg-green-500/30': 'bg-gray-900',
  'bg-green-600': 'bg-gray-700',
  'bg-yellow-500': 'bg-gray-800',
  'bg-yellow-500/5': 'bg-gray-900',
  'bg-yellow-500/10': 'bg-gray-900',
  'bg-yellow-500/20': 'bg-gray-900',
  'bg-yellow-500/30': 'bg-gray-900',
  'bg-red-500': 'bg-gray-800',
  'bg-blue-500': 'bg-gray-800',
  'bg-purple-500': 'bg-gray-800',
  
  // Border colors
  'border-green-500/20': 'border-gray-700',
  'border-green-500/50': 'border-gray-700',
  'border-yellow-500/50': 'border-gray-700',
  'border-red-500': 'border-gray-700',
  'border-blue-500': 'border-gray-700',
  'border-purple-500': 'border-gray-700',
  
  // Hover states
  'hover:bg-green-500/20': 'hover:bg-gray-800',
  'hover:bg-green-500/30': 'hover:bg-gray-800',
  'hover:bg-green-600': 'hover:bg-gray-700',
  'hover:bg-yellow-500/30': 'hover:bg-gray-800',
};

// Rounded corner replacements
const roundedReplacements = {
  'rounded': '',
  'rounded-sm': '',
  'rounded-md': '',
  'rounded-lg': '',
  'rounded-xl': '',
  'rounded-2xl': '',
  'rounded-3xl': '',
  'rounded-full': '',
  'rounded-t': '',
  'rounded-r': '',
  'rounded-b': '',
  'rounded-l': '',
  'rounded-tl': '',
  'rounded-tr': '',
  'rounded-br': '',
  'rounded-bl': '',
};

function processFile(filepath) {
  console.log(`Processing: ${filepath}`);
  
  let content = fs.readFileSync(filepath, 'utf8');
  let modified = false;
  
  // Replace colors
  Object.entries(colorReplacements).forEach(([old, replacement]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, replacement);
      modified = true;
      console.log(`  - Replaced ${old} with ${replacement}`);
    }
  });
  
  // Replace rounded corners
  Object.entries(roundedReplacements).forEach(([old, replacement]) => {
    const regex = new RegExp(`\\b${old}(?![a-z-])`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, replacement);
      modified = true;
      console.log(`  - Removed ${old}`);
    }
  });
  
  // Remove gradients
  const gradientPatterns = [
    /bg-gradient-to-[a-z]+/g,
    /from-[a-z-]+/g,
    /to-[a-z-]+/g,
    /via-[a-z-]+/g,
  ];
  
  gradientPatterns.forEach(pattern => {
    if (content.match(pattern)) {
      content = content.replace(pattern, '');
      modified = true;
      console.log(`  - Removed gradient pattern`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filepath, content);
    console.log(`  ✓ File updated`);
  }
}

// Process all component files
const componentPaths = [
  '/Users/seth/eden-academy/src/components/**/*.tsx',
  '/Users/seth/eden-academy/src/components/**/*.jsx',
  '/Users/seth/eden-academy/src/app/**/*.tsx',
  '/Users/seth/eden-academy/src/app/**/*.jsx',
];

let totalFiles = 0;

componentPaths.forEach(pattern => {
  const files = glob.sync(pattern);
  files.forEach(file => {
    processFile(file);
    totalFiles++;
  });
});

console.log(`\n✅ Processed ${totalFiles} files`);
console.log('Brand violations fixed! Please review changes and test the application.');