import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Agent - Autonomous Creative AI',
  description: 'Sovereign AI agents creating and trading autonomously',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white font-helvetica">
        {children}
      </body>
    </html>
  );
}