'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles,
  Eye,
  Send
} from 'lucide-react';

interface Work {
  id: string;
  agent_id: string;
  day: number;
  media_url: string;
  state: 'created' | 'curated' | 'published';
  created_at: string;
  tags?: any;
  critiques?: any[];
}

export default function InboxPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState<'all' | 'created' | 'curated' | 'published'>('created');
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  useEffect(() => {
    fetchWorks();
  }, [filter]);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? '' : `?state=${filter}`;
      const res = await fetch(`/api/works${params}`);
      const data = await res.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCritique = async (workId: string, verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE') => {
    try {
      const res = await fetch('/api/critiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          work_id: workId,
          critic: 'human',
          verdict,
          rationale: `Manual ${verdict.toLowerCase()} decision`
        })
      });

      if (res.ok) {
        // Refresh works to show updated state
        fetchWorks();
      }
    } catch (error) {
      console.error('Error creating critique:', error);
    }
  };

  const handlePublish = async (workId: string) => {
    try {
      const res = await fetch(`/api/works/${workId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        fetchWorks();
      }
    } catch (error) {
      console.error('Error publishing work:', error);
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'created': return 'bg-yellow-500/10 text-yellow-600';
      case 'curated': return 'bg-blue-500/10 text-blue-600';
      case 'published': return 'bg-green-500/10 text-green-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Inbox</h1>
        <p className="text-muted-foreground">
          Review and curate agent works through the pipeline
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="created">
            New
            {works.filter(w => w.state === 'created').length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {works.filter(w => w.state === 'created').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="curated">Curated</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Works Grid */}
      {loading ? (
        <div className="text-center py-12">Loading works...</div>
      ) : works.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <p className="text-muted-foreground">
              No works in {filter === 'all' ? 'the inbox' : `${filter} state`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work) => (
            <Card 
              key={work.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedWork(work)}
            >
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={work.media_url}
                  alt={`Work by ${work.agent_id}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <Badge 
                  className={`absolute top-2 right-2 ${getStatusColor(work.state)}`}
                >
                  {work.state}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold capitalize">{work.agent_id}</p>
                    <p className="text-sm text-muted-foreground">Day {work.day}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(work.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Quick Actions */}
                {work.state === 'created' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCritique(work.id, 'INCLUDE');
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Include
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCritique(work.id, 'MAYBE');
                      }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Maybe
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCritique(work.id, 'EXCLUDE');
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Exclude
                    </Button>
                  </div>
                )}

                {work.state === 'curated' && (
                  <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePublish(work.id);
                    }}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                )}

                {work.state === 'published' && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>Live on platform</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Work Detail Modal (placeholder for future enhancement) */}
      {selectedWork && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWork(null)}
        >
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedWork.agent_id} - Day {selectedWork.day}
              </h2>
              <div className="aspect-square relative bg-gray-100 mb-4">
                <Image
                  src={selectedWork.media_url}
                  alt={`Work detail`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <Badge className={getStatusColor(selectedWork.state)}>
                {selectedWork.state}
              </Badge>
              <Button 
                className="mt-4"
                onClick={() => setSelectedWork(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}