/**
 * Registry Contract Tests
 * Validates API contracts between Eden Registry and consuming services
 * Ensures data model consistency and API stability
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { registryClient } from '@/lib/registry/client';
import { Agent, Profile, Creation, Persona, Artifact } from '@/lib/registry/types';
import { z } from 'zod';

// Contract schemas for validation
const AgentSchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  cohort: z.enum(['genesis', 'alpha', 'beta']),
  status: z.enum(['active', 'training', 'launched', 'archived']),
  profile: z.object({}).optional(),
  capabilities: z.array(z.any()).optional(),
  personality: z.object({}).optional(),
  operational_config: z.object({}).optional(),
  metrics: z.object({}).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

const ProfileSchema = z.object({
  agent_id: z.string(),
  bio: z.string().min(1),
  description: z.string().min(1),
  avatar_url: z.string().url().optional().nullable(),
  banner_url: z.string().url().optional().nullable(),
  personality: z.object({}).optional(),
  values: z.array(z.string()).optional(),
  communication_style: z.object({}).optional(),
  expertise_areas: z.array(z.string()).optional(),
  interaction_preferences: z.object({}).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

const CreationSchema = z.object({
  id: z.string().min(1),
  agent_id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  status: z.enum(['draft', 'published', 'curated', 'archived']),
  content_url: z.string().url().optional().nullable(),
  metadata: z.object({}).optional(),
  created_at: z.string(),
  updated_at: z.string().optional()
});

const PersonaSchema = z.object({
  id: z.string(),
  agent_id: z.string(),
  name: z.string(),
  description: z.string(),
  traits: z.object({}),
  active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().optional()
});

const ArtifactSchema = z.object({
  id: z.string(),
  agent_id: z.string(),
  type: z.string(),
  name: z.string(),
  content: z.object({}),
  metadata: z.object({}).optional(),
  created_at: z.string(),
  updated_at: z.string().optional()
});

describe('Registry Contract Validation', () => {
  const TEST_AGENT_ID = 'amanda';
  const TIMEOUT_MS = 10000;

  beforeAll(() => {
    // Ensure Registry is available for contract testing
    process.env.USE_REGISTRY = 'true';
  });

  describe('Agent Endpoint Contracts', () => {
    it('should validate /agents endpoint response format', async () => {
      const agents = await registryClient.getAgents();
      
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
      
      // Validate each agent conforms to contract
      agents.forEach(agent => {
        const result = AgentSchema.safeParse(agent);
        if (!result.success) {
          console.error('Agent schema validation failed:', result.error.issues);
          console.error('Agent data:', agent);
        }
        expect(result.success).toBe(true);
      });
    }, TIMEOUT_MS);

    it('should validate /agents/{id} endpoint response format', async () => {
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      
      const result = AgentSchema.safeParse(agent);
      if (!result.success) {
        console.error('Agent schema validation failed:', result.error.issues);
        console.error('Agent data:', agent);
      }
      expect(result.success).toBe(true);
      
      // Validate specific fields
      expect(agent.id).toBe(TEST_AGENT_ID);
      expect(agent.handle).toBe('amanda');
      expect(agent.role).toBe('art-collector');
    }, TIMEOUT_MS);

    it('should validate /agents with query parameters', async () => {
      // Test cohort filter
      const genesisAgents = await registryClient.getAgents({ cohort: 'genesis' });
      expect(Array.isArray(genesisAgents)).toBe(true);
      
      genesisAgents.forEach(agent => {
        expect(agent.cohort).toBe('genesis');
        const result = AgentSchema.safeParse(agent);
        expect(result.success).toBe(true);
      });

      // Test status filter
      const activeAgents = await registryClient.getAgents({ status: 'active' });
      expect(Array.isArray(activeAgents)).toBe(true);
      
      activeAgents.forEach(agent => {
        expect(agent.status).toBe('active');
      });
    }, TIMEOUT_MS);

    it('should validate /agents/{id} with include parameters', async () => {
      const agent = await registryClient.getAgent(TEST_AGENT_ID, ['profile', 'capabilities']);
      
      const result = AgentSchema.safeParse(agent);
      expect(result.success).toBe(true);
      
      // When include is specified, these fields should be present
      expect(agent.profile).toBeDefined();
      expect(agent.capabilities).toBeDefined();
      
      // Validate types
      expect(typeof agent.profile).toBe('object');
      expect(Array.isArray(agent.capabilities)).toBe(true);
    }, TIMEOUT_MS);
  });

  describe('Profile Endpoint Contracts', () => {
    it('should validate /agents/{id}/profile endpoint response format', async () => {
      const profile = await registryClient.getAgentProfile(TEST_AGENT_ID);
      
      const result = ProfileSchema.safeParse(profile);
      if (!result.success) {
        console.error('Profile schema validation failed:', result.error.issues);
        console.error('Profile data:', profile);
      }
      expect(result.success).toBe(true);
      
      // Validate required fields
      expect(profile.agent_id).toBe(TEST_AGENT_ID);
      expect(profile.bio).toBeDefined();
      expect(profile.description).toBeDefined();
      expect(typeof profile.bio).toBe('string');
      expect(typeof profile.description).toBe('string');
    }, TIMEOUT_MS);

    it('should validate profile URL fields are valid URLs or null', async () => {
      const profile = await registryClient.getAgentProfile(TEST_AGENT_ID);
      
      if (profile.avatar_url) {
        expect(profile.avatar_url).toMatch(/^https?:\/\/.+/);
      }
      
      if (profile.banner_url) {
        expect(profile.banner_url).toMatch(/^https?:\/\/.+/);
      }
    }, TIMEOUT_MS);

    it('should validate profile arrays contain expected data types', async () => {
      const profile = await registryClient.getAgentProfile(TEST_AGENT_ID);
      
      if (profile.values) {
        expect(Array.isArray(profile.values)).toBe(true);
        profile.values.forEach(value => {
          expect(typeof value).toBe('string');
        });
      }
      
      if (profile.expertise_areas) {
        expect(Array.isArray(profile.expertise_areas)).toBe(true);
        profile.expertise_areas.forEach(area => {
          expect(typeof area).toBe('string');
        });
      }
    }, TIMEOUT_MS);
  });

  describe('Creation Endpoint Contracts', () => {
    it('should validate /agents/{id}/creations endpoint response format', async () => {
      const creations = await registryClient.getAgentCreations(TEST_AGENT_ID);
      
      expect(Array.isArray(creations)).toBe(true);
      
      creations.forEach(creation => {
        const result = CreationSchema.safeParse(creation);
        if (!result.success) {
          console.error('Creation schema validation failed:', result.error.issues);
          console.error('Creation data:', creation);
        }
        expect(result.success).toBe(true);
        expect(creation.agent_id).toBe(TEST_AGENT_ID);
      });
    }, TIMEOUT_MS);

    it('should validate creation status filtering', async () => {
      const publishedCreations = await registryClient.getAgentCreations(TEST_AGENT_ID, 'published');
      
      expect(Array.isArray(publishedCreations)).toBe(true);
      publishedCreations.forEach(creation => {
        expect(creation.status).toBe('published');
      });

      const curatedCreations = await registryClient.getAgentCreations(TEST_AGENT_ID, 'curated');
      
      expect(Array.isArray(curatedCreations)).toBe(true);
      curatedCreations.forEach(creation => {
        expect(creation.status).toBe('curated');
      });
    }, TIMEOUT_MS);

    it('should validate creation URLs are valid when present', async () => {
      const creations = await registryClient.getAgentCreations(TEST_AGENT_ID);
      
      creations.forEach(creation => {
        if (creation.content_url) {
          expect(creation.content_url).toMatch(/^https?:\/\/.+/);
        }
      });
    }, TIMEOUT_MS);
  });

  describe('Persona Endpoint Contracts', () => {
    it('should validate /agents/{id}/personas endpoint response format', async () => {
      const personas = await registryClient.getAgentPersonas(TEST_AGENT_ID);
      
      expect(Array.isArray(personas)).toBe(true);
      
      personas.forEach(persona => {
        const result = PersonaSchema.safeParse(persona);
        if (!result.success) {
          console.error('Persona schema validation failed:', result.error.issues);
          console.error('Persona data:', persona);
        }
        expect(result.success).toBe(true);
        expect(persona.agent_id).toBe(TEST_AGENT_ID);
      });
    }, TIMEOUT_MS);

    it('should validate persona traits structure', async () => {
      const personas = await registryClient.getAgentPersonas(TEST_AGENT_ID);
      
      personas.forEach(persona => {
        expect(typeof persona.traits).toBe('object');
        expect(persona.traits).not.toBeNull();
        expect(typeof persona.active).toBe('boolean');
      });
    }, TIMEOUT_MS);
  });

  describe('Artifact Endpoint Contracts', () => {
    it('should validate /agents/{id}/artifacts endpoint response format', async () => {
      const artifacts = await registryClient.getAgentArtifacts(TEST_AGENT_ID);
      
      expect(Array.isArray(artifacts)).toBe(true);
      
      artifacts.forEach(artifact => {
        const result = ArtifactSchema.safeParse(artifact);
        if (!result.success) {
          console.error('Artifact schema validation failed:', result.error.issues);
          console.error('Artifact data:', artifact);
        }
        expect(result.success).toBe(true);
        expect(artifact.agent_id).toBe(TEST_AGENT_ID);
      });
    }, TIMEOUT_MS);

    it('should validate artifact content structure', async () => {
      const artifacts = await registryClient.getAgentArtifacts(TEST_AGENT_ID);
      
      artifacts.forEach(artifact => {
        expect(typeof artifact.content).toBe('object');
        expect(artifact.content).not.toBeNull();
        expect(typeof artifact.type).toBe('string');
        expect(artifact.type.length).toBeGreaterThan(0);
      });
    }, TIMEOUT_MS);
  });

  describe('Error Response Contracts', () => {
    it('should validate 404 error response format', async () => {
      try {
        await registryClient.getAgent('non-existent-agent');
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const message = (error as Error).message;
        expect(message).toContain('404');
      }
    }, TIMEOUT_MS);

    it('should validate invalid parameter error responses', async () => {
      try {
        await registryClient.getAgent('');
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    }, TIMEOUT_MS);

    it('should validate malformed query parameter handling', async () => {
      try {
        // @ts-expect-error - Intentionally passing invalid status
        await registryClient.getAgents({ status: 'invalid-status' as any });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const message = (error as Error).message;
        expect(message.length).toBeGreaterThan(0);
      }
    }, TIMEOUT_MS);
  });

  describe('Response Headers and Metadata', () => {
    it('should validate response timing is reasonable', async () => {
      const startTime = Date.now();
      await registryClient.getAgent(TEST_AGENT_ID);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(5000); // Less than 5 seconds
      expect(responseTime).toBeGreaterThan(0);
    }, TIMEOUT_MS);

    it('should validate consistent response structure across endpoints', async () => {
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      const profile = await registryClient.getAgentProfile(TEST_AGENT_ID);
      const creations = await registryClient.getAgentCreations(TEST_AGENT_ID);
      
      // All should have consistent timestamp formats
      if (agent.created_at) {
        expect(agent.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      }
      
      if (profile.created_at) {
        expect(profile.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      }
      
      creations.forEach(creation => {
        expect(creation.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    }, TIMEOUT_MS);
  });

  describe('Backward Compatibility', () => {
    it('should maintain API version compatibility', async () => {
      // Test that current client works with Registry API
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      
      // Core fields that must always be present for backward compatibility
      const requiredFields = ['id', 'handle', 'name', 'role', 'cohort', 'status'];
      requiredFields.forEach(field => {
        expect(agent).toHaveProperty(field);
        expect((agent as any)[field]).toBeDefined();
      });
    }, TIMEOUT_MS);

    it('should handle optional fields gracefully', async () => {
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      
      // Optional fields should not break the contract if missing
      const optionalFields = ['metrics', 'operational_config', 'personality'];
      optionalFields.forEach(field => {
        // Field can be undefined, but if present should be an object
        const value = (agent as any)[field];
        if (value !== undefined) {
          expect(typeof value).toBe('object');
        }
      });
    }, TIMEOUT_MS);
  });

  describe('Data Type Consistency', () => {
    it('should validate consistent ID formats across endpoints', async () => {
      const agents = await registryClient.getAgents();
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      const profile = await registryClient.getAgentProfile(TEST_AGENT_ID);
      
      // Agent IDs should be consistent
      expect(agent.id).toBe(TEST_AGENT_ID);
      expect(profile.agent_id).toBe(TEST_AGENT_ID);
      
      // All agent IDs should follow same format
      agents.forEach(a => {
        expect(typeof a.id).toBe('string');
        expect(a.id.length).toBeGreaterThan(0);
        expect(a.id).toMatch(/^[a-z0-9-_]+$/); // alphanumeric, dashes, underscores
      });
    }, TIMEOUT_MS);

    it('should validate consistent enum values', async () => {
      const agents = await registryClient.getAgents();
      
      const validCohorts = ['genesis', 'alpha', 'beta'];
      const validStatuses = ['active', 'training', 'launched', 'archived'];
      
      agents.forEach(agent => {
        expect(validCohorts).toContain(agent.cohort);
        expect(validStatuses).toContain(agent.status);
      });
    }, TIMEOUT_MS);

    it('should validate consistent date formats', async () => {
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      const creations = await registryClient.getAgentCreations(TEST_AGENT_ID);
      
      // All dates should be ISO 8601 format
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;
      
      if (agent.created_at) {
        expect(agent.created_at).toMatch(dateRegex);
      }
      
      if (agent.updated_at) {
        expect(agent.updated_at).toMatch(dateRegex);
      }
      
      creations.forEach(creation => {
        expect(creation.created_at).toMatch(dateRegex);
        if (creation.updated_at) {
          expect(creation.updated_at).toMatch(dateRegex);
        }
      });
    }, TIMEOUT_MS);
  });
});