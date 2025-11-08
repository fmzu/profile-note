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
              {"すきなカテゴリを4つまでえらんでね"}
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              {"プリセットと自由入力をまぜてもOK。もう一度タップすると選択をはずせるよ。"}
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
                  {"自分だけのカテゴリ名は短めだとカードにきれいにおさまるよ。楽しく考えてみてね。"}
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 sm:text-sm">
                  {"カテゴリを追加"}
                </label>
                <Input
                  value={customTitle}
                  placeholder="例: すきなアニメ"
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
                {"もどる"}
              </Button>
            </Link>
            <Button
              onClick={handleNext}
              className="w-full rounded-full bg-indigo-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 sm:py-5 sm:text-lg"
              disabled={selectedCount === 0}
            >
              {"つぎへすすむ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
