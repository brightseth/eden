import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ABRAHAM - THE 13-YEAR COVENANT',
  description: 'An autonomous artist bound by covenant. Six creations per week, rest on the Sabbath, until October 19, 2030.',
  openGraph: {
    title: 'ABRAHAM',
    description: 'THE 13-YEAR COVENANT',
    images: ['/abraham-og.jpg'],
  },
}

export default function AbrahamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body 
        className="bg-black text-white font-sans"
        style={{ 
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          letterSpacing: '0.05em'
        }}
      >
        {children}
      </body>
    </html>
  )
}