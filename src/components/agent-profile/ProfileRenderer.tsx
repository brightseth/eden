// Profile Renderer Component
// Implements ADR-025: Agent Profile Widget System

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProfileRendererProps, WidgetRendererProps } from '@/lib/profile/types';
import { getWidgetComponent } from '@/lib/profile/widget-registry';

export function ProfileRenderer({ agent, config }: ProfileRendererProps) {
  return (
    <div className={`min-h-screen ${config.theme.background}`}>
      {/* Navigation */}
      {config.navigation.showBackToAcademy && (
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
      {config.widgets
        .filter(widget => isWidgetVisible(widget, agent))
        .sort((a, b) => a.position.order - b.position.order)
        .map(widget => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            agent={agent}
            config={widget.config}
          />
        ))}
    </div>
  );
}

function WidgetRenderer({ widget, agent, config }: WidgetRendererProps) {
  const WidgetComponent = getWidgetComponent(widget.type);
  
  if (!WidgetComponent) {
    console.warn(`Unknown widget type: ${widget.type}`);
    return null;
  }
  
  return (
    <WidgetComponent 
      widget={widget}
      agent={agent}
    />
  );
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