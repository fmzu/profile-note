import japaneseHolidays from "japanese-holidays"

const isoFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

const monthDayFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  month: "numeric",
  day: "numeric",
})

const weekdayFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  weekday: "short",
})

const monthTitleFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
})

function createDateFromIso(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00+09:00`)
}

export function getCurrentJstIsoDate(): string {
  return isoFormatter.format(new Date())
}

export function formatIsoDate(date: Date): string {
  return isoFormatter.format(date)
}

export function shiftIsoDate(isoDate: string, amount: number): string {
  const base = createDateFromIso(isoDate)
  base.setUTCDate(base.getUTCDate() + amount)
  return formatIsoDate(base)
}

export function getWeekBaseMondayIso(currentIsoDate: string): string {
  const date = createDateFromIso(currentIsoDate)
  const weekday = date.getUTCDay()
  if (weekday === 1) {
    return currentIsoDate
  }
  if (weekday === 0) {
    return shiftIsoDate(currentIsoDate, -6)
  }
  const offset = 1 - weekday
  return shiftIsoDate(currentIsoDate, offset)
}

export function formatMonthDayLabel(isoDate: string): string {
  return monthDayFormatter.format(createDateFromIso(isoDate))
}

export function formatWeekdayLabel(isoDate: string): string {
  return weekdayFormatter.format(createDateFromIso(isoDate))
}

export function isWeekendIso(isoDate: string): boolean {
  const date = createDateFromIso(isoDate)
  const weekday = date.getUTCDay()
  return weekday === 0 || weekday === 6
}

export function getHolidayLabel(isoDate: string): string {
  const date = createDateFromIso(isoDate)
  const label = japaneseHolidays.isHoliday(date)
  if (typeof label === "string") {
    return label
  }
  return ""
}

export function getMonthStartIso(currentIsoDate: string): string {
  const date = createDateFromIso(currentIsoDate)
  date.setUTCDate(1)
  return formatIsoDate(date)
}

export function getMonthGridStartIso(currentIsoDate: string): string {
  const monthStart = getMonthStartIso(currentIsoDate)
  const date = createDateFromIso(monthStart)
  const weekday = date.getUTCDay()
  const shift = -weekday
  if (shift === 0) {
    return monthStart
  }
  return shiftIsoDate(monthStart, shift)
}

export function createMonthGridIsoDates(currentIsoDate: string): string[] {
  const startIso = getMonthGridStartIso(currentIsoDate)
  const dates: string[] = []
  for (let index = 0; index < 42; index += 1) {
    dates.push(shiftIsoDate(startIso, index))
  }
  return dates
}

export function isSameMonth(isoDate: string, monthStartIso: string): boolean {
  const target = createDateFromIso(isoDate)
  const monthStart = createDateFromIso(monthStartIso)
  return target.getUTCFullYear() === monthStart.getUTCFullYear() && target.getUTCMonth() === monthStart.getUTCMonth()
}

export function formatMonthTitle(isoDate: string): string {
  return monthTitleFormatter.format(createDateFromIso(isoDate))
}

export function getWeekdayIndex(isoDate: string): number {
  const date = createDateFromIso(isoDate)
  return date.getUTCDay()
}

export function addMonthsIso(isoDate: string, months: number): string {
  const date = createDateFromIso(isoDate)
  date.setUTCMonth(date.getUTCMonth() + months)
  return formatIsoDate(date)
}

export function compareIsoDates(firstIso: string, secondIso: string): number {
  const firstTime = createDateFromIso(firstIso).getTime()
  const secondTime = createDateFromIso(secondIso).getTime()
  if (firstTime === secondTime) {
    return 0
  }
  if (firstTime < secondTime) {
    return -1
  }
  return 1
}
