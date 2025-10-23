import * as React from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProfilePreviewCard } from "@/components/profile-preview-card"
import { useProfileStore } from "@/store/profile-context"

export const Route = createFileRoute("/create")({
  component: CreatePage,
})

function CreatePage() {
  const store = useProfileStore()
  const profile = store.profile
  const navigate = useNavigate()

  if (profile.categories.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-white px-4 sm:px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white/90 p-8 text-center shadow-xl shadow-sky-100 sm:p-10">
          <h1 className="text-2xl font-semibold text-slate-800">カテゴリがまだえらばれていないみたい…</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            もういちどカテゴリをえらんでから入力にすすもうね。
          </p>
          <Link to="/select" className="mt-8 inline-block w-full sm:w-auto">
            <Button className="w-full rounded-full bg-sky-500 px-8 py-3 text-white hover:bg-sky-400 sm:w-auto">
              カテゴリをえらびにいく
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const readyToComplete = React.useMemo(function () {
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

  function handleCategoryChange(categoryId: string, event: React.ChangeEvent<HTMLTextAreaElement>) {
    store.updateCategoryContent({
      categoryId,
      content: event.target.value,
    })
  }

  function handleComplete() {
    navigate({ to: "/done" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-indigo-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="rounded-3xl bg-white/85 p-6 shadow-2xl shadow-sky-100 backdrop-blur sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500 sm:text-sm">Step 2</p>
              <h1 className="mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl">カードの内容をおしえてね</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                入力すると右側のプレビューがすぐに更新されるよ。やさしい言葉で自由に書いてみよう。
              </p>
              <div className="mt-6 space-y-6 sm:mt-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">なまえ</label>
                  <Input
                    value={profile.name}
                    onChange={handleNameChange}
                    placeholder="例: さくら"
                    className="rounded-xl border-sky-200 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">ひとことメッセージ</label>
                  <Textarea
                    value={profile.message}
                    onChange={handleMessageChange}
                    placeholder="どんなことがすきか、今の気持ちなど自由に書いてね🫧"
                    className="min-h-28 rounded-xl border-sky-200 bg-white/90"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-slate-600">カテゴリの内容</h2>
                  {profile.categories.map(function (category) {
                    return (
                      <div key={category.id} className="space-y-2 rounded-2xl bg-sky-50/70 p-4 shadow-inner shadow-sky-100">
                        <p className="text-sm font-semibold text-sky-700">{category.title}</p>
                        <Textarea
                          value={category.content}
                          onChange={function (event) {
                            handleCategoryChange(category.id, event)
                          }}
                          placeholder="ここに好きなことを書いてみよう"
                          className="min-h-24 rounded-xl border-sky-200 bg-white/90"
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link to="/select" className="w-full sm:w-auto">
                    <Button variant="ghost" className="w-full rounded-full text-slate-500 hover:text-slate-700 sm:w-auto">
                      カテゴリを調整する
                    </Button>
                  </Link>
                  <Button
                    onClick={handleComplete}
                    disabled={!readyToComplete}
                    className="w-full rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 sm:py-3 sm:text-lg"
                  >
                    できた！
                  </Button>
                </div>
              </div>
            </section>
            <aside className="rounded-3xl bg-gradient-to-br from-sky-200/60 via-sky-100/80 to-white p-5 shadow-lg shadow-sky-100 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600 sm:text-sm">Live Preview</p>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">入力した内容がリアルタイムでカードに反映されます。</p>
              <div className="mt-4 sm:mt-6">
                <ProfilePreviewCard profile={profile} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
