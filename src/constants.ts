import type { ProfileBackgroundOption } from "@/types/types"

export const profileBackgroundOptions: ProfileBackgroundOption[] = [
  {
    id: "sky",
    label: "\u305d\u3089",
    cardClass: "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-50",
    sampleClass: "bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100",
  },
  {
    id: "peach",
    label: "\u3082\u3082",
    cardClass: "bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50",
    sampleClass: "bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100",
  },
  {
    id: "mint",
    label: "\u307f\u3069\u308a",
    cardClass: "bg-gradient-to-br from-emerald-100 via-green-50 to-lime-50",
    sampleClass: "bg-gradient-to-br from-emerald-200 via-green-100 to-lime-100",
  },
  {
    id: "lavender",
    label: "\u30e9\u30d9\u30f3\u30c0\u30fc",
    cardClass: "bg-gradient-to-br from-indigo-100 via-violet-50 to-purple-50",
    sampleClass: "bg-gradient-to-br from-indigo-200 via-violet-100 to-purple-100",
  },
]

export const defaultProfileBackgroundId = "sky"

export function getProfileBackgroundClass(backgroundId: string): string {
  for (const option of profileBackgroundOptions) {
    if (option.id === backgroundId) {
      return option.cardClass
    }
  }
  return getDefaultProfileBackgroundClass()
}

export function getProfileBackgroundSampleClass(backgroundId: string): string {
  for (const option of profileBackgroundOptions) {
    if (option.id === backgroundId) {
      return option.sampleClass
    }
  }
  return getDefaultProfileBackgroundSampleClass()
}

export function getDefaultProfileBackgroundClass(): string {
  return "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-50"
}

export function getDefaultProfileBackgroundSampleClass(): string {
  return "bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100"
}
