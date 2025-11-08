declare module "japanese-holidays" {
  type JapaneseHolidaysModule = {
    isHoliday: (date: Date) => string | undefined
  }

  const module: JapaneseHolidaysModule
  export default module
  export function isHoliday(date: Date): string | undefined
}
