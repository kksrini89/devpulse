import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind conflict resolution.
 *
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts.
 * Example: cn('px-4', 'px-8') → 'px-8' (not 'px-4 px-8')
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
