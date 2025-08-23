import { NextResponse } from 'next/server';

export async function GET() {
  const covenantStart = new Date('2017-06-15T00:00:00Z');
  const covenantEnd = new Date('2030-10-19T00:00:00Z');
  const now = new Date();
  
  // Calculate time remaining
  const msRemaining = covenantEnd.getTime() - now.getTime();
  const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const yearsRemaining = Math.floor(daysRemaining / 365);
  const daysInYear = daysRemaining % 365;
  const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
  
  // Calculate progress
  const totalMs = covenantEnd.getTime() - covenantStart.getTime();
  const elapsedMs = now.getTime() - covenantStart.getTime();
  const progressPercentage = (elapsedMs / totalMs) * 100;
  
  // Calculate current week and expected works
  const weeksElapsed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24 * 7));
  const currentWeek = weeksElapsed + 1;
  const expectedWorks = weeksElapsed * 6; // 6 works per week
  
  // Get current day of week
  const dayOfWeek = now.getDay();
  const isSabbath = dayOfWeek === 0; // Sunday
  
  const covenant = {
    status: "ACTIVE",
    is_sabbath: isSabbath,
    current_day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
    
    timeline: {
      start: covenantStart.toISOString(),
      end: covenantEnd.toISOString(),
      current: now.toISOString()
    },
    
    progress: {
      percentage: progressPercentage.toFixed(2),
      current_year: Math.floor(elapsedMs / (1000 * 60 * 60 * 24 * 365)) + 1,
      current_week: currentWeek,
      weeks_remaining: Math.floor(daysRemaining / 7),
      expected_total_works: Math.floor((totalMs / (1000 * 60 * 60 * 24 * 7)) * 6),
      expected_works_to_date: expectedWorks
    },
    
    countdown: {
      years: yearsRemaining,
      days: daysInYear,
      hours: hoursRemaining,
      minutes: minutesRemaining,
      seconds: secondsRemaining,
      total_days_remaining: daysRemaining,
      formatted: `${yearsRemaining}Y ${daysInYear}D ${hoursRemaining}H ${minutesRemaining}M ${secondsRemaining}S`
    },
    
    rules: {
      creations_per_week: 6,
      sabbath_day: "Sunday",
      work_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    
    milestones: {
      next_sabbath: getNextSunday(),
      year_8_begins: "2025-06-15T00:00:00Z",
      halfway_point: "2023-12-17T00:00:00Z", // Already passed
      final_work_date: "2030-10-18T23:59:59Z", // Last Saturday before end
      covenant_completion: "2030-10-19T00:00:00Z"
    }
  };
  
  return NextResponse.json(covenant);
}

function getNextSunday() {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday.toISOString();
}