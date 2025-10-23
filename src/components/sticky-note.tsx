import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GripVertical, X } from "lucide-react"
import type { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type StickyNoteProps = {
  readonly task: Task
  readonly onUpdate: (id: string, updates: Partial<Task>) => void
  readonly onDelete: (id: string) => void
}

/**
 * Sticky note card with drag and resize support.
 */
export function StickyNote(props: StickyNoteProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const isDraggingRef = useRef(false)
  const isResizingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const resizeStartRef = useRef({ width: 0, height: 0, x: 0, y: 0 })
  const activePointerIdRef = useRef<number | null>(null)

  const noteRef = useRef<HTMLDivElement | null>(null)
  const resizeHandleRef = useRef<HTMLDivElement | null>(null)

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (isDraggingRef.current) {
        const newX = event.clientX - dragOffsetRef.current.x
        const newY = event.clientY - dragOffsetRef.current.y
        props.onUpdate(props.task.id, { x: newX, y: newY })
      }

      if (isResizingRef.current) {
        const deltaX = event.clientX - resizeStartRef.current.x
        const deltaY = event.clientY - resizeStartRef.current.y
        const newWidth = Math.max(200, resizeStartRef.current.width + deltaX)
        const newHeight = Math.max(150, resizeStartRef.current.height + deltaY)
        props.onUpdate(props.task.id, {
          width: newWidth,
          height: newHeight,
        })
      }
    },
    [props],
  )

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (
      activePointerIdRef.current !== null &&
      activePointerIdRef.current === event.pointerId
    ) {
      noteRef.current?.releasePointerCapture?.(activePointerIdRef.current)
      activePointerIdRef.current = null
    }
    if (!isDraggingRef.current && !isResizingRef.current) return
    isDraggingRef.current = false
    isResizingRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  const handleNotePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      if (event.target === resizeHandleRef.current) return
      if (event.pointerType === "touch") {
        event.preventDefault()
      }
      noteRef.current = event.currentTarget
      noteRef.current?.setPointerCapture(event.pointerId)
      activePointerIdRef.current = event.pointerId
      isDraggingRef.current = true
      dragOffsetRef.current = {
        x: event.clientX - props.task.x,
        y: event.clientY - props.task.y,
      }
    },
    [props.task.x, props.task.y],
  )

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
      if (event.button !== 0) return
      noteRef.current = event.currentTarget.parentElement as HTMLDivElement
      noteRef.current?.setPointerCapture(event.pointerId)
      activePointerIdRef.current = event.pointerId
      isResizingRef.current = true
      resizeStartRef.current = {
        width: props.task.width,
        height: props.task.height,
        x: event.clientX,
        y: event.clientY,
      }
    },
    [props.task.height, props.task.width],
  )

  const rotationClass = useMemo(() => {
    return Math.random() > 0.5 ? "rotate-1" : "-rotate-1"
  }, [])

  return (
    <Card
      ref={noteRef}
      className={`absolute select-none border border-yellow-300 bg-yellow-100 text-gray-800 shadow-lg transition-shadow ${rotationClass}`}
      style={{
        left: props.task.x,
        top: props.task.y,
        width: props.task.width,
        height: props.task.height,
        minWidth: 200,
        minHeight: 150,
        touchAction: "none",
      }}
      onPointerDown={handleNotePointerDown}
    >
      <div className="flex h-full flex-col p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-700">
            <GripVertical className="h-4 w-4 opacity-70" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
            onClick={(event) => {
              event.stopPropagation()
              props.onDelete(props.task.id)
            }}
            aria-label="Delete sticky note"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-2">
          {isEditingTitle ? (
            <Input
              value={props.task.title}
              onChange={(event) =>
                props.onUpdate(props.task.id, { title: event.target.value })
              }
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setIsEditingTitle(false)
              }}
              className="text-sm font-semibold"
              placeholder="Untitled sticky"
              autoFocus
            />
          ) : (
            <button
              type="button"
              className="w-full cursor-text truncate text-left text-sm font-semibold hover:text-yellow-700"
              onClick={(event) => {
                event.stopPropagation()
                setIsEditingTitle(true)
              }}
            >
              {props.task.title || "Untitled sticky"}
            </button>
          )}
        </div>

        <Textarea
          value={props.task.content}
          onChange={(event) =>
            props.onUpdate(props.task.id, { content: event.target.value })
          }
          onPointerDown={(event) => event.stopPropagation()}
          placeholder="Write a quick note..."
          className="flex-1 resize-none border-none bg-transparent p-0 text-xs focus-visible:ring-0"
        />

        <div
          ref={resizeHandleRef}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onPointerDown={handleResizePointerDown}
        >
          <div className="h-full w-full rounded-tl bg-yellow-600/60" />
        </div>
      </div>
    </Card>
  )
}

