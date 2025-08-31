import type { Metadata } from 'next'

// HELVETICA FONT SYSTEM - No Google Fonts, system fallback only

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
    <div className="bg-black text-white" style={{ 
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {children}
    </div>
  )
}