import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/*
* Function to merge tailwindcss classes with clsx classes.
*
* @param {ClassValue[]} inputs - The classes to merge.
*
* @returns {string} - The merged classes.
* */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
