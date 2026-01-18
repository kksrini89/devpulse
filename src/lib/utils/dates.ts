import {
  format,
  formatDistanceToNow,
  startOfDay,
  endOfDay,
  subDays,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

/**
 * Format a date for display in the UI.
 * @example formatDate(new Date()) → "Jan 18, 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

/**
 * Format a date with time.
 * @example formatDateTime(new Date()) → "Jan 18, 2026, 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy, h:mm a");
}

/**
 * Format a date as relative time.
 * @example formatRelative(new Date()) → "less than a minute ago"
 */
export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format a date for display, with smart relative formatting for recent dates.
 * @example formatSmart(today) → "Today"
 * @example formatSmart(yesterday) → "Yesterday"
 * @example formatSmart(lastWeek) → "Jan 12, 2026"
 */
export function formatSmart(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;

  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";

  return formatDate(d);
}

/**
 * Get the start of the current day.
 */
export function getStartOfDay(date: Date = new Date()): Date {
  return startOfDay(date);
}

/**
 * Get the end of the current day.
 */
export function getEndOfDay(date: Date = new Date()): Date {
  return endOfDay(date);
}

/**
 * Get a date N days ago.
 */
export function getDaysAgo(days: number): Date {
  return subDays(new Date(), days);
}

/**
 * Format a date for chart labels.
 * @example formatChartDate(new Date()) → "Jan 18"
 */
export function formatChartDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d");
}

/**
 * Format a date as ISO string for data storage.
 */
export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
