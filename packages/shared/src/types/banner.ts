export enum BannerPosition {
  HOME_TOP = 'HOME_TOP',
  HOME_MIDDLE = 'HOME_MIDDLE',
}

export interface Banner {
  id: string
  imageUrl: string
  link?: string
  position: BannerPosition
  startAt?: string
  endAt?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}
