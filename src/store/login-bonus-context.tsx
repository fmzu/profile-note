import * as React from "react"
import {
  addMonthsIso,
  compareIsoDates,
  createMonthGridIsoDates,
  formatMonthDayLabel,
  formatMonthTitle,
  formatWeekdayLabel,
  getCurrentJstIsoDate,
  getHolidayLabel,
  getMonthStartIso,
  getWeekBaseMondayIso,
  getWeekdayIndex,
  isSameMonth,
  isWeekendIso,
  shiftIsoDate,
} from "@/lib/login-bonus-date"
import { createLoginBonusWeekMetadata, type LoginBonusWeekMetadata } from "@/lib/login-bonus-week"
import type {
  LoginBonusCalendarDay,
  LoginBonusStorageWeek,
  LoginBonusWeekOption,
  LoginBonusWeekView,
} from "@/types/types"

const storageKey = "login-bonus-weeks.v1"

type LoginBonusState = {
  weeks: Record<string, LoginBonusStorageWeek>
}

type LoginBonusStoreValue = {
  currentDateIso: string
  monthLabel: string
  calendarDays: LoginBonusCalendarDay[]
  currentWeek: LoginBonusWeekView
  currentWorkingDayCount: number
  currentLoggedDayCount: number
  currentMissingWorkingDays: string[]
  shouldShowManualClaimPrompt: boolean
  selectedWeek: LoginBonusWeekView
  selectedWeekId: string
  selectedWorkingDayCount: number
  selectedLoggedDayCount: number
  canEditSelectedWeekBonus: boolean
  weekOptions: LoginBonusWeekOption[]
  selectWeek: (weekId: string) => void
  markTodayLogin: () => void
  updateSelectedWeekBonusText: (value: string) => void
  requestManualClaim: () => void
}

const defaultState: LoginBonusState = { weeks: {} }

const LoginBonusContext = React.createContext<LoginBonusStoreValue | undefined>(undefined)

function createEmptyWeek(metadata: LoginBonusWeekMetadata): LoginBonusStorageWeek {
  const dayLogins: Record<string, boolean> = {}
  for (const isoDate of metadata.workingDayIsoList) {
    dayLogins[isoDate] = false
  }
  return {
    id: metadata.id,
    bonusText: "",
    claimState: "pending",
    dayLogins,
  }
}

function normalizeWeek(entry: LoginBonusStorageWeek, metadata: LoginBonusWeekMetadata): LoginBonusStorageWeek {
  const normalizedDayLogins: Record<string, boolean> = {}
  let changed = false
  for (const isoDate of metadata.workingDayIsoList) {
    const loginValue = entry.dayLogins[isoDate] === true
    normalizedDayLogins[isoDate] = loginValue
    if (!changed && entry.dayLogins[isoDate] !== normalizedDayLogins[isoDate]) {
      changed = true
    }
  }
  const currentKeys = Object.keys(entry.dayLogins).length
  if (!changed && currentKeys !== metadata.workingDayIsoList.length) {
    changed = true
  }
  if (changed) {
    return {
      ...entry,
      dayLogins: normalizedDayLogins,
    }
  }
  return entry
}

function loadInitialState(): LoginBonusState {
  if (typeof window === "undefined") {
    return defaultState
  }
  const stored = window.localStorage.getItem(storageKey)
  if (!stored) {
    return defaultState
  }
  try {
    const parsed = JSON.parse(stored) as LoginBonusState
    if (parsed && parsed.weeks && typeof parsed.weeks === "object") {
      return parsed
    }
  } catch {
    return defaultState
  }
  return defaultState
}

function saveState(state: LoginBonusState) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

function formatRangeLabel(startIso: string, endIso: string): string {
  const startLabel = formatMonthDayLabel(startIso)
  const endLabel = formatMonthDayLabel(endIso)
  return `${startLabel} - ${endLabel}`
}

function getFinalWorkingDay(metadata: LoginBonusWeekMetadata): string {
  if (metadata.workingDayIsoList.length === 0) {
    return metadata.workingEndDate
  }
  return metadata.workingDayIsoList[metadata.workingDayIsoList.length - 1]
}

export function LoginBonusProvider(props: { children: React.ReactNode }) {
  const [state, setState] = React.useState<LoginBonusState>(loadInitialState)
  const [currentDateIso] = React.useState<string>(getCurrentJstIsoDate)
  const currentWeekMetadata = React.useMemo(() => createLoginBonusWeekMetadata(currentDateIso), [currentDateIso])
  const [selectedWeekId, setSelectedWeekId] = React.useState<string>(currentWeekMetadata.id)

  const futureLimitIso = React.useMemo(() => addMonthsIso(currentDateIso, 3), [currentDateIso])

  const weekMetadatas = React.useMemo(() => {
    const list: LoginBonusWeekMetadata[] = []
    let cursor = currentWeekMetadata.id
    while (compareIsoDates(cursor, futureLimitIso) <= 0) {
      list.push(createLoginBonusWeekMetadata(cursor))
      cursor = shiftIsoDate(cursor, 7)
    }
    return list
  }, [currentWeekMetadata, futureLimitIso])

  const metadataById = React.useMemo(() => {
    const map = new Map<string, LoginBonusWeekMetadata>()
    for (const metadata of weekMetadatas) {
      map.set(metadata.id, metadata)
    }
    return map
  }, [weekMetadatas])

  React.useEffect(() => {
    setState((previous) => {
      let changed = false
      const nextWeeks: Record<string, LoginBonusStorageWeek> = { ...previous.weeks }
      for (const metadata of weekMetadatas) {
        const existing = nextWeeks[metadata.id]
        if (!existing) {
          nextWeeks[metadata.id] = createEmptyWeek(metadata)
          changed = true
          continue
        }
        const normalized = normalizeWeek(existing, metadata)
        if (normalized !== existing) {
          nextWeeks[metadata.id] = normalized
          changed = true
        }
      }
      if (!changed) {
        return previous
      }
      return {
        weeks: nextWeeks,
      }
    })
  }, [weekMetadatas])

  React.useEffect(() => {
    if (!metadataById.has(selectedWeekId)) {
      setSelectedWeekId(currentWeekMetadata.id)
    }
  }, [metadataById, selectedWeekId, currentWeekMetadata.id])

  React.useEffect(() => {
    saveState(state)
  }, [state])

  const selectWeek = React.useCallback(
    (weekId: string) => {
      if (!metadataById.has(weekId)) {
        return
      }
      setSelectedWeekId(weekId)
    },
    [metadataById],
  )

  const markTodayLogin = React.useCallback(() => {
    if (!currentWeekMetadata.workingDayIsoList.includes(currentDateIso)) {
      return
    }
    setState((previous) => {
      const existing = previous.weeks[currentWeekMetadata.id]
      if (!existing) {
        return previous
      }
      if (existing.dayLogins[currentDateIso]) {
        return previous
      }
      const updatedDayLogins = {
        ...existing.dayLogins,
        [currentDateIso]: true,
      }
      let newClaimState = existing.claimState
      if (newClaimState === "pending") {
        let allLogged = true
        for (const iso of currentWeekMetadata.workingDayIsoList) {
          if (!updatedDayLogins[iso]) {
            allLogged = false
            break
          }
        }
        if (allLogged) {
          newClaimState = "completed"
        }
      }
      const updatedWeek: LoginBonusStorageWeek = {
        ...existing,
        dayLogins: updatedDayLogins,
        claimState: newClaimState,
      }
      return {
        weeks: {
          ...previous.weeks,
          [currentWeekMetadata.id]: updatedWeek,
        },
      }
    })
  }, [currentDateIso, currentWeekMetadata])

  const updateSelectedWeekBonusText = React.useCallback(
    (value: string) => {
      setState((previous) => {
        const metadata = metadataById.get(selectedWeekId)
        if (!metadata) {
          return previous
        }
        const existing = previous.weeks[selectedWeekId]
        if (!existing) {
          return previous
        }
        if (existing.bonusText === value) {
          return previous
        }
        const updatedWeek: LoginBonusStorageWeek = {
          ...existing,
          bonusText: value,
        }
        return {
          weeks: {
            ...previous.weeks,
            [selectedWeekId]: updatedWeek,
          },
        }
      })
    },
    [metadataById, selectedWeekId],
  )

  const requestManualClaim = React.useCallback(() => {
    setState((previous) => {
      if (selectedWeekId !== currentWeekMetadata.id) {
        return previous
      }
      const existing = previous.weeks[currentWeekMetadata.id]
      if (!existing) {
        return previous
      }
      if (existing.claimState !== "pending") {
        return previous
      }
      const updatedWeek: LoginBonusStorageWeek = {
        ...existing,
        claimState: "manual",
      }
      return {
        weeks: {
          ...previous.weeks,
          [currentWeekMetadata.id]: updatedWeek,
        },
      }
    })
  }, [currentWeekMetadata.id, selectedWeekId])

  const derivedValue = React.useMemo<LoginBonusStoreValue>(() => {
    const currentEntry = state.weeks[currentWeekMetadata.id] ?? createEmptyWeek(currentWeekMetadata)
    const normalizedCurrent = normalizeWeek(currentEntry, currentWeekMetadata)
    const currentWeekView: LoginBonusWeekView = {
      id: normalizedCurrent.id,
      calendarLabel: formatRangeLabel(currentWeekMetadata.workingStartDate, currentWeekMetadata.workingEndDate),
      displayStartDate: currentWeekMetadata.workingStartDate,
      displayEndDate: currentWeekMetadata.workingEndDate,
      workingDayCount: currentWeekMetadata.workingDayIsoList.length,
      loggedDayCount: 0,
      days: currentWeekMetadata.calendarDays.map((day) => ({
        date: day.date,
        label: day.label,
        weekdayLabel: day.weekdayLabel,
        weekdayIndex: getWeekdayIndex(day.date),
        isHoliday: day.isHoliday,
        holidayLabel: day.holidayLabel,
        isWeekend: day.isWeekend,
        isWorkingDay: day.isWorkingDay,
        isToday: day.date === currentDateIso,
        isLogged: normalizedCurrent.dayLogins[day.date] === true,
        isCurrentMonth: true,
        isActiveWeekDay: true,
      })),
      bonusText: normalizedCurrent.bonusText,
      claimState: normalizedCurrent.claimState,
    }

    let currentLoggedDayCount = 0
    const currentMissingWorkingDays: string[] = []
    for (const isoDate of currentWeekMetadata.workingDayIsoList) {
      if (normalizedCurrent.dayLogins[isoDate]) {
        currentLoggedDayCount += 1
      } else {
        currentMissingWorkingDays.push(isoDate)
      }
    }
    currentWeekView.loggedDayCount = currentLoggedDayCount

    const selectedMetadata = metadataById.get(selectedWeekId) ?? currentWeekMetadata
    const selectedEntry = state.weeks[selectedMetadata.id] ?? createEmptyWeek(selectedMetadata)
    const normalizedSelected = normalizeWeek(selectedEntry, selectedMetadata)
    const selectedWeekView: LoginBonusWeekView = {
      id: normalizedSelected.id,
      calendarLabel: formatRangeLabel(selectedMetadata.workingStartDate, selectedMetadata.workingEndDate),
      displayStartDate: selectedMetadata.workingStartDate,
      displayEndDate: selectedMetadata.workingEndDate,
      workingDayCount: selectedMetadata.workingDayIsoList.length,
      loggedDayCount: 0,
      days: selectedMetadata.calendarDays.map((day) => ({
        date: day.date,
        label: day.label,
        weekdayLabel: day.weekdayLabel,
        weekdayIndex: getWeekdayIndex(day.date),
        isHoliday: day.isHoliday,
        holidayLabel: day.holidayLabel,
        isWeekend: day.isWeekend,
        isWorkingDay: day.isWorkingDay,
        isToday: day.date === currentDateIso,
        isLogged: normalizedSelected.dayLogins[day.date] === true,
        isCurrentMonth: true,
        isActiveWeekDay: true,
      })),
      bonusText: normalizedSelected.bonusText,
      claimState: normalizedSelected.claimState,
    }

    let selectedLoggedDayCount = 0
    for (const isoDate of selectedMetadata.workingDayIsoList) {
      if (normalizedSelected.dayLogins[isoDate]) {
        selectedLoggedDayCount += 1
      }
    }
    selectedWeekView.loggedDayCount = selectedLoggedDayCount

    const selectedFinalWorkingDay = getFinalWorkingDay(selectedMetadata)
    const selectedWeekIsPast = compareIsoDates(selectedMetadata.workingEndDate, currentDateIso) < 0
    const selectedWeekIsCurrent = selectedMetadata.id === currentWeekMetadata.id
    let canEditSelectedWeekBonus = false
    if (!selectedWeekIsPast) {
      if (selectedWeekIsCurrent) {
        canEditSelectedWeekBonus = normalizedSelected.claimState === "pending" && currentDateIso !== selectedFinalWorkingDay
      } else {
        canEditSelectedWeekBonus = true
      }
    }

    const currentFinalWorkingDay = getFinalWorkingDay(currentWeekMetadata)
    const shouldShowManualClaimPrompt =
      selectedWeekIsCurrent &&
      normalizedCurrent.claimState === "pending" &&
      currentDateIso === currentFinalWorkingDay &&
      currentMissingWorkingDays.length > 0

    const monthStartIso = getMonthStartIso(currentDateIso)
    const monthLabel = formatMonthTitle(monthStartIso)
    const activeWeekDates = new Set(selectedMetadata.calendarDays.map((day) => day.date))
    const monthDates = createMonthGridIsoDates(currentDateIso)
    const calendarDays: LoginBonusCalendarDay[] = []
    for (const isoDate of monthDates) {
      const isWeekend = isWeekendIso(isoDate)
      const holidayLabel = getHolidayLabel(isoDate)
      const isHoliday = holidayLabel !== ""
      const isWorkingDay = !isWeekend && !isHoliday
      const weekId = getWeekBaseMondayIso(isoDate)
      const weekEntry = state.weeks[weekId]
      const logged = weekEntry ? weekEntry.dayLogins[isoDate] === true : false
      calendarDays.push({
        date: isoDate,
        label: formatMonthDayLabel(isoDate),
        weekdayLabel: formatWeekdayLabel(isoDate),
        weekdayIndex: getWeekdayIndex(isoDate),
        isHoliday,
        holidayLabel,
        isWeekend,
        isWorkingDay,
        isToday: isoDate === currentDateIso,
        isLogged: logged,
        isCurrentMonth: isSameMonth(isoDate, monthStartIso),
        isActiveWeekDay: activeWeekDates.has(isoDate),
      })
    }

    const weekOptions: LoginBonusWeekOption[] = weekMetadatas.map((metadata) => {
      const entry = state.weeks[metadata.id] ?? createEmptyWeek(metadata)
      const optionFinalDay = getFinalWorkingDay(metadata)
      const optionIsCurrent = metadata.id === currentWeekMetadata.id
      const optionIsPast = compareIsoDates(metadata.workingEndDate, currentDateIso) < 0
      let optionIsEditable = false
      if (!optionIsPast) {
        if (optionIsCurrent) {
          optionIsEditable = entry.claimState === "pending" && currentDateIso !== optionFinalDay
        } else {
          optionIsEditable = true
        }
      }
      return {
        id: metadata.id,
        label: formatRangeLabel(metadata.workingStartDate, metadata.workingEndDate),
        rangeLabel: formatRangeLabel(metadata.workingStartDate, metadata.workingEndDate),
        bonusText: entry.bonusText,
        isSelected: metadata.id === selectedWeekId,
        isCurrent: optionIsCurrent,
        isPast: optionIsPast,
        isEditable: optionIsEditable,
      }
    })

    return {
      currentDateIso,
      monthLabel,
      calendarDays,
      currentWeek: currentWeekView,
      currentWorkingDayCount: currentWeekMetadata.workingDayIsoList.length,
      currentLoggedDayCount,
      currentMissingWorkingDays,
      shouldShowManualClaimPrompt,
      selectedWeek: selectedWeekView,
      selectedWeekId,
      selectedWorkingDayCount: selectedMetadata.workingDayIsoList.length,
      selectedLoggedDayCount,
      canEditSelectedWeekBonus,
      weekOptions,
      selectWeek,
      markTodayLogin,
      updateSelectedWeekBonusText,
      requestManualClaim,
    }
  }, [
    currentDateIso,
    currentWeekMetadata,
    markTodayLogin,
    metadataById,
    selectWeek,
    selectedWeekId,
    state.weeks,
    updateSelectedWeekBonusText,
    weekMetadatas,
  ])

  return <LoginBonusContext.Provider value={derivedValue}>{props.children}</LoginBonusContext.Provider>
}

export function useLoginBonusStore(): LoginBonusStoreValue {
  const context = React.useContext(LoginBonusContext)
  if (!context) {
    throw new Error("useLoginBonusStore must be used within LoginBonusProvider")
  }
  return context
}
