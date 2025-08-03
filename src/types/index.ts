export interface MarkdownContent {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  name: string
  count: number
  lastUsed: Date
}

export interface HistoryItem {
  id: string
  title: string
  previewText: string
  tags: string[]
  date: Date
}
