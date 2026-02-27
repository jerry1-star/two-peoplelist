<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import client from '@/api/client'
import type { Course } from '@renren/shared'

const route = useRoute()
const course = ref<Course | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await client.get<void, Course>(`/courses/${route.params.id}`)
    course.value = res
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16">
    <RouterLink to="/learning" class="flex items-center gap-2 text-[#3625f4] mb-8 hover:underline">
      <AppIcon name="arrow_back" class="w-5 h-5" /> 返回课程列表
    </RouterLink>
    <div v-if="loading" class="animate-pulse">
      <div class="h-8 bg-white/5 rounded mb-4 w-3/4"></div>
      <div class="h-4 bg-white/5 rounded mb-2"></div>
      <div class="h-4 bg-white/5 rounded w-2/3"></div>
    </div>
    <div v-else-if="course">
      <h1 class="text-3xl font-black text-white mb-4">{{ course.title }}</h1>
      <div class="glass-card rounded-xl p-6">
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">{{ course.description }}</p>
      </div>
    </div>
    <div v-else class="text-center py-24">
      <p class="text-slate-400">课程不存在</p>
    </div>
  </div>
</template>
