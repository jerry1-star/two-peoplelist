<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import client from '@/api/client'
import type { Category } from '@renren/shared'

const router = useRouter()
const title = ref('')
const content = ref('')
const categoryId = ref('')
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  const res = await client.get<void, Category[]>('/posts/categories').catch(() => [] as Category[])
  categories.value = res ?? []
  if (categories.value.length) categoryId.value = categories.value[0]!.id
})

async function handleSubmit() {
  if (!title.value || !content.value || !categoryId.value) {
    error.value = '请填写完整内容'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await client.post<void, { id: string }>('/posts', {
      title: title.value,
      content: content.value,
      categoryId: categoryId.value,
    })
    router.push(`/forum/${res.id}`)
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message ?? '发布失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <RouterLink to="/forum" class="flex items-center gap-2 text-[#3625f4] mb-8 hover:underline">
      <AppIcon name="arrow_back" class="w-5 h-5" /> 返回论坛
    </RouterLink>

    <h1 class="text-3xl font-black text-white mb-8">发布新帖子</h1>

    <div v-if="error" class="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
      {{ error }}
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm text-slate-400 mb-2">分类</label>
        <select
          v-model="categoryId"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3625f4] transition-colors"
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-[#111022]">{{ cat.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-slate-400 mb-2">标题</label>
        <input
          v-model="title"
          type="text"
          placeholder="帖子标题（2-100字）"
          maxlength="100"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3625f4] transition-colors"
        />
      </div>

      <div>
        <label class="block text-sm text-slate-400 mb-2">内容</label>
        <textarea
          v-model="content"
          placeholder="详细描述你的想法..."
          rows="10"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3625f4] resize-none transition-colors"
        ></textarea>
      </div>

      <div class="flex gap-4">
        <button
          :disabled="loading"
          class="flex-1 bg-[#3625f4] hover:bg-[#2d1fd4] disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all neon-glow"
          @click="handleSubmit"
        >
          {{ loading ? '发布中...' : '发布帖子' }}
        </button>
        <RouterLink to="/forum" class="px-6 py-3 glass-card text-slate-300 rounded-xl font-bold hover:text-white transition-colors">取消</RouterLink>
      </div>
    </div>

    <p class="text-xs text-slate-500 mt-4">帖子需经过审核后才会显示在论坛中</p>
  </div>
</template>
