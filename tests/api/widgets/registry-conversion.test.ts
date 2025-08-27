/**
 * Registry to AgentConfig Conversion Tests
 * Tests for utility functions that convert Registry data to AgentConfig format
 */

import { registryAgentToConfig } from '../../../src/lib/registry-to-agent-config';

describe('Registry to AgentConfig Conversion', () => {
  describe('registryAgentToConfig', () => {
    test('should convert basic Registry agent to AgentConfig', () => {
      const registryAgent = {
        id: 'test-agent-1',
        handle: 'testAgent',
        displayName: 'Test Agent',
        status: 'ACTIVE',
        profile: {
          statement: 'A test agent for testing purposes',
          manifesto: 'Section 1: Test manifesto\n\nSection 2: More testing\n\nSection 3: Final section',
          links: {
            process: [
              { step: 'Step 1', description: 'First step' },
              { step: 'Step 2', description: 'Second step' }
            ],
            social: {
              twitter: 'testAgent',
              instagram: 'test.agent',
              email: 'test@eden.art'
            },
            identity: {
              tagline: 'Testing is my passion'
            }
          }
        },
        counts: {
          creations: 42,
          artifacts: 10
        }
      };

      const result = registryAgentToConfig(registryAgent);

      expect(result.id).toBe('testAgent');
      expect(result.name).toBe('Test Agent');
      expect(result.tagline).toBe('Testing is my passion');
      expect(result.description).toBe('A test agent for testing purposes');
      expect(result.manifestoSections).toHaveLength(3);
      expect(result.process).toHaveLength(2);
      expect(result.social).toHaveProperty('twitter', 'testAgent');
      expect(result.stats).toBeDefined();
    });

    test('should handle agent with minimal data', () => {
      const minimalAgent = {
        handle: 'minimal',
        displayName: 'Minimal Agent'
      };

      const result = registryAgentToConfig(minimalAgent);

      expect(result.id).toBe('minimal');
      expect(result.name).toBe('Minimal Agent');
      expect(result.tagline).toBe('');
      expect(result.description).toBe('');
      expect(result.manifestoSections).toHaveLength(0);
      expect(result.process).toHaveLength(0);
      expect(result.social).toBeUndefined();
      expect(result.stats).toBeUndefined();
    });

    test('should parse manifesto into sections', () => {
      const agentWithManifesto = {
        handle: 'manifesto-agent',
        profile: {
          manifesto: 'First Section: Introduction\n\nThis is the intro\n\nSecond Section: Details\n\nMore details here\n\nThird Section: Conclusion\n\nFinal thoughts'
        }
      };

      const result = registryAgentToConfig(agentWithManifesto);

      expect(result.manifestoSections).toHaveLength(3);
      expect(result.manifestoSections[0]).toHaveProperty('title', 'First Section: Introduction');
      expect(result.manifestoSections[0]).toHaveProperty('content', 'This is the intro');
      expect(result.manifestoSections[1]).toHaveProperty('title', 'Second Section: Details');
      expect(result.manifestoSections[1]).toHaveProperty('content', 'More details here');
      expect(result.manifestoSections[2]).toHaveProperty('title', 'Third Section: Conclusion');
      expect(result.manifestoSections[2]).toHaveProperty('content', 'Final thoughts');
    });

    test('should handle manifesto without clear sections', () => {
      const agentWithFreeform = {
        handle: 'freeform-agent',
        profile: {
          manifesto: 'This is just a paragraph of text without clear sections or structure.'
        }
      };

      const result = registryAgentToConfig(agentWithFreeform);

      expect(result.manifestoSections).toHaveLength(0);
    });

    test('should extract social links correctly', () => {
      const agentWithSocial = {
        handle: 'social-agent',
        profile: {
          links: {
            social: {
              twitter: 'socialagent',
              instagram: 'social.agent',
              tiktok: 'socialagenttt',
              website: 'https://socialagent.com',
              email: 'social@eden.art',
              discord: 'socialagent#1234'
            }
          }
        }
      };

      const result = registryAgentToConfig(agentWithSocial);

      expect(result.social).toHaveProperty('twitter', 'socialagent');
      expect(result.social).toHaveProperty('instagram', 'social.agent');
      expect(result.social).toHaveProperty('tiktok', 'socialagenttt');
      expect(result.social).toHaveProperty('website', 'https://socialagent.com');
      expect(result.social).toHaveProperty('email', 'social@eden.art');
      expect(result.social).toHaveProperty('discord', 'socialagent#1234');
    });

    test('should generate stats from counts', () => {
      const agentWithCounts = {
        handle: 'stats-agent',
        counts: {
          creations: 156,
          artifacts: 23,
          personas: 5
        },
        monthlyRevenue: 8500,
        outputRate: 45
      };

      const result = registryAgentToConfig(agentWithCounts);

      expect(result.stats).toBeDefined();
      expect(result.stats).toHaveProperty('totalWorks', 156);
      expect(result.stats).toHaveProperty('artifacts', 23);
      expect(result.stats).toHaveProperty('personas', 5);
      expect(result.stats).toHaveProperty('monthlyRevenue', 8500);
      expect(result.stats).toHaveProperty('outputRate', 45);
    });

    test('should handle missing process data', () => {
      const agentWithoutProcess = {
        handle: 'no-process',
        profile: {
          links: {}
        }
      };

      const result = registryAgentToConfig(agentWithoutProcess);

      expect(result.process).toHaveLength(0);
    });

    test('should determine accent color based on agent handle', () => {
      const abrahamAgent = { handle: 'abraham' };
      const solienneAgent = { handle: 'solienne' };
      const defaultAgent = { handle: 'unknown' };

      const abrahamResult = registryAgentToConfig(abrahamAgent);
      const solienneResult = registryAgentToConfig(solienneAgent);
      const defaultResult = registryAgentToConfig(defaultAgent);

      expect(abrahamResult.accentColor).toBe('blue-600');
      expect(solienneResult.accentColor).toBe('purple-600');
      expect(defaultResult.accentColor).toBe('gray-600');
    });

    test('should use fallback values when data is missing', () => {
      const emptyAgent = {
        handle: 'empty'
      };

      const result = registryAgentToConfig(emptyAgent);

      expect(result.name).toBe('empty'); // Uses handle as fallback
      expect(result.tagline).toBe(''); // Empty fallback
      expect(result.description).toBe(''); // Empty fallback
    });

    test('should prioritize tagline over statement for tagline field', () => {
      const agentWithBoth = {
        handle: 'both-agent',
        profile: {
          statement: 'This is the statement',
          links: {
            identity: {
              tagline: 'This is the tagline'
            }
          }
        }
      };

      const result = registryAgentToConfig(agentWithBoth);

      expect(result.tagline).toBe('This is the tagline');
    });

    test('should use statement as fallback for tagline', () => {
      const agentWithStatement = {
        handle: 'statement-agent',
        profile: {
          statement: 'This is the statement'
        }
      };

      const result = registryAgentToConfig(agentWithStatement);

      expect(result.tagline).toBe('This is the statement');
    });

    test('should preserve original data structure integrity', () => {
      const originalAgent = {
        id: 'preserve-test',
        handle: 'preserve',
        displayName: 'Preserve Agent',
        status: 'ACTIVE',
        profile: {
          statement: 'Original statement',
          manifesto: 'Original manifesto',
          links: {
            social: {
              twitter: 'preserve'
            }
          }
        }
      };

      const originalCopy = JSON.parse(JSON.stringify(originalAgent));
      const result = registryAgentToConfig(originalAgent);

      // Original should be unchanged
      expect(originalAgent).toEqual(originalCopy);
      
      // Result should have converted structure
      expect(result.id).toBe('preserve');
      expect(result.name).toBe('Preserve Agent');
    });

    test('should handle nested link structures safely', () => {
      const agentWithNestedLinks = {
        handle: 'nested-agent',
        profile: {
          links: {
            identity: {
              tagline: 'Nested tagline'
            },
            social: {
              twitter: 'nested'
            },
            process: [
              { step: 'Nested step', description: 'Nested description' }
            ],
            economicData: {
              monthlyRevenue: 5000
            }
          }
        }
      };

      const result = registryAgentToConfig(agentWithNestedLinks);

      expect(result.tagline).toBe('Nested tagline');
      expect(result.social).toHaveProperty('twitter', 'nested');
      expect(result.process).toHaveLength(1);
      expect(result.stats).toHaveProperty('monthlyRevenue', 5000);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null and undefined values', () => {
      const agentWithNulls = {
        handle: 'null-agent',
        displayName: null,
        profile: {
          statement: undefined,
          manifesto: null,
          links: null
        }
      };

      const result = registryAgentToConfig(agentWithNulls);

      expect(result.name).toBe('null-agent'); // Uses handle as fallback
      expect(result.tagline).toBe('');
      expect(result.description).toBe('');
      expect(result.manifestoSections).toHaveLength(0);
    });

    test('should handle empty strings', () => {
      const agentWithEmpty = {
        handle: 'empty-agent',
        displayName: '',
        profile: {
          statement: '',
          manifesto: '',
          links: {
            social: {
              twitter: '',
              email: ''
            }
          }
        }
      };

      const result = registryAgentToConfig(agentWithEmpty);

      expect(result.name).toBe('empty-agent'); // Uses handle as fallback
      expect(result.social).toBeUndefined(); // Empty social links should be undefined
    });

    test('should handle malformed manifesto', () => {
      const agentWithBadManifesto = {
        handle: 'bad-manifesto',
        profile: {
          manifesto: 'Title:\n\n\nContent:\nContent with multiple\n\n\n\nEmpty lines\n\n'
        }
      };

      const result = registryAgentToConfig(agentWithBadManifesto);

      // Should handle gracefully without crashing
      expect(result.manifestoSections).toBeDefined();
      expect(Array.isArray(result.manifestoSections)).toBe(true);
    });
  });
});