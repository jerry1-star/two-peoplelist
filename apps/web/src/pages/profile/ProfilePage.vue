<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import client from '@/api/client'
import type { LearningRecord, Post } from '@renren/shared'

const auth = useAuthStore()
const learningRecords = ref<LearningRecord[]>([])
const myPosts = ref<Post[]>([])
const activeTab = ref<'learning' | 'posts'>('learning')
const loading = ref(true)

onMounted(async () => {
  await auth.fetchProfile()
  try {
    const [lrRes, postsRes] = await Promise.all([
      client.get<void, LearningRecord[]>('/learning-records/me'),
      client.get<void, { data: Post[]; total: number }>('/posts/mine'),
    ])
    learningRecords.value = lrRes ?? []
    myPosts.value = postsRes.data ?? []
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16">
    <!-- Profile Header -->
    <div class="glass-card rounded-2xl p-8 mb-8 flex items-center gap-6">
      <div class="size-20 rounded-full bg-[#3625f4]/20 border-2 border-[#3625f4]/30 flex items-center justify-center overflow-hidden">
        <img v-if="auth.user?.avatar" :src="auth.user.avatar" :alt="auth.user.nickname" class="w-full h-full object-cover" />
        <span v-else class="material-symbols-outlined text-4xl text-[#3625f4]">person</span>
      </div>
      <div class="flex-1">
        <h1 class="text-2xl font-black text-white">{{ auth.user?.nickname ?? '加载中...' }}</h1>
        <p class="text-slate-400 text-sm mt-1">{{ auth.user?.bio ?? '这个人很懒，还没有填写简介' }}</p>
        <p class="text-xs text-slate-500 mt-2">{{ auth.user?.phone }}</p>
      </div>
      <RouterLink to="/profile/edit" class="glass-card hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
        <AppIcon name="edit" class="w-5 h-5" /> 编辑资料
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-8">
      <button
        :class="['px-6 py-2 rounded-full font-bold text-sm transition-all', activeTab === 'learning' ? 'bg-[#3625f4] text-white neon-glow' : 'glass-card text-slate-300 hover:text-white']"
        @click="activeTab = 'learning'"
      >学习记录</button>
      <button
        :class="['px-6 py-2 rounded-full font-bold text-sm transition-all', activeTab === 'posts' ? 'bg-[#3625f4] text-white neon-glow' : 'glass-card text-slate-300 hover:text-white']"
        @click="activeTab = 'posts'"
      >我的帖子</button>
    </div>

    <!-- Learning Records -->
    <div v-if="activeTab === 'learning'">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="glass-card rounded-xl p-5 animate-pulse">
          <div class="h-4 bg-white/5 rounded w-1/2 mb-3"></div>
          <div class="h-2 bg-white/5 rounded"></div>
        </div>
      </div>
      <div v-else-if="learningRecords.length" class="space-y-4">
        <div v-for="record in learningRecords" :key="record.id" class="glass-card rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-white">{{ record.course?.title ?? '未知课程' }}</h3>
            <span v-if="record.completedAt" class="text-xs text-green-400 font-bold flex items-center gap-1">
              <AppIcon name="check_circle" class="w-5 h-5" /> 已完成
            </span>
            <span v-else class="text-xs text-slate-400">{{ record.progress }}%</span>
          </div>
          <div class="w-full bg-white/5 rounded-full h-1.5">
            <div class="bg-[#3625f4] h-1.5 rounded-full transition-all" :style="{ width: `${record.progress}%` }"></div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16">
        <AppIcon name="school" class="w-5 h-5" />
        <p class="text-slate-400 mb-4">还没有学习记录</p>
        <RouterLink to="/learning" class="text-[#3625f4] hover:underline font-bold">去学习课程</RouterLink>
      </div>
    </div>

    <!-- My Posts -->
    <div v-if="activeTab === 'posts'">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="glass-card rounded-xl p-5 animate-pulse">
          <div class="h-4 bg-white/5 rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-white/5 rounded w-1/3"></div>
        </div>
      </div>
      <div v-else-if="myPosts.length" class="space-y-4">
        <RouterLink
          v-for="post in myPosts"
          :key="post.id"
          :to="`/forum/${post.id}`"
          class="glass-card rounded-xl p-5 block group hover:border-[#3625f4]/50 transition-all"
        >
          <div class="flex items-start justify-between">
            <h3 class="font-bold text-white group-hover:text-[#3625f4] transition-colors">{{ post.title }}</h3>
            <span :class="['text-xs font-bold px-2 py-1 rounded-full', post.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' : post.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400']">
              {{ post.status === 'APPROVED' ? '已通过' : post.status === 'REJECTED' ? '已拒绝' : '审核中' }}
            </span>
          </div>
        </RouterLink>
      </div>
      <div v-else class="text-center py-16">
        <AppIcon name="forum" class="w-5 h-5" />
        <p class="text-slate-400 mb-4">还没有发布帖子</p>
        <RouterLink to="/forum/create" class="text-[#3625f4] hover:underline font-bold">去发帖</RouterLink>
      </div>
    </div>
  </div>
</template>
