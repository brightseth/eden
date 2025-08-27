// Simple file-based storage for BERTHA training data
// In production, this would use a proper database

import fs from 'fs/promises';
import path from 'path';
import { amandaBootstrapKnowledge, bootstrapToTrainingData } from './amanda-bootstrap';

const TRAINING_DATA_DIR = path.join(process.cwd(), 'data', 'bertha-training');
const TRAINING_FILE = path.join(TRAINING_DATA_DIR, 'training-data.json');

interface TrainingRecord {
  id: string;
  trainer: string;
  timestamp: string;
  responses: Record<string, any>;
  configUpdates?: any;
  status: 'pending' | 'processed' | 'integrated';
}

// Ensure training directory exists
async function ensureDirectory() {
  try {
    await fs.mkdir(TRAINING_DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create training directory:', error);
  }
}

// Save training data to file
export async function saveTrainingData(data: TrainingRecord): Promise<void> {
  await ensureDirectory();
  
  try {
    // Read existing data
    let existingData: TrainingRecord[] = [];
    try {
      const fileContent = await fs.readFile(TRAINING_FILE, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch {
      // File doesn't exist yet, start with empty array
    }
    
    // Add new record
    existingData.push(data);
    
    // Write back to file
    await fs.writeFile(
      TRAINING_FILE, 
      JSON.stringify(existingData, null, 2),
      'utf-8'
    );
    
    console.log('Training data saved successfully');
  } catch (error) {
    console.error('Failed to save training data:', error);
    throw error;
  }
}

// Load all training data
export async function loadTrainingData(): Promise<TrainingRecord[]> {
  await ensureDirectory();
  
  try {
    const fileContent = await fs.readFile(TRAINING_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    // Return bootstrap data if no training file exists
    return [{
      id: 'bootstrap',
      trainer: 'Amanda Schmitt',
      timestamp: new Date().toISOString(),
      responses: bootstrapToTrainingData(),
      status: 'integrated'
    }];
  }
}

// Get latest training configuration
export async function getLatestTrainingConfig(): Promise<Record<string, any>> {
  const allData = await loadTrainingData();
  
  // Merge all processed training into single config
  const mergedConfig: Record<string, any> = {
    ...bootstrapToTrainingData() // Start with bootstrap
  };
  
  // Apply each training session in order
  allData
    .filter(d => d.status === 'processed' || d.status === 'integrated')
    .forEach(record => {
      Object.assign(mergedConfig, record.responses);
    });
  
  return mergedConfig;
}

// Initialize with bootstrap data if needed
export async function initializeBootstrapData(): Promise<void> {
  const existingData = await loadTrainingData();
  
  if (existingData.length === 0 || existingData[0].id !== 'bootstrap') {
    await saveTrainingData({
      id: 'bootstrap',
      trainer: 'Amanda Schmitt',
      timestamp: new Date().toISOString(),
      responses: bootstrapToTrainingData(),
      status: 'integrated'
    });
    console.log('Bootstrap data initialized for BERTHA');
  }
}

// Email notification function (placeholder)
export async function sendTrainingNotification(
  trainerEmail: string,
  trainingData: TrainingRecord
): Promise<void> {
  // In production, this would use a real email service
  console.log(`
    ========================================
    Training Notification Email
    ========================================
    To: ${trainerEmail}
    Subject: BERTHA Training Data Received
    
    Dear ${trainingData.trainer},
    
    Your training interview responses have been successfully processed.
    
    Session ID: ${trainingData.id}
    Timestamp: ${trainingData.timestamp}
    Status: ${trainingData.status}
    
    BERTHA is now incorporating your expertise into her collection intelligence.
    
    Key insights provided:
    ${Object.keys(trainingData.responses).map(key => `- ${key}`).join('\n    ')}
    
    Thank you for training BERTHA!
    
    Best,
    Eden Academy
    ========================================
  `);
}

// Google Sheets export function (placeholder implementation)
export async function exportToGoogleSheets(
  trainingData: TrainingRecord
): Promise<string> {
  // In production, this would use Google Sheets API
  // For now, we'll format the data for easy manual copy-paste
  
  const sheetsData = {
    metadata: {
      sessionId: trainingData.id,
      trainer: trainingData.trainer,
      timestamp: trainingData.timestamp,
      status: trainingData.status
    },
    responses: trainingData.responses
  };
  
  console.log(`
    ========================================
    GOOGLE SHEETS EXPORT DATA
    ========================================
    Copy the following data to Google Sheets:
    
    METADATA:
    Session ID: ${trainingData.id}
    Trainer: ${trainingData.trainer}
    Timestamp: ${trainingData.timestamp}
    Status: ${trainingData.status}
    
    RESPONSES:
    ${Object.entries(trainingData.responses)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n    ')}
    
    ========================================
    
    To set up Google Sheets integration:
    1. Create a Google Cloud Project
    2. Enable Google Sheets API
    3. Create service account credentials
    4. Add GOOGLE_SHEETS_API_KEY to environment variables
    5. Share target spreadsheet with service account email
    ========================================
  `);
  
  // Return placeholder URL - in production would return actual sheets URL
  return `https://docs.google.com/spreadsheets/d/placeholder-sheet-id/edit#gid=0`;
}

// Function to format training data as CSV for easy import
export function formatAsCSV(trainingData: TrainingRecord): string {
  const headers = ['Question', 'Response', 'Section', 'Timestamp', 'Trainer'];
  const rows = Object.entries(trainingData.responses).map(([question, response]) => {
    const cleanResponse = Array.isArray(response) 
      ? response.join('; ') 
      : String(response).replace(/\n/g, ' | ').replace(/,/g, ';');
    
    return [
      question,
      cleanResponse,
      'Unknown', // Would need section mapping
      trainingData.timestamp,
      trainingData.trainer
    ];
  });
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}