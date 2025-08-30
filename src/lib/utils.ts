import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe status formatting to prevent toUpperCase() errors
export function safeStatusFormat(status: string | null | undefined): string {
  if (!status || typeof status !== 'string') {
    return 'DEVELOPING';
  }
  return status.toUpperCase();
}

// Safe agent property access with fallbacks
export function safeAgentAccess<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

export function calculateDayNumber(startDate: Date, currentDate: Date = new Date()): number {
  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function calculateDaysUntilLaunch(launchDate: Date, currentDate: Date = new Date()): number {
  const diffTime = launchDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Additional utility for legacy code compatibility
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}