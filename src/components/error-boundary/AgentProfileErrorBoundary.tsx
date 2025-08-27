'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface AgentProfileErrorBoundaryProps {
  children: React.ReactNode;
  agentId?: string;
  fallback?: React.ComponentType<{error?: Error; reset: () => void}>;
}

export class AgentProfileErrorBoundary extends React.Component<
  AgentProfileErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: AgentProfileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AgentProfileErrorBoundary caught an error:', error, errorInfo);
    
    // Log error details for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      agentId: this.props.agentId,
      timestamp: new Date().toISOString()
    });

    this.setState({ 
      hasError: true,
      error,
      errorInfo
    });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-black text-white">
          {/* Header */}
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

          {/* Error Content */}
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="border border-red-500 bg-red-500/10 p-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h1 className="text-2xl mb-2">Profile Loading Error</h1>
                  <p className="text-lg opacity-75 mb-4">
                    {this.props.agentId 
                      ? `Unable to load profile for ${this.props.agentId.toUpperCase()}`
                      : 'Unable to load agent profile'
                    }
                  </p>
                </div>
              </div>

              {/* Error Details */}
              <div className="mb-6 p-4 bg-black/50 border border-white/20">
                <h3 className="text-sm mb-2 opacity-75">Error Details:</h3>
                <p className="text-sm font-mono">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                  <details className="mt-2">
                    <summary className="text-xs opacity-50 cursor-pointer">Stack Trace (Dev Only)</summary>
                    <pre className="text-xs mt-2 opacity-75 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={this.reset}
                  className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  TRY AGAIN
                </button>
                
                <Link 
                  href="/academy"
                  className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  BACK TO ACADEMY
                </Link>

                {this.props.agentId && (
                  <Link 
                    href={`/agents/${this.props.agentId}`}
                    className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
                  >
                    PUBLIC PROFILE
                  </Link>
                )}
              </div>

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 pt-6 border-t border-white/20 text-xs opacity-50">
                  <h4 className="mb-2">Development Info:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Check browser console for detailed error logs</li>
                    <li>Verify agent profile configuration exists</li>
                    <li>Check Registry API connectivity</li>
                    <li>Ensure all widget components are properly imported</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based alternative for functional components
export function useAgentProfileErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      console.error('Agent profile error:', error);
    }
  }, [error]);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, setError, resetError };
}

// HOC for wrapping components with error boundary
export function withAgentProfileErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  agentId?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <AgentProfileErrorBoundary agentId={agentId}>
        <Component {...props} />
      </AgentProfileErrorBoundary>
    );
  };
}