#!/usr/bin/env node

// Import script for Abraham's 2000+ Everydays
// These are historical works that exist before the Covenant begins

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

interface EverydayData {
  title: string;
  date: string;
  image_url: string;
  thumbnail_url?: string;
  number: number;
  description?: string;
  source_url?: string;
}

// Function to parse filename and extract metadata
function parseEverydayFilename(filename: string): { date: string; number: number; title: string } | null {
  // Expected formats:
  // everyday_YYYY_MM_DD.jpg
  // everyday_#1234_YYYY_MM_DD.jpg
  // abraham_everyday_1234.jpg
  
  const patterns = [
    /everyday_(\d{4})_(\d{2})_(\d{2})/,
    /everyday_#?(\d+)_(\d{4})_(\d{2})_(\d{2})/,
    /abraham_everyday_(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) {
      if (match.length === 4) {
        // Date only pattern
        return {
          date: `${match[1]}-${match[2]}-${match[3]}`,
          number: 0, // Will be calculated based on date
          title: `Everyday ${match[1]}.${match[2]}.${match[3]}`
        };
      } else if (match.length === 5) {
        // Number and date pattern
        return {
          date: `${match[2]}-${match[3]}-${match[4]}`,
          number: parseInt(match[1]),
          title: `Everyday #${match[1]}`
        };
      } else if (match.length === 2) {
        // Number only pattern
        return {
          date: '', // Will need to be calculated
          number: parseInt(match[1]),
          title: `Everyday #${match[1]}`
        };
      }
    }
  }
  
  return null;
}

// Calculate date from everyday number (starting from Oct 19, 2012)
function calculateDateFromNumber(everydayNumber: number): string {
  const startDate = new Date('2012-10-19');
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + everydayNumber - 1);
  return targetDate.toISOString().split('T')[0];
}

async function importFromLocalDirectory(directoryPath: string) {
  console.log(`Importing Abraham's Everydays from: ${directoryPath}`);
  
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
  
  for (const [index, file] of files.entries()) {
    try {
      const metadata = parseEverydayFilename(file);
      
      if (!metadata) {
        console.warn(`Could not parse filename: ${file}`);
        continue;
      }
      
      // Calculate date if not provided
      if (!metadata.date && metadata.number > 0) {
        metadata.date = calculateDateFromNumber(metadata.number);
      }
      
      // If no number, calculate from date
      if (metadata.number === 0 && metadata.date) {
        const startDate = new Date('2012-10-19');
        const currentDate = new Date(metadata.date);
        const diffTime = currentDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        metadata.number = diffDays + 1;
      }
      
      const everydayData: EverydayData = {
        title: metadata.title,
        date: metadata.date,
        number: metadata.number,
        image_url: `https://abraham-everydays.s3.amazonaws.com/${file}`, // Update with actual URL
        description: `Abraham's Everyday #${metadata.number}`,
        source_url: `https://abraham.ai/everydays/${metadata.number}`
      };
      
      // Insert into agent_archives table
      const { data, error } = await supabase
        .from('agent_archives')
        .insert({
          agent_id: 'abraham',
          archive_type: 'everyday',
          title: everydayData.title,
          description: everydayData.description,
          image_url: everydayData.image_url,
          thumbnail_url: everydayData.thumbnail_url,
          created_date: everydayData.date,
          archive_number: everydayData.number,
          source_url: everydayData.source_url,
          metadata: {
            original_filename: file,
            import_batch: 'initial_import',
            import_date: new Date().toISOString()
          }
        });
      
      if (error) {
        console.error(`Error importing ${file}:`, error);
        errorCount++;
      } else {
        console.log(`✓ Imported: ${everydayData.title} (${everydayData.date})`);
        successCount++;
      }
      
      // Progress indicator
      if ((index + 1) % 100 === 0) {
        console.log(`Progress: ${index + 1}/${files.length} files processed`);
      }
      
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
      errorCount++;
    }
  }
  
  console.log('\n=== Import Complete ===');
  console.log(`✓ Successfully imported: ${successCount} everydays`);
  console.log(`✗ Failed: ${errorCount} files`);
}

async function importFromGoogleDrive(folderId: string) {
  console.log('Google Drive import not yet implemented');
  console.log('Please download files locally first or implement Google Drive API integration');
  // TODO: Implement Google Drive API integration
}

async function verifyImport() {
  const { data, count } = await supabase
    .from('agent_archives')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', 'abraham')
    .eq('archive_type', 'everyday');
  
  console.log(`\nTotal Abraham Everydays in database: ${count}`);
  
  // Get date range
  const { data: dateRange } = await supabase
    .from('agent_archives')
    .select('created_date')
    .eq('agent_id', 'abraham')
    .eq('archive_type', 'everyday')
    .order('created_date', { ascending: true })
    .limit(1);
  
  const { data: latestDate } = await supabase
    .from('agent_archives')
    .select('created_date')
    .eq('agent_id', 'abraham')
    .eq('archive_type', 'everyday')
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
  
  if (command === 'google-drive') {
    const folderId = args[1];
    if (!folderId) {
      console.error('Please provide Google Drive folder ID');
      process.exit(1);
    }
    await importFromGoogleDrive(folderId);
  } else {
    // Default: import from local directory
    const directoryPath = args[0] || './abraham-everydays';
    await importFromLocalDirectory(directoryPath);
    await verifyImport();
  }
}

// Run the import
main().catch(console.error);