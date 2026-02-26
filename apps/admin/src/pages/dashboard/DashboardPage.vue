<script setup lang="ts">
import { ref, onMounted } from 'vue'
import client from '@/api/client'
import {
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  RiseOutlined,
} from '@ant-design/icons-vue'

interface DashboardStats {
  totalUsers: number
  todayNewUsers: number
  totalPosts: number
  pendingPosts: number
  totalComments: number
  totalCourses: number
  totalTools: number
  activeUsers: number
}

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

async function fetchStats() {
  try {
    const data = await client.get<never, DashboardStats>('/dashboard/stats')
    stats.value = data
  } catch {
    stats.value = {
      totalUsers: 0,
      todayNewUsers: 0,
      totalPosts: 0,
      pendingPosts: 0,
      totalComments: 0,
      totalCourses: 0,
      totalTools: 0,
      activeUsers: 0,
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)

const statCards = [
  {
    title: '总用户数',
    key: 'totalUsers' as const,
    icon: UserOutlined,
    color: '#1677ff',
    bg: '#e6f4ff',
  },
  {
    title: '今日新增用户',
    key: 'todayNewUsers' as const,
    icon: RiseOutlined,
    color: '#52c41a',
    bg: '#f6ffed',
  },
  {
    title: '论坛帖子',
    key: 'totalPosts' as const,
    icon: FileTextOutlined,
    color: '#722ed1',
    bg: '#f9f0ff',
  },
  {
    title: '待审核帖子',
    key: 'pendingPosts' as const,
    icon: MessageOutlined,
    color: '#fa8c16',
    bg: '#fff7e6',
  },
]
</script>

<template>
  <div>
    <h2 class="page-title">数据看板</h2>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]">
        <a-col
          v-for="card in statCards"
          :key="card.key"
          :xs="24"
          :sm="12"
          :lg="6"
        >
          <a-card class="stat-card" :bordered="false">
            <div class="stat-content">
              <div class="stat-icon" :style="{ background: card.bg }">
                <component
                  :is="card.icon"
                  :style="{ color: card.color, fontSize: '24px' }"
                />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats?.[card.key] ?? '-' }}</div>
                <div class="stat-label">{{ card.title }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <a-col :span="12">
          <a-card title="平台概览" :bordered="false">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="总用户数">
                {{ stats?.totalUsers ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="论坛帖子总数">
                {{ stats?.totalPosts ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="评论总数">
                {{ stats?.totalComments ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="课程总数">
                {{ stats?.totalCourses ?? '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="待处理事项" :bordered="false">
            <a-list size="small">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>待审核帖子</template>
                  <template #description>共 {{ stats?.pendingPosts ?? 0 }} 篇帖子等待审核</template>
                </a-list-item-meta>
                <a-button type="link" size="small" @click="$router.push('/forum')">
                  去处理
                </a-button>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px;
}

.stat-card {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
</style>
