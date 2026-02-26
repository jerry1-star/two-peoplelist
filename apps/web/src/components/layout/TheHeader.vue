<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'AI 学习路径', to: '/learning' },
  { name: 'AI 工具库', to: '/tools' },
  { name: '成功案例', to: '/cases' },
  { name: '社群论坛', to: '/forum' },
]

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111022]/80 backdrop-blur-md px-6 md:px-16 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo + Nav -->
      <div class="flex items-center gap-10">
        <RouterLink to="/" class="flex items-center gap-3 text-[#3625f4]">
          <AppIcon name="rocket_launch" class="w-5 h-5" />
          <h2 class="text-xl font-bold tracking-tight text-white">人人都是产品专家</h2>
        </RouterLink>
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-slate-300 hover:text-[#3625f4] transition-colors text-sm font-medium"
            active-class="text-[#3625f4]"
          >
            {{ link.name }}
          </RouterLink>
        </nav>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-4">
        <div class="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-56">
          <AppIcon name="search" class="w-5 h-5" />
          <input
            class="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full ml-2"
            placeholder="搜索 AI 灵感..."
            type="text"
          />
        </div>

        <template v-if="auth.isAuthenticated">
          <RouterLink
            to="/profile"
            class="size-10 rounded-full border border-[#3625f4]/30 overflow-hidden flex items-center justify-center bg-slate-800"
          >
            <img v-if="auth.user?.avatar" :src="auth.user.avatar" :alt="auth.user.nickname" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-[#3625f4] text-xl">person</span>
          </RouterLink>
          <button
            class="text-slate-400 hover:text-white text-sm transition-colors"
            @click="handleLogout"
          >
            退出
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/auth/login"
            class="bg-[#3625f4] hover:bg-[#2d1fd4] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style="box-shadow: 0 0 20px rgba(54, 37, 244, 0.4)"
          >
            登录 / 注册
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
