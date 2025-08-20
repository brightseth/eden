/**
 * Calculate academy status based on graduation date
 * Academy runs for 100 days, ending on graduation date
 */

export function getAcademyStatus(graduationDate: string) {
  const graduation = new Date(graduationDate);
  // Use August 19, 2025 as "today" for consistent demo
  const today = new Date('2025-08-19');
  
  // Reset time to midnight for accurate day calculation
  graduation.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate the start date (100 days before graduation)
  const startDate = new Date(graduation);
  startDate.setDate(graduation.getDate() - 99); // Day 1 to Day 100 = 100 days
  
  // Calculate days passed since start
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / msPerDay) + 1;
  const currentDay = Math.max(1, Math.min(100, daysPassed));
  
  // Calculate days until graduation
  const daysUntilGraduation = Math.ceil((graduation.getTime() - today.getTime()) / msPerDay);
  const daysRemaining = Math.max(0, daysUntilGraduation);
  
  // Determine if already graduated
  const hasGraduated = daysRemaining <= 0;
  
  return {
    currentDay,
    totalDays: 100,
    daysRemaining,
    hasGraduated,
    progressPercentage: (currentDay / 100) * 100,
    graduationDate: graduation.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase(),
    startDate: startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase()
  };
}

// Genesis cohort graduation dates
// Abraham: Started July 11, 2025 → Graduates October 19, 2025 (currently Day 39)
export const ABRAHAM_GRADUATION = '2025-10-19';

// Solienne: Started August 2, 2025 → Graduates November 10, 2025 (currently Day 17)
export const SOLIENNE_GRADUATION = '2025-11-10';

// Calculate the start date (100 days before graduation)
export function getAcademyStartDate(graduationDate: string): Date {
  const graduation = new Date(graduationDate);
  const startDate = new Date(graduation);
  startDate.setDate(graduation.getDate() - 99); // Day 1 to Day 100 = 100 days
  return startDate;
}