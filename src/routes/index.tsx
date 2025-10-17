import { StickyNote } from "lucide-react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/task-model"

const previewTasks: Task[] = [
  {
    id: "preview-1",
    title: "Plan meetup",
    description: "Draft session ideas and invite the core team.",
    completed: false,
    width: 220,
    height: 140,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "preview-2",
    title: "Shopping list",
    description: "Milk, bread, eggs, fruit, and coffee beans.",
    completed: true,
    width: 220,
    height: 140,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
      <div className="mx-auto max-w-4xl py-16 text-center">
        <div className="mb-4 flex items-center justify-center">
          <StickyNote className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Fusen ToDo</h1>
        <p className="mt-3 text-gray-600">
          Arrange draggable and resizable sticky notes on a playful canvas.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/board">
            <Button className="bg-yellow-500 text-white hover:bg-yellow-600">
              Open the board
            </Button>
          </Link>
          <Link to="/canvas">
            <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
              Watch the canvas demo
            </Button>
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {previewTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleComplete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
