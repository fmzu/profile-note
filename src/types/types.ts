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
}
