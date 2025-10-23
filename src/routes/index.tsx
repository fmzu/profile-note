import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:py-20">
        <div className="w-full max-w-3xl rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-2xl shadow-sky-100 backdrop-blur sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-500 sm:text-sm">🩵 MyProfileNote</p>
          <h1 className="mt-4 text-3xl font-semibold leading-snug text-slate-800 sm:text-4xl">
            わたしの「すき」を、ふわっと可愛いカードでとじこめよう
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            最大4つのカテゴリをえらんで、なまえやひとことを入力するだけ。プレビューはリアルタイムに反映されて、
            できあがったカードはPNGでダウンロードできます。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:flex-wrap">
            <Link to="/select" className="w-full sm:w-auto">
              <Button className="w-full rounded-full bg-sky-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-400 hover:shadow-xl sm:px-8 sm:py-6 sm:text-lg">
                つくってみる
              </Button>
            </Link>
            <div className="w-full rounded-2xl bg-white/70 px-5 py-4 text-left text-xs leading-relaxed text-slate-500 shadow-inner sm:w-auto sm:text-sm">
              <p>フローはかんたん 4 ステップ：</p>
              <p className="mt-1">① カードの説明を読む</p>
              <p>② カテゴリをえらぶ</p>
              <p>③ なまえと内容を入力</p>
              <p>④ 画像として保存</p>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-slate-400 sm:mt-12">
          パステルカラーのやさしいトーンで、安心してプロフィールを届けましょう🫧
        </p>
      </div>
    </div>
  )
}
