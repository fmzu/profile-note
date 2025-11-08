import {
  getProfileBackgroundClass,
  getProfileBackgroundDetailClass,
} from "@/constants"
import type { ProfileCategory, ProfileData } from "@/types/types"

type Props = {
  profile: ProfileData
}

function renderCategory(
  category: ProfileCategory,
  cardBackgroundClass: string,
) {
  return (
    <div
      key={category.id}
      className={`flex h-36 flex-col justify-between rounded-lg border border-white/60 p-3 text-center shadow-sm ${cardBackgroundClass}`}
    >
      <span className="font-semibold text-sky-700 text-sm">
        {category.title}
      </span>
      <p className="text-slate-600 text-xs leading-relaxed">
        {category.content || "ここに内容を書いてね"}
      </p>
    </div>
  )
}

export function ProfilePreviewCard(props: Props) {
  const categories = props.profile.categories
  const remainingCount = 4 - categories.length
  const placeholders = remainingCount > 0 ? remainingCount : 0
  const placeholderItems = Array.from({ length: placeholders })
  const backgroundClass = getProfileBackgroundClass(props.profile.backgroundId)
  const categoryCardBackgroundClass = getProfileBackgroundDetailClass(
    props.profile.backgroundId,
  )

  return (
    <div
      className={`mx-auto w-[320px] max-w-full rounded-3xl p-5 shadow-sky-100 shadow-xl sm:w-[360px] ${backgroundClass}`}
    >
      <div className="flex flex-col items-center border-white/70 border-b pb-4 text-center">
        <span className="text-sky-600 text-sm">なまえ</span>
        <h2 className="mt-1 font-semibold text-2xl text-sky-800">
          {props.profile.name || "なまえを書いてね"}
        </h2>
        <p className="mt-3 text-slate-600 text-sm leading-relaxed">
          {props.profile.message || "いまのきもちやひとことを教えてね🫧"}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {categories.map((category) =>
          renderCategory(category, categoryCardBackgroundClass),
        )}
        {placeholderItems.map((_value, index) => (
          <div
            key={`placeholder-${index}`}
            className={`h-36 rounded-lg ${categoryCardBackgroundClass}`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
