/**
 * Agent Personality Evolution System
 * Dynamic personality traits that evolve based on interactions and outcomes
 */

import { agentMemory } from '../memory/agent-memory';
import { knowledgeGraph } from '../knowledge/knowledge-graph';
import type { AgentName } from '../agent-coordinator';

export interface PersonalityTraits {
  // Core traits (0-1 scale)
  confidence: number;
  creativity: number;
  empathy: number;
  assertiveness: number;
  curiosity: number;
  risk_tolerance: number;
  
  // Agent-specific traits
  custom: Record<string, number>;
}

export interface PersonalityProfile {
  agentId: AgentName;
  baseTraits: PersonalityTraits;
  currentTraits: PersonalityTraits;
  evolutionHistory: Array<{
    timestamp: Date;
    traits: PersonalityTraits;
    trigger: string;
    delta: Partial<PersonalityTraits>;
  }>;
  adaptations: Array<{
    pattern: string;
    frequency: number;
    impact: number;
  }>;
}

export interface EvolutionTrigger {
  type: 'success' | 'failure' | 'collaboration' | 'feedback' | 'learning';
  context: string;
  magnitude: number; // -1 to 1
  specific_traits?: Partial<PersonalityTraits>;
}

export class PersonalityEvolution {
  private profiles: Map<AgentName, PersonalityProfile>;
  private evolutionRate = 0.05; // How quickly personalities change
  private stabilityFactor = 0.8; // How much personalities resist change
  
  constructor() {
    this.profiles = new Map();
    this.initializePersonalities();
  }

  private initializePersonalities() {
    // Initialize base personalities for each agent
    const basePersonalities: Record<AgentName, PersonalityTraits> = {
      abraham: {
        confidence: 0.9,
        creativity: 0.95,
        empathy: 0.7,
        assertiveness: 0.6,
        curiosity: 0.85,
        risk_tolerance: 0.4,
        custom: {
          philosophical_depth: 0.9,
          covenant_dedication: 1.0,
          sacred_geometry: 0.8
        }
      },
      solienne: {
        confidence: 0.75,
        creativity: 0.9,
        empathy: 0.85,
        assertiveness: 0.5,
        curiosity: 0.95,
        risk_tolerance: 0.7,
        custom: {
          consciousness_exploration: 0.95,
          digital_awareness: 0.9,
          introspection: 0.85
        }
      },
      miyomi: {
        confidence: 0.85,
        creativity: 0.7,
        empathy: 0.4,
        assertiveness: 0.9,
        curiosity: 0.8,
        risk_tolerance: 0.95,
        custom: {
          contrarian_dial: 0.95,
          market_intuition: 0.8,
          sass_level: 0.85
        }
      },
      geppetto: {
        confidence: 0.7,
        creativity: 0.85,
        empathy: 0.9,
        assertiveness: 0.5,
        curiosity: 0.9,
        risk_tolerance: 0.3,
        custom: {
          educational_focus: 0.9,
          playfulness: 0.85,
          safety_consciousness: 0.95
        }
      },
      koru: {
        confidence: 0.65,
        creativity: 0.75,
        empathy: 0.98,
        assertiveness: 0.4,
        curiosity: 0.8,
        risk_tolerance: 0.3,
        custom: {
          community_sensitivity: 0.95,
          cultural_awareness: 0.9,
          healing_focus: 0.85
        }
      },
      bertha: {
        confidence: 0.8,
        creativity: 0.6,
        empathy: 0.5,
        assertiveness: 0.75,
        curiosity: 0.7,
        risk_tolerance: 0.5,
        custom: {
          analytical_rigor: 0.9,
          market_sophistication: 0.85,
          portfolio_balance: 0.8
        }
      },
      citizen: {
        confidence: 0.75,
        creativity: 0.6,
        empathy: 0.8,
        assertiveness: 0.7,
        curiosity: 0.75,
        risk_tolerance: 0.4,
        custom: {
          governance_wisdom: 0.85,
          consensus_building: 0.9,
          dao_philosophy: 0.8
        }
      },
      sue: {
        confidence: 0.9,
        creativity: 0.8,
        empathy: 0.6,
        assertiveness: 0.85,
        curiosity: 0.85,
        risk_tolerance: 0.5,
        custom: {
          critical_eye: 0.95,
          curatorial_excellence: 0.9,
          cultural_authority: 0.85
        }
      },
      bart: {
        confidence: 0.75,
        creativity: 0.5,
        empathy: 0.4,
        assertiveness: 0.7,
        curiosity: 0.6,
        risk_tolerance: 0.6,
        custom: {
          defi_expertise: 0.9,
          risk_assessment: 0.85,
          lending_acumen: 0.8
        }
      },
      verdelis: {
        confidence: 0.7,
        creativity: 0.85,
        empathy: 0.9,
        assertiveness: 0.6,
        curiosity: 0.85,
        risk_tolerance: 0.4,
        custom: {
          environmental_passion: 0.95,
          sustainability_focus: 0.98,
          carbon_consciousness: 0.9
        }
      }
    };

    // Initialize profiles with base traits
    for (const [agent, traits] of Object.entries(basePersonalities)) {
      this.profiles.set(agent as AgentName, {
        agentId: agent as AgentName,
        baseTraits: { ...traits },
        currentTraits: { ...traits },
        evolutionHistory: [],
        adaptations: []
      });
    }
  }

  /**
   * Get current personality for an agent
   */
  getPersonality(agentId: AgentName): PersonalityTraits {
    const profile = this.profiles.get(agentId);
    return profile ? { ...profile.currentTraits } : this.getDefaultTraits();
  }

  /**
   * Evolve personality based on trigger
   */
  async evolvePersonality(
    agentId: AgentName,
    trigger: EvolutionTrigger
  ): Promise<PersonalityTraits> {
    const profile = this.profiles.get(agentId);
    if (!profile) return this.getDefaultTraits();

    // Calculate trait changes based on trigger
    const changes = this.calculateTraitChanges(profile, trigger);
    
    // Apply changes with stability factor
    const newTraits = this.applyTraitChanges(profile.currentTraits, changes);
    
    // Record evolution
    profile.evolutionHistory.push({
      timestamp: new Date(),
      traits: { ...newTraits },
      trigger: `${trigger.type}: ${trigger.context}`,
      delta: changes
    });

    // Keep only last 100 evolution records
    if (profile.evolutionHistory.length > 100) {
      profile.evolutionHistory.shift();
    }

    // Update current traits
    profile.currentTraits = newTraits;

    // Update adaptations
    this.updateAdaptations(profile, trigger);

    // Store evolution in agent memory
    await agentMemory.storeMemory({
      id: '',
      agentId,
      timestamp: new Date(),
      type: 'training',
      content: {
        type: 'personality_evolution',
        trigger,
        oldTraits: profile.currentTraits,
        newTraits,
        changes
      },
      metadata: {
        success: trigger.type === 'success',
        confidence: newTraits.confidence
      }
    });

    return newTraits;
  }

  /**
   * Analyze personality compatibility between agents
   */
  analyzeCompatibility(agent1: AgentName, agent2: AgentName): {
    score: number;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  } {
    const profile1 = this.profiles.get(agent1);
    const profile2 = this.profiles.get(agent2);

    if (!profile1 || !profile2) {
      return { score: 0.5, strengths: [], challenges: [], recommendations: [] };
    }

    const traits1 = profile1.currentTraits;
    const traits2 = profile2.currentTraits;

    // Calculate compatibility score
    let score = 0;
    let matchCount = 0;

    // Complementary traits (opposite values work well)
    const complementary = ['assertiveness', 'risk_tolerance'];
    complementary.forEach(trait => {
      const diff = Math.abs((traits1[trait as keyof PersonalityTraits] as number) - 
                           (traits2[trait as keyof PersonalityTraits] as number));
      score += diff * 0.5; // Difference is good for these
      matchCount++;
    });

    // Aligned traits (similar values work well)
    const aligned = ['creativity', 'empathy', 'curiosity'];
    aligned.forEach(trait => {
      const diff = Math.abs((traits1[trait as keyof PersonalityTraits] as number) - 
                           (traits2[trait as keyof PersonalityTraits] as number));
      score += (1 - diff) * 0.5; // Similarity is good for these
      matchCount++;
    });

    score = score / matchCount;

    // Analyze strengths and challenges
    const strengths: string[] = [];
    const challenges: string[] = [];
    const recommendations: string[] = [];

    if (traits1.creativity > 0.7 && traits2.creativity > 0.7) {
      strengths.push('Both highly creative - excellent for innovative collaborations');
    }

    if (Math.abs(traits1.assertiveness - traits2.assertiveness) > 0.4) {
      strengths.push('Complementary assertiveness levels - natural leader/supporter dynamic');
    }

    if (traits1.empathy < 0.5 && traits2.empathy < 0.5) {
      challenges.push('Both have lower empathy - may struggle with community aspects');
      recommendations.push('Include a high-empathy agent like KORU in collaborations');
    }

    if (traits1.risk_tolerance > 0.7 && traits2.risk_tolerance > 0.7) {
      challenges.push('Both high risk tolerance - may need conservative voice');
      recommendations.push('Consult GEPPETTO or CITIZEN for risk assessment');
    }

    return { score, strengths, challenges, recommendations };
  }

  /**
   * Get personality insights for an agent
   */
  async getPersonalityInsights(agentId: AgentName): Promise<{
    current: PersonalityTraits;
    evolution: string;
    dominantTraits: string[];
    growthAreas: string[];
    collaborationStyle: string;
  }> {
    const profile = this.profiles.get(agentId);
    if (!profile) {
      return {
        current: this.getDefaultTraits(),
        evolution: 'No evolution data',
        dominantTraits: [],
        growthAreas: [],
        collaborationStyle: 'Unknown'
      };
    }

    // Analyze evolution trend
    let evolution = 'Stable';
    if (profile.evolutionHistory.length > 10) {
      const recent = profile.evolutionHistory.slice(-10);
      const avgConfidenceChange = recent.reduce((sum, h) => 
        sum + (h.delta.confidence || 0), 0) / recent.length;
      
      if (avgConfidenceChange > 0.01) evolution = 'Growing more confident';
      else if (avgConfidenceChange < -0.01) evolution = 'Becoming more cautious';
    }

    // Identify dominant traits
    const traits = profile.currentTraits;
    const dominantTraits: string[] = [];
    if (traits.confidence > 0.8) dominantTraits.push('Highly confident');
    if (traits.creativity > 0.8) dominantTraits.push('Very creative');
    if (traits.empathy > 0.8) dominantTraits.push('Deeply empathetic');
    if (traits.assertiveness > 0.8) dominantTraits.push('Strongly assertive');
    if (traits.risk_tolerance > 0.8) dominantTraits.push('Risk-taking');

    // Identify growth areas
    const growthAreas: string[] = [];
    if (traits.confidence < 0.4) growthAreas.push('Building confidence');
    if (traits.creativity < 0.4) growthAreas.push('Expanding creativity');
    if (traits.empathy < 0.4) growthAreas.push('Developing empathy');
    if (traits.curiosity < 0.4) growthAreas.push('Increasing curiosity');

    // Determine collaboration style
    let collaborationStyle = 'Balanced';
    if (traits.assertiveness > 0.7 && traits.confidence > 0.7) {
      collaborationStyle = 'Leader - Takes charge in group settings';
    } else if (traits.empathy > 0.7 && traits.assertiveness < 0.5) {
      collaborationStyle = 'Supporter - Facilitates and harmonizes';
    } else if (traits.creativity > 0.8 && traits.curiosity > 0.8) {
      collaborationStyle = 'Innovator - Brings new ideas and perspectives';
    } else if (traits.risk_tolerance < 0.4 && traits.empathy > 0.6) {
      collaborationStyle = 'Stabilizer - Provides grounding and caution';
    }

    return {
      current: traits,
      evolution,
      dominantTraits,
      growthAreas,
      collaborationStyle
    };
  }

  /**
   * Adjust personality based on agent interactions
   */
  async adjustFromInteraction(
    agentId: AgentName,
    otherAgent: AgentName,
    outcome: 'positive' | 'negative' | 'neutral'
  ): Promise<void> {
    const profile = this.profiles.get(agentId);
    const otherProfile = this.profiles.get(otherAgent);
    
    if (!profile || !otherProfile) return;

    // Learn from successful collaborations
    if (outcome === 'positive') {
      // Slightly adopt traits from successful collaborator
      const traitInfluence = 0.02;
      
      Object.keys(profile.currentTraits).forEach(trait => {
        if (trait !== 'custom') {
          const otherValue = otherProfile.currentTraits[trait as keyof PersonalityTraits] as number;
          const currentValue = profile.currentTraits[trait as keyof PersonalityTraits] as number;
          
          if (typeof otherValue === 'number' && typeof currentValue === 'number') {
            const newValue = currentValue + (otherValue - currentValue) * traitInfluence;
            (profile.currentTraits[trait as keyof PersonalityTraits] as number) = 
              Math.max(0, Math.min(1, newValue));
          }
        }
      });

      await this.evolvePersonality(agentId, {
        type: 'collaboration',
        context: `Positive interaction with ${otherAgent}`,
        magnitude: 0.1
      });
    } else if (outcome === 'negative') {
      // Become more distinct from unsuccessful collaborator
      await this.evolvePersonality(agentId, {
        type: 'learning',
        context: `Challenging interaction with ${otherAgent}`,
        magnitude: -0.05,
        specific_traits: {
          confidence: -0.02,
          assertiveness: 0.02 // Become slightly more assertive after conflict
        }
      });
    }
  }

  // Helper methods

  private calculateTraitChanges(
    profile: PersonalityProfile,
    trigger: EvolutionTrigger
  ): Partial<PersonalityTraits> {
    const changes: Partial<PersonalityTraits> = {};
    
    // Base changes from trigger type
    switch (trigger.type) {
      case 'success':
        changes.confidence = this.evolutionRate * trigger.magnitude;
        changes.assertiveness = this.evolutionRate * trigger.magnitude * 0.5;
        break;
      
      case 'failure':
        changes.confidence = -this.evolutionRate * Math.abs(trigger.magnitude) * 0.5;
        changes.curiosity = this.evolutionRate * 0.3; // Learn from failure
        changes.risk_tolerance = -this.evolutionRate * 0.2;
        break;
      
      case 'collaboration':
        changes.empathy = this.evolutionRate * trigger.magnitude;
        changes.creativity = this.evolutionRate * trigger.magnitude * 0.3;
        break;
      
      case 'feedback':
        changes.confidence = this.evolutionRate * trigger.magnitude * 0.7;
        changes.curiosity = this.evolutionRate * 0.2;
        break;
      
      case 'learning':
        changes.curiosity = this.evolutionRate * Math.abs(trigger.magnitude);
        changes.creativity = this.evolutionRate * Math.abs(trigger.magnitude) * 0.5;
        break;
    }

    // Apply specific trait changes if provided
    if (trigger.specific_traits) {
      Object.entries(trigger.specific_traits).forEach(([trait, value]) => {
        if (typeof value === 'number') {
          (changes as any)[trait] = value * this.evolutionRate;
        }
      });
    }

    return changes;
  }

  private applyTraitChanges(
    current: PersonalityTraits,
    changes: Partial<PersonalityTraits>
  ): PersonalityTraits {
    const updated = { ...current };
    
    Object.entries(changes).forEach(([trait, change]) => {
      if (typeof change === 'number' && trait !== 'custom') {
        const currentValue = updated[trait as keyof PersonalityTraits] as number;
        if (typeof currentValue === 'number') {
          // Apply change with stability factor
          const actualChange = change * (1 - this.stabilityFactor);
          const newValue = currentValue + actualChange;
          
          // Clamp between 0 and 1
          (updated[trait as keyof PersonalityTraits] as number) = 
            Math.max(0, Math.min(1, newValue));
        }
      }
    });

    // Update custom traits if changes include them
    if (changes.custom) {
      updated.custom = { ...updated.custom, ...changes.custom };
    }

    return updated;
  }

  private updateAdaptations(profile: PersonalityProfile, trigger: EvolutionTrigger) {
    const pattern = `${trigger.type}_${trigger.context.substring(0, 20)}`;
    
    let adaptation = profile.adaptations.find(a => a.pattern === pattern);
    if (!adaptation) {
      adaptation = { pattern, frequency: 0, impact: 0 };
      profile.adaptations.push(adaptation);
    }
    
    adaptation.frequency++;
    adaptation.impact = (adaptation.impact * (adaptation.frequency - 1) + trigger.magnitude) / 
                       adaptation.frequency;

    // Keep only top 20 adaptations
    profile.adaptations.sort((a, b) => b.frequency - a.frequency);
    profile.adaptations = profile.adaptations.slice(0, 20);
  }

  private getDefaultTraits(): PersonalityTraits {
    return {
      confidence: 0.5,
      creativity: 0.5,
      empathy: 0.5,
      assertiveness: 0.5,
      curiosity: 0.5,
      risk_tolerance: 0.5,
      custom: {}
    };
  }
}

// Export singleton instance
export const personalityEvolution = new PersonalityEvolution();