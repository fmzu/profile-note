import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import * as React from "react"
import { ProfilePreviewCard } from "@/components/profile-preview-card"
import { Button } from "@/components/ui/button"
import { downloadNodeAsPng } from "@/lib/html-to-image-client"
import { useProfileStore } from "@/store/profile-context"

export const Route = createFileRoute("/profile/done")({
  component: DonePage,
})

function DonePage() {
  const store = useProfileStore()
  const profile = store.profile
  const navigate = useNavigate()
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = React.useState<
    "idle" | "processing" | "success" | "error"
  >("idle")
  const [statusMessage, setStatusMessage] = React.useState("")

  const isIncomplete = React.useMemo(() => {
    if (profile.name.trim() === "") {
      return true
    }
    if (profile.categories.length === 0) {
      return true
    }
    for (const category of profile.categories) {
      if (category.content.trim() === "") {
        return true
      }
    }
    return false
  }, [profile])

  if (isIncomplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 sm:px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white/90 p-8 text-center shadow-xl shadow-indigo-100 sm:p-10">
          <h1 className="text-2xl font-semibold text-slate-800">
            {"\u3042\u3068\u3061\u3087\u3063\u3068\uff01"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {
              "\u30ab\u30fc\u30c9\u3092\u4fdd\u5b58\u3059\u308b\u524d\u306b\u3001\u30ab\u30c6\u30b4\u30ea\u306e\u5185\u5bb9\u3092\u3053\u3068\u3054\u3068\u57cb\u3081\u3066\u304b\u3089\u623b\u3063\u3066\u304d\u3066\u306d\u3002"
            }
          </p>
          <Link
            to="/profile/create"
            className="mt-8 inline-block w-full sm:w-auto"
          >
            <Button className="w-full rounded-full bg-sky-500 px-8 py-3 text-white hover:bg-sky-400 sm:w-auto">
              {"\u7de8\u96c6\u753b\u9762\u306b\u3082\u3069\u308b"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  async function handleDownload() {
    setStatus("processing")
    setStatusMessage(
      "\u753b\u50cf\u3092\u4f5c\u6210\u4e2d\u3060\u3088\u2026\ud83e\udee7",
    )
    try {
      const target = cardRef.current
      const fileName =
        profile.name.trim() === "" ? "my-profile-note" : profile.name
      await downloadNodeAsPng({
        element: target,
        fileName,
      })
      setStatus("success")
      setStatusMessage(
        "\u4fdd\u5b58\u3067\u304d\u305f\u3088\uff01\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3092\u898b\u3066\u307f\u3066\u306d\u3002",
      )
    } catch (error) {
      console.error(error)
      setStatus("error")
      setStatusMessage(
        "\u3054\u3081\u3093\u306d\u3001\u3082\u3046\u4e00\u5ea6\u305f\u3081\u3057\u3066\u307f\u3066\u306d\u3002",
      )
    }
  }

  function handleReset() {
    store.resetProfile()
    navigate({ to: "/profile/select" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-100 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="rounded-3xl bg-white/85 p-6 text-center shadow-2xl shadow-sky-100 backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500 sm:text-sm">
            Step 3
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-800 sm:text-3xl">
            {
              "\u3067\u304d\u305f\uff01\u30ab\u30fc\u30c9\u3092\u4fdd\u5b58\u3057\u3088\u3046"
            }
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {
              "\u30d7\u30ec\u30d3\u30e5\u30fc\u3092PNG\u753b\u50cf\u3068\u3057\u3066\u4fdd\u5b58\u3067\u304d\u307e\u3059\u3002\u4fdd\u5b58\u5f8c\u306f\u65b0\u3057\u3044\u30ab\u30c6\u30b4\u30ea\u3067\u3082\u3046\u3044\u3061\u3069\u59cb\u3081\u307e\u3057\u3087\u3046\u3002"
            }
          </p>
          <div className="mt-8 flex flex-col items-center gap-6 sm:mt-10 sm:gap-8">
            <div ref={cardRef} className="w-full max-w-sm">
              <ProfilePreviewCard profile={profile} />
            </div>
            <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
              <Button
                onClick={handleDownload}
                disabled={status === "processing"}
                className="w-full rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 sm:py-3 sm:text-lg"
              >
                {status === "processing"
                  ? "\u4fdd\u5b58\u4e2d..."
                  : "PNG\u3067\u4fdd\u5b58\u3059\u308b"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full rounded-full border-sky-200 text-sky-600 hover:bg-sky-100 sm:w-auto"
              >
                {"\u3082\u3046\u3044\u3061\u3069\u3064\u304f\u308b"}
              </Button>
            </div>
            <p className="text-sm text-slate-500">{statusMessage}</p>
            <p className="text-xs text-slate-400">
              {
                "\u30d2\u30f3\u30c8: \u5199\u771f\u30d5\u30a9\u30eb\u30c0\u306b\u4fdd\u5b58\u3057\u305f\u308a\u3001\u304a\u53cb\u3060\u3061\u3068\u5206\u304b\u3061\u5408\u304a\u3046\u3002"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
