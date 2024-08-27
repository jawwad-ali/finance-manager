import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, isSameDay } from "date-fns"

interface IActiveDays {
  date: Date
  income: number,
  expense: number,
}

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

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }

  return ((current - previous) / previous) * 100;

}

export function fillMissingDays(activeDays: { date: Date, income: number, expenses: number }[], startDate: Date, endDate: Date) {
  if (activeDays.length === 0) {
    return []
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const transactionByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))

    if (found) return found

    else {
      return {
        date: day,
        income: 0,
        expense: 0
      }
    }
  })

  return transactionByDay
}