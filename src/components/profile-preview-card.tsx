import type { ProfileCategory, ProfileData } from "@/types/types"

type Props = {
  profile: ProfileData
}

function renderCategory(category: ProfileCategory) {
  return (
    <div
      key={category.id}
      className="flex h-36 flex-col justify-between rounded-lg border border-white/60 bg-white/80 p-3 text-center shadow-sm"
    >
      <span className="text-sm font-semibold text-sky-700">{category.title}</span>
      <p className="text-xs leading-relaxed text-slate-600">{category.content || "ここに内容を書いてね"}</p>
    </div>
  )
}

export function ProfilePreviewCard(props: Props) {
  const categories = props.profile.categories
  const remainingCount = 4 - categories.length
  const placeholders = remainingCount > 0 ? remainingCount : 0
  const placeholderItems = Array.from({ length: placeholders })

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-sky-100/70 p-5 shadow-xl shadow-sky-100">
      <div className="flex flex-col items-center border-b border-white/70 pb-4 text-center">
        <span className="text-sm text-sky-600">なまえ</span>
        <h2 className="mt-1 text-2xl font-semibold text-sky-800">
          {props.profile.name || "なまえを書いてね"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {props.profile.message || "いまのきもちやひとことを教えてね🫧"}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {categories.map(renderCategory)}
        {placeholderItems.map(function (_value, index) {
          return (
            <div
              key={`placeholder-${index}`}
              className="h-36 rounded-lg bg-sky-100/70"
              aria-hidden
            />
          )
        })}
      </div>
    </div>
  )
}
