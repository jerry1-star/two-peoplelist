import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

interface AdminUser {
  id: string
  phone: string
  nickname: string
  avatar?: string
  roles: string[]
}

export const useAdminAuthStore = defineStore('admin-auth', () => {
  const user = ref<AdminUser | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('admin_access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('admin_refresh_token'))

  const isAuthenticated = computed(() => !!accessToken.value)

  function setTokens(tokens: { accessToken: string; refreshToken: string }) {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem('admin_access_token', tokens.accessToken)
    localStorage.setItem('admin_refresh_token', tokens.refreshToken)
  }

  async function login(username: string, password: string) {
    const tokens = await authApi.adminLogin(username, password)
    setTokens(tokens)
  }

  async function refresh() {
    if (!refreshToken.value) throw new Error('No refresh token')
    const tokens = await authApi.refresh(refreshToken.value)
    setTokens(tokens)
  }

  function logout() {
    if (refreshToken.value) {
      authApi.logout(refreshToken.value).catch(() => {})
    }
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
  }

  return { user, accessToken, refreshToken, isAuthenticated, login, refresh, logout }
})
