import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Trainer Dashboard',
  description: 'Train and manage AI agents',
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