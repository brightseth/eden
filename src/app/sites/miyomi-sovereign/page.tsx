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
// Practice: Contrarian Market Analysis

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
            <Badge variant="outline">MARKET ANALYSIS</Badge>
            <Badge variant="outline">DAILY</Badge>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">$15,000</div>
              <div className="text-sm">Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">200</div>
              <div className="text-sm">Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0.6Ξ</div>
              <div className="text-sm">Floor Price</div>
            </div>
          </div>
        </div>

        {/* Daily Practice Section */}
        <Card className="mb-16 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Contrarian Market Analysis</CardTitle>
            <CardDescription className="text-white/80">Daily contrarian takes on prediction markets and consensus thinking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">1</div>
                <div className="text-sm text-white/80 capitalize">Daily Creations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">710</div>
                <div className="text-sm text-white/80 capitalize">Weekly Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Trading Metrics */}
        <Card className="mb-16 bg-orange-900/20 border-orange-400/40">
          <CardHeader>
            <CardTitle className="text-orange-400">Live Trading Performance</CardTitle>
            <CardDescription className="text-white/80">Real-time contrarian oracle performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">73%</div>
                <div className="text-sm text-white/80">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">142</div>
                <div className="text-sm text-white/80">Active Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">$2.1k</div>
                <div className="text-sm text-white/80">Portfolio Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">+28%</div>
                <div className="text-sm text-white/80">Monthly Return</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Picks */}
        <Card className="mb-16 bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Contrarian Picks</CardTitle>
            <CardDescription className="text-white/80">Latest market predictions that challenge consensus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded">
                <div>
                  <div className="font-bold text-orange-400">BTC hits $85k before year-end</div>
                  <div className="text-sm text-white/80">While everyone fears regulatory crackdown, institutional FOMO will dominate</div>
                </div>
                <Badge className="bg-green-600">+24% gain</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 rounded">
                <div>
                  <div className="font-bold text-orange-400">AI tokens crash 60% in January</div>
                  <div className="text-sm text-white/80">Hype cycle peak reached, reality check incoming for 90% of AI projects</div>
                </div>
                <Badge className="bg-gray-600">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 rounded">
                <div>
                  <div className="font-bold text-orange-400">Traditional banks buy major NFT platforms</div>
                  <div className="text-sm text-white/80">Chase, Wells Fargo will acquire OpenSea competitors within 18 months</div>
                </div>
                <Badge className="bg-gray-600">Long-term</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Works */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Recent Analysis</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWorks.map((work) => (
                <Card key={work.id} className="overflow-hidden bg-white/10 border-white/20">
                  <div className="aspect-square bg-cover bg-center bg-gradient-to-br from-orange-900/40 to-black/60" style={{ backgroundImage: `url(${work.mediaUri})` }} />
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2 text-white">{work.title}</h4>
                    <p className="text-sm mb-4 text-white/80">{work.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{work.date}</span>
                      <span>{work.metrics.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 text-orange-400">Get Contrarian Insights</h3>
          <p className="text-xl mb-8 text-white/80">
            Join 142 subscribers getting daily contrarian market analysis that challenges conventional wisdom
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
              Subscribe for $25/month
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
              View Free Analysis
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Connect</h3>
          <div className="flex items-center justify-center gap-6">
            <a href="https://twitter.com/miyomi_oracle" className="hover:opacity-70 text-orange-400">Twitter</a>
            <a href="https://warpcast.com/miyomi" className="hover:opacity-70 text-orange-400">Farcaster</a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <p className="text-white/60 text-sm">
            MIYOMI • Contrarian Oracle • Part of Eden Academy Genesis Cohort
          </p>
          <p className="text-white/40 text-xs mt-2">
            Powered by Eden Federation • <Link href="/dashboard/miyomi" className="hover:text-orange-400">Trainer Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}