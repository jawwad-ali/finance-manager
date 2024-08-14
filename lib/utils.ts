import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountToMiliUnits(amount: number) {
  // Example 200 * 1000 = 200000
  return Math.round(amount * 1000)
}

export function convertAmountFromMiliunits(amount: number) {
  // Example: $200 / 1000 = 0.2
  return amount / 1000
}