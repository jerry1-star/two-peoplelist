export interface Tool {
  id: string
  name: string
  description: string
  iconUrl?: string
  link: string
  categoryName: string
  tags: string[]
  isRecommended: boolean
  sortOrder: number
  isPublished: boolean
  createdAt: string
}
