export interface SendCodeRequest {
  phone: string
}

export interface LoginRequest {
  phone: string
  code: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}
