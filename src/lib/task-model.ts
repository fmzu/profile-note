/**
 * Task Model - 付箋スタイルのカードで共有する型。
 */
export type Task = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly completed: boolean
  readonly width: number
  readonly height: number
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * 新規作成時に必要なプロパティ。
 */
export type CreateTaskProps = {
  readonly title: string
  readonly description: string
}

/**
 * 既存タスクを更新する際に利用するプロパティ。
 */
export type UpdateTaskProps = {
  readonly id: string
  readonly title?: string
  readonly description?: string
  readonly completed?: boolean
  readonly width?: number
  readonly height?: number
}

