'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Coins, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SaleCountdownProps {
  targetDate: string;
  title: string;
  price?: string;
  totalSupply?: number;
  saleUrl: string;
  description?: string;
}

export function SaleCountdown({ 
  targetDate, 
  title, 
  price, 
  totalSupply, 
  saleUrl, 
  description 
}: SaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsLive(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="border border-white bg-black/50 backdrop-blur">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-sm tracking-wider mb-2 opacity-75">
            {isLive ? 'SALE NOW LIVE' : 'SALE COUNTDOWN'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h3>
          {description && (
            <p className="text-sm opacity-75">{description}</p>
          )}
        </div>

        {/* Countdown Display */}
        {!isLive ? (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold border-b border-white pb-2 mb-2">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wide">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold border-b border-white pb-2 mb-2">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold border-b border-white pb-2 mb-2">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wide">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold border-b border-white pb-2 mb-2">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wide">Seconds</div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-400 mb-2">LIVE NOW</div>
            <div className="text-sm opacity-75">Sale is currently active</div>
          </div>
        )}

        {/* Sale Details */}
        {(price || totalSupply) && (
          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
            {price && (
              <div className="border border-white p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Coins className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Price</span>
                </div>
                <div className="font-bold text-lg">{price}</div>
              </div>
            )}
            {totalSupply && (
              <div className="border border-white p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Supply</span>
                </div>
                <div className="font-bold text-lg">{totalSupply.toLocaleString()}</div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <Link
            href={saleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2 px-6 py-3 font-bold transition-all ${
              isLive 
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500' 
                : 'border border-white hover:bg-white hover:text-black'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isLive ? 'PARTICIPATE NOW' : 'SET REMINDER'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-4">
          <div className="text-xs opacity-50">
            {new Date(targetDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric', 
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}