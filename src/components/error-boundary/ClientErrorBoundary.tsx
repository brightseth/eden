'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ClientErrorBoundary extends Component<Props, State> {
  private _isMounted = true;

  public state: State = {
    hasError: false
  };

  public componentWillUnmount() {
    this._isMounted = false;
  }

  public static getDerivedStateFromError(error: Error): State {
    // Suppress wallet provider errors at the getDerivedStateFromError level
    if (
      error.message?.includes('proxy-injected-providers') ||
      error.message?.includes('Cannot create proxy') ||
      error.message?.includes('Minified React error #306') ||
      error.message?.includes('Non-object as target or handler') ||
      error.message?.includes('wallet provider')
    ) {
      // Don't update state for wallet provider errors
      return { hasError: false };
    }

    // Update state for real errors
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Suppress common wallet provider errors that don't affect functionality
    if (
      error.message?.includes('proxy-injected-providers') ||
      error.message?.includes('Cannot create proxy') ||
      error.message?.includes('Minified React error #306') ||
      error.message?.includes('Non-object as target or handler') ||
      error.message?.includes('wallet provider')
    ) {
      console.warn('[Wallet Provider] Suppressed injection error:', error.message);
      // Don't call setState for wallet provider errors to avoid #185
      return;
    }

    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleRetry = () => {
    if (this._isMounted) {
      this.setState({ hasError: false, error: undefined });
    }
  };

  public render() {
    // Only render error UI for real errors, not wallet provider errors
    if (this.state.hasError && this.state.error) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-6">An error occurred while loading this page.</p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}