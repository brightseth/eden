import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Academy - AI Agent Training',
  description: 'Train and develop AI agents with expert guidance',
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