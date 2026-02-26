<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import client from '@/api/client'
import type { Post, Comment } from '@renren/shared'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(true)
const submitting = ref(false)

onMounted(async () => {
  try {
    const [postRes, commentsRes] = await Promise.all([
      client.get<void, Post>(`/posts/${route.params.id}`),
      client.get<void, { data: Comment[] }>(`/posts/${route.params.id}/comments`),
    ])
    post.value = postRes
    comments.value = commentsRes.data ?? []
  } catch { /* ignore */ }
  finally { loading.value = false }
})

async function submitComment() {
  if (!newComment.value.trim() || submitting.value) return
  submitting.value = true
  try {
    const res = await client.post<void, Comment>(`/posts/${route.params.id}/comments`, { content: newComment.value })
    comments.value.push(res)
    newComment.value = ''
  } catch { /* ignore */ }
  finally { submitting.value = false }
}

function formatTime(date: string) {
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16">
    <RouterLink to="/forum" class="flex items-center gap-2 text-[#3625f4] mb-8 hover:underline">
      <AppIcon name="arrow_back" class="w-5 h-5" /> 返回论坛
    </RouterLink>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-white/5 rounded w-3/4"></div>
      <div class="h-4 bg-white/5 rounded"></div>
      <div class="h-4 bg-white/5 rounded w-2/3"></div>
    </div>

    <div v-else-if="post">
      <h1 class="text-3xl font-black text-white mb-4">{{ post.title }}</h1>
      <div class="flex items-center gap-4 text-sm text-slate-500 mb-8">
        <span class="flex items-center gap-1"><AppIcon name="person" class="w-5 h-5" />{{ post.author?.nickname }}</span>
        <span class="flex items-center gap-1"><AppIcon name="visibility" class="w-5 h-5" />{{ post.viewCount }}</span>
        <span>{{ formatTime(post.createdAt) }}</span>
      </div>

      <div class="glass-card rounded-xl p-8 mb-12">
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">{{ post.content }}</p>
      </div>

      <!-- Comments -->
      <h2 class="text-xl font-bold text-white mb-6">评论 ({{ comments.length }})</h2>

      <div v-if="auth.isAuthenticated" class="glass-card rounded-xl p-6 mb-8">
        <textarea
          v-model="newComment"
          placeholder="发表你的看法..."
          rows="3"
          class="w-full bg-transparent border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3625f4] resize-none transition-colors"
        ></textarea>
        <div class="flex justify-end mt-3">
          <button
            :disabled="!newComment.trim() || submitting"
            class="bg-[#3625f4] hover:bg-[#2d1fd4] disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all"
            @click="submitComment"
          >
            {{ submitting ? '提交中...' : '发表评论' }}
          </button>
        </div>
      </div>
      <div v-else class="glass-card rounded-xl p-6 mb-8 text-center">
        <RouterLink to="/auth/login" class="text-[#3625f4] hover:underline">登录</RouterLink>
        <span class="text-slate-400"> 后参与评论</span>
      </div>

      <div class="space-y-4">
        <div v-for="comment in comments" :key="comment.id" class="glass-card rounded-xl p-5">
          <div class="flex items-center gap-2 mb-3">
            <div class="size-8 rounded-full bg-slate-800 flex items-center justify-center">
              <AppIcon name="person" class="w-5 h-5" />
            </div>
            <span class="text-sm font-bold text-white">{{ comment.author?.nickname }}</span>
            <span class="text-xs text-slate-500 ml-auto">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <p class="text-slate-300 text-sm">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
