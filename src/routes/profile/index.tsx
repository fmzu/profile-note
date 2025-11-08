import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/profile/")({
  component: ProfileHomePage,
})

function ProfileHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:py-20">
        <div className="w-full max-w-3xl rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-2xl shadow-sky-100 backdrop-blur sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-500 sm:text-sm">🩵 MyProfileNote</p>
          <h1 className="mt-4 text-3xl font-semibold leading-snug text-slate-800 sm:text-4xl">
            {"\u308f\u305f\u3057\u306e\u300c\u3059\u304d\u300d\u3092\u3001\u3075\u308f\u3063\u3068\u53ef\u611b\u3044\u30ab\u30fc\u30c9\u306b\u3068\u3058\u3053\u3081\u3088\u3046"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {
              "\u6700\u59274\u3064\u306e\u30ab\u30c6\u30b4\u30ea\u3092\u3048\u3089\u3093\u3067\u3001\u306a\u307e\u3048\u3068\u3072\u3068\u3053\u3068\u3092\u5165\u529b\u3059\u308b\u3060\u3051\u3002\u30d7\u30ec\u30d3\u30e5\u30fc\u306f\u305d\u306e\u5834\u3067\u53cd\u6620\u3055\u308c\u3066\u3001\u3067\u304d\u3042\u304c\u3063\u305f\u30ab\u30fc\u30c9\u306fPNG\u3067\u4fdd\u5b58\u3067\u304d\u307e\u3059\u3002"
            }
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:flex-wrap">
            <Link to="/profile/select" className="w-full sm:w-auto">
              <Button className="w-full rounded-full bg-sky-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-400 hover:shadow-xl sm:px-8 sm:py-6 sm:text-lg">
                {"\u3064\u304f\u3063\u3066\u307f\u308b"}
              </Button>
            </Link>
            <div className="w-full rounded-2xl bg-white/70 px-5 py-4 text-left text-xs leading-relaxed text-slate-500 shadow-inner sm:w-auto sm:text-sm">
              <p>{"\u304b\u3093\u305f\u30934\u30b9\u30c6\u30c3\u30d7\uff1a"}</p>
              <p className="mt-1">{"\u2460 \u30ab\u30fc\u30c9\u306e\u8aac\u660e\u3092\u8aad\u3080"}</p>
              <p>{"\u2461 \u30ab\u30c6\u30b4\u30ea\u3092\u3048\u3089\u3076"}</p>
              <p>{"\u2462 \u306a\u307e\u3048\u3068\u5185\u5bb9\u3092\u66f8\u304f"}</p>
              <p>{"\u2463 \u753b\u50cf\u3068\u3057\u3066\u4fdd\u5b58\u3059\u308b"}</p>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-slate-400 sm:mt-12">
          {"\u3084\u3055\u3057\u3044\u30d1\u30b9\u30c6\u30eb\u30ab\u30e9\u30fc\u3067\u3001\u5b89\u5fc3\u3057\u3066\u300c\u3059\u304d\u300d\u3092\u5c4a\u3051\u3088\u3046\ud83e\udee7"}
        </p>
      </div>
    </div>
  )
}
