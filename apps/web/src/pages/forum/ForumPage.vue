<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import client from '@/api/client'
import type { Post, Category } from '@renren/shared'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const activeCategory = ref('')
const loading = ref(true)
const page = ref(1)
const total = ref(0)

async function loadPosts() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: String(page.value), pageSize: '20' })
    if (activeCategory.value) params.set('categoryId', activeCategory.value)
    const res = await client.get<void, { data: Post[]; total: number }>(`/posts?${params}`)
    posts.value = res.data ?? []
    total.value = res.total ?? 0
  } catch { /* ignore */ }
  finally { loading.value = false }
}

onMounted(async () => {
  const catRes = await client.get<void, Category[]>('/posts/categories').catch(() => ([]))
  categories.value = catRes ?? []
  loadPosts()
})

function handleCategoryChange(id: string) {
  activeCategory.value = id
  page.value = 1
  loadPosts()
}

function handleCreatePost() {
  if (!auth.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/forum/create' } })
  } else {
    router.push('/forum/create')
  }
}

function formatTime(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <div class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-4xl font-black text-white mb-2">社群论坛</h1>
        <p class="text-slate-400">与 50,000+ AI 创作者交流实操经验</p>
      </div>
      <button
        class="bg-[#3625f4] hover:bg-[#2d1fd4] text-white px-6 py-3 rounded-xl font-bold transition-all neon-glow flex items-center gap-2"
        @click="handleCreatePost"
      >
        <AppIcon name="edit" class="w-5 h-5" /> 发帖
      </button>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-3 flex-wrap mb-8">
      <button
        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all', !activeCategory ? 'bg-[#3625f4] text-white neon-glow' : 'glass-card text-slate-300 hover:text-white']"
        @click="handleCategoryChange('')"
      >全部</button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all', activeCategory === cat.id ? 'bg-[#3625f4] text-white neon-glow' : 'glass-card text-slate-300 hover:text-white']"
        @click="handleCategoryChange(cat.id)"
      >{{ cat.name }}</button>
    </div>

    <!-- Post List -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="glass-card rounded-xl p-6 animate-pulse">
        <div class="h-5 bg-white/5 rounded mb-3 w-2/3"></div>
        <div class="h-3 bg-white/5 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="posts.length" class="space-y-4">
      <RouterLink
        v-for="post in posts"
        :key="post.id"
        :to="`/forum/${post.id}`"
        class="glass-card rounded-xl p-6 block group hover:border-[#3625f4]/50 transition-all"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white group-hover:text-[#3625f4] transition-colors mb-2 truncate">{{ post.title }}</h3>
            <p class="text-slate-400 text-sm line-clamp-2">{{ post.content }}</p>
          </div>
          <div class="flex-shrink-0 text-right">
            <div v-if="post.categoryName" class="text-xs text-[#3625f4] font-bold mb-1">{{ post.categoryName }}</div>
          </div>
        </div>
        <div class="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span class="flex items-center gap-1">
            <AppIcon name="person" class="w-5 h-5" />
            {{ post.author?.nickname ?? '匿名' }}
          </span>
          <span class="flex items-center gap-1">
            <AppIcon name="visibility" class="w-5 h-5" />
            {{ post.viewCount }}
          </span>
          <span class="flex items-center gap-1">
            <AppIcon name="chat_bubble" class="w-5 h-5" />
            {{ post.commentCount }}
          </span>
          <span class="ml-auto">{{ formatTime(post.createdAt) }}</span>
        </div>
      </RouterLink>
    </div>

    <div v-else class="text-center py-24">
      <AppIcon name="forum" class="w-5 h-5" />
      <p class="text-slate-400 mb-6">暂无帖子，来发第一篇吧</p>
      <button class="bg-[#3625f4] text-white px-6 py-3 rounded-xl font-bold neon-glow" @click="handleCreatePost">发布帖子</button>
    </div>
  </div>
</template>
