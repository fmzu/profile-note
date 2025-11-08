export type CategoryOption = {
  id: string
  title: string
  isCustom: boolean
}

export type ProfileCategory = {
  id: string
  title: string
  content: string
  isCustom: boolean
}

export type ProfileData = {
  name: string
  message: string
  categories: ProfileCategory[]
  backgroundId: string
}

export type ProfileBackgroundOption = {
  id: string
  label: string
  cardClass: string
  sampleClass: string
  detailClass: string
}

export type LoginBonusClaimState = "pending" | "completed" | "manual"

export type LoginBonusStorageWeek = {
  id: string
  bonusText: string
  claimState: LoginBonusClaimState
  dayLogins: Record<string, boolean>
}

export type LoginBonusCalendarDay = {
  date: string
  label: string
  weekdayLabel: string
  weekdayIndex: number
  isToday: boolean
  isWeekend: boolean
  isHoliday: boolean
  holidayLabel: string
  isWorkingDay: boolean
  isLogged: boolean
  isCurrentMonth: boolean
  isActiveWeekDay: boolean
}

export type LoginBonusWeekView = {
  id: string
  calendarLabel: string
  displayStartDate: string
  displayEndDate: string
  workingDayCount: number
  loggedDayCount: number
  days: LoginBonusCalendarDay[]
  bonusText: string
  claimState: LoginBonusClaimState
}

export type LoginBonusWeekOption = {
  id: string
  label: string
  rangeLabel: string
  bonusText: string
  isSelected: boolean
  isCurrent: boolean
  isPast: boolean
  isEditable: boolean
}
