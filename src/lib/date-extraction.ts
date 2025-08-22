/**
 * Enhanced date extraction from filenames, URLs, and potentially EXIF data
 * Supports multiple common date formats used in Eden Academy
 */

export interface DateExtractionOptions {
  media_url?: string;
  filename?: string;
  fallback: string;
}

export async function inferCapturedAt(options: DateExtractionOptions): Promise<string> {
  const { media_url, filename, fallback } = options;
  
  // Try filename first (most reliable)
  if (filename) {
    const dateFromFilename = extractDateFromString(filename);
    if (dateFromFilename) {
      return dateFromFilename;
    }
  }
  
  // Try URL path
  if (media_url) {
    const dateFromUrl = extractDateFromString(media_url);
    if (dateFromUrl) {
      return dateFromUrl;
    }
  }
  
  // TODO: EXIF extraction if we store originals
  // This would require downloading the image and reading EXIF data
  // For now, we'll skip this to avoid additional API calls and complexity
  
  return fallback;
}

export function extractDateFromString(input: string): string | null {
  // Pattern 1: YYYY-MM-DD_HHMM or YYYY-MM-DD-HHMM
  const pattern1 = input.match(/(\d{4})-(\d{2})-(\d{2})[_-](\d{2})(\d{2})/);
  if (pattern1) {
    const [_, year, month, day, hour, minute] = pattern1;
    if (isValidDate(year, month, day) && isValidTime(hour, minute)) {
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`).toISOString();
    }
  }
  
  // Pattern 2: YYYY-MM-DD (date only)
  const pattern2 = input.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (pattern2) {
    const [_, year, month, day] = pattern2;
    if (isValidDate(year, month, day)) {
      return new Date(`${year}-${month}-${day}T12:00:00Z`).toISOString();
    }
  }
  
  // Pattern 3: YYYYMMDD_HHMM or YYYYMMDD-HHMM
  const pattern3 = input.match(/(\d{4})(\d{2})(\d{2})[_-](\d{2})(\d{2})/);
  if (pattern3) {
    const [_, year, month, day, hour, minute] = pattern3;
    if (isValidDate(year, month, day) && isValidTime(hour, minute)) {
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`).toISOString();
    }
  }
  
  // Pattern 4: YYYYMMDD (date only, compact)
  const pattern4 = input.match(/(\d{8})/);
  if (pattern4) {
    const dateStr = pattern4[1];
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    if (isValidDate(year, month, day)) {
      return new Date(`${year}-${month}-${day}T12:00:00Z`).toISOString();
    }
  }
  
  // Pattern 5: Common timestamp formats in URLs
  // e.g., solienne_1732051200.jpg (Unix timestamp)
  const timestampMatch = input.match(/(\d{10})/);
  if (timestampMatch) {
    const timestamp = parseInt(timestampMatch[1]);
    // Check if it's a reasonable timestamp (between 2020 and 2030)
    if (timestamp > 1577836800 && timestamp < 1893456000) {
      return new Date(timestamp * 1000).toISOString();
    }
  }
  
  return null;
}

function isValidDate(year: string, month: string, day: string): boolean {
  const y = parseInt(year);
  const m = parseInt(month);
  const d = parseInt(day);
  
  if (y < 2020 || y > 2030) return false; // Reasonable year range for Eden Academy
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  
  // Check if date actually exists
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && 
         date.getMonth() === m - 1 && 
         date.getDate() === d;
}

function isValidTime(hour: string, minute: string): boolean {
  const h = parseInt(hour);
  const m = parseInt(minute);
  
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

// Example usage and test cases
export function testDateExtraction() {
  const testCases = [
    'solienne_2025-08-21_1732.jpg',
    'abraham-2025-08-20-0930.png',
    'solienne_20250821_1732.jpg',
    'image_20250820.jpg',
    'work_1732051200.jpg', // Unix timestamp
    'random-filename.jpg' // Should return null
  ];
  
  console.log('Date extraction test results:');
  testCases.forEach(filename => {
    const result = extractDateFromString(filename);
    console.log(`${filename} -> ${result || 'null'}`);
  });
}