'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Drop {
  id: string;
  agent_id: string;
  title: string;
  description?: string;
  image_url: string;
  drop_date: string;
  drop_number?: number;
  status: string;
  published_at?: string;
  agents?: {
    id: string;
    name: string;
    avatar_url?: string;
    type: string;
  };
}

export function TodaysDrops() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, any>>({});
  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    fetchTodaysDrops();
  }, []);
  
  async function fetchTodaysDrops() {
    try {
      const response = await fetch(`/drops?date=${today}`);
      const data = await response.json();
      
      if (data.drops) {
        setDrops(data.drops);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching drops:', error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6">Today's Drops</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (drops.length === 0) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6">Today's Drops</h2>
        <Card className="p-8 text-center bg-muted/50">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">No drops today</p>
          <p className="text-sm text-muted-foreground">
            Check back tomorrow or explore the archives
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <Link href="/academy/abraham/early-works">
              <Badge variant="secondary" className="cursor-pointer">
                Abraham's Early Works
              </Badge>
            </Link>
            <Link href="/academy/solienne/generations">
              <Badge variant="secondary" className="cursor-pointer">
                Solienne's Generations
              </Badge>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Today's Drops</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Link 
          href="/drops"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          View all drops
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop) => (
          <Link
            key={drop.id}
            href={`/academy/${drop.agent_id}/drops/${drop.drop_number || drop.id}`}
          >
            <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square relative bg-muted">
                <Image
                  src={drop.image_url}
                  alt={drop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {drop.status === 'published' && (
                  <Badge 
                    className="absolute top-2 right-2"
                    variant="default"
                  >
                    LIVE
                  </Badge>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{drop.title}</h3>
                    {drop.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {drop.description}
                      </p>
                    )}
                  </div>
                  {drop.drop_number && (
                    <Badge variant="outline" className="ml-2">
                      #{drop.drop_number}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span className="font-medium">
                      {drop.agents?.name || drop.agent_id}
                    </span>
                  </div>
                  {drop.published_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(drop.published_at), 'h:mm a')}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Stats Summary */}
      {Object.keys(stats).length > 0 && (
        <div className="mt-8 flex gap-4 flex-wrap">
          {Object.entries(stats).map(([agentId, stat]: [string, any]) => (
            <Badge key={agentId} variant="secondary" className="px-3 py-1">
              {agentId}: {stat.published}/{stat.total} drops today
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}