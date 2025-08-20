export const calculateDaysUntil = (date: string): number => {
  const target = new Date(date);
  const today = new Date();
  const days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};