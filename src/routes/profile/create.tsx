import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import * as React from "react"
import { ProfilePreviewCard } from "@/components/profile-preview-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProfileStore } from "@/store/profile-context"

export const Route = createFileRoute("/profile/create")({
  component: CreatePage,
})

function CreatePage() {
  const store = useProfileStore()
  const profile = store.profile
  const backgroundOptions = store.backgroundOptions
  const navigate = useNavigate()

  if (profile.categories.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-white px-4 sm:px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white/90 p-8 text-center shadow-sky-100 shadow-xl sm:p-10">
          <h1 className="font-semibold text-2xl text-slate-800">
            {"カテゴリがまだえらばれていないみたい"}
          </h1>
          <p className="mt-4 text-slate-600 text-sm leading-relaxed">
            {"まずはカテゴリを1つ以上えらんでから内容を入力してみようね。"}
          </p>
          <Link
            to="/profile/select"
            className="mt-8 inline-block w-full sm:w-auto"
          >
            <Button className="w-full rounded-full bg-sky-500 px-8 py-3 text-white hover:bg-sky-400 sm:w-auto">
              {"カテゴリ一覧にもどる"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const readyToComplete = React.useMemo(() => {
    if (profile.name.trim() === "") {
      return false
    }
    for (const category of profile.categories) {
      if (category.content.trim() === "") {
        return false
      }
    }
    return true
  }, [profile])

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    store.updateProfileName(event.target.value)
  }

  function handleMessageChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    store.updateProfileMessage(event.target.value)
  }

  function handleCategoryChange(
    categoryId: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    store.updateCategoryContent({
      categoryId,
      content: event.target.value,
    })
  }

  function handleBackgroundSelect(backgroundId: string) {
    store.updateBackgroundId(backgroundId)
  }

  function handleComplete() {
    navigate({ to: "/profile/done" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-indigo-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="rounded-3xl bg-white/85 p-6 shadow-2xl shadow-sky-100 backdrop-blur sm:p-10">
          <div className="mx-auto grid max-w-[1260px] gap-8 lg:grid-cols-[minmax(0,1.6fr)_360px] lg:gap-10">
            <div className="w-full max-w-3xl lg:justify-self-start">
              <p className="font-semibold text-sky-500 text-xs uppercase tracking-[0.35em] sm:text-sm">
                Step 2
              </p>
              <h1 className="mt-4 font-semibold text-2xl text-slate-800 sm:text-3xl">
                {"カードの内容を教えてね"}
              </h1>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed sm:text-base">
                {
                  "なまえやメッセージ、カテゴリごとのエピソードを書いてね。右側のプレビューはすぐ更新されるよ。"
                }
              </p>
              <div className="mt-6 space-y-6 sm:mt-8">
                <div className="space-y-2">
                  <p className="font-semibold text-slate-600 text-sm">
                    {"なまえ"}
                  </p>
                  <Input
                    value={profile.name}
                    onChange={handleNameChange}
                    placeholder="例: さくら"
                    className="rounded-xl border-sky-200 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-slate-600 text-sm">
                    {"ひとことメッセージ"}
                  </p>
                  <Textarea
                    value={profile.message}
                    onChange={handleMessageChange}
                    placeholder="いまのきもちや自己紹介を書いてみよう🫧"
                    className="min-h-28 rounded-xl border-sky-200 bg-white/90"
                  />
                </div>
                <div className="space-y-3">
                  <h2 className="font-semibold text-slate-600 text-sm">
                    {"背景カラー"}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {backgroundOptions.map((option) => {
                      const isSelected = option.id === profile.backgroundId
                      const baseButtonClass =
                        "flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      const activeClass = isSelected
                        ? "border-indigo-400 ring-2 ring-indigo-200"
                        : "border-transparent ring-0"
                      const buttonClass = `${baseButtonClass} ${activeClass}`
                      const sampleClass = `${option.sampleClass} h-14 w-full rounded-xl shadow-sm`
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            handleBackgroundSelect(option.id)
                          }}
                          className={buttonClass}
                        >
                          <div className={sampleClass} aria-hidden />
                          <span className="font-medium text-slate-600 text-xs">
                            {option.label}
                          </span>
                          {isSelected ? (
                            <span className="text-[10px] text-indigo-500">
                              {"この色にする"}
                            </span>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="font-semibold text-slate-600 text-sm">
                    {"カテゴリの内容"}
                  </h2>
                  {profile.categories.map((category) => (
                    <div
                      key={category.id}
                      className="space-y-2 rounded-2xl bg-sky-50/70 p-4 shadow-inner shadow-sky-100"
                    >
                      <p className="font-semibold text-sky-700 text-sm">
                        {category.title}
                      </p>
                      <Textarea
                        value={category.content}
                        onChange={(event) => {
                          handleCategoryChange(category.id, event)
                        }}
                        placeholder="そのカテゴリの「すき」をくわしく書いてね"
                        className="min-h-24 rounded-xl border-sky-200 bg-white/90"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 border-slate-100 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link to="/profile/select" className="w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      className="w-full rounded-full text-slate-500 hover:text-slate-700 sm:w-auto"
                    >
                      {"カテゴリを調整する"}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleComplete}
                    disabled={!readyToComplete}
                    className="w-full rounded-full bg-indigo-500 px-6 py-3 font-semibold text-base text-white shadow-indigo-200 shadow-lg hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 sm:py-3 sm:text-lg"
                  >
                    {"できた！"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md rounded-3xl bg-gradient-to-br from-sky-200/60 via-sky-100/80 to-white p-5 shadow-lg shadow-sky-100 sm:p-6 lg:mx-0 lg:w-[360px] lg:max-w-none lg:justify-self-center">
              <p className="font-semibold text-sky-600 text-xs uppercase tracking-[0.35em] sm:text-sm">
                Live Preview
              </p>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm">
                {"選んだ背景とテキストがリアルタイムで反映されます。"}
              </p>
              <div className="mt-4 flex justify-center sm:mt-6">
                <ProfilePreviewCard profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
