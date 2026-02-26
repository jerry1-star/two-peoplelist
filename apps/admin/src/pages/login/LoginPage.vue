<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAdminAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAdminAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    message.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? '/dashboard')
  } catch (e: unknown) {
    const err = e as { message?: string }
    message.error(err?.message ?? '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>人人都是产品专家</h1>
        <p>管理后台</p>
      </div>

      <a-form layout="vertical" @submit.prevent="handleLogin">
        <a-form-item label="用户名">
          <a-input
            v-model:value="username"
            size="large"
            placeholder="请输入用户名"
            autocomplete="username"
            @press-enter="handleLogin"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password
            v-model:value="password"
            size="large"
            placeholder="请输入密码"
            autocomplete="current-password"
            @press-enter="handleLogin"
          />
        </a-form-item>
        <a-button
          type="primary"
          size="large"
          block
          :loading="loading"
          html-type="submit"
          @click="handleLogin"
        >
          登录
        </a-button>
      </a-form>

      <p class="hint">默认管理员账号：admin / 123123</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 48px 40px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #1677ff;
  margin: 0 0 4px;
}

.login-header p {
  color: #666;
  margin: 0;
}

.hint {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 24px;
  margin-bottom: 0;
}
</style>
