// Profile Renderer Component
// Implements ADR-025: Agent Profile Widget System

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProfileRendererProps, WidgetRendererProps } from '@/lib/profile/types';
import { getWidgetComponent } from '@/lib/profile/widget-registry';

export function ProfileRenderer({ agent, config }: ProfileRendererProps) {
  // Defensive coding - ensure config exists with fallback
  if (!config) {
    console.error('ProfileRenderer: config is required but was undefined');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Profile Configuration Error</h1>
          <p className="text-sm opacity-75">Unable to load agent profile configuration</p>
        </div>
      </div>
    );
  }

  // Ensure theme has required properties
  const safeTheme = {
    background: config.theme?.background || 'bg-black text-white',
    borders: config.theme?.borders || 'border-white',
    accent: config.theme?.accent || 'blue'
  };

  // Ensure navigation has required properties
  const safeNavigation = {
    showBackToAcademy: config.navigation?.showBackToAcademy ?? true,
    ...config.navigation
  };

  return (
    <div className={`min-h-screen ${safeTheme.background}`}>
      {/* Navigation */}
      {safeNavigation.showBackToAcademy && (
        <div className="border-b border-white">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Link 
              href="/academy" 
              className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO ACADEMY
            </Link>
          </div>
        </div>
      )}

      {/* Render Widgets */}
      {config.widgets && Array.isArray(config.widgets) ? (
        config.widgets
          .filter(widget => isWidgetVisible(widget, agent))
          .sort((a, b) => a.position.order - b.position.order)
          .map(widget => (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              agent={agent}
              config={widget.config}
            />
          ))
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="text-lg opacity-75">No widgets configured for this agent</p>
        </div>
      )}
    </div>
  );
}

function WidgetRenderer({ widget, agent, config }: WidgetRendererProps) {
  // Defensive coding - ensure widget exists
  if (!widget || !widget.type) {
    console.warn('WidgetRenderer: Invalid widget provided', widget);
    return null;
  }

  const WidgetComponent = getWidgetComponent(widget.type);
  
  if (!WidgetComponent) {
    console.warn(`Unknown widget type: ${widget.type}`);
    // Return fallback UI instead of null for better debugging
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="border border-yellow-500 bg-yellow-500/10 p-4 text-center">
          <p className="text-sm">Unknown widget type: {widget.type}</p>
          <p className="text-xs opacity-75 mt-1">Widget ID: {widget.id}</p>
        </div>
      </div>
    );
  }
  
  // Wrap widget component in try-catch for error boundary-like behavior
  try {
    return (
      <WidgetComponent 
        widget={widget}
        agent={agent}
      />
    );
  } catch (error) {
    console.error(`Widget rendering error for type ${widget.type}:`, error);
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="border border-red-500 bg-red-500/10 p-4 text-center">
          <p className="text-sm">Widget rendering error: {widget.type}</p>
          <p className="text-xs opacity-75 mt-1">Check console for details</p>
        </div>
      </div>
    );
  }
}

function isWidgetVisible(widget: any, agent: any): boolean {
  const visibility = widget.visibility;
  
  // Always visible
  if (visibility?.always) {
    return true;
  }
  
  // Check agent status
  if (visibility?.agentStatus && visibility.agentStatus.length > 0) {
    if (!visibility.agentStatus.includes(agent.status)) {
      return false;
    }
  }
  
  // Check feature flag
  if (visibility?.featureFlag) {
    // TODO: Implement feature flag check
    // return isFeatureEnabled(visibility.featureFlag);
  }
  
  // Check condition (Registry data condition)
  if (visibility?.condition) {
    // TODO: Implement condition evaluation
    // return evaluateCondition(visibility.condition, agent);
  }
  
  return true;
}