'use client';

import { useState, useEffect } from 'react';

export function useCountdown(targetTime: string) {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const [hours, minutes, seconds] = targetTime.split(':').map(Number);
      
      // Create target date for today at the specified time
      const target = new Date();
      target.setHours(hours, minutes, seconds, 0);
      
      // If target time has passed today, set it for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const difference = target.getTime() - now.getTime();
      
      if (difference > 0) {
        const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
        const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);
        
        return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
      }
      
      return '00:00:00';
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetTime]);

  return timeLeft;
}