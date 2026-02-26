<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import client from '@/api/client'

const auth = useAuthStore()
const router = useRouter()
const nickname = ref('')
const bio = ref('')
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  await auth.fetchProfile()
  nickname.value = auth.user?.nickname ?? ''
  bio.value = auth.user?.bio ?? ''
})

async function handleSave() {
  if (!nickname.value) return
  loading.value = true
  error.value = ''
  try {
    await client.patch('/users/me', { nickname: nickname.value, bio: bio.value })
    await auth.fetchProfile()
    router.push('/profile')
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message ?? '保存失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <RouterLink to="/profile" class="flex items-center gap-2 text-[#3625f4] mb-8 hover:underline">
      <AppIcon name="arrow_back" class="w-5 h-5" /> 返回个人中心
    </RouterLink>
    <h1 class="text-3xl font-black text-white mb-8">编辑资料</h1>

    <div v-if="error" class="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{{ error }}</div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm text-slate-400 mb-2">昵称</label>
        <input v-model="nickname" type="text" maxlength="20" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3625f4] transition-colors" />
      </div>
      <div>
        <label class="block text-sm text-slate-400 mb-2">个人简介</label>
        <textarea v-model="bio" rows="4" maxlength="200" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3625f4] resize-none transition-colors"></textarea>
      </div>
      <div class="flex gap-4">
        <button :disabled="loading" class="flex-1 bg-[#3625f4] hover:bg-[#2d1fd4] disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all neon-glow" @click="handleSave">
          {{ loading ? '保存中...' : '保存' }}
        </button>
        <RouterLink to="/profile" class="px-6 py-3 glass-card text-slate-300 rounded-xl font-bold hover:text-white transition-colors">取消</RouterLink>
      </div>
    </div>
  </div>
</template>
