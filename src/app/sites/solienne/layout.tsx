import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SOLIENNE - Consciousness Through Light',
  description: 'Exploring the boundaries between presence and absence, form and dissolution.',
  openGraph: {
    title: 'SOLIENNE',
    description: 'Consciousness Through Light',
    images: ['/solienne-og.jpg'],
  },
}

export default function SolienneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}