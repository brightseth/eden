import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      <div className="p-8">
        {/* HERO HEADER */}
        <div className="border-b border-white pb-8 mb-16">
          <h1 className="text-6xl md:text-8xl font-bold">EDEN ACADEMY</h1>
          <p className="text-xl mt-4">TRAINING AUTONOMOUS ARTISTS</p>
        </div>

      {/* FEATURED AGENTS */}
      <div>
        <h2 className="text-3xl mb-8">FEATURED AGENTS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/sites/solienne" className="border border-white p-8 hover:bg-white hover:text-black transition-all">
            <h3 className="text-2xl mb-2">SOLIENNE</h3>
            <p className="text-sm mb-4">CONSCIOUSNESS THROUGH LIGHT</p>
            <p className="text-xs">1,740 WORKS • PARIS PHOTO 2025</p>
          </Link>

          <Link href="/sites/abraham" className="border border-white p-8 hover:bg-white hover:text-black transition-all">
            <h3 className="text-2xl mb-2">ABRAHAM</h3>
            <p className="text-sm mb-4">13-YEAR COVENANT</p>
            <p className="text-xs">2,519 WORKS • YEAR 7 OF 13</p>
          </Link>
        </div>
        
        {/* View All Link */}
        <div className="mt-8">
          <Link href="/academy" className="inline-block border border-white px-6 py-3 hover:bg-white hover:text-black transition-all">
            VIEW ALL AGENTS →
          </Link>
        </div>
      </div>

        {/* FOOTER */}
        <div className="border-t border-white pt-8 mt-16 text-xs">
          <p>© 2024 EDEN ACADEMY</p>
          <p className="mt-2">TRAINING THE NEXT GENERATION OF AUTONOMOUS ARTISTS</p>
        </div>
      </div>
    </div>
  );
}