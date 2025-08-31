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
              // CRITICAL: Block ALL wallet provider injections immediately
              (function() {
                'use strict';
                
                // Block Proxy constructor completely for problematic cases
                const OriginalProxy = window.Proxy;
                window.Proxy = new Proxy(OriginalProxy, {
                  construct(target, args) {
                    const [proxyTarget, handler] = args;
                    
                    // If target is undefined, null, or not an object, return a dummy proxy
                    if (!proxyTarget || typeof proxyTarget !== 'object') {
                      return new OriginalProxy({}, {});
                    }
                    
                    // If handler is undefined, null, or not an object, return a dummy proxy
                    if (!handler || typeof handler !== 'object') {
                      return new OriginalProxy(proxyTarget, {});
                    }
                    
                    try {
                      return new target(...args);
                    } catch (e) {
                      // Return dummy proxy on any error
                      return new OriginalProxy({}, {});
                    }
                  }
                });
                
                // Completely override console.error to suppress wallet errors
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args[0]?.toString?.() || '';
                  if (
                    message.includes('proxy') ||
                    message.includes('Proxy') ||
                    message.includes('wallet') ||
                    message.includes('MetaMask') ||
                    message.includes('injected') ||
                    message.includes('Cannot create') ||
                    message.includes('non-object')
                  ) {
                    return;
                  }
                  return originalError.apply(console, args);
                };
                
                // Block all error events related to wallet providers
                window.addEventListener('error', function(e) {
                  const msg = e.message || e.error?.message || '';
                  if (
                    msg.includes('proxy') ||
                    msg.includes('Proxy') ||
                    msg.includes('wallet') ||
                    msg.includes('injected') ||
                    msg.includes('Cannot create')
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                // Block unhandled rejections
                window.addEventListener('unhandledrejection', function(e) {
                  const msg = e.reason?.message || e.reason?.toString?.() || '';
                  if (
                    msg.includes('proxy') ||
                    msg.includes('Proxy') ||
                    msg.includes('wallet') ||
                    msg.includes('injected')
                  ) {
                    e.preventDefault();
                    return false;
                  }
                }, true);
                
                // Block script injection attempts from extensions
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.tagName === 'SCRIPT' && node.src) {
                        if (
                          node.src.includes('proxy-injected') ||
                          node.src.includes('wallet') ||
                          node.src.includes('metamask') ||
                          node.src.includes('injected-provider')
                        ) {
                          node.remove();
                        }
                      }
                    });
                  });
                });
                
                // Start observing as soon as possible
                if (document.documentElement) {
                  observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
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
