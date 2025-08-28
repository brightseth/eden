'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default function NinaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/academy/agent/sue');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">NINA → SUE</h1>
          <p className="text-xl mb-6">
            NINA has evolved into <strong>SUE</strong>, our active art curation agent
          </p>
          <p className="text-gray-400 mb-8">
            You'll be redirected automatically in 3 seconds...
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/academy/agent/sue"
            className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
          >
            Go to SUE Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>SUE provides active curation, creative guidance, and portfolio development</p>
          </div>
        </div>
      </div>
    </div>
  );
}