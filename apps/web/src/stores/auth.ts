import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '@renren/shared'
import client from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshTokenVal = ref<string | null>(localStorage.getItem('refresh_token'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.roles?.some((r) => ['super_admin', 'admin'].includes(r)) ?? false)

  async function fetchProfile() {
    if (!accessToken.value) return
    try {
      const profile = await client.get<void, UserProfile>('/users/me')
      user.value = profile
    } catch {
      // token invalid
    }
  }

  async function login(phone: string, code: string) {
    const tokens = await client.post<void, { accessToken: string; refreshToken: string }>('/auth/login', { phone, code })
    accessToken.value = tokens.accessToken
    refreshTokenVal.value = tokens.refreshToken
    localStorage.setItem('access_token', tokens.accessToken)
    localStorage.setItem('refresh_token', tokens.refreshToken)
    await fetchProfile()
  }

  async function sendCode(phone: string) {
    await client.post('/auth/send-code', { phone })
  }

  async function logout() {
    if (refreshTokenVal.value) {
      await client.post('/auth/logout', { refreshToken: refreshTokenVal.value }).catch(() => {})
    }
    accessToken.value = null
    refreshTokenVal.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return { user, accessToken, isAuthenticated, isAdmin, login, logout, sendCode, fetchProfile }
})
