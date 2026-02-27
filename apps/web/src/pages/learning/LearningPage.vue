<script setup lang="ts">
import { ref, onMounted } from 'vue'
import client from '@/api/client'
import type { Course } from '@renren/shared'

const courses = ref<Course[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await client.get<void, Course[]>('/courses')
    courses.value = res ?? []
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-black text-white mb-4">AI 学习路径</h1>
      <p class="text-slate-400 text-lg">系统化课程体系，从零基础到 AI 实战专家</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="i in 3" :key="i" class="glass-card rounded-xl p-6 animate-pulse">
        <div class="h-40 bg-white/5 rounded-lg mb-4"></div>
        <div class="h-4 bg-white/5 rounded mb-2"></div>
        <div class="h-3 bg-white/5 rounded w-3/4"></div>
      </div>
    </div>

    <div v-else-if="courses.length" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <RouterLink
        v-for="course in courses"
        :key="course.id"
        :to="`/learning/${course.id}`"
        class="glass-card rounded-xl overflow-hidden group hover:border-[#3625f4]/50 transition-all"
      >
        <div class="h-40 bg-slate-800 flex items-center justify-center relative">
          <img v-if="course.coverUrl" :src="course.coverUrl" :alt="course.title" class="w-full h-full object-cover" />
          <span v-else class="material-symbols-outlined text-5xl text-slate-600">school</span>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-[#3625f4] transition-colors">{{ course.title }}</h3>
          <p class="text-slate-400 text-sm line-clamp-2">{{ course.description }}</p>
          <div class="mt-4 flex items-center gap-2 text-[#3625f4] text-sm font-bold">
            开始学习 <AppIcon name="arrow_forward" class="w-5 h-5" />
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-else class="text-center py-24">
      <AppIcon name="school" class="w-5 h-5" />
      <p class="text-slate-400">课程内容正在筹备中，敬请期待</p>
    </div>
  </div>
</template>
