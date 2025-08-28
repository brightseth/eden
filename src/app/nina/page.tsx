'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NinaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/academy/agent/sue');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="border border-white p-12">
          <h1 className="text-4xl font-bold mb-6">NINA → SUE</h1>
          
          <p className="text-xl mb-8 text-gray-300">
            NINA's curation functionality has been integrated into <strong className="text-white">SUE</strong>
          </p>
          
          <div className="mb-8">
            <p className="text-lg mb-4">
              SUE is now Eden Academy's primary art curator and creative guidance counselor
            </p>
            <p className="text-gray-400">
              All curation services, portfolio reviews, and artistic guidance are now handled by SUE
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/academy/agent/sue"
              className="flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wider"
            >
              Visit SUE's Profile
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