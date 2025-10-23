import { useEffect, useId, useState } from "react"
import { StickyNote } from "lucide-react"
import type { CreateTaskProps, Task } from "@/lib/task-model"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TaskDialogProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly onSave: (taskProps: CreateTaskProps) => void
  readonly task?: Task
}

/**
 * Dialog for composing or editing a sticky-style task.
 */
export function TaskDialog(props: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (props.task) {
      setTitle(props.task.title)
      setDescription(props.task.description)
    } else {
      setTitle("")
      setDescription("")
    }
  }, [props.task, props.open])

  const titleId = useId()
  const descriptionId = useId()

  const handleSave = () => {
    props.onSave({ title, description })
    props.onClose()
  }

  const handleClose = () => {
    props.onClose()
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <StickyNote className="h-5 w-5 text-yellow-600" />
            {props.task ? "Edit sticky task" : "Add sticky task"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={titleId} className="text-right font-medium">
              Title
            </Label>
            <Input
              id={titleId}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="col-span-3"
              placeholder="What should be tackled?"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor={descriptionId} className="mt-2 text-right font-medium">
              Notes
            </Label>
            <Textarea
              id={descriptionId}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="col-span-3"
              placeholder="Add helpful context..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            {props.task ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

