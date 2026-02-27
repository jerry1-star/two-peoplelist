<script setup lang="ts">
import { ref, onMounted } from 'vue'
import client from '@/api/client'
import type { Case } from '@renren/shared'

const cases = ref<Case[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await client.get<void, Case[]>('/cases')
    cases.value = res ?? []
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-black text-white mb-4">成功案例</h1>
      <p class="text-slate-400 text-lg">真实可复制的 AI 商业闭环，看先行者的实战经验</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="i in 3" :key="i" class="glass-card rounded-xl p-6 animate-pulse">
        <div class="h-48 bg-white/5 rounded-lg mb-4"></div>
        <div class="h-4 bg-white/5 rounded mb-2"></div>
        <div class="h-3 bg-white/5 rounded w-3/4"></div>
      </div>
    </div>

    <div v-else-if="cases.length" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <RouterLink
        v-for="item in cases"
        :key="item.id"
        :to="`/cases/${item.id}`"
        class="glass-card rounded-xl overflow-hidden group hover:border-[#3625f4]/50 transition-all"
      >
        <div class="h-48 bg-slate-800 flex items-center justify-center relative">
          <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title" class="w-full h-full object-cover" />
          <span v-else class="material-symbols-outlined text-5xl text-slate-600">auto_awesome</span>
        </div>
        <div class="p-6">
          <div v-if="item.revenue" class="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold mb-3">
            <AppIcon name="trending_up" class="w-5 h-5" /> {{ item.revenue }}
          </div>
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-[#3625f4] transition-colors">{{ item.title }}</h3>
          <p class="text-slate-400 text-sm line-clamp-2 mb-4">{{ item.summary }}</p>
          <p class="text-xs text-slate-500">by {{ item.authorName }}</p>
        </div>
      </RouterLink>
    </div>

    <div v-else class="text-center py-24">
      <AppIcon name="auto_awesome" class="w-5 h-5" />
      <p class="text-slate-400">案例内容正在整理中，敬请期待</p>
    </div>
  </div>
</template>
