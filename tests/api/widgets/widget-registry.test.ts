/**
 * Widget Registry Component Tests
 * Tests for widget registry functionality and metadata
 */

import { 
  WIDGET_REGISTRY, 
  getWidget, 
  getAllWidgets, 
  getWidgetsForAgentType,
  validateWidget,
  getWidgetComponent 
} from '../../../src/lib/profile/widget-registry';
import { WidgetType } from '../../../src/lib/profile/types';

describe('Widget Registry', () => {
  describe('Registry Structure', () => {
    test('should have all expected widget types', () => {
      const expectedTypes: WidgetType[] = [
        'hero',
        'mission', 
        'daily-practice',
        'training-status',
        'metrics',
        'works-gallery',
        'countdown',
        'trainer-info',
        'social-links',
        'custom-content'
      ];

      expectedTypes.forEach(type => {
        expect(WIDGET_REGISTRY[type]).toBeDefined();
        expect(WIDGET_REGISTRY[type].type).toBe(type);
      });
    });

    test('should have valid metadata for each widget', () => {
      Object.values(WIDGET_REGISTRY).forEach(widget => {
        expect(widget).toHaveProperty('type');
        expect(widget).toHaveProperty('name');
        expect(widget).toHaveProperty('description');
        expect(widget).toHaveProperty('component');
        
        expect(typeof widget.type).toBe('string');
        expect(typeof widget.name).toBe('string');
        expect(typeof widget.description).toBe('string');
        expect(widget.component).toBeDefined();
      });
    });

    test('should have valid config schemas', () => {
      Object.values(WIDGET_REGISTRY).forEach(widget => {
        if (widget.configSchema) {
          expect(widget.configSchema).toHaveProperty('type');
          expect(widget.configSchema.type).toBe('object');
          
          if (widget.configSchema.properties) {
            expect(typeof widget.configSchema.properties).toBe('object');
          }
        }
      });
    });
  });

  describe('Helper Functions', () => {
    test('getWidget should return correct widget metadata', () => {
      const heroWidget = getWidget('hero');
      expect(heroWidget).toBeDefined();
      expect(heroWidget?.type).toBe('hero');
      expect(heroWidget?.name).toBe('Hero Section');
      expect(heroWidget?.component).toBeDefined();
    });

    test('getWidget should return undefined for invalid type', () => {
      const invalid = getWidget('invalid' as WidgetType);
      expect(invalid).toBeUndefined();
    });

    test('getAllWidgets should return all widgets', () => {
      const allWidgets = getAllWidgets();
      expect(allWidgets).toHaveLength(Object.keys(WIDGET_REGISTRY).length);
      
      allWidgets.forEach(widget => {
        expect(widget).toHaveProperty('type');
        expect(widget).toHaveProperty('name');
        expect(widget).toHaveProperty('description');
        expect(widget).toHaveProperty('component');
      });
    });

    test('getWidgetsForAgentType should filter correctly', () => {
      const creatorWidgets = getWidgetsForAgentType('creator');
      const collectorWidgets = getWidgetsForAgentType('collector');
      
      expect(creatorWidgets.length).toBeGreaterThan(0);
      expect(collectorWidgets.length).toBeGreaterThan(0);
      
      // Daily practice should be available for both
      const creatorHasPractice = creatorWidgets.some(w => w.type === 'daily-practice');
      const collectorHasPractice = collectorWidgets.some(w => w.type === 'daily-practice');
      
      expect(creatorHasPractice).toBe(true);
      expect(collectorHasPractice).toBe(true);
    });

    test('getWidgetsForAgentType should include unrestricted widgets', () => {
      const widgets = getWidgetsForAgentType('any-type');
      
      // Hero widget should be available for any type
      const hasHero = widgets.some(w => w.type === 'hero');
      expect(hasHero).toBe(true);
    });

    test('getWidgetComponent should return component', () => {
      const HeroComponent = getWidgetComponent('hero');
      expect(HeroComponent).toBeDefined();
      expect(typeof HeroComponent).toBe('function');
    });

    test('getWidgetComponent should return undefined for invalid type', () => {
      const InvalidComponent = getWidgetComponent('invalid' as WidgetType);
      expect(InvalidComponent).toBeUndefined();
    });
  });

  describe('Widget Validation', () => {
    test('validateWidget should return true for valid widget', () => {
      const validWidget = {
        id: 'test-hero',
        type: 'hero' as WidgetType,
        position: { order: 1 },
        visibility: { always: true },
        config: {
          showStatus: true,
          showTrainer: true
        }
      };

      const isValid = validateWidget(validWidget);
      expect(isValid).toBe(true);
    });

    test('validateWidget should return false for invalid type', () => {
      const invalidWidget = {
        id: 'test-invalid',
        type: 'invalid' as WidgetType,
        position: { order: 1 },
        visibility: { always: true },
        config: {}
      };

      const isValid = validateWidget(invalidWidget);
      expect(isValid).toBe(false);
    });
  });

  describe('Widget Requirements', () => {
    test('hero widget should have correct requirements', () => {
      const heroWidget = getWidget('hero');
      expect(heroWidget?.requirements).toContain('displayName');
      expect(heroWidget?.requirements).toContain('status');
      expect(heroWidget?.requirements).toContain('trainer.name');
    });

    test('mission widget should have correct requirements', () => {
      const missionWidget = getWidget('mission');
      expect(missionWidget?.requirements).toContain('profile.statement');
    });

    test('works-gallery widget should have agent type restriction', () => {
      const worksWidget = getWidget('works-gallery');
      expect(worksWidget?.agentTypes).toContain('creator');
      expect(worksWidget?.requirements).toContain('counts.creations');
    });

    test('daily-practice widget should have agent type restrictions', () => {
      const practiceWidget = getWidget('daily-practice');
      expect(practiceWidget?.agentTypes).toContain('creator');
      expect(practiceWidget?.agentTypes).toContain('collector');
    });
  });

  describe('Config Schemas', () => {
    test('hero widget config schema should be valid', () => {
      const heroWidget = getWidget('hero');
      const schema = heroWidget?.configSchema;
      
      expect(schema).toBeDefined();
      expect(schema.type).toBe('object');
      expect(schema.properties).toHaveProperty('showStatus');
      expect(schema.properties).toHaveProperty('showTrainer');
      expect(schema.properties).toHaveProperty('primaryAction');
      expect(schema.properties).toHaveProperty('secondaryActions');
      
      expect(schema.properties.showStatus.type).toBe('boolean');
      expect(schema.properties.primaryAction.type).toBe('object');
      expect(schema.properties.secondaryActions.type).toBe('array');
    });

    test('mission widget config schema should be valid', () => {
      const missionWidget = getWidget('mission');
      const schema = missionWidget?.configSchema;
      
      expect(schema).toBeDefined();
      expect(schema.properties).toHaveProperty('title');
      expect(schema.properties).toHaveProperty('layout');
      expect(schema.properties).toHaveProperty('showBorder');
      
      expect(schema.properties.layout.enum).toContain('single-column');
      expect(schema.properties.layout.enum).toContain('two-column');
    });

    test('countdown widget config schema should validate dates', () => {
      const countdownWidget = getWidget('countdown');
      const schema = countdownWidget?.configSchema;
      
      expect(schema).toBeDefined();
      expect(schema.properties).toHaveProperty('targetDate');
      expect(schema.properties).toHaveProperty('title');
      expect(schema.properties).toHaveProperty('showDays');
      expect(schema.properties).toHaveProperty('showHours');
    });

    test('metrics widget config schema should have layout options', () => {
      const metricsWidget = getWidget('metrics');
      const schema = metricsWidget?.configSchema;
      
      expect(schema).toBeDefined();
      expect(schema.properties).toHaveProperty('layout');
      expect(schema.properties.layout.enum).toContain('horizontal');
      expect(schema.properties.layout.enum).toContain('vertical');
      expect(schema.properties.layout.enum).toContain('grid');
    });
  });

  describe('Component Loading', () => {
    test('all widget components should be loadable', () => {
      Object.keys(WIDGET_REGISTRY).forEach(type => {
        const component = getWidgetComponent(type as WidgetType);
        expect(component).toBeDefined();
        expect(typeof component).toBe('function');
      });
    });
  });

  describe('Widget Categories', () => {
    test('should categorize widgets by function', () => {
      const coreWidgets = ['hero', 'mission', 'metrics'];
      const contentWidgets = ['works-gallery', 'custom-content'];
      const interactionWidgets = ['social-links', 'trainer-info'];
      const statusWidgets = ['training-status', 'countdown', 'daily-practice'];
      
      coreWidgets.forEach(type => {
        expect(WIDGET_REGISTRY[type as WidgetType]).toBeDefined();
      });
      
      contentWidgets.forEach(type => {
        expect(WIDGET_REGISTRY[type as WidgetType]).toBeDefined();
      });
      
      interactionWidgets.forEach(type => {
        expect(WIDGET_REGISTRY[type as WidgetType]).toBeDefined();
      });
      
      statusWidgets.forEach(type => {
        expect(WIDGET_REGISTRY[type as WidgetType]).toBeDefined();
      });
    });
  });

  describe('Registry Consistency', () => {
    test('widget types should match metadata types', () => {
      Object.entries(WIDGET_REGISTRY).forEach(([key, widget]) => {
        expect(widget.type).toBe(key);
      });
    });

    test('all widgets should have consistent structure', () => {
      const requiredFields = ['type', 'name', 'description', 'component'];
      const optionalFields = ['configSchema', 'requirements', 'agentTypes', 'preview'];
      
      Object.values(WIDGET_REGISTRY).forEach(widget => {
        requiredFields.forEach(field => {
          expect(widget).toHaveProperty(field);
        });
        
        Object.keys(widget).forEach(field => {
          expect([...requiredFields, ...optionalFields]).toContain(field);
        });
      });
    });
  });
});