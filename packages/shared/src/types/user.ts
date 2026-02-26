export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export interface UserProfile {
  id: string
  phone: string
  nickname: string
  avatar?: string
  bio?: string
  status: UserStatus
  createdAt: string
  roles: string[]
}
