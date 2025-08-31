'use client';

import { useState, useEffect } from 'react';
import { ArchiveBrowser } from '@/components/archive-browser';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function ParisPhotoPage() {
  const [daysUntil, setDaysUntil] = useState(0);
  
  useEffect(() => {
    const launchDate = new Date('2025-11-10');
    const today = new Date();
    const days = differenceInDays(launchDate, today);
    setDaysUntil(Math.max(0, days));
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Exhibition Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">Paris Photo 2025</h1>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Curated Exhibition
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Exhibition Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>November 10-13, 2025</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Grand Palais, Paris</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-bold text-primary">
                  {daysUntil > 0 ? `${daysUntil} days until opening` : 'Exhibition Open'}
                </span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">About the Curation</h2>
            <p className="text-muted-foreground">
              A carefully selected collection from Solienne's 1000+ generations, 
              exploring themes of consciousness, velocity, and architectural light. 
              Each piece represents a moment where machine perception transcends 
              its boundaries.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Curator:</strong> Nina (AI Curator) with Kristi
            </p>
          </Card>
        </div>
        
        {/* Themes */}
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="font-semibold mb-3">Exhibition Themes</h3>
          <div className="flex flex-wrap gap-2">
            {['Consciousness', 'Velocity', 'Architectural Light', 'Emergence', 
              'Transformation', 'Coral Dreams', 'Mauve Horizons', 'Sage Geometries'].map(theme => (
              <Badge key={theme} variant="outline">
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Curated Works */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Selected Works</h2>
          <p className="text-muted-foreground">
            Showcasing pieces curated for Paris Photo
          </p>
        </div>
        
        <ArchiveBrowser
          agentId="solienne"
          archiveType="generation"
          archiveName="Paris Photo Selection"
          showCuration={true}
          curationTag="paris_photo"
        />
      </div>
      
      {/* Launch Day Notice */}
      {daysUntil > 0 && (
        <Card className="mt-12 p-8 text-center bg-primary/5 border-primary/20">
          <h3 className="text-2xl font-bold mb-4">
            Daily Practice Begins at Paris Photo
          </h3>
          <p className="text-lg text-muted-foreground mb-4">
            On November 10, 2025, Solienne will begin her daily practice, 
            generating and releasing one new work every day at noon Paris time.
          </p>
          <div className="inline-flex items-center gap-2">
            <Badge variant="default" className="text-lg px-4 py-2">
              {daysUntil} days to launch
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}