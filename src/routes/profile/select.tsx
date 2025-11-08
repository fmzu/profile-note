import * as React from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { CategoryToggleCard } from "@/components/category-toggle-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProfileStore } from "@/store/profile-context"

export const Route = createFileRoute("/profile/select")({
  component: SelectPage,
})

function SelectPage() {
  const store = useProfileStore()
  const profile = store.profile
  const availableCategories = store.availableCategories
  const navigate = useNavigate()

  const [customTitle, setCustomTitle] = React.useState("")

  const selectedCount = profile.categories.length
  const canSelectMore = selectedCount < 4

  function handleCustomTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCustomTitle(event.target.value)
  }

  function handleCustomTitleSubmit() {
    store.addCustomCategory(customTitle)
    setCustomTitle("")
  }

  function handleNext() {
    if (selectedCount === 0) {
      return
    }
    navigate({ to: "/profile/create" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="rounded-3xl bg-white/80 p-6 shadow-xl shadow-sky-100 backdrop-blur sm:p-10">
          <div className="flex flex-col gap-4 text-center sm:gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500 sm:text-sm">Step 1</p>
            <h1 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
              {"\u3059\u304d\u306a\u30ab\u30c6\u30b4\u30ea\u30924\u3064\u307e\u3067\u3048\u3089\u3093\u3067\u306d"}
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              {"\u30d7\u30ea\u30bb\u30c3\u30c8\u3068\u81ea\u7531\u5165\u529b\u3092\u307e\u305c\u3066\u3082OK\u3002\u3082\u3046\u4e00\u5ea6\u30bf\u30c3\u30d7\u3059\u308b\u3068\u9078\u629e\u3092\u306f\u305a\u305b\u308b\u3088\u3002"}
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                {availableCategories.map(function (option) {
                  const isSelected = profile.categories.some(function (category) {
                    return category.id === option.id
                  })
                  const disableSelection = !isSelected && !canSelectMore
                  return (
                    <CategoryToggleCard
                      key={option.id}
                      title={option.title}
                      selected={isSelected}
                      disabled={disableSelection}
                      onClick={function () {
                        store.toggleCategorySelection(option.id)
                      }}
                    />
                  )
                })}
              </div>
            </div>
            <aside className="flex flex-col justify-between rounded-2xl bg-sky-50/80 p-5 text-left shadow-inner shadow-sky-100 sm:p-6">
              <div>
                <p className="text-sm font-semibold text-sky-700 sm:text-base">あと {4 - selectedCount} こえらべるよ</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {"\u81ea\u5206\u3060\u3051\u306e\u30ab\u30c6\u30b4\u30ea\u540d\u306f\u77ed\u3081\u3060\u3068\u30ab\u30fc\u30c9\u306b\u304d\u308c\u3044\u306b\u304a\u3055\u307e\u308b\u3088\u3002\u697d\u3057\u304f\u8003\u3048\u3066\u307f\u3066\u306d\u3002"}
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 sm:text-sm">
                  {"\u30ab\u30c6\u30b4\u30ea\u3092\u8ffd\u52a0"}
                </label>
                <Input
                  value={customTitle}
                  placeholder="\u4f8b: \u3059\u304d\u306a\u30a2\u30cb\u30e1"
                  onChange={handleCustomTitleChange}
                  className="rounded-xl border-sky-200 bg-white/90"
                />
                <Button
                  type="button"
                  onClick={handleCustomTitleSubmit}
                  disabled={customTitle.trim() === "" || !canSelectMore}
                  className="w-full rounded-xl bg-sky-500 text-white hover:bg-sky-400"
                >
                  追加する
                </Button>
              </div>
            </aside>
          </div>
          <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:gap-6 lg:mt-12">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full rounded-full text-slate-500 hover:text-slate-700">
                {"\u3082\u3069\u308b"}
              </Button>
            </Link>
            <Button
              onClick={handleNext}
              className="w-full rounded-full bg-indigo-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 sm:py-5 sm:text-lg"
              disabled={selectedCount === 0}
            >
              {"\u3064\u304e\u3078\u3059\u3059\u3080"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
