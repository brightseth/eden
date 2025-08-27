// Hero Widget Component
// Implements ADR-025: Agent Profile Widget System

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BaseWidgetProps } from '@/lib/profile/types';

interface HeroWidgetConfig {
  showStatus?: boolean;
  showTrainer?: boolean;
  primaryAction?: {
    text: string;
    href: string;
  };
  secondaryActions?: Array<{
    text: string;
    href: string;
  }>;
}

export function HeroWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as HeroWidgetConfig;
  
  return (
    <div className={`border-b border-white ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Status Badge */}
            {config.showStatus && agent.status && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold mb-4">
                  {getStatusDisplay(agent.status)}
                </span>
              </div>
            )}
            
            {/* Agent Name */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              {agent.displayName?.toUpperCase() || agent.handle?.toUpperCase()}
            </h1>
            
            {/* Agent Tagline */}
            {agent.profile?.statement && (
              <p className="text-xl mb-8">
                <strong>{truncateStatement(agent.profile.statement)}</strong>
              </p>
            )}
            
            {/* Trainer Info */}
            {config.showTrainer && agent.trainer && (
              <p className="text-lg mb-8 text-gray-300">
                <strong>Trained by:</strong> {agent.trainer.name || 'TBD'}
                {agent.trainer.specialization && `, ${agent.trainer.specialization}`}
              </p>
            )}
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {/* Primary Action */}
              {config.primaryAction && (
                <Link
                  href={config.primaryAction.href}
                  className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-all font-bold"
                >
                  {config.primaryAction.text}
                </Link>
              )}
              
              {/* Secondary Actions */}
              {config.secondaryActions?.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="border border-gray-600 px-6 py-3 hover:bg-gray-600 hover:text-white transition-all"
                >
                  {action.text}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Agent Status Panel */}
          <div className="border border-white p-8">
            <h3 className="text-xl font-bold mb-6">Agent Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Agent:</span>
                <span className="font-bold">{agent.displayName || agent.handle}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-bold ${getStatusColor(agent.status)}`}>
                  {getStatusDisplay(agent.status)}
                </span>
              </div>
              {agent.launchDate && (
                <div className="flex justify-between">
                  <span>Launch Target:</span>
                  <span>{formatDate(agent.launchDate)}</span>
                </div>
              )}
              {agent.specialization && (
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span>{agent.specialization}</span>
                </div>
              )}
              {agent.trainer?.name && (
                <div className="flex justify-between">
                  <span>Trainer:</span>
                  <span className="font-bold">{agent.trainer.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusDisplay(status: string): string {
  switch (status?.toUpperCase()) {
    case 'INVITED': return 'Invited';
    case 'APPLYING': return 'Applying';
    case 'ONBOARDING': return 'In Training';
    case 'ACTIVE': return 'Active';
    case 'GRADUATED': return 'Graduated';
    default: return 'Unknown';
  }
}

function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'INVITED': return 'text-yellow-400';
    case 'APPLYING': return 'text-blue-400';
    case 'ONBOARDING': return 'text-purple-400';
    case 'ACTIVE': return 'text-green-400';
    case 'GRADUATED': return 'text-emerald-400';
    default: return 'text-gray-400';
  }
}

function truncateStatement(statement: string, maxLength: number = 120): string {
  if (statement.length <= maxLength) return statement;
  return statement.substring(0, maxLength).trim() + '...';
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}