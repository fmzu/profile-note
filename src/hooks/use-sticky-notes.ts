import { useState } from "react"
import type { Task, TaskProps } from "@/types"

const MIN_WIDTH = 200
const MIN_HEIGHT = 150

function createInitialTask(props: TaskProps): Task {
  const now = new Date()
  return {
    id: crypto.randomUUID(),
    title: props.title ?? "",
    content: props.content ?? "",
    width: props.width ?? 240,
    height: props.height ?? 160,
    x: props.x ?? 100,
    y: props.y ?? 100,
    completed: props.completed ?? false,
    createdAt: now,
    updatedAt: now,
  }
}

function randomPosition(): { x: number; y: number } {
  if (typeof window === "undefined") {
    return { x: 120, y: 120 }
  }
  const baseX = window.innerWidth * 0.25
  const baseY = window.innerHeight * 0.2
  return {
    x: Math.floor(baseX + Math.random() * 240),
    y: Math.floor(baseY + Math.random() * 160),
  }
}

export function useStickyNotes() {
  const [tasks, setTasks] = useState<Task[]>([
    createInitialTask({
      title: "Welcome note",
      content: "Drag me around and resize from the bottom-right corner.",
      x: 80,
      y: 120,
      width: 260,
      height: 180,
    }),
    createInitialTask({
      title: "Important task",
      content: "Pin focus items here to keep them in view.",
      x: 400,
      y: 180,
      width: 280,
      height: 200,
    }),
    createInitialTask({
      title: "Idea bucket",
      content: "Capture quick thoughts so they do not slip away.",
      x: 700,
      y: 260,
      width: 220,
      height: 160,
    }),
  ])

  const createTask = (props?: TaskProps) => {
    const now = new Date()
    const position =
      props?.x !== undefined && props?.y !== undefined
        ? { x: props.x, y: props.y }
        : randomPosition()
    const task: Task = {
      id: crypto.randomUUID(),
      title: props?.title ?? "New sticky note",
      content: props?.content ?? "",
      width: Math.max(props?.width ?? 240, MIN_WIDTH),
      height: Math.max(props?.height ?? 160, MIN_HEIGHT),
      x: position.x,
      y: position.y,
      completed: props?.completed ?? false,
      createdAt: now,
      updatedAt: now,
    }
    setTasks((prev) => [...prev, task])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              width: Math.max(updates.width ?? task.width, MIN_WIDTH),
              height: Math.max(updates.height ?? task.height, MIN_HEIGHT),
              updatedAt: new Date(),
            }
          : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return { tasks, createTask, updateTask, deleteTask }
}

