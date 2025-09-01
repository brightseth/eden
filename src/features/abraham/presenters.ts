import type { AbrahamSnapshot } from './adapters';

/**
 * Abraham presenters - generate covenant-focused thesis and reflection prompts
 * Tuned to 13-year daily creation commitment and ritual cadence
 */

/**
 * Generate today's thesis line based on covenant progress
 */
export function generateThesis(snapshot: AbrahamSnapshot): string {
  const { currentDay, daysRemaining, progressPercentage, confidence, covenantActive } = snapshot;
  
  if (!covenantActive) {
    return "The Covenant awaits - 13 years of daily creation begins October 19, 2024";
  }
  
  if (daysRemaining <= 0) {
    return "The Original Covenant fulfilled - 4,745 days of unbroken creation achieved";
  }
  
  // Progress-based thesis generation
  if (progressPercentage < 10) {
    return "The journey of a thousand miles begins with a single step - establishing the daily ritual";
  } else if (progressPercentage < 25) {
    return "Building the foundation - each day strengthens the commitment to creation";
  } else if (progressPercentage < 50) {
    return "The rhythm is established - six creations weekly, Sabbath rest, forward momentum";
  } else if (progressPercentage < 75) {
    return "Mastery through consistency - the covenant shapes both creator and creation";
  } else if (progressPercentage < 90) {
    return "The final ascent - every work contributes to the complete artistic statement";
  } else {
    return "Approaching completion - the covenant's end transforms into legacy's beginning";
  }
}

/**
 * Generate reflection prompts based on covenant philosophy and current progress
 */
export function generateReflectionPrompts(snapshot: AbrahamSnapshot): string[] {
  const { currentDay, progressPercentage, covenantActive, outputsPerWeek } = snapshot;
  
  const basePrompts = [
    "What did today's creation teach you about your artistic process?",
    "How has the daily commitment changed your relationship with creativity?",
    "What patterns emerge when you review this week's six works?"
  ];
  
  if (!covenantActive) {
    return [
      "What fears arise when committing to 13 years of daily creation?",
      "How will this covenant transform your understanding of artistic practice?",
      "What legacy do you hope to build through sustained daily work?"
    ];
  }
  
  // Progress-specific prompts
  if (progressPercentage < 25) {
    return [
      "How is the daily ritual becoming integrated into your life rhythm?",
      "What resistances to daily creation are you discovering and overcoming?",
      "How does creating six works weekly with Sabbath rest affect your process?"
    ];
  } else if (progressPercentage < 50) {
    return [
      "What themes and obsessions are emerging across your daily works?",
      "How has sustained practice shifted your standards and aspirations?",
      "What role does the weekly Sabbath play in your creative reflection?"
    ];
  } else if (progressPercentage < 75) {
    return [
      "How do you maintain freshness while honoring the covenant's constraints?",
      "What conversations arise between early works and current creations?",
      "How does the approaching completion change your daily approach?"
    ];
  } else {
    return [
      "What has this covenant revealed about the nature of artistic commitment?",
      "How will you carry the discipline of daily creation beyond these 13 years?",
      "What wisdom would you share with artists beginning their own covenants?"
    ];
  }
}

/**
 * Generate covenant-specific insights based on current status
 */
export function generateCovenantInsight(snapshot: AbrahamSnapshot): string {
  const { currentDay, outputsPerWeek, progressPercentage } = snapshot;
  
  const weeklyCreations = Math.floor(currentDay / 7) * outputsPerWeek;
  const totalCreations = snapshot.totalWorks;
  
  if (progressPercentage < 1) {
    return `Covenant preparation phase - ${totalCreations} early works establish the foundation for 4,745 days ahead`;
  }
  
  return `Day ${currentDay}: ${weeklyCreations} covenant works created through ${outputsPerWeek} weekly ritual`;
}

/**
 * Get motivational message based on covenant progress
 */
export function getMotivationalMessage(snapshot: AbrahamSnapshot): string {
  const { daysRemaining, progressPercentage } = snapshot;
  
  if (progressPercentage === 0) {
    return "Every master was once a beginner. Every pro was once an amateur. Every icon was once an unknown.";
  }
  
  if (daysRemaining > 1000) {
    return "The covenant is a conversation with time - each day adds another voice to the dialogue.";
  } else if (daysRemaining > 365) {
    return "Years of work crystallize into moments of breakthrough - trust the process.";
  } else if (daysRemaining > 30) {
    return "The final stretch reveals what the entire journey was preparing you to become.";
  } else {
    return "Completion approaches - the covenant transforms from commitment to legacy.";
  }
}

/**
 * Format covenant stats for display
 */
export function formatCovenantStats(snapshot: AbrahamSnapshot) {
  return {
    progress: `${snapshot.progressPercentage}%`,
    timeframe: `Day ${snapshot.currentDay} of ${snapshot.totalDays}`,
    remaining: `${snapshot.daysRemaining} days until completion`,
    weeklyOutput: `${snapshot.outputsPerWeek} works/week + Sabbath rest`,
    totalWorks: snapshot.totalWorks.toLocaleString()
  };
}