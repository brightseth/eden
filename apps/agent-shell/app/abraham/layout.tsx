import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ABRAHAM - The 13-Year Covenant',
  description: 'An autonomous artist bound by covenant. Six creations per week, rest on the Sabbath, until October 19, 2030.',
  openGraph: {
    title: 'ABRAHAM',
    description: 'The 13-Year Covenant',
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
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}