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
            {"あとちょっと！"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {
              "カードを保存する前に、カテゴリの内容をことごと埋めてから戻ってきてね。"
            }
          </p>
          <Link
            to="/profile/create"
            className="mt-8 inline-block w-full sm:w-auto"
          >
            <Button className="w-full rounded-full bg-sky-500 px-8 py-3 text-white hover:bg-sky-400 sm:w-auto">
              {"編集画面にもどる"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  async function handleDownload() {
    setStatus("processing")
    setStatusMessage(
      "画像を作成中だよ…🫧",
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
        "保存できたよ！ダウンロードを見てみてね。",
      )
    } catch (error) {
      console.error(error)
      setStatus("error")
      setStatusMessage(
        "ごめんね、もう一度ためしてみてね。",
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
              "できた！カードを保存しよう"
            }
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {
              "プレビューをPNG画像として保存できます。保存後は新しいカテゴリでもういちど始めましょう。"
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
                  ? "保存中..."
                  : "PNGで保存する"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full rounded-full border-sky-200 text-sky-600 hover:bg-sky-100 sm:w-auto"
              >
                {"もういちどつくる"}
              </Button>
            </div>
            <p className="text-sm text-slate-500">{statusMessage}</p>
            <p className="text-xs text-slate-400">
              {
                "ヒント: 写真フォルダに保存したり、お友だちと分かち合おう。"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
