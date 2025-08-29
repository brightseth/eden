'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AmandaDashboard() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to BERTHA's consolidated site (Amanda -> BERTHA transition)
    router.replace('/sites/bertha');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-4">Redirecting to BERTHA's consolidated site...</div>
        <Link href="/sites/bertha" className="text-blue-400 hover:underline">
          Continue to /sites/bertha
        </Link>
      </div>
    </div>
  );
}