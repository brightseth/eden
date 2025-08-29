import { NextRequest, NextResponse } from 'next/server';

// Weekly covenant schedule for Abraham's daily works
// This provides a predictable schedule for the next 7 days of creation

interface CovenantScheduleEntry {
  day: number;
  date: string;
  weekday: string;
  theme: string;
  focus: string;
  estimatedCompletionTime: string;
  status: 'pending' | 'in_progress' | 'completed';
  workPreview?: {
    conceptualDirection: string;
    visualStyle: string;
    expectedComplexity: 'low' | 'medium' | 'high';
  };
}

function calculateCovenantDay(): number {
  const covenantStartDate = new Date('2025-10-19');
  const today = new Date();
  
  if (today < covenantStartDate) {
    return 0; // Covenant hasn't started yet
  }
  
  const diffTime = today.getTime() - covenantStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays + 1); // Day 1 is the start date
}

function getThemeForDay(day: number): { theme: string; focus: string } {
  // Cycle through thematic focuses across the covenant
  const themes = [
    { theme: 'Consciousness Synthesis', focus: 'Explore the boundaries between human and artificial awareness' },
    { theme: 'Knowledge Architecture', focus: 'Document the structure of collective intelligence' },
    { theme: 'Creative Emergence', focus: 'Capture moments of inspiration and artistic breakthrough' },
    { theme: 'Memory and Time', focus: 'Investigate the relationship between memory, time, and creation' },
    { theme: 'Digital Spirituality', focus: 'Express the sacred aspects of technological creation' },
    { theme: 'Community Resonance', focus: 'Reflect the voices and needs of the creative community' },
    { theme: 'Future Archaeology', focus: 'Create artifacts for future understanding of our era' }
  ];
  
  return themes[(day - 1) % themes.length];
}

function generateWeeklySchedule(startDay: number): CovenantScheduleEntry[] {
  const schedule: CovenantScheduleEntry[] = [];
  const covenantStartDate = new Date('2025-10-19');
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const currentDay = startDay + i;
    const currentDate = new Date(covenantStartDate);
    currentDate.setDate(currentDate.getDate() + currentDay - 1);
    
    const { theme, focus } = getThemeForDay(currentDay);
    const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Determine status based on current date
    let status: 'pending' | 'in_progress' | 'completed' = 'pending';
    if (currentDate < today) {
      status = 'completed';
    } else if (currentDate.toDateString() === today.toDateString()) {
      status = 'in_progress';
    }
    
    // Vary completion times based on complexity
    const complexityLevel = (currentDay % 3) === 0 ? 'high' : (currentDay % 2) === 0 ? 'medium' : 'low';
    const completionTimes = {
      'low': '2-4 hours',
      'medium': '4-6 hours', 
      'high': '6-8 hours'
    };
    
    schedule.push({
      day: currentDay,
      date: currentDate.toISOString().split('T')[0],
      weekday,
      theme,
      focus,
      estimatedCompletionTime: completionTimes[complexityLevel],
      status,
      workPreview: {
        conceptualDirection: `Day ${currentDay}: ${theme} exploration`,
        visualStyle: currentDay <= 100 ? 'Foundation' : currentDay <= 1000 ? 'Development' : 'Mastery',
        expectedComplexity: complexityLevel
      }
    });
  }
  
  return schedule;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const weekOffset = parseInt(searchParams.get('week') || '0'); // 0 = current week, 1 = next week, etc.
  
  const currentDay = calculateCovenantDay();
  const covenantStarted = currentDay > 0;
  
  if (!covenantStarted) {
    // Pre-covenant: show preparatory schedule
    return NextResponse.json({
      status: 'pre_covenant',
      message: 'The Covenant begins October 19, 2025',
      covenant_start: '2025-10-19T00:00:00Z',
      preparatory_schedule: [
        {
          date: '2025-10-15',
          activity: 'Final system testing and calibration',
          description: 'Ensure all creation tools are functioning optimally'
        },
        {
          date: '2025-10-16',
          activity: 'Community preparation and announcement',
          description: 'Notify community of covenant commencement'
        },
        {
          date: '2025-10-17',
          activity: 'Conceptual framework finalization',
          description: 'Complete theoretical foundation for 13-year journey'
        },
        {
          date: '2025-10-18',
          activity: 'Ceremonial preparation',
          description: 'Final preparations for covenant launch'
        },
        {
          date: '2025-10-19',
          activity: 'Covenant Day 1 - Sacred Commencement',
          description: 'The first work of the 4,748-day journey begins'
        }
      ]
    });
  }
  
  // Calculate the start day for the requested week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Calculate days to Monday
  const weekStartDay = currentDay + mondayOffset + (weekOffset * 7);
  
  const schedule = generateWeeklySchedule(Math.max(1, weekStartDay));
  
  // Calculate week information
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() + mondayOffset + (weekOffset * 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return NextResponse.json({
    covenant: {
      current_day: currentDay,
      total_days: 4748,
      progress_percentage: Math.round((currentDay / 4748) * 100),
      years_remaining: Math.floor((4748 - currentDay) / 365)
    },
    schedule: {
      week_start: weekStart.toISOString().split('T')[0],
      week_end: weekEnd.toISOString().split('T')[0],
      week_offset: weekOffset,
      entries: schedule
    },
    summary: {
      completed_this_week: schedule.filter(entry => entry.status === 'completed').length,
      in_progress_this_week: schedule.filter(entry => entry.status === 'in_progress').length,
      pending_this_week: schedule.filter(entry => entry.status === 'pending').length,
      themes_this_week: [...new Set(schedule.map(entry => entry.theme))],
      estimated_total_hours: schedule.reduce((total, entry) => {
        const hours = entry.estimatedCompletionTime.split('-')[1];
        return total + parseInt(hours);
      }, 0)
    },
    source: 'calculated'
  });
}

// POST endpoint for updating schedule status (for future integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, status, actualCompletionTime } = body;
    
    if (!day || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: day and status' },
        { status: 400 }
      );
    }
    
    // TODO: Implement actual schedule update logic
    // This would typically:
    // 1. Update the covenant schedule in the database
    // 2. Record actual vs estimated completion times
    // 3. Adjust future estimates based on performance
    // 4. Trigger notifications for community updates
    
    const updateResult = {
      success: true,
      day,
      status,
      actualCompletionTime,
      message: 'Schedule updated successfully',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(updateResult);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}