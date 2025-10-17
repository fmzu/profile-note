import { useEffect, useMemo, useRef, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"

const COLORS = [
  "bg-green-200 border-green-400",
  "bg-blue-200 border-blue-400",
  "bg-purple-200 border-purple-400",
  "bg-pink-200 border-pink-400",
  "bg-yellow-200 border-yellow-400",
]

function useRandomColor() {
  return useMemo(
    () => COLORS[Math.floor(Math.random() * COLORS.length)],
    [],
  )
}

type SlugCardProps = {
  readonly name: string
}

function SlugCard(props: SlugCardProps) {
  const [scale, setScale] = useState(1)
  const [shrinking, setShrinking] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const color = useRandomColor()
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current)
        animationRef.current = null
      }
    }
  }, [])

  const shrink = (type: "salt" | "sugar") => {
    if (shrinking) return

    setMessage(
      type === "salt" ? "Salt makes me wilt..." : "Sugar drains my energy...",
    )
    setShrinking(true)

    let current = 1
    animationRef.current = window.setInterval(() => {
      current -= 0.02
      if (current <= 0.1) {
        current = 0.1
        if (animationRef.current !== null) {
          window.clearInterval(animationRef.current)
          animationRef.current = null
        }
        setShrinking(false)
      }
      setScale(Number(current.toFixed(2)))
    }, 30)
  }

  const reset = () => {
    setScale(1)
    setShrinking(false)
    setMessage(null)
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current)
      animationRef.current = null
    }
  }

  return (
    <div
      className={`flex h-32 w-56 flex-col items-center justify-center gap-3 rounded-xl border-2 shadow-lg transition-all duration-150 ${color}`}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="text-lg font-bold">{props.name}</div>
      <div className="flex gap-2">
        <button
          className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={() => shrink("salt")}
          disabled={shrinking}
        >
          Sprinkle salt
        </button>
        <button
          className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={() => shrink("sugar")}
          disabled={shrinking}
        >
          Add sugar
        </button>
        <button
          className="rounded bg-blue-100 px-2 py-1 text-sm hover:bg-blue-200"
          onClick={reset}
        >
          Reset size
        </button>
      </div>
      {message && <div className="text-xs text-gray-600">{message}</div>}
    </div>
  )
}

function SlugGame() {
  const [slugs] = useState(["Slug A", "Slug B", "Slug C"])

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-green-50 to-blue-100 py-10">
      <h1 className="mb-6 text-3xl font-bold text-green-800">Slug Playground</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {slugs.map((name) => (
          <SlugCard key={name} name={name} />
        ))}
      </div>
      <div className="mt-8 text-sm text-gray-500">
        A whimsical demo: salt and sugar shrink the slugs until you reset them.
      </div>
    </div>
  )
}

export const Route = createFileRoute("/slug")({
  component: SlugGame,
})

export default SlugGame

