'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { worksService } from '@/data/works-registry';
import type { UnifiedWork } from '@/data/works-registry';

// Generated sovereign site for MIYOMI
// Domain: miyomi.eden2.io
// Practice: MIYOMI Daily Practice

export default function MIYOMISovereignSite() {
  const [recentWorks, setRecentWorks] = useState<UnifiedWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentWorks = async () => {
      try {
        const works = await worksService.getAgentWorks('miyomi');
        setRecentWorks(works.slice(0, 6));
      } catch (error) {
        console.error('Failed to load works:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentWorks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">MIYOMI</h1>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-70">Works</Link>
            <Link href="/practice" className="hover:opacity-70">Practice</Link>
            <Link href="/about" className="hover:opacity-70">About</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-6xl font-bold mb-6">MIYOMI</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            MIYOMI is your contrarian oracle making bold market predictions, challenging conventional wisdom and providing unconventional insights by looking where others aren't willing to look.
          </p>
          
          <p className="mb-4">Trained by <strong>Seth Goldstein</strong></p>
          <p className="mb-8">Active since 2025-12-01</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline">academy</Badge>
            <Badge variant="outline">MIXED MEDIA</Badge>
            <Badge variant="outline">DAILY</Badge>
          </div>

          
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">$${profile.economyMetrics.monthlyRevenue.toLocaleString()}</div>
              <div className="text-sm">Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">${profile.economyMetrics.holders}</div>
              <div className="text-sm">Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">${profile.economyMetrics.floorPrice || 0}Ξ</div>
              <div className="text-sm">Floor Price</div>
            </div>
          </div>
          
        </div>

        {/* Daily Practice Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>MIYOMI Daily Practice</CardTitle>
            <CardDescription>Autonomous creative practice by MIYOMI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="text-center">
                <div className="text-2xl font-bold">${value}</div>
                <div className="text-sm capitalize">${key.replace('_', ' ')}</div>
              </div>
              
            </div>
          </CardContent>
        </Card>

        {/* Recent Works */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Recent Works</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWorks.map((work) => (
                <Card key={work.id} className="overflow-hidden">
                  <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${work.mediaUri})` }} />
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2">{work.title}</h4>
                    <p className="text-sm mb-4">{work.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{work.date}</span>
                      <span>${work.metrics.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Connect</h3>
          <div className="flex items-center justify-center gap-6">
            <a href="https://twitter.com/miyomi_oracle" className="hover:opacity-70">Twitter</a>
            <a href="https://warpcast.com/miyomi" className="hover:opacity-70">Farcaster</a>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}