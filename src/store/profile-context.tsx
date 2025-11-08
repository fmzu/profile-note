import * as React from "react"
import { defaultProfileBackgroundId, profileBackgroundOptions } from "@/constants"
import type { CategoryOption, ProfileBackgroundOption, ProfileCategory, ProfileData } from "@/types/types"

type Props = {
  children: React.ReactNode
}

type UpdateCategoryContentProps = {
  categoryId: string
  content: string
}

type ProfileStoreValue = {
  profile: ProfileData
  availableCategories: CategoryOption[]
  backgroundOptions: ProfileBackgroundOption[]
  addCustomCategory: (title: string) => void
  toggleCategorySelection: (categoryId: string) => void
  updateProfileName: (value: string) => void
  updateProfileMessage: (value: string) => void
  updateCategoryContent: (props: UpdateCategoryContentProps) => void
  updateBackgroundId: (backgroundId: string) => void
  resetProfile: () => void
}

const presetCategoryTitles: string[] = [
  "すきなこと",
  "すきなたべもの",
  "すきなばしょ",
  "すきなおんがく",
  "すきなゲーム",
  "すきなほん",
  "すきないろ",
]

const ProfileContext = React.createContext<ProfileStoreValue | undefined>(undefined)

function createInitialProfile(): ProfileData {
  return {
    name: "",
    message: "",
    categories: [],
    backgroundId: defaultProfileBackgroundId,
  }
}

function createInitialOptions(): CategoryOption[] {
  const options: CategoryOption[] = []
  for (const title of presetCategoryTitles) {
    options.push({
      id: createCategoryId(title),
      title,
      isCustom: false,
    })
  }
  return options
}

function createCategoryId(base: string): string {
  const time = String(Date.now())
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${base}-${crypto.randomUUID()}`
  }
  const random = Math.random().toString(36).slice(2, 10)
  return `${base}-${time}-${random}`
}

export function ProfileProvider(props: Props) {
  const profileState = React.useState<ProfileData>(createInitialProfile())
  const profile = profileState[0]
  const setProfile = profileState[1]

  const availableOptionsState = React.useState<CategoryOption[]>(createInitialOptions())
  const availableCategories = availableOptionsState[0]
  const setAvailableCategories = availableOptionsState[1]

  function addCustomCategory(title: string) {
    const trimmed = title.trim()
    if (trimmed === "") {
      return
    }
    setAvailableCategories(function (previous) {
      const duplicate = previous.some(function (option) {
        return option.title === trimmed
      })
      if (duplicate) {
        return previous
      }
      const createdOption: CategoryOption = {
        id: createCategoryId(trimmed),
        title: trimmed,
        isCustom: true,
      }
      return [...previous, createdOption]
    })
  }

  function toggleCategorySelection(categoryId: string) {
    setProfile(function (previous) {
      const alreadySelected = previous.categories.some(function (category) {
        return category.id === categoryId
      })
      if (alreadySelected) {
        const remainingCategories = previous.categories.filter(function (category) {
          return category.id !== categoryId
        })
        return {
          ...previous,
          categories: remainingCategories,
        }
      }
      if (previous.categories.length >= 4) {
        return previous
      }
      const option = availableCategories.find(function (entry) {
        return entry.id === categoryId
      })
      if (!option) {
        return previous
      }
      const appendedCategories: ProfileCategory[] = [
        ...previous.categories,
        {
          id: option.id,
          title: option.title,
          content: "",
          isCustom: option.isCustom,
        },
      ]
      return {
        ...previous,
        categories: appendedCategories,
      }
    })
  }

  function updateProfileName(value: string) {
    setProfile(function (previous) {
      if (previous.name === value) {
        return previous
      }
      return {
        ...previous,
        name: value,
      }
    })
  }

  function updateProfileMessage(value: string) {
    setProfile(function (previous) {
      if (previous.message === value) {
        return previous
      }
      return {
        ...previous,
        message: value,
      }
    })
  }

  function updateCategoryContent(props: UpdateCategoryContentProps) {
    setProfile(function (previous) {
      const updatedCategories: ProfileCategory[] = previous.categories.map(function (category) {
        if (category.id !== props.categoryId) {
          return category
        }
        if (category.content === props.content) {
          return category
        }
        return {
          ...category,
          content: props.content,
        }
      })
      return {
        ...previous,
        categories: updatedCategories,
      }
    })
  }

  function updateBackgroundId(backgroundId: string) {
    const exists = profileBackgroundOptions.some(function (option) {
      return option.id === backgroundId
    })
    if (!exists) {
      return
    }
    setProfile(function (previous) {
      if (previous.backgroundId === backgroundId) {
        return previous
      }
      return {
        ...previous,
        backgroundId,
      }
    })
  }

  function resetProfile() {
    setProfile(createInitialProfile())
    setAvailableCategories(createInitialOptions())
  }

  const value = React.useMemo<ProfileStoreValue>(
    function () {
      return {
        profile,
        availableCategories,
        backgroundOptions: profileBackgroundOptions,
        addCustomCategory,
        toggleCategorySelection,
        updateProfileName,
        updateProfileMessage,
        updateCategoryContent,
        updateBackgroundId,
        resetProfile,
      }
    },
    [profile, availableCategories],
  )

  return <ProfileContext.Provider value={value}>{props.children}</ProfileContext.Provider>
}

export function useProfileStore(): ProfileStoreValue {
  const context = React.useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfileStore must be used within ProfileProvider")
  }
  return context
}
