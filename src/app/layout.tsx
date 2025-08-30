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
              // Suppress wallet provider injection errors
              if (typeof window !== 'undefined') {
                const originalError = console.error;
                console.error = (...args) => {
                  const message = args[0]?.toString() || '';
                  if (
                    message.includes('proxy-injected-providers') ||
                    message.includes('Cannot create proxy') ||
                    message.includes('Minified React error #306')
                  ) return;
                  originalError.apply(console, args);
                };
                
                window.addEventListener('error', (event) => {
                  const message = event.error?.toString() || event.message || '';
                  if (
                    message.includes('proxy-injected-providers') ||
                    message.includes('Cannot create proxy') ||
                    message.includes('Minified React error #306')
                  ) {
                    event.preventDefault();
                    return;
                  }
                });
              }
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
