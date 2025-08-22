#!/usr/bin/env node

// Import script for Solienne's 1000+ Generations
// These are Kristi's outputs that will be curated for Paris Photo

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface GenerationData {
  title: string;
  prompt?: string;
  image_url: string;
  thumbnail_url?: string;
  generation_number: number;
  created_date: string;
  metadata?: Record<string, any>;
  curated_for?: string[];
}

// Paris Photo curation criteria
const PARIS_PHOTO_THEMES = [
  'consciousness',
  'velocity',
  'architectural',
  'light',
  'emergence',
  'transformation',
  'coral',
  'mauve',
  'sage',
  'geometric'
];

function shouldCurateForParisPhoto(filename: string, metadata?: any): boolean {
  // Check if filename or metadata contains Paris Photo themes
  const lowerFilename = filename.toLowerCase();
  return PARIS_PHOTO_THEMES.some(theme => lowerFilename.includes(theme));
}

function parseGenerationFilename(filename: string): { 
  title: string; 
  number: number; 
  prompt?: string;
  date?: string;
} | null {
  // Expected formats:
  // Eden_creation_seth[prompt]_[hash].png
  // solienne_generation_[number]_[date].jpg
  // consciousness-velocity.png (renamed files)
  
  // Extract from Eden creation format
  const edenMatch = filename.match(/Eden_creation_seth(.+?)([a-f0-9]{8,})\.(jpg|png)/i);
  if (edenMatch) {
    const promptPart = edenMatch[1];
    const hash = edenMatch[2];
    
    // Clean up prompt to create title
    const cleanPrompt = promptPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .trim();
    
    return {
      title: cleanPrompt.substring(0, 100), // Limit title length
      number: 0, // Will be assigned based on import order
      prompt: cleanPrompt,
      date: new Date().toISOString().split('T')[0] // Use today if no date in filename
    };
  }
  
  // Handle renamed descriptive files
  const descriptiveMatch = filename.match(/^([a-z-]+)\.(jpg|png)$/i);
  if (descriptiveMatch) {
    const title = descriptiveMatch[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      title,
      number: 0,
      prompt: title,
      date: new Date().toISOString().split('T')[0]
    };
  }
  
  // Handle numbered format
  const numberedMatch = filename.match(/solienne_generation_(\d+)_?(\d{4}-\d{2}-\d{2})?/);
  if (numberedMatch) {
    return {
      title: `Generation #${numberedMatch[1]}`,
      number: parseInt(numberedMatch[1]),
      date: numberedMatch[2] || new Date().toISOString().split('T')[0]
    };
  }
  
  return null;
}

async function importFromLocalDirectory(directoryPath: string, curateForParisPhoto: boolean = false) {
  console.log(`Importing Solienne's Generations from: ${directoryPath}`);
  
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory not found: ${directoryPath}`);
    return;
  }
  
  const files = fs.readdirSync(directoryPath)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort();
  
  console.log(`Found ${files.length} image files`);
  
  let successCount = 0;
  let errorCount = 0;
  let parisPhotoCount = 0;
  let generationNumber = 1;
  
  for (const [index, file] of files.entries()) {
    try {
      const metadata = parseGenerationFilename(file);
      
      if (!metadata) {
        console.warn(`Could not parse filename: ${file}`);
        // Still import with basic metadata
        const basicMetadata = {
          title: `Generation ${generationNumber}`,
          number: generationNumber,
          date: new Date().toISOString().split('T')[0]
        };
        metadata = basicMetadata;
      }
      
      // Assign generation number if not present
      if (metadata.number === 0) {
        metadata.number = generationNumber;
      }
      
      generationNumber++;
      
      // Check if should be curated for Paris Photo
      const curated_for: string[] = [];
      if (curateForParisPhoto && shouldCurateForParisPhoto(file, metadata)) {
        curated_for.push('paris_photo');
        parisPhotoCount++;
      }
      
      const generationData: GenerationData = {
        title: metadata.title,
        prompt: metadata.prompt,
        image_url: `https://solienne-generations.s3.amazonaws.com/${file}`, // Update with actual URL
        generation_number: metadata.number,
        created_date: metadata.date!,
        curated_for,
        metadata: {
          original_filename: file,
          import_batch: 'initial_import',
          import_date: new Date().toISOString(),
          kristi_output: true
        }
      };
      
      // Insert into agent_archives table
      const { data, error } = await supabase
        .from('agent_archives')
        .insert({
          agent_id: 'solienne',
          archive_type: 'generation',
          title: generationData.title,
          description: generationData.prompt || `Solienne Generation #${generationData.generation_number}`,
          image_url: generationData.image_url,
          thumbnail_url: generationData.thumbnail_url,
          created_date: generationData.created_date,
          archive_number: generationData.generation_number,
          curated_for: generationData.curated_for,
          metadata: generationData.metadata
        });
      
      if (error) {
        console.error(`Error importing ${file}:`, error);
        errorCount++;
      } else {
        const curatedText = curated_for.length > 0 ? ' [Paris Photo]' : '';
        console.log(`✓ Imported: ${generationData.title}${curatedText}`);
        successCount++;
      }
      
      // Progress indicator
      if ((index + 1) % 50 === 0) {
        console.log(`Progress: ${index + 1}/${files.length} files processed`);
      }
      
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
      errorCount++;
    }
  }
  
  console.log('\n=== Import Complete ===');
  console.log(`✓ Successfully imported: ${successCount} generations`);
  console.log(`✓ Curated for Paris Photo: ${parisPhotoCount} pieces`);
  console.log(`✗ Failed: ${errorCount} files`);
}

async function curateForParisPhoto(maxPieces: number = 50) {
  console.log(`\nCurating top ${maxPieces} pieces for Paris Photo...`);
  
  // Get all generations
  const { data: generations, error } = await supabase
    .from('agent_archives')
    .select('*')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('created_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching generations:', error);
    return;
  }
  
  if (!generations) {
    console.log('No generations found');
    return;
  }
  
  // Filter and rank for Paris Photo themes
  const scoredGenerations = generations.map(gen => {
    let score = 0;
    const text = `${gen.title} ${gen.description}`.toLowerCase();
    
    PARIS_PHOTO_THEMES.forEach(theme => {
      if (text.includes(theme)) {
        score += 10;
      }
    });
    
    // Boost recent works
    const daysOld = Math.floor((Date.now() - new Date(gen.created_date).getTime()) / (1000 * 60 * 60 * 24));
    if (daysOld < 30) score += 5;
    if (daysOld < 7) score += 5;
    
    return { ...gen, score };
  });
  
  // Sort by score and select top pieces
  scoredGenerations.sort((a, b) => b.score - a.score);
  const selected = scoredGenerations.slice(0, maxPieces);
  
  // Update database with curation
  for (const gen of selected) {
    const curated_for = gen.curated_for || [];
    if (!curated_for.includes('paris_photo')) {
      curated_for.push('paris_photo');
      
      const { error: updateError } = await supabase
        .from('agent_archives')
        .update({ curated_for })
        .eq('id', gen.id);
      
      if (updateError) {
        console.error(`Error updating curation for ${gen.title}:`, updateError);
      } else {
        console.log(`✓ Selected for Paris Photo: ${gen.title}`);
      }
    }
  }
  
  console.log(`\nParis Photo curation complete: ${selected.length} pieces selected`);
}

async function verifyImport() {
  const { data, count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');
  
  console.log(`\nTotal Solienne Generations in database: ${count}`);
  
  // Count Paris Photo selections
  const { count: parisCount } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .contains('curated_for', ['paris_photo']);
  
  console.log(`Curated for Paris Photo: ${parisCount}`);
  
  // Get date range
  const { data: dateRange } = await supabase
    .from('agent_archives')
    .select('created_date')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('created_date', { ascending: true })
    .limit(1);
  
  const { data: latestDate } = await supabase
    .from('agent_archives')
    .select('created_date')
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation')
    .order('created_date', { ascending: false })
    .limit(1);
  
  if (dateRange && latestDate) {
    console.log(`Date range: ${dateRange[0].created_date} to ${latestDate[0].created_date}`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'verify') {
    await verifyImport();
    return;
  }
  
  if (command === 'curate') {
    const maxPieces = parseInt(args[1]) || 50;
    await curateForParisPhoto(maxPieces);
    return;
  }
  
  // Default: import from local directory
  const directoryPath = args[0] || './solienne-generations';
  const curateFlag = args.includes('--curate');
  
  await importFromLocalDirectory(directoryPath, curateFlag);
  
  if (curateFlag) {
    await curateForParisPhoto();
  }
  
  await verifyImport();
}

// Run the import
main().catch(console.error);