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
          <h1 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{"\u30df\u30cb\u30a2\u30d7\u30ea\u3092\u9078\u3093\u3067\u306d"}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {"\u597d\u304d\u306a\u4f53\u9a13\u3092\u9078\u3093\u3067\u30b9\u30bf\u30fc\u30c8\u3057\u307e\u3057\u3087\u3046\u3002"}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-sky-100 bg-sky-50/80 p-6 text-left shadow-md shadow-sky-100">
              <h2 className="text-lg font-semibold text-slate-800">{"\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u5e33\u30a2\u30d7\u30ea"}</h2>
              <p className="mt-2 text-sm text-slate-600">{"\u30ab\u30c6\u30b4\u30ea\u3092\u9078\u3093\u3067\u30ab\u30fc\u30c9\u3092\u4f5c\u308c\u308b\u3088"}</p>
              <Link to="/profile" className="mt-auto">
                <Button className="mt-4 w-full rounded-full bg-sky-500 text-white hover:bg-sky-400">{"\u958b\u304f"}</Button>
              </Link>
            </div>
            <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/80 p-6 text-left shadow-md shadow-slate-100">
              <h2 className="text-lg font-semibold text-slate-500">
                {"\u30ed\u30b0\u30a4\u30f3\u30dc\u30fc\u30ca\u30b9\u8a2d\u5b9a\uff08\u6e96\u5099\u4e2d\uff09"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {"\u65e5\u8ab2\u306e\u30dc\u30fc\u30ca\u30b9\u6f14\u51fa\u3092\u8a2d\u5b9a\u3067\u304d\u308b\u30a2\u30d7\u30ea\u3092\u4f5c\u6210\u4e88\u5b9a\u3067\u3059"}
              </p>
              <Button disabled variant="outline" className="mt-auto rounded-full">
                {"\u8fd1\u65e5\u516c\u958b"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
