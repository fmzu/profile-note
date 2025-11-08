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
        <div className="w-full max-w-lg rounded-3xl bg-white/90 p-8 text-center shadow-xl shadow-sky-100 sm:p-10">
          <h1 className="text-2xl font-semibold text-slate-800">
            {
              "\u30ab\u30c6\u30b4\u30ea\u304c\u307e\u3060\u3048\u3089\u3070\u308c\u3066\u3044\u306a\u3044\u307f\u305f\u3044"
            }
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {
              "\u307e\u305a\u306f\u30ab\u30c6\u30b4\u30ea\u30921\u3064\u4ee5\u4e0a\u3048\u3089\u3093\u3067\u304b\u3089\u5185\u5bb9\u3092\u5165\u529b\u3057\u3066\u307f\u3088\u3046\u306d\u3002"
            }
          </p>
          <Link
            to="/profile/select"
            className="mt-8 inline-block w-full sm:w-auto"
          >
            <Button className="w-full rounded-full bg-sky-500 px-8 py-3 text-white hover:bg-sky-400 sm:w-auto">
              {"\u30ab\u30c6\u30b4\u30ea\u4e00\u89a7\u306b\u3082\u3069\u308b"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500 sm:text-sm">
                Step 2
              </p>
              <h1 className="mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl">
                {
                  "\u30ab\u30fc\u30c9\u306e\u5185\u5bb9\u3092\u6559\u3048\u3066\u306d"
                }
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {
                  "\u306a\u307e\u3048\u3084\u30e1\u30c3\u30bb\u30fc\u30b8\u3001\u30ab\u30c6\u30b4\u30ea\u3054\u3068\u306e\u30a8\u30d4\u30bd\u30fc\u30c9\u3092\u66f8\u3044\u3066\u306d\u3002\u53f3\u5074\u306e\u30d7\u30ec\u30d3\u30e5\u30fc\u306f\u3059\u3050\u66f4\u65b0\u3055\u308c\u308b\u3088\u3002"
                }
              </p>
              <div className="mt-6 space-y-6 sm:mt-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">
                    {"\u306a\u307e\u3048"}
                  </label>
                  <Input
                    value={profile.name}
                    onChange={handleNameChange}
                    placeholder="\u4f8b: \u3055\u304f\u3089"
                    className="rounded-xl border-sky-200 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">
                    {"\u3072\u3068\u3053\u3068\u30e1\u30c3\u30bb\u30fc\u30b8"}
                  </label>
                  <Textarea
                    value={profile.message}
                    onChange={handleMessageChange}
                    placeholder="\u3044\u307e\u306e\u304d\u3082\u3061\u3084\u81ea\u5df1\u7d39\u4ecb\u3092\u66f8\u3044\u3066\u307f\u3088\u3046\ud83e\udee7"
                    className="min-h-28 rounded-xl border-sky-200 bg-white/90"
                  />
                </div>
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-600">
                    {"\u80cc\u666f\u30ab\u30e9\u30fc"}
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
                          <span className="text-xs font-medium text-slate-600">
                            {option.label}
                          </span>
                          {isSelected ? (
                            <span className="text-[10px] text-indigo-500">
                              {"\u3053\u306e\u8272\u306b\u3059\u308b"}
                            </span>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-slate-600">
                    {"\u30ab\u30c6\u30b4\u30ea\u306e\u5185\u5bb9"}
                  </h2>
                  {profile.categories.map((category) => (
                    <div
                      key={category.id}
                      className="space-y-2 rounded-2xl bg-sky-50/70 p-4 shadow-inner shadow-sky-100"
                    >
                      <p className="text-sm font-semibold text-sky-700">
                        {category.title}
                      </p>
                      <Textarea
                        value={category.content}
                        onChange={(event) => {
                          handleCategoryChange(category.id, event)
                        }}
                        placeholder="\u305d\u306e\u30ab\u30c6\u30b4\u30ea\u306e\u300c\u3059\u304d\u300d\u3092\u304f\u308f\u3057\u304f\u66f8\u3044\u3066\u306d"
                        className="min-h-24 rounded-xl border-sky-200 bg-white/90"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link to="/profile/select" className="w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      className="w-full rounded-full text-slate-500 hover:text-slate-700 sm:w-auto"
                    >
                      {"\u30ab\u30c6\u30b4\u30ea\u3092\u8abf\u6574\u3059\u308b"}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleComplete}
                    disabled={!readyToComplete}
                    className="w-full rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 sm:py-3 sm:text-lg"
                  >
                    {"\u3067\u304d\u305f\uff01"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md rounded-3xl bg-gradient-to-br from-sky-200/60 via-sky-100/80 to-white p-5 shadow-lg shadow-sky-100 sm:p-6 lg:mx-0 lg:w-[360px] lg:max-w-none lg:justify-self-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600 sm:text-sm">
                Live Preview
              </p>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                {
                  "\u9078\u3093\u3060\u80cc\u666f\u3068\u30c6\u30ad\u30b9\u30c8\u304c\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u3067\u53cd\u6620\u3055\u308c\u307e\u3059\u3002"
                }
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
