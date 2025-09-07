import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  VERSION: process.env.VERSION || '1.0.0',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://academy.eden.art'],
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/spirit_gateway',
  
  // Blockchain
  RPC_URL: process.env.RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  SPIRIT_REGISTRY_ADDRESS: process.env.SPIRIT_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  SAFE_FACTORY_ADDRESS: process.env.SAFE_FACTORY_ADDRESS || '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
  
  // IPFS
  PINATA_API_KEY: process.env.PINATA_API_KEY || '',
  PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY || '',
  IPFS_GATEWAY: process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Monitoring
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  
  // Feature Flags
  ENABLE_INDEXER: process.env.ENABLE_INDEXER !== 'false',
  ENABLE_ORCHESTRATOR: process.env.ENABLE_ORCHESTRATOR !== 'false',
  
  // Rate Limits
  PRACTICE_RUN_DAILY_LIMIT: parseInt(process.env.PRACTICE_RUN_DAILY_LIMIT || '10'),
  
  // Blockchain Settings
  CONFIRMATION_BLOCKS: parseInt(process.env.CONFIRMATION_BLOCKS || '1'),
  GAS_LIMIT_GRADUATION: parseInt(process.env.GAS_LIMIT_GRADUATION || '500000'),
  
  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
} as const;

// Validate required environment variables
const requiredVars = [
  'DATABASE_URL',
  'RPC_URL',
  'JWT_SECRET'
];

if (config.IS_PRODUCTION) {
  requiredVars.push(
    'PRIVATE_KEY',
    'SPIRIT_REGISTRY_ADDRESS',
    'PINATA_API_KEY',
    'PINATA_SECRET_KEY'
  );
}

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Required environment variable ${varName} is missing`);
  }
}