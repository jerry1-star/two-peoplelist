<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import client from '@/api/client'
import type { Case } from '@renren/shared'

const route = useRoute()
const item = ref<Case | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await client.get<void, Case>(`/cases/${route.params.id}`)
    item.value = res
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16">
    <RouterLink to="/cases" class="flex items-center gap-2 text-[#3625f4] mb-8 hover:underline">
      <AppIcon name="arrow_back" class="w-5 h-5" /> 返回案例列表
    </RouterLink>
    <div v-if="loading" class="animate-pulse">
      <div class="h-8 bg-white/5 rounded mb-4 w-3/4"></div>
      <div class="h-4 bg-white/5 rounded mb-2"></div>
    </div>
    <div v-else-if="item">
      <div v-if="item.revenue" class="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold mb-4">
        <AppIcon name="trending_up" class="w-5 h-5" /> {{ item.revenue }}
      </div>
      <h1 class="text-3xl font-black text-white mb-2">{{ item.title }}</h1>
      <p class="text-slate-400 mb-8">by {{ item.authorName }}</p>
      <div class="glass-card rounded-xl p-8">
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>
