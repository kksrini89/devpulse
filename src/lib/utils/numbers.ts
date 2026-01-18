/**
 * Format a number with thousand separators.
 * @example formatNumber(1234567) → "1,234,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a number in compact notation.
 * @example formatCompact(1234) → "1.2K"
 * @example formatCompact(1234567) → "1.2M"
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a decimal as percentage.
 * @example formatPercent(0.156) → "15.6%"
 * @example formatPercent(0.156, 0) → "16%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format hours as a readable duration.
 * @example formatDuration(1.5) → "1h 30m"
 * @example formatDuration(0.25) → "15m"
 */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Calculate percentage change between two values.
 * @example calcChange(120, 100) → 0.2 (20% increase)
 * @example calcChange(80, 100) → -0.2 (20% decrease)
 */
export function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 1 : 0;
  return (current - previous) / previous;
}

/**
 * Format a change value as a trend indicator.
 * @example formatTrend(0.15) → "+15%"
 * @example formatTrend(-0.08) → "-8%"
 */
export function formatTrend(change: number): string {
  const percent = Math.abs(change * 100).toFixed(0);
  const sign = change >= 0 ? "+" : "-";
  return `${sign}${percent}%`;
}
