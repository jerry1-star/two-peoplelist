export interface PaginationQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T = void> {
  code: number
  message: string
  data: T
}
