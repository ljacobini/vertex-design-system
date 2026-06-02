import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn standard className merge utility.
 * Combines clsx (conditional classes) + tailwind-merge (dedupe conflicting Tailwind utilities).
 *
 * Usage:
 *   cn("px-2", condition && "px-4")  // → "px-4" (last wins, tailwind-merge resolves conflict)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
