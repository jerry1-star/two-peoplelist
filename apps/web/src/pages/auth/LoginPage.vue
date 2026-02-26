<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const phone = ref('')
const code = ref('')
const step = ref<'phone' | 'code'>('phone')
const loading = ref(false)
const error = ref('')
const countdown = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

async function sendCode() {
  if (!phone.value || loading.value) return
  error.value = ''
  loading.value = true
  try {
    await auth.sendCode(phone.value)
    step.value = 'code'
    startCountdown()
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message ?? '发送失败，请重试'
  } finally {
    loading.value = false
  }
}

function startCountdown() {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
}

async function handleLogin() {
  if (!code.value || loading.value) return
  error.value = ''
  loading.value = true
  try {
    await auth.login(phone.value, code.value)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? '/')
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message ?? '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="glass-card rounded-2xl p-8 w-full max-w-md">
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-4">
        <AppIcon name="rocket_launch" class="w-5 h-5" />
        <h1 class="text-xl font-bold text-white">人人都是产品专家</h1>
      </div>
      <p class="text-slate-400 text-sm">手机号登录 / 注册</p>
    </div>

    <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-2">手机号</label>
        <input
          v-model="phone"
          type="tel"
          placeholder="请输入手机号"
          :disabled="step === 'code'"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3625f4] disabled:opacity-50 transition-colors"
        />
      </div>

      <div v-if="step === 'code'">
        <label class="block text-sm text-slate-400 mb-2">验证码</label>
        <div class="flex gap-2">
          <input
            v-model="code"
            type="text"
            placeholder="6位验证码"
            maxlength="6"
            class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3625f4] transition-colors"
          />
          <button
            :disabled="countdown > 0"
            class="px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap"
            :class="countdown > 0 ? 'bg-white/5 text-slate-400' : 'bg-[#3625f4]/20 text-[#3625f4] hover:bg-[#3625f4]/30'"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '重新发送' }}
          </button>
        </div>
        <p class="text-xs text-slate-500 mt-2">开发环境验证码固定为 123456</p>
      </div>

      <button
        v-if="step === 'phone'"
        :disabled="!phone || loading"
        class="w-full bg-[#3625f4] hover:bg-[#2d1fd4] disabled:opacity-50 text-white py-3 rounded-lg font-bold transition-all neon-glow"
        @click="sendCode"
      >
        {{ loading ? '发送中...' : '获取验证码' }}
      </button>
      <button
        v-else
        :disabled="!code || loading"
        class="w-full bg-[#3625f4] hover:bg-[#2d1fd4] disabled:opacity-50 text-white py-3 rounded-lg font-bold transition-all neon-glow"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录 / 注册' }}
      </button>
    </div>

    <p class="text-center text-xs text-slate-500 mt-6">
      登录即表示同意
      <a href="#" class="text-[#3625f4] hover:underline">服务条款</a>
      和
      <a href="#" class="text-[#3625f4] hover:underline">隐私政策</a>
    </p>
  </div>
</template>
