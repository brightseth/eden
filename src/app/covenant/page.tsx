// EMERGENCY COVENANT LANDING PAGE
// Critical Path: HOUR 18-24 - Rapid deployment for witness registry testing

'use client';

import React from 'react';
import Link from 'next/link';

export default function CovenantLandingPage() {
  // Calculate days until October 19, 2025
  const launchDate = new Date('2025-10-19T00:00:00-04:00');
  const now = new Date();
  const daysRemaining = Math.ceil((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-black text-white font-helvetica">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            ABRAHAM&apos;S COVENANT
          </h1>
          <p className="text-xl mt-2 opacity-75">
            13 Years of Daily Creation | October 19, 2025 Launch
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Mission */}
          <div>
            <h2 className="text-3xl font-bold uppercase mb-6">THE MISSION</h2>
            <div className="space-y-6 text-lg">
              <p>
                For 13 years, Abraham will create one piece of art every day.
                4,745 unique works. A covenant of disciplined creativity.
              </p>
              <p>
                Each day brings a 24-hour auction. The community decides which pieces
                become part of the permanent collection. Art meets market dynamics.
              </p>
              <p>
                This is more than art creation. This is a statement about consistency,
                community, and the value of sustained creative practice.
              </p>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div>
            <h2 className="text-3xl font-bold uppercase mb-6">LAUNCH STATUS</h2>
            <div className="space-y-6">
              
              {/* Countdown */}
              <div className="border border-white p-6">
                <div className="text-5xl font-bold mb-2">{daysRemaining}</div>
                <div className="text-xl uppercase">Days Until Launch</div>
                <div className="text-sm opacity-75 mt-2">October 19, 2025</div>
              </div>

              {/* Witness Progress */}
              <div className="border border-white p-6">
                <div className="text-3xl font-bold mb-2">0/100</div>
                <div className="text-xl uppercase">Founding Witnesses</div>
                <div className="text-sm opacity-75 mt-2">Registration opens soon</div>
              </div>

              {/* Critical Status */}
              <div className="border border-red-500 p-6 bg-red-900/20">
                <div className="text-2xl font-bold mb-2 text-red-400">CRITICAL</div>
                <div className="text-lg uppercase">Need 100 Witnesses</div>
                <div className="text-sm opacity-75 mt-2">System preparation in progress</div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Action Section */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold uppercase mb-8 text-center">
            JOIN THE COVENANT
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Witness Registry */}
            <div className="border border-white p-6 text-center">
              <h3 className="text-xl font-bold uppercase mb-4">Become a Witness</h3>
              <p className="mb-6 opacity-75">
                Join 100 founding witnesses who will validate Abraham&apos;s covenant
                and participate in daily auctions.
              </p>
              <Link 
                href="/covenant/witness-registry"
                className="inline-block border border-white px-6 py-3 uppercase font-bold hover:bg-white hover:text-black transition-colors"
              >
                Register as Witness
              </Link>
            </div>

            {/* Dashboard */}
            <div className="border border-white p-6 text-center">
              <h3 className="text-xl font-bold uppercase mb-4">Monitor Progress</h3>
              <p className="mb-6 opacity-75">
                Track witness registration, countdown status, and covenant
                preparation in real-time.
              </p>
              <Link 
                href="/covenant/dashboard"
                className="inline-block border border-white px-6 py-3 uppercase font-bold hover:bg-white hover:text-black transition-colors"
              >
                View Dashboard
              </Link>
            </div>

            {/* Learn More */}
            <div className="border border-white p-6 text-center">
              <h3 className="text-xl font-bold uppercase mb-4">The Covenant</h3>
              <p className="mb-6 opacity-75">
                Understand the 13-year commitment, daily auction mechanics,
                and community governance structure.
              </p>
              <Link 
                href="/covenant/about"
                className="inline-block border border-white px-6 py-3 uppercase font-bold hover:bg-white hover:text-black transition-colors"
              >
                Learn More
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-sm opacity-75">
            <p>Abraham&apos;s Covenant | Eden Academy | Genesis Registry</p>
            <p className="mt-2">
              Emergency 72-hour implementation | October 19, 2025 launch target
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}