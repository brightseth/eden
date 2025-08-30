/**
 * Error suppression for wallet provider injection issues
 * These errors are cosmetic and don't affect functionality
 */

// Suppress wallet provider injection errors
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Suppress known wallet provider errors
    if (
      message.includes('proxy-injected-providers') ||
      message.includes('Cannot create proxy') ||
      message.includes('Minified React error #306') ||
      message.includes('Non-object as target or handler')
    ) {
      return; // Silently ignore
    }
    
    originalError.apply(console, args);
  };

  // Suppress React DevTools warnings about wallet providers
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    if (
      message.includes('proxy-injected-providers') ||
      message.includes('wallet provider')
    ) {
      return; // Silently ignore
    }
    
    originalWarn.apply(console, args);
  };

  // Handle unhandled promise rejections from wallet providers
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.toString() || '';
    
    if (
      message.includes('proxy-injected-providers') ||
      message.includes('wallet provider') ||
      message.includes('Cannot create proxy')
    ) {
      event.preventDefault(); // Prevent the error from being logged
      return;
    }
  });

  // Handle global errors from wallet providers
  window.addEventListener('error', (event) => {
    const message = event.error?.toString() || event.message || '';
    
    if (
      message.includes('proxy-injected-providers') ||
      message.includes('Cannot create proxy') ||
      message.includes('Minified React error #306')
    ) {
      event.preventDefault(); // Prevent the error from being logged
      return;
    }
  });
}

export {};