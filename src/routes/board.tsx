import { useState } from "react"
import { Plus } from "lucide-react"
import { createFileRoute } from "@tanstack/react-router"
import { StickyNote as StickyNoteCard } from "@/components/sticky-note"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { useStickyNotes } from "@/hooks/use-sticky-notes"

export const Route = createFileRoute("/board")({
  component: BoardPage,
})

function BoardPage() {
  const { tasks, createTask, updateTask, deleteTask } = useStickyNotes()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-between gap-4 p-4">
        <div className="pointer-events-auto rounded-full bg-white/80 px-4 py-2 text-sm text-yellow-800 shadow">
          Drag to move, resize from the bottom-right corner, and write directly on each note.
        </div>
        <div className="pointer-events-auto flex gap-2">
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
            onClick={() => setDialogOpen(true)}
          >
            Create sticky
          </Button>
          <Button
            onClick={() => createTask()}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Random placement
          </Button>
        </div>
      </div>

      <div className="relative z-0 h-[200vh] w-[200vw] bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_1px,_transparent_1px)] bg-[length:48px_48px]">
        {tasks.map((task) => (
          <StickyNoteCard
            key={task.id}
            task={task}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={({ title, description }) => {
          createTask({ title, content: description })
        }}
      />
    </div>
  )
}

