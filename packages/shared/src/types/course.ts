export interface Course {
  id: string
  title: string
  description: string
  coverUrl?: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface LearningRecord {
  id: string
  userId: string
  courseId: string
  course?: Course
  progress: number
  completedAt?: string
  createdAt: string
  updatedAt: string
}
