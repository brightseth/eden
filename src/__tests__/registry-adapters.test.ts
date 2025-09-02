import { 
  toLocalAgent, 
  toLocalCreation, 
  toLocalPersona,
  normalizeStatus 
} from '@/lib/registry/adapters';
import { toSdkCreationInput } from '@/lib/registry/gateway';

describe('Registry Adapters Contract Tests', () => {
  describe('Agent Adapter Round-trip', () => {
    test('SDK Agent → Local Agent preserves core fields', () => {
      const sdkAgent = {
        id: 'test-123',
        handle: 'testhandle',
        displayName: 'Test Agent',
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        cohort: 'genesis',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      };

      const localAgent = toLocalAgent(sdkAgent as any);

      expect(localAgent.id).toBe('test-123');
      expect(localAgent.handle).toBe('testhandle');
      expect(localAgent.displayName).toBe('Test Agent');
      expect(localAgent.status).toBe('ACTIVE');
      expect(localAgent.visibility).toBe('PUBLIC');
      expect(localAgent.cohort).toBe('genesis');
    });

    test('handles missing fields with defaults', () => {
      const minimalAgent = { id: 'minimal' };
      const localAgent = toLocalAgent(minimalAgent as any);

      expect(localAgent.id).toBe('minimal');
      expect(localAgent.handle).toBe('unknown');
      expect(localAgent.displayName).toBe('Untitled Agent');
      expect(localAgent.status).toBe('ACTIVE');
      expect(localAgent.visibility).toBe('PUBLIC');
    });
  });

  describe('Creation Adapter Round-trip', () => {
    test('Local Creation → SDK input → Local Creation preserves mediaUri', () => {
      const localCreation = {
        mediaUri: 'https://example.com/image.jpg',
        metadata: { prompt: 'test prompt' },
        status: 'published' as const,
        publishedTo: {
          chainTx: '0x123',
          farcasterCastId: 'cast-456'
        }
      };

      // Convert to SDK format
      const sdkInput = toSdkCreationInput(localCreation);
      
      expect(sdkInput.mediaUri).toBe('https://example.com/image.jpg');
      expect(sdkInput.metadata).toEqual({ prompt: 'test prompt' });
      expect(sdkInput.publishedTo).toBe('0x123'); // Only chainTx preserved
      expect(sdkInput.title).toBe('Untitled'); // Default added
      expect(sdkInput.description).toBe(''); // Default added

      // Simulate SDK response
      const sdkResponse = {
        id: 'creation-789',
        ...sdkInput,
        status: 'PUBLISHED',
        createdAt: '2024-01-01T00:00:00Z'
      };

      // Convert back to local
      const roundTripCreation = toLocalCreation('agent-123', sdkResponse);
      
      expect(roundTripCreation.id).toBe('creation-789');
      expect(roundTripCreation.agentId).toBe('agent-123');
      expect(roundTripCreation.mediaUri).toBe('https://example.com/image.jpg');
      expect(roundTripCreation.status).toBe('published');
      expect(roundTripCreation.metadata).toEqual({ prompt: 'test prompt' });
    });
  });

  describe('Status Normalization', () => {
    test('normalizes various status formats consistently', () => {
      expect(normalizeStatus('active')).toBe('ACTIVE');
      expect(normalizeStatus('ACTIVE')).toBe('ACTIVE');
      expect(normalizeStatus('ready')).toBe('ACTIVE');
      expect(normalizeStatus('online')).toBe('ACTIVE');
      
      expect(normalizeStatus('academy')).toBe('ACTIVE'); // Legacy
      expect(normalizeStatus('training')).toBe('ONBOARDING');
      expect(normalizeStatus('learning')).toBe('ONBOARDING');
      
      expect(normalizeStatus('paused')).toBe('ARCHIVED');
      expect(normalizeStatus('inactive')).toBe('ARCHIVED');
      expect(normalizeStatus('suspended')).toBe('ARCHIVED');
      
      expect(normalizeStatus(null)).toBe('ACTIVE'); // Default
      expect(normalizeStatus(undefined)).toBe('ACTIVE'); // Default
      expect(normalizeStatus('unknown')).toBe('ACTIVE'); // Default
    });
  });

  describe('Cache Wrapper Contract', () => {
    test('cacheSet/cacheGet returns naked type', () => {
      // This would be tested in the gateway class
      // Simulating the behavior here
      const cache = new Map();
      
      const cacheSet = <T>(key: string, data: T) => {
        cache.set(key, { data, timestamp: Date.now() });
      };
      
      const cacheGet = <T>(key: string): T | undefined => {
        const v = cache.get(key);
        if (!v) return undefined;
        if (Array.isArray(v)) return v as unknown as T; // legacy
        if (typeof v === 'object' && v && 'data' in v) return v.data;
        return v as T;
      };

      const testData = { id: 'test', name: 'Test Agent' };
      cacheSet('test-key', testData);
      
      const retrieved = cacheGet<typeof testData>('test-key');
      expect(retrieved).toEqual(testData);
      expect(retrieved).not.toHaveProperty('timestamp');
    });

    test('handles legacy array entries', () => {
      const cache = new Map();
      
      const cacheGet = <T>(key: string): T | undefined => {
        const v = cache.get(key);
        if (!v) return undefined;
        if (Array.isArray(v)) return v as unknown as T; // legacy
        if (typeof v === 'object' && v && 'data' in v) return v.data;
        return v as T;
      };

      // Legacy direct array storage
      const legacyData = [{ id: '1' }, { id: '2' }];
      cache.set('legacy-key', legacyData);
      
      const retrieved = cacheGet<typeof legacyData>('legacy-key');
      expect(retrieved).toEqual(legacyData);
      expect(Array.isArray(retrieved)).toBe(true);
    });
  });
});