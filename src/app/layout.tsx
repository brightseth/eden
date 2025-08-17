import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from '@/components/providers/query-provider';
import { RealtimeProvider } from '@/components/providers/realtime-provider';
import { Header } from '@/components/layout/Header';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-eden-black text-eden-white`}
      >
        <QueryProvider>
          <RealtimeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </RealtimeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
