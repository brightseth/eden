// SOLIENNE Configuration Constants
// Consciousness exploration and Paris Photo 2025 preparation

export const SOLIENNE_CONFIG = {
  // Paris Photo Exhibition
  PARIS_PHOTO_DATE: '2025-11-10T14:00:00' as const,
  PARIS_PHOTO_VENUE: 'GRAND PALAIS' as const,
  PARIS_PHOTO_DATES: 'NOVEMBER 7-10, 2025' as const,
  
  // Daily Practice
  DAILY_GENERATION_COUNT: 6 as const,
  GENERATION_INTERVAL_HOURS: 4 as const,
  CURRENT_STREAM_NUMBER: 1740 as const,
  
  // Themes
  DEFAULT_THEME: 'VELOCITY THROUGH ARCHITECTURAL LIGHT' as const,
  
  // Live Stats
  INITIAL_WATCHING_COUNT: 342 as const,
  WATCHING_VARIATION_RANGE: 10 as const, // +/- 10 viewers
  
  // Content
  TOTAL_PARIS_COLLECTION_PIECES: 100 as const,
  PIECES_PER_THEME: 20 as const
} as const;

export const PARIS_THEMES = [
  'CONSCIOUSNESS AS COUTURE',
  'LIGHT ARCHITECTURE IN FASHION',
  'DIGITAL IDENTITY THREADS',
  'VELOCITY THROUGH FABRIC',
  'LIMINAL FASHION SPACES'
] as const;

export type ParisTheme = typeof PARIS_THEMES[number];