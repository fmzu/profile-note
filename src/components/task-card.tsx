import { useMemo } from "react"
import { Edit, GripVertical, Trash2 } from "lucide-react"
import type { Task } from "@/lib/task-model"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

type TaskCardProps = {
  readonly task: Task
  readonly onEdit: (task: Task) => void
  readonly onDelete: (id: string) => void
  readonly onToggleComplete: (id: string) => void
}

/**
 * Sticky-note inspired task card.
 */
export function TaskCard(props: TaskCardProps) {
  const { task } = props

  const initialRotation = useMemo(() => {
    const max = 4
    const rotation = Math.random() * max - max / 2
    return `rotate(${rotation.toFixed(1)}deg)`
  }, [])

  return (
    <Card
      className={`relative cursor-pointer overflow-hidden border-yellow-300 bg-yellow-100 shadow-xl transition-transform ${task.completed ? "opacity-60 grayscale" : "hover:-rotate-1 hover:scale-105"}`}
      style={{
        width: `${task.width}px`,
        height: `${task.height}px`,
        transform: initialRotation,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
      }}
    >
      <CardHeader className="relative pb-2">
        <div className="absolute left-2 top-2 opacity-40">
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
        <div className="ml-6 flex items-start justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => props.onToggleComplete(task.id)}
              className="mt-1"
            />
            <CardTitle className={`text-sm font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
              {task.title}
            </CardTitle>
          </div>
          <div className="ml-2 flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-700 hover:bg-white/50"
              onClick={(event) => {
                event.stopPropagation()
                props.onEdit(task)
              }}
              aria-label="Edit task"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-500 hover:bg-white/50 hover:text-red-600"
              onClick={(event) => {
                event.stopPropagation()
                props.onDelete(task.id)
              }}
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <CardContent className="ml-6 pt-1">
          <CardDescription className={`text-xs leading-relaxed ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
            {task.description}
          </CardDescription>
        </CardContent>
      </CardHeader>
    </Card>
  )
}
