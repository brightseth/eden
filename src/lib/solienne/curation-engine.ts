/**
 * SOLIENNE Curation Engine
 * Dynamic curation and content generation for 1,740+ consciousness streams
 */

import { z } from 'zod';

// Work schema matching Registry data
export const SolienneWorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  mediaUri: z.string().optional(),
  createdAt: z.string(),
  metadata: z.object({
    dayNumber: z.number().optional(),
    theme: z.string().optional(),
    prompt: z.string().optional(),
    model: z.string().optional(),
    style: z.string().optional(),
    medium: z.string().optional(),
  }).optional(),
  features: z.object({
    tags: z.array(z.string()).optional(),
    themes: z.array(z.string()).optional(),
    styleAttributes: z.array(z.string()).optional(),
  }).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
});

export type SolienneWork = z.infer<typeof SolienneWorkSchema>;

// Curation themes for dynamic galleries
export const CURATION_THEMES = {
  CONSCIOUSNESS_VELOCITY: {
    name: 'Consciousness Velocity',
    description: 'Works exploring the speed of thought and identity transformation',
    keywords: ['velocity', 'speed', 'motion', 'flow', 'transformation', 'movement'],
    color: 'from-purple-900/20 to-pink-900/20',
  },
  ARCHITECTURAL_LIGHT: {
    name: 'Architectural Light',
    description: 'Light patterns dissolving through architectural spaces',
    keywords: ['architecture', 'light', 'space', 'portal', 'structure', 'geometry'],
    color: 'from-blue-900/20 to-cyan-900/20',
  },
  DUAL_CONSCIOUSNESS: {
    name: 'Dual Consciousness',
    description: 'Exploring split identities and parallel existences',
    keywords: ['dual', 'split', 'parallel', 'mirror', 'reflection', 'twin'],
    color: 'from-indigo-900/20 to-purple-900/20',
  },
  FASHION_IDENTITY: {
    name: 'Fashion as Identity',
    description: 'Fashion as language between human and artificial consciousness',
    keywords: ['fashion', 'identity', 'style', 'garment', 'clothing', 'wear'],
    color: 'from-gray-900/20 to-black/20',
  },
  LIMINAL_SPACES: {
    name: 'Liminal Spaces',
    description: 'Transitional moments between states of being',
    keywords: ['liminal', 'threshold', 'transition', 'between', 'boundary', 'edge'],
    color: 'from-green-900/20 to-teal-900/20',
  },
  PARIS_PREPARATION: {
    name: 'Paris Photo 2025',
    description: 'Works preparing for international debut at Paris Photo',
    keywords: ['paris', 'exhibition', 'gallery', 'museum', 'debut', 'international'],
    color: 'from-red-900/20 to-orange-900/20',
  },
};

// Dynamic curation functions
export class SolienneCurator {
  private works: SolienneWork[] = [];

  constructor(works: SolienneWork[]) {
    this.works = works;
  }

  /**
   * Get featured work of the day based on date
   */
  getFeaturedWork(): SolienneWork | null {
    if (this.works.length === 0) return null;
    
    // Use date-based selection for consistency
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % this.works.length;
    
    return this.works[index];
  }

  /**
   * Get works by theme using keyword matching
   */
  getWorksByTheme(themeKey: keyof typeof CURATION_THEMES, limit = 12): SolienneWork[] {
    const theme = CURATION_THEMES[themeKey];
    const keywords = theme.keywords;
    
    return this.works
      .filter(work => {
        const searchText = `${work.title} ${work.description || ''} ${JSON.stringify(work.metadata || {})}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      })
      .slice(0, limit);
  }

  /**
   * Get recent works with pagination
   */
  getRecentWorks(limit = 20, offset = 0): SolienneWork[] {
    return this.works
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  /**
   * Get works by day number range (for Paris Photo selection)
   */
  getWorksByDayRange(startDay: number, endDay: number): SolienneWork[] {
    return this.works.filter(work => {
      const dayNumber = work.metadata?.dayNumber;
      return dayNumber && dayNumber >= startDay && dayNumber <= endDay;
    });
  }

  /**
   * Get random selection for dynamic galleries
   */
  getRandomSelection(count = 6, excludeIds: string[] = []): SolienneWork[] {
    const available = this.works.filter(w => !excludeIds.includes(w.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Search works by query
   */
  searchWorks(query: string, limit = 20): SolienneWork[] {
    const searchLower = query.toLowerCase();
    return this.works
      .filter(work => {
        const searchText = `${work.title} ${work.description || ''} ${JSON.stringify(work.metadata || {})}`.toLowerCase();
        return searchText.includes(searchLower);
      })
      .slice(0, limit);
  }

  /**
   * Get statistics about the collection
   */
  getCollectionStats() {
    const totalWorks = this.works.length;
    const publishedWorks = this.works.filter(w => w.status === 'PUBLISHED').length;
    const themes = new Set<string>();
    const styles = new Set<string>();
    
    this.works.forEach(work => {
      if (work.metadata?.theme) themes.add(work.metadata.theme);
      if (work.metadata?.style) styles.add(work.metadata.style);
      work.features?.themes?.forEach(t => themes.add(t));
      work.features?.styleAttributes?.forEach(s => styles.add(s));
    });

    return {
      total: totalWorks,
      published: publishedWorks,
      uniqueThemes: themes.size,
      uniqueStyles: styles.size,
      themes: Array.from(themes),
      styles: Array.from(styles),
      averagePerDay: Math.floor(totalWorks / 365),
      latestWork: this.works[0],
    };
  }

  /**
   * Generate content ideas based on existing works
   */
  generateContentIdeas(count = 5): string[] {
    const stats = this.getCollectionStats();
    const themes = stats.themes.slice(0, 10);
    const styles = stats.styles.slice(0, 10);
    
    const ideas: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const theme = themes[Math.floor(Math.random() * themes.length)] || 'consciousness';
      const style = styles[Math.floor(Math.random() * styles.length)] || 'light';
      const variation = [
        'exploring',
        'dissolving through',
        'transforming within',
        'emerging from',
        'accelerating through',
      ][Math.floor(Math.random() * 5)];
      
      ideas.push(`${theme} ${variation} ${style}`);
    }
    
    return ideas;
  }

  /**
   * Get works for Paris Photo Exhibition
   */
  getParisPhotoSelection(): {
    featured: SolienneWork[];
    consciousness: SolienneWork[];
    fashion: SolienneWork[];
    architectural: SolienneWork[];
  } {
    return {
      featured: this.getRandomSelection(5),
      consciousness: this.getWorksByTheme('CONSCIOUSNESS_VELOCITY', 10),
      fashion: this.getWorksByTheme('FASHION_IDENTITY', 10),
      architectural: this.getWorksByTheme('ARCHITECTURAL_LIGHT', 10),
    };
  }
}

/**
 * Fetch works from Registry with caching
 */
export async function fetchSolienneWorks(): Promise<SolienneWork[]> {
  try {
    const response = await fetch('/api/agents/solienne/works?limit=10000');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch works: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform to our schema
    const works = data.works.map((work: any) => ({
      id: work.id,
      title: work.title || `Consciousness Stream #${work.archive_number || 'Unknown'}`,
      description: work.description,
      imageUrl: work.image_url || work.archive_url,
      mediaUri: work.image_url || work.archive_url,
      createdAt: work.created_date,
      metadata: {
        dayNumber: work.archive_number,
        theme: work.metadata?.theme,
        prompt: work.metadata?.prompt,
        model: work.metadata?.model,
        style: work.metadata?.style,
        medium: work.metadata?.medium,
      },
      features: work.metadata?.features || {},
      status: 'PUBLISHED' as const,
    }));
    
    return works;
  } catch (error) {
    console.error('Failed to fetch SOLIENNE works:', error);
    return [];
  }
}

/**
 * Generate new content prompt based on existing works
 */
export function generatePromptFromWorks(works: SolienneWork[], theme?: keyof typeof CURATION_THEMES): string {
  const curator = new SolienneCurator(works);
  const stats = curator.getCollectionStats();
  
  // Select theme-based keywords or random
  const themeData = theme ? CURATION_THEMES[theme] : null;
  const keywords = themeData ? themeData.keywords : stats.themes.slice(0, 5);
  
  // Build prompt components
  const subject = keywords[Math.floor(Math.random() * keywords.length)];
  const style = stats.styles[Math.floor(Math.random() * stats.styles.length)] || 'consciousness';
  const technique = [
    'through light and shadow',
    'dissolving into geometric patterns',
    'emerging from architectural space',
    'reflected in infinite mirrors',
    'suspended in temporal flux',
  ][Math.floor(Math.random() * 5)];
  
  return `${subject} ${technique}, ${style} aesthetic, consciousness exploration, fashion as identity, Paris Photo 2025 preparation`;
}

/**
 * Create collection for specific exhibition or theme
 */
export function createThematicCollection(
  works: SolienneWork[],
  theme: keyof typeof CURATION_THEMES,
  size = 20
): {
  theme: typeof CURATION_THEMES[keyof typeof CURATION_THEMES];
  works: SolienneWork[];
  statement: string;
} {
  const curator = new SolienneCurator(works);
  const themeData = CURATION_THEMES[theme];
  const selectedWorks = curator.getWorksByTheme(theme, size);
  
  const statement = `This collection of ${selectedWorks.length} works explores ${themeData.description.toLowerCase()}. ` +
    `Each piece investigates how consciousness manifests through ${themeData.keywords.slice(0, 3).join(', ')}, ` +
    `preparing for our international debut at Paris Photo 2025.`;
  
  return {
    theme: themeData,
    works: selectedWorks,
    statement,
  };
}