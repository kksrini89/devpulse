/**
 * Application-wide constants
 */

export const APP_NAME = "DevPulse";
export const APP_DESCRIPTION = "Developer Analytics Dashboard";

/**
 * Project status options
 */
export const PROJECT_STATUSES = {
  active: { label: "Active", color: "green" },
  paused: { label: "Paused", color: "yellow" },
  completed: { label: "Completed", color: "blue" },
} as const;

export type ProjectStatus = keyof typeof PROJECT_STATUSES;

/**
 * Activity type options
 */
export const ACTIVITY_TYPES = {
  commit: { label: "Commit", icon: "GitCommit", color: "green" },
  review: { label: "Review", icon: "MessageSquare", color: "blue" },
  deploy: { label: "Deploy", icon: "Rocket", color: "purple" },
  issue: { label: "Issue", icon: "AlertCircle", color: "orange" },
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;

/**
 * Project color options for UI
 */
export const PROJECT_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Cyan", value: "#06b6d4" },
] as const;

/**
 * Analytics time periods
 */
export const TIME_PERIODS = {
  "7d": { label: "Last 7 days", days: 7 },
  "14d": { label: "Last 14 days", days: 14 },
  "30d": { label: "Last 30 days", days: 30 },
  "90d": { label: "Last 90 days", days: 90 },
} as const;

export type TimePeriod = keyof typeof TIME_PERIODS;

/**
 * Navigation items for sidebar
 */
export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;
