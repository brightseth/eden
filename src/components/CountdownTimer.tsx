'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  label: string;
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-700/50">
      <div className="text-sm text-gray-400 mb-4 text-center font-semibold tracking-wider">{label}</div>
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {timeLeft.days}
          </div>
          <div className="text-xs text-gray-500 mt-1">DAYS</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">HOURS</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">MINS</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">SECS</div>
        </div>
      </div>
    </div>
  );
}