<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import client from '@/api/client'

interface Post {
  id: string
  title: string
  status: string
  author: { nickname: string; phone: string }
  createdAt: string
  viewCount: number
  commentCount: number
}

interface PaginatedResponse {
  data: Post[]
  total: number
}

const posts = ref<Post[]>([])
const total = ref(0)
const loading = ref(false)
const activeTab = ref('PENDING')
const page = ref(1)
const pageSize = ref(20)

const tabs = [
  { key: 'PENDING', label: '待审核' },
  { key: 'APPROVED', label: '已通过' },
  { key: 'REJECTED', label: '已拒绝' },
]

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '作者', key: 'author' },
  { title: '状态', key: 'status', width: 100 },
  { title: '浏览', dataIndex: 'viewCount', key: 'viewCount', width: 80 },
  { title: '评论', dataIndex: 'commentCount', key: 'commentCount', width: 80 },
  { title: '发布时间', key: 'createdAt', width: 120 },
  { title: '操作', key: 'actions', width: 160 },
]

const statusMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: '待审核' },
  APPROVED: { color: 'green', label: '已通过' },
  REJECTED: { color: 'red', label: '已拒绝' },
}

function onTableChange(p: number, ps: number) { page.value = p; pageSize.value = ps; fetchPosts() }

async function fetchPosts() {
  loading.value = true
  try {
    const data = await client.get<never, PaginatedResponse>('/posts/admin', {
      params: { page: page.value, pageSize: pageSize.value, status: activeTab.value },
    })
    posts.value = data.data
    total.value = data.total
  } catch {
    message.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

async function approve(post: Post) {
  await client.patch(`/posts/${post.id}/review`, { status: 'APPROVED' })
  message.success('已通过')
  fetchPosts()
}

async function reject(post: Post) {
  await client.patch(`/posts/${post.id}/review`, { status: 'REJECTED' })
  message.success('已拒绝')
  fetchPosts()
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

watch(activeTab, () => {
  page.value = 1
  fetchPosts()
})

onMounted(fetchPosts)
</script>

<template>
  <div>
    <h2 class="page-title">论坛审核</h2>

    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.label" />
    </a-tabs>

    <a-table
      :columns="columns"
      :data-source="posts"
      :loading="loading"
      :pagination="{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t: number) => `共 ${t} 条`,
        onChange: onTableChange,
      }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'author'">
          {{ record.author.nickname }}
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="statusMap[record.status]?.color">
            {{ statusMap[record.status]?.label }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <template v-if="record.status === 'PENDING'">
            <a-button type="primary" size="small" @click="approve(record)">通过</a-button>
            <a-button danger size="small" style="margin-left: 8px" @click="reject(record)">拒绝</a-button>
          </template>
          <template v-else>
            <a-button
              size="small"
              @click="activeTab === 'APPROVED' ? reject(record) : approve(record)"
            >
              {{ activeTab === 'APPROVED' ? '撤回' : '重新通过' }}
            </a-button>
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px;
}
</style>
