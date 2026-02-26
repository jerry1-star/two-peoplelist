<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import client from '@/api/client'

interface User {
  id: string
  phone: string
  nickname: string
  status: 'ACTIVE' | 'BANNED'
  createdAt: string
  roles: string[]
}

interface PaginatedResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
}

const users = ref<User[]>([])
const total = ref(0)
const loading = ref(false)
const searchPhone = ref('')
const page = ref(1)
const pageSize = ref(20)

const columns = [
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  { title: '角色', key: 'roles' },
  { title: '状态', key: 'status' },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'actions', width: 160 },
]

async function fetchUsers() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, pageSize: pageSize.value }
    if (searchPhone.value) params.keyword = searchPhone.value
    const data = await client.get<never, PaginatedResponse>('/users', { params })
    users.value = data.data
    total.value = data.total
  } catch {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

async function toggleStatus(user: User) {
  const action = user.status === 'ACTIVE' ? '禁用' : '启用'
  Modal.confirm({
    title: `确认${action}该用户？`,
    content: `用户：${user.nickname}（${user.phone}）`,
    async onOk() {
      const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE'
      await client.patch(`/users/${user.id}/status`, { status: newStatus })
      message.success(`${action}成功`)
      fetchUsers()
    },
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <div class="search-bar">
        <a-input-search
          v-model:value="searchPhone"
          placeholder="搜索手机号"
          style="width: 240px"
          @search="fetchUsers"
        />
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="users"
      :loading="loading"
      :pagination="{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t: number) => `共 ${t} 条`,
        onChange: (p: number, ps: number) => { page.value = p; pageSize.value = ps; fetchUsers() },
      }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'roles'">
          <a-tag v-for="role in record.roles" :key="role" color="blue">
            {{ role }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-badge
            :status="record.status === 'ACTIVE' ? 'success' : 'error'"
            :text="record.status === 'ACTIVE' ? '正常' : '已禁用'"
          />
        </template>
        <template v-else-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-button
            :type="record.status === 'ACTIVE' ? 'default' : 'primary'"
            size="small"
            :danger="record.status === 'ACTIVE'"
            @click="toggleStatus(record)"
          >
            {{ record.status === 'ACTIVE' ? '禁用' : '启用' }}
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
</style>
