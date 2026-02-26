import axios from 'axios'
import { useAdminAuthStore } from '@/stores/auth'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

client.interceptors.request.use((config) => {
  const auth = useAdminAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

let refreshing = false
let queue: Array<() => void> = []

client.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (refreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(client(original)))
        })
      }
      refreshing = true
      try {
        const auth = useAdminAuthStore()
        await auth.refresh()
        queue.forEach((fn) => fn())
        queue = []
        return client(original)
      } catch {
        const auth = useAdminAuthStore()
        auth.logout()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(error.response?.data || error)
  },
)

export default client
