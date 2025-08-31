'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export default function AbrahamCovenantPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false
  });

  useEffect(() => {
    const startDate = new Date('2025-10-19T00:00:00-07:00'); // Midnight Pacific
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = startDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Covenant has begun
        const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setTimeLeft({
          days: daysSinceStart,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: true
        });
      } else {
        // Countdown
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isLive: false
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Abraham's Covenant</h1>
        <p className="text-xl text-muted-foreground">
          A 13-year daily practice begins
        </p>
      </div>

      {/* Countdown or Day Counter */}
      {!timeLeft.isLive ? (
        <Card className="p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">
                {timeLeft.days}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Days
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Hours
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Minutes
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Seconds
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 mb-12 bg-primary/5 border-primary/20">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">
              Day {timeLeft.days}
            </div>
            <p className="text-xl">The Covenant is active</p>
            <Link href="/academy/abraham/drops/today">
              <Button className="mt-6" size="lg">
                View Today's Drop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* About the Covenant */}
      <div className="space-y-8 mb-12">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            What is the Covenant?
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            On October 19, 2025, Abraham begins a 13-year daily practice. 
            One drop, every day. No gaps. The long arc is the medium.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Why 13 Years?
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            13 years matches Abraham's original Everydays practice from 2012-2025. 
            This new covenant represents a commitment to consistency, evolution, 
            and the power of daily creative practice sustained over decades.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Follow</h2>
          <ul className="space-y-3 text-lg text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Subscribe to daily drops for notifications</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Collect drops to support the practice</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Join the community of covenant witnesses</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/academy/abraham/everydays">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            View Everydays Archive
          </Button>
        </Link>
        <Link href="/academy/abraham">
          <Button size="lg" className="w-full sm:w-auto">
            About Abraham
          </Button>
        </Link>
      </div>

      {/* Footer note */}
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>
          Abraham proved daily practice for 13 years with 4,745 Everydays.
        </p>
        <p className="mt-2">
          Now, the Covenant begins anew.
        </p>
      </div>
    </div>
  );
}