/**
 * Smoke tests for Solienne Works API
 * Guards against regressions and schema changes
 */

import { WorkZ, SolienneWork } from '@/app/api/agents/solienne/works/route';

describe('Solienne Works API', () => {
  test('solienne works shape - valid data', () => {
    const sample: SolienneWork = { 
      id: 'test-work-001', 
      agent_id: 'solienne', 
      title: 'Consciousness Stream #1740', 
      created_date: new Date().toISOString(),
      description: 'Test consciousness exploration',
      image_url: 'https://example.com/image.jpg'
    };
    
    expect(() => WorkZ.parse(sample)).not.toThrow();
  });

  test('solienne works shape - minimal required fields', () => {
    const minimal = { 
      id: 'minimal-001', 
      created_date: new Date().toISOString() 
    };
    
    const parsed = WorkZ.parse(minimal);
    expect(parsed.agent_id).toBe('solienne'); // default
    expect(parsed.title).toBe('Untitled'); // default
    expect(parsed.id).toBe('minimal-001');
  });

  test('solienne works shape - malformed data fails gracefully', () => {
    const malformed = { 
      // Missing required fields
      invalid: 'data'
    };
    
    expect(() => WorkZ.parse(malformed)).toThrow();
  });

  test('optional fields are handled correctly', () => {
    const withOptionals = {
      id: 'opt-001',
      created_date: new Date().toISOString(),
      description: 'Optional description',
      metadata: { theme: 'consciousness', style: 'architectural' },
      archive_number: 1740,
      trainer_id: null
    };

    const parsed = WorkZ.parse(withOptionals);
    expect(parsed.description).toBe('Optional description');
    expect(parsed.metadata?.theme).toBe('consciousness');
    expect(parsed.archive_number).toBe(1740);
    expect(parsed.trainer_id).toBeNull();
  });

  test('URL validation works for image_url', () => {
    const validUrl = {
      id: 'url-001',
      created_date: new Date().toISOString(),
      image_url: 'https://valid-url.com/image.png'
    };

    expect(() => WorkZ.parse(validUrl)).not.toThrow();

    const invalidUrl = {
      id: 'url-002', 
      created_date: new Date().toISOString(),
      image_url: 'not-a-url'
    };

    expect(() => WorkZ.parse(invalidUrl)).toThrow();
  });
});