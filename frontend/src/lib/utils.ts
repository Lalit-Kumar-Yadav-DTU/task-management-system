import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// This helper allows for dynamic tailwind classes without conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format dates professionally
export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
};