import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl shadow-sky-100 backdrop-blur sm:p-12">
          <h1 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{"ミニアプリを選んでね"}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {"好きな体験を選んでスタートしましょう。"}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-sky-100 bg-sky-50/80 p-6 text-left shadow-md shadow-sky-100">
              <h2 className="text-lg font-semibold text-slate-800">{"プロフィール帳アプリ"}</h2>
              <p className="mt-2 text-sm text-slate-600">{"カテゴリを選んでカードを作れるよ"}</p>
              <Link to="/profile" className="mt-auto">
                <Button className="mt-4 w-full rounded-full bg-sky-500 text-white hover:bg-sky-400">{"開く"}</Button>
              </Link>
            </div>
            <div className="flex flex-col rounded-2xl border border-rose-100 bg-rose-50/80 p-6 text-left shadow-md shadow-rose-100">
              <h2 className="text-lg font-semibold text-slate-800">{"ログインボーナスアプリ"}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {"平日のログインで💮を集めて、自分で決めたご褒美メッセージを受け取ろう"}
              </p>
              <Link to="/login-bonus" className="mt-auto">
                <Button className="mt-4 w-full rounded-full bg-rose-500 text-white hover:bg-rose-400">
                  {"開く"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
