import client from './client'
import type { TokenPair } from '@renren/shared'

export const authApi = {
  sendCode: (phone: string) =>
    client.post<void, { message: string }>('/auth/send-code', { phone }),
  login: (phone: string, code: string) =>
    client.post<void, { data: TokenPair }>('/auth/login', { phone, code }),
  refresh: (refreshToken: string) =>
    client.post<void, { data: TokenPair }>('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string) =>
    client.post('/auth/logout', { refreshToken }),
}
