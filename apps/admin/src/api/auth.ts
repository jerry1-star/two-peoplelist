import client from './client'

export const authApi = {
  adminLogin: (username: string, password: string) =>
    client.post<never, { accessToken: string; refreshToken: string }>('/auth/admin-login', { username, password }),

  refresh: (refreshToken: string) =>
    client.post<never, { accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    client.post('/auth/logout', { refreshToken }),
}
