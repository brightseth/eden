'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AmandaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 3 seconds  
    const timer = setTimeout(() => {
      router.push('/academy/agent/bertha');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="border border-white p-12">
          <h1 className="text-4xl font-bold mb-6">AMANDA → BERTHA</h1>
          
          <p className="text-xl mb-8 text-gray-300">
            Amanda agent has evolved into <strong className="text-white">BERTHA</strong>
          </p>
          
          <div className="mb-8">
            <p className="text-lg mb-4">
              BERTHA is the art collection intelligence agent, trained by Amanda Schmitt
            </p>
            <p className="text-gray-400">
              All Amanda agent functionality has been consolidated under BERTHA
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/academy/agent/bertha"
              className="flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wider"
            >
              Visit BERTHA
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            Redirecting automatically in 3 seconds...
          </div>
        </div>
      </div>
    </div>
  );
}