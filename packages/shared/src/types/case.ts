export interface Case {
  id: string
  title: string
  summary: string
  content: string
  coverUrl?: string
  authorName: string
  revenue?: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
