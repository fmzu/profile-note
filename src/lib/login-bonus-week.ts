import {
  formatMonthDayLabel,
  formatWeekdayLabel,
  getHolidayLabel,
  getWeekBaseMondayIso,
  isWeekendIso,
  shiftIsoDate,
} from "@/lib/login-bonus-date"

export type LoginBonusCalendarMeta = {
  date: string
  label: string
  weekdayLabel: string
  isHoliday: boolean
  holidayLabel: string
  isWeekend: boolean
  isWorkingDay: boolean
}

export type LoginBonusWeekMetadata = {
  id: string
  calendarStartDate: string
  calendarEndDate: string
  calendarDays: LoginBonusCalendarMeta[]
  workingDayIsoList: string[]
  workingStartDate: string
  workingEndDate: string
}

export function createLoginBonusWeekMetadata(currentIsoDate: string): LoginBonusWeekMetadata {
  const calendarStart = getWeekBaseMondayIso(currentIsoDate)
  const calendarDays: LoginBonusCalendarMeta[] = []
  for (let index = 0; index < 7; index += 1) {
    const isoDate = shiftIsoDate(calendarStart, index)
    const isWeekend = isWeekendIso(isoDate)
    const holidayLabel = getHolidayLabel(isoDate)
    const isHoliday = holidayLabel !== ""
    const isWorkingDay = !isWeekend && !isHoliday
    calendarDays.push({
      date: isoDate,
      label: formatMonthDayLabel(isoDate),
      weekdayLabel: formatWeekdayLabel(isoDate),
      isHoliday,
      holidayLabel,
      isWeekend,
      isWorkingDay,
    })
  }
  const workingDayIsoList: string[] = []
  for (const day of calendarDays) {
    if (day.isWorkingDay) {
      workingDayIsoList.push(day.date)
    }
  }
  let workingStartDate = calendarStart
  let workingEndDate = shiftIsoDate(calendarStart, 4)
  if (workingDayIsoList.length > 0) {
    workingStartDate = workingDayIsoList[0]
    workingEndDate = workingDayIsoList[workingDayIsoList.length - 1]
  }
  return {
    id: calendarStart,
    calendarStartDate: calendarStart,
    calendarEndDate: shiftIsoDate(calendarStart, 6),
    calendarDays,
    workingDayIsoList,
    workingStartDate,
    workingEndDate,
  }
}
