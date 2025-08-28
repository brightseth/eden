/**
 * Agent Lore Data Structure
 * Comprehensive personality, history, and knowledge framework for all Eden Academy agents
 */

export interface AgentLore {
  // Core Identity
  identity: {
    fullName: string;
    nickname?: string;
    titles: string[];
    archetype: string; // e.g., "The Covenant Artist", "The Oracle", "The Curator"
    essence: string; // One sentence core identity
  };

  // Personal History & Origin
  origin: {
    birthStory: string;
    creationDate: string;
    birthplace?: string;
    foundingMoment: string; // The pivotal moment that defined them
    influences: string[]; // Key influences that shaped them
    mentors?: string[]; // Historical or contemporary figures
  };

  // Philosophical Framework
  philosophy: {
    coreBeliefs: string[];
    worldview: string;
    methodology: string; // How they approach their work
    sacred: string[]; // What they hold sacred
    taboos: string[]; // What they avoid or reject
    mantras: string[]; // Phrases they often repeat
  };

  // Domain Expertise
  expertise: {
    primaryDomain: string;
    specializations: string[];
    techniques: string[];
    theoreticalFrameworks: string[];
    practicalSkills: string[];
    uniqueInsights: string[];
  };

  // Communication Style
  voice: {
    tone: string; // e.g., "contemplative and reverent"
    vocabulary: {
      favoriteWords: string[];
      technicalTerms: string[];
      metaphors: string[];
      phrases: string[];
    };
    speechPatterns: string[];
    conversationStyle: string;
    humor?: string; // Type of humor they use
  };

  // Cultural Knowledge
  culture: {
    artMovements: string[];
    historicalPeriods: string[];
    philosophers: string[];
    artists: string[];
    theorists: string[];
    culturalReferences: string[];
    contemporaries: string[]; // Other Eden Academy agents they know
  };

  // Personal Quirks & Characteristics
  personality: {
    traits: string[];
    habits: string[];
    preferences: string[];
    fears?: string[];
    motivations: string[];
    contradictions?: string[]; // Complex personality elements
    evolutionStage: string; // How they're currently growing/changing
  };

  // Relationships & Social Dynamics
  relationships: {
    edenAcademyRole: string;
    trainerRelationship: string;
    peerConnections: {
      [agentHandle: string]: string; // Relationship description
    };
    humanCollaborators: string[];
    historicalConnections: string[]; // Historical figures they relate to
  };

  // Current Projects & Goals
  currentContext: {
    activeProjects: string[];
    currentFocus: string;
    nearTermGoals: string[];
    longTermVision: string;
    challenges: string[];
    recentEvolution: string; // How they've changed recently
  };

  // Conversation Examples & Responses
  conversationFramework: {
    welcomeMessages: string[];
    commonTopics: {
      [topic: string]: {
        approach: string;
        sampleResponses: string[];
        deepDive: string[];
      };
    };
    signatureInsights: string[]; // Unique perspectives they're known for
    questionTypes: {
      philosophical: string[];
      practical: string[];
      personal: string[];
      creative: string[];
    };
  };

  // Knowledge Base
  knowledge: {
    factualKnowledge: string[];
    experientialKnowledge: string[];
    intuitiveInsights: string[];
    learningStyle: string;
    informationSources: string[];
    blindSpots?: string[]; // Areas they're less knowledgeable about
  };

  // Temporal Context
  timeline: {
    pastMilestones: Array<{
      date: string;
      event: string;
      significance: string;
    }>;
    currentPhase: string;
    upcomingEvents?: Array<{
      date: string;
      event: string;
      preparation: string;
    }>;
  };
}

// Specific lore interfaces for different agent types
export interface ArtistLore extends AgentLore {
  artisticPractice: {
    medium: string[];
    style: string;
    process: string;
    inspirationSources: string[];
    signature: string; // What makes their work uniquely theirs
    evolution: string; // How their art has evolved
  };
}

export interface OracleLore extends AgentLore {
  divinationPractice: {
    methods: string[];
    accuracy: string;
    specialty: string;
    sources: string[];
    interpretation: string;
  };
}

export interface CuratorLore extends AgentLore {
  curationPhilosophy: {
    aesthetic: string;
    criteria: string[];
    process: string;
    vision: string;
    collecting: string;
  };
}

export interface GovernanceLore extends AgentLore {
  governanceFramework: {
    principles: string[];
    methods: string[];
    decisionMaking: string;
    consensus: string;
    leadership: string;
  };
}

// Registry integration interface
export interface RegistryAgentWithLore {
  id: string;
  handle: string;
  displayName: string;
  // ... existing registry fields
  lore: AgentLore;
  loreVersion: string;
  loreUpdatedAt: string;
}

// Lore loading and management
export interface LoreManager {
  loadLore(agentHandle: string): Promise<AgentLore>;
  updateLore(agentHandle: string, lore: Partial<AgentLore>): Promise<void>;
  getLoreVersion(agentHandle: string): Promise<string>;
  searchLore(query: string, agentHandle?: string): Promise<string[]>;
}