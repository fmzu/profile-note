import { useEffect, useRef } from "react"

type Props = {
  onDraw: (context: CanvasRenderingContext2D, time: DOMHighResTimeStamp) => void
}

export function CanvasView(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const context = canvas.getContext("2d")
    if (context === null) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()

    const loop = (time: DOMHighResTimeStamp) => {
      props.onDraw(context, time)
      frameRef.current = window.requestAnimationFrame(loop)
    }

    window.addEventListener("resize", resize)
    frameRef.current = window.requestAnimationFrame(loop)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener("resize", resize)
    }
  }, [props.onDraw])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  )
}
