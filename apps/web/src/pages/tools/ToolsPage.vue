<script setup lang="ts">
import { ref, onMounted } from 'vue'
import client from '@/api/client'
import type { Tool } from '@renren/shared'

const tools = ref<Tool[]>([])
const loading = ref(true)
const activeCategory = ref('全部')
const categories = ref<string[]>(['全部'])

onMounted(async () => {
  try {
    const res = await client.get<void, { data: { data: Tool[] } }>('/tools')
    tools.value = res.data ?? []
    const cats = [...new Set(tools.value.map((t) => t.categoryName))]
    categories.value = ['全部', ...cats]
  } catch { /* ignore */ }
  finally { loading.value = false }
})

function filteredTools() {
  if (activeCategory.value === '全部') return tools.value
  return tools.value.filter((t) => t.categoryName === activeCategory.value)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-black text-white mb-4">AI 工具库</h1>
      <p class="text-slate-400 text-lg">精选全球顶级 AI 工具，找到最适合你的效率神器</p>
    </div>

    <!-- Category Filter -->
    <div class="flex gap-3 flex-wrap mb-10">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all', activeCategory === cat ? 'bg-[#3625f4] text-white neon-glow' : 'glass-card text-slate-300 hover:text-white']"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="glass-card rounded-xl p-5 animate-pulse">
        <div class="size-12 bg-white/5 rounded-xl mb-3"></div>
        <div class="h-4 bg-white/5 rounded mb-2"></div>
        <div class="h-3 bg-white/5 rounded w-3/4"></div>
      </div>
    </div>

    <div v-else-if="filteredTools().length" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <a
        v-for="tool in filteredTools()"
        :key="tool.id"
        :href="tool.link"
        target="_blank"
        rel="noopener"
        class="glass-card rounded-xl p-5 group hover:border-[#3625f4]/50 transition-all block"
      >
        <div class="size-12 bg-slate-800 rounded-xl flex items-center justify-center mb-3">
          <img v-if="tool.iconUrl" :src="tool.iconUrl" :alt="tool.name" class="size-8 object-contain" />
          <span v-else class="material-symbols-outlined text-2xl text-[#3625f4]">build</span>
        </div>
        <h3 class="font-bold text-white mb-1 group-hover:text-[#3625f4] transition-colors">{{ tool.name }}</h3>
        <p class="text-slate-400 text-xs line-clamp-2 mb-3">{{ tool.description }}</p>
        <div class="flex flex-wrap gap-1">
          <span v-for="tag in tool.tags.slice(0, 3)" :key="tag" class="px-2 py-0.5 bg-[#3625f4]/10 text-[#3625f4] rounded text-[10px]">{{ tag }}</span>
        </div>
      </a>
    </div>

    <div v-else class="text-center py-24">
      <AppIcon name="build" class="w-5 h-5" />
      <p class="text-slate-400">暂无工具数据</p>
    </div>
  </div>
</template>
