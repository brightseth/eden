import type { Metadata } from "next";
import { QueryProvider } from '@/components/providers/query-provider';
import { RealtimeProvider } from '@/components/providers/realtime-provider';
import { NotificationToast } from '@/components/notifications/NotificationToast';
import { ClientErrorBoundary } from '@/components/error-boundary/ClientErrorBoundary';
import "./globals.css";

export const metadata: Metadata = {
  title: "Eden Agent Academy",
  description: "AI Agent Training Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Comprehensive wallet provider error suppression
              (function() {
                'use strict';
                
                // Early suppression setup before any other code runs
                const suppressedPatterns = [
                  'proxy-injected-providers',
                  'Cannot create proxy',
                  'non-object as target or handler',
                  'Minified React error #306',
                  'MetaMask',
                  'wallet provider',
                  'injected provider',
                  'ethereum provider',
                  'web3 provider'
                ];
                
                function shouldSuppress(message) {
                  if (!message) return false;
                  const str = message.toString().toLowerCase();
                  return suppressedPatterns.some(pattern => str.includes(pattern.toLowerCase()));
                }
                
                // Override console methods immediately
                if (typeof console !== 'undefined') {
                  const originalError = console.error;
                  const originalWarn = console.warn;
                  const originalLog = console.log;
                  
                  console.error = function(...args) {
                    if (shouldSuppress(args[0])) return;
                    return originalError.apply(console, args);
                  };
                  
                  console.warn = function(...args) {
                    if (shouldSuppress(args[0])) return;
                    return originalWarn.apply(console, args);
                  };
                  
                  console.log = function(...args) {
                    if (shouldSuppress(args[0])) return;
                    return originalLog.apply(console, args);
                  };
                }
                
                // Global error handling
                window.addEventListener('error', function(event) {
                  if (shouldSuppress(event.error?.message) || shouldSuppress(event.message)) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, { capture: true, passive: false });
                
                // Unhandled promise rejection handling
                window.addEventListener('unhandledrejection', function(event) {
                  if (shouldSuppress(event.reason?.message) || shouldSuppress(event.reason)) {
                    event.preventDefault();
                    return false;
                  }
                }, { capture: true, passive: false });
                
                // Proxy trap for common wallet injection issues
                if (typeof window !== 'undefined' && typeof Proxy !== 'undefined') {
                  const originalProxy = window.Proxy;
                  window.Proxy = function(target, handler) {
                    try {
                      if (!target || typeof target !== 'object') {
                        console.warn('[Wallet Provider] Suppressed invalid proxy target');
                        return {};
                      }
                      return new originalProxy(target, handler);
                    } catch (error) {
                      if (shouldSuppress(error.message)) {
                        console.warn('[Wallet Provider] Suppressed proxy creation error');
                        return target || {};
                      }
                      throw error;
                    }
                  };
                  
                  // Preserve original Proxy properties
                  Object.setPrototypeOf(window.Proxy, originalProxy);
                  Object.defineProperty(window.Proxy, 'revocable', {
                    value: originalProxy.revocable,
                    writable: false,
                    configurable: false
                  });
                }
              })();
            `
          }}
        />
      </head>
      <body
        className="antialiased bg-eden-black text-eden-white font-helvetica"
      >
        <ClientErrorBoundary>
          <QueryProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
            <NotificationToast />
          </QueryProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
