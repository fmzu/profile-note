import { useCallback, useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CanvasView } from "@/components/canvas-view"
import { Card } from "@/components/ui/card"

type FloatingNote = {
  readonly x: number
  readonly y: number
  readonly size: number
  readonly color: string
  readonly drift: number
}

const COLORS = ["#FDE68A", "#FECACA", "#BFDBFE", "#C4B5FD", "#FDBA74"]

function useFloatingNotes() {
  return useMemo<FloatingNote[]>(() => {
    return Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 80 + Math.random() * 70,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: (Math.random() - 0.5) * 0.0008,
    }))
  }, [])
}

export const Route = createFileRoute("/canvas")({
  component: CanvasRoute,
})

function CanvasRoute() {
  const notes = useFloatingNotes()

  const handleDraw = useCallback(
    (context: CanvasRenderingContext2D, time: number) => {
      const { canvas } = context
      const width = canvas.width
      const height = canvas.height

      context.clearRect(0, 0, width, height)

      const gradient = context.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#fff7ed")
      gradient.addColorStop(1, "#fde68a")

      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      notes.forEach((note, index) => {
        const t = time * 0.0003 + index
        const x = note.x * width + Math.sin(t) * 40
        const y = note.y * height + Math.cos(t * 0.8) * 40

        context.save()
        context.translate(x, y)
        context.rotate(Math.sin(t) * 0.1)
        context.fillStyle = note.color
        context.shadowColor = "rgba(0,0,0,0.15)"
        context.shadowBlur = 12
        context.fillRect(-note.size / 2, -note.size / 2, note.size, note.size)

        context.fillStyle = "rgba(0,0,0,0.12)"
        context.fillRect(-note.size / 2, -note.size / 2, note.size, 12)
        context.restore()
      })
    },
    [notes],
  )

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-amber-50">
      <CanvasView onDraw={handleDraw} />
      <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center">
        <Card className="pointer-events-auto bg-white/80 px-6 py-4 shadow-lg backdrop-blur">
          <div className="text-center text-sm text-gray-700">
            Watch sticky notes drift across the canvas—your cursor sends subtle ripples through the swarm.
          </div>
        </Card>
      </div>
    </div>
  )
}

