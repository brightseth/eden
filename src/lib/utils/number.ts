/**
 * Safely formats a number with toFixed, handling undefined/null values
 */
export function safeToFixed(value: number | undefined | null, digits: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }
  return value.toFixed(digits);
}

/**
 * Safely formats a number as an integer, handling undefined/null values
 */
export function safeToInt(value: number | undefined | null): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return Math.floor(value).toString();
}