export type Task = {
  readonly id: string
  readonly title: string
  readonly content: string
  readonly width: number
  readonly height: number
  readonly x: number
  readonly y: number
  readonly completed: boolean
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type TaskProps = {
  readonly title?: string
  readonly content?: string
  readonly width?: number
  readonly height?: number
  readonly x?: number
  readonly y?: number
  readonly completed?: boolean
}
