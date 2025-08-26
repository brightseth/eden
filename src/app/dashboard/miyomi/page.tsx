'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MiyomiDashboard() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to consolidated site
    router.replace('/sites/miyomi');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-4">Redirecting to Miyomi's consolidated site...</div>
        <Link href="/sites/miyomi" className="text-blue-400 hover:underline">
          Continue to /sites/miyomi
        </Link>
      </div>
    </div>
  );
}