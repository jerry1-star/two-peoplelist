export enum PostStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface PostAuthor {
  id: string
  nickname: string
  avatar?: string
}

export interface Post {
  id: string
  title: string
  content: string
  status: PostStatus
  authorId: string
  author: PostAuthor
  categoryId: string
  categoryName?: string
  viewCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  author: PostAuthor
  postId: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  sortOrder: number
}
