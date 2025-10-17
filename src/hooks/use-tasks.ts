import { useMemo, useState } from "react"
import type { CreateTaskProps, Task, UpdateTaskProps } from "@/lib/task-model"

/**
 * Hook for managing sticky-style tasks in list-oriented UIs.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Write project brief",
      description: "Summarise goals, market research, and competitor review.",
      completed: false,
      width: 288,
      height: 160,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Groceries",
      description: "Milk, bread, eggs, fruit, yoghurt, and coffee beans.",
      completed: false,
      width: 256,
      height: 144,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Reading time",
      description: "Set aside weekends for technical books. Target: three books this month.",
      completed: true,
      width: 224,
      height: 128,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const createTask = (taskProps: CreateTaskProps) => {
    const now = new Date()
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskProps.title,
      description: taskProps.description,
      completed: false,
      width: 256,
      height: 144,
      createdAt: now,
      updatedAt: now,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: UpdateTaskProps) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: updates.title ?? task.title,
              description: updates.description ?? task.description,
              completed: updates.completed ?? task.completed,
              width: updates.width ?? task.width,
              height: updates.height ?? task.height,
              updatedAt: new Date(),
            }
          : task,
      ),
    )
  }

  const resizeTask = (id: string, width: number, height: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              width,
              height,
              updatedAt: new Date(),
            }
          : task,
      ),
    )
  }

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTask = (id: string) => tasks.find((task) => task.id === id)

  const { completedTasks, pendingTasks } = useMemo(() => {
    const completed = tasks.filter((task) => task.completed)
    const pending = tasks.filter((task) => !task.completed)
    return { completedTasks: completed, pendingTasks: pending }
  }, [tasks])

  return {
    tasks,
    completedTasks,
    pendingTasks,
    createTask,
    updateTask,
    toggleComplete,
    resizeTask,
    deleteTask,
    getTask,
  }
}

