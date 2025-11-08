import type { MouseEventHandler } from "react"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  selected: boolean
  disabled: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

export function CategoryToggleCard(props: Props) {
  const baseClass =
    "w-full rounded-xl border bg-white/80 px-4 py-5 text-center text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 sm:px-5 sm:py-6"
  const selectedClass = props.selected ? "border-sky-400 shadow-lg shadow-sky-100" : "border-white/70 shadow-md"
  const disabledClass = props.disabled ? "opacity-40" : "hover:-translate-y-0.5 hover:shadow-lg"

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled && !props.selected}
      className={cn(baseClass, selectedClass, disabledClass)}
    >
      <span className="text-base font-semibold text-sky-700 sm:text-lg">{props.title}</span>
      {props.selected ? <span className="mt-2 block text-xs text-sky-500 sm:text-sm">えらんだよ</span> : null}
    </button>
  )
}
