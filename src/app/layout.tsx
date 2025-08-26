import type { Metadata } from "next";
import { QueryProvider } from '@/components/providers/query-provider';
import { RealtimeProvider } from '@/components/providers/realtime-provider';
import { NotificationToast } from '@/components/notifications/NotificationToast';
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
      <body
        className="antialiased bg-eden-black text-eden-white font-helvetica"
      >
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <NotificationToast />
        </QueryProvider>
      </body>
    </html>
  );
}
