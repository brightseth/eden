'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  Hash,
  Download,
  Share2,
  Maximize2,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface WorkViewerProps {
  work: {
    id: string;
    agent_id: string;
    archive_type: string;
    archive_number?: number;
    title?: string;
    description?: string;
    image_url: string;
    thumbnail_url?: string;
    created_date?: string;
    trainer_id?: string;
    metadata?: any;
  };
  trainer?: {
    id: string;
    display_name: string;
  };
  navigation?: {
    prev?: number;
    next?: number;
  };
}

export function WorkViewer({ work, trainer, navigation }: WorkViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === 'ArrowLeft' && navigation?.prev) {
        window.location.href = `${navigation.prev}`;
      }
      if (e.key === 'ArrowRight' && navigation?.next) {
        window.location.href = `${navigation.next}`;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, navigation]);
  
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: work.title || `Work #${work.archive_number}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = work.image_url;
    link.download = `${work.agent_id}_${work.archive_number || work.id}.jpg`;
    link.click();
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href={`/academy/agent/${work.agent_id}/${work.archive_type}s`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {work.archive_type === 'generation' ? 'Generations' : 'Archive'}
          </Link>
          
          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            {navigation?.prev && (
              <Link href={`${navigation.prev}`}>
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {navigation?.next && (
              <Link href={`${navigation.next}`}>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-black">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                <Image
                  src={work.image_url}
                  alt={work.title || `Work #${work.archive_number}`}
                  fill
                  className="object-contain"
                  onLoad={() => setImageLoading(false)}
                  priority
                />
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsFullscreen(true)}
                    className="bg-black/50 backdrop-blur"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleShare}
                    className="bg-black/50 backdrop-blur"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleDownload}
                    className="bg-black/50 backdrop-blur"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Details Panel */}
          <div className="space-y-6">
            {/* Title and Number */}
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold mb-2">
                  {work.title || `${work.archive_type === 'generation' ? 'Generation' : 'Work'} #${work.archive_number}`}
                </h1>
                
                {work.description && (
                  <p className="text-muted-foreground mb-4">{work.description}</p>
                )}
                
                <div className="space-y-3">
                  {work.archive_number && (
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Archive #{work.archive_number}</span>
                    </div>
                  )}
                  
                  {work.created_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(work.created_date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  {trainer && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Trainer: </span>
                      <Link href={`/trainers/${trainer.id}`}>
                        <Badge variant="secondary">{trainer.display_name}</Badge>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Metadata */}
            {work.metadata && Object.keys(work.metadata).length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Generation Details</h3>
                  <div className="space-y-2">
                    {work.metadata.text_input && (
                      <div>
                        <span className="text-xs text-muted-foreground">Prompt</span>
                        <p className="text-sm mt-1">{work.metadata.text_input}</p>
                      </div>
                    )}
                    {work.metadata.model_name && (
                      <div>
                        <span className="text-xs text-muted-foreground">Model</span>
                        <p className="text-sm mt-1">{work.metadata.model_name}</p>
                      </div>
                    )}
                    {work.metadata.verdict && (
                      <div>
                        <span className="text-xs text-muted-foreground">Curation</span>
                        <Badge 
                          className="ml-2"
                          variant={
                            work.metadata.verdict === 'INCLUDE' ? 'default' :
                            work.metadata.verdict === 'MAYBE' ? 'secondary' : 'outline'
                          }
                        >
                          {work.metadata.verdict}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative w-full h-full p-8">
            <Image
              src={work.image_url}
              alt={work.title || `Work #${work.archive_number}`}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}